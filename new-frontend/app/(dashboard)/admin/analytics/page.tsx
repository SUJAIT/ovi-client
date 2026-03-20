"use client"

import { useState, useEffect, useMemo } from "react"
import { auth } from "@/lib/firebase"
import { getAllTransactions, getAllUsers } from "@/lib/api"
import {
  RefreshCw,
  TrendingUp,
  FileText,
  Wallet,
  Users,
  Calendar,
  BarChart2,
} from "lucide-react"

type Transaction = {
  _id: string
  userId: { _id: string; name?: string; email: string } | string
  type: "credit" | "debit"
  service: "server-copy" | "recharge"
  amount: number
  nid?: string
  status: "success" | "failed"
  createdAt: string
}

type User = {
  _id: string
  name?: string
  email: string
  role: string
}

// ── Date helpers ──────────────────────────────────────────────────
const isToday = (d: Date) => new Date().toDateString() === d.toDateString()

const isThisWeek = (d: Date) => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return d >= startOfWeek
}

const isThisMonth = (d: Date) => {
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

const monthName = (monthIndex: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[monthIndex]
}

export default function AdminAnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "monthly" | "users">("overview")

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const [txRes, usersRes] = await Promise.all([
        getAllTransactions(token),
        getAllUsers(token),
      ])
      if (txRes.success) setTransactions(txRes.data)
      if (usersRes.success) setUsers(usersRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // ── Server copy transactions only ─────────────────────────────
  const serverCopyTx = useMemo(() =>
    transactions.filter((t) => t.service === "server-copy" && t.status === "success"),
    [transactions]
  )

  // ── Overview stats ─────────────────────────────────────────────
  const stats = useMemo(() => {
    const daily = serverCopyTx.filter((t) => isToday(new Date(t.createdAt)))
    const weekly = serverCopyTx.filter((t) => isThisWeek(new Date(t.createdAt)))
    const monthly = serverCopyTx.filter((t) => isThisMonth(new Date(t.createdAt)))

    const totalRevenue = serverCopyTx.reduce((s, t) => s + t.amount, 0)
    const totalRecharge = transactions
      .filter((t) => t.type === "credit" && t.status === "success")
      .reduce((s, t) => s + t.amount, 0)

    return {
      daily: { count: daily.length, revenue: daily.reduce((s, t) => s + t.amount, 0) },
      weekly: { count: weekly.length, revenue: weekly.reduce((s, t) => s + t.amount, 0) },
      monthly: { count: monthly.length, revenue: monthly.reduce((s, t) => s + t.amount, 0) },
      total: { count: serverCopyTx.length, revenue: totalRevenue },
      totalRecharge,
    }
  }, [serverCopyTx, transactions])

  // ── Monthly breakdown (last 6 months) ─────────────────────────
  const monthlyData = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const txInMonth = serverCopyTx.filter((t) => {
        const td = new Date(t.createdAt)
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
      })
      months.push({
        label: `${monthName(d.getMonth())} ${d.getFullYear()}`,
        shortLabel: monthName(d.getMonth()),
        count: txInMonth.length,
        revenue: txInMonth.reduce((s, t) => s + t.amount, 0),
      })
    }
    return months
  }, [serverCopyTx])

  const maxMonthlyCount = Math.max(...monthlyData.map((m) => m.count), 1)
  const maxMonthlyRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1)

  // ── Per user breakdown ─────────────────────────────────────────
  const userBreakdown = useMemo(() => {
    const map = new Map<string, { name: string; email: string; count: number; revenue: number }>()

    serverCopyTx.forEach((t) => {
      const uid = typeof t.userId === "object" ? t.userId._id : t.userId
      const name = typeof t.userId === "object" ? (t.userId.name || t.userId.email) : uid
      const email = typeof t.userId === "object" ? t.userId.email : ""

      if (!map.has(uid)) {
        map.set(uid, { name, email, count: 0, revenue: 0 })
      }
      const entry = map.get(uid)!
      entry.count += 1
      entry.revenue += t.amount
    })

    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [serverCopyTx])

  const maxUserCount = Math.max(...userBreakdown.map((u) => u.count), 1)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <RefreshCw size={24} className="animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .analytics-wrap { max-width: 1000px; margin: 0 auto; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat-card { border-radius: 14px; padding: 18px 16px; position: relative; overflow: hidden; }
        .stat-card-deco { position: absolute; right: -10px; top: -10px; width: 65px; height: 65px; border-radius: 50%; background: rgba(255,255,255,0.15); }
        .stat-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .stat-value { font-size: 22px; font-weight: 800; color: #fff; line-height: 1; }
        .stat-label { font-size: 11px; color: rgba(255,255,255,0.8); margin-top: 3px; }
        .tabs { display: flex; gap: 4px; margin-bottom: 20px; background: hsl(var(--muted)); padding: 4px; border-radius: 10px; width: fit-content; }
        .tab-btn { padding: 7px 16px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; background: transparent; color: hsl(var(--muted-foreground)); }
        .tab-btn.active { background: hsl(var(--background)); color: hsl(var(--foreground)); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .section-title { font-size: 15px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
        /* Bar chart */
        .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 160px; padding: 0 4px; }
        .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
        .bar { width: 100%; border-radius: 6px 6px 0 0; transition: height 0.5s ease; min-height: 4px; }
        .bar-label { font-size: 10px; color: hsl(var(--muted-foreground)); white-space: nowrap; }
        .bar-value { font-size: 10px; font-weight: 700; }
        /* User table */
        .user-table { width: 100%; border-collapse: collapse; }
        .user-table th { text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 700; color: hsl(var(--muted-foreground)); border-bottom: 1px solid hsl(var(--border)); }
        .user-table td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid hsl(var(--border)/0.5); vertical-align: middle; }
        .user-table tr:hover td { background: hsl(var(--muted)/0.3); }
        .progress-bar { height: 6px; border-radius: 3px; background: hsl(var(--muted)); overflow: hidden; width: 100px; }
        .progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.5s ease; }
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .progress-bar { width: 60px; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .bar-chart { gap: 4px; }
        }
      `}</style>

      <div className="analytics-wrap space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart2 size={22} /> Sales Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Server Copy বিক্রির সার্বিক চিত্র</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border rounded-lg px-3 py-2 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          {[
            { label: "আজকের Sales", count: stats.daily.count, revenue: stats.daily.revenue, gradient: "linear-gradient(135deg, #667eea, #764ba2)", icon: Calendar },
            { label: "এই সপ্তাহে", count: stats.weekly.count, revenue: stats.weekly.revenue, gradient: "linear-gradient(135deg, #f093fb, #f5576c)", icon: TrendingUp },
            { label: "এই মাসে", count: stats.monthly.count, revenue: stats.monthly.revenue, gradient: "linear-gradient(135deg, #4facfe, #00f2fe)", icon: FileText },
            { label: "সর্বমোট", count: stats.total.count, revenue: stats.total.revenue, gradient: "linear-gradient(135deg, #43e97b, #38f9d7)", icon: Wallet },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="stat-card" style={{ background: s.gradient }}>
                <div className="stat-card-deco" />
                <div className="stat-icon"><Icon size={18} color="#fff" /></div>
                <div className="stat-value">{s.count} টি</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginTop: "2px" }}>৳{s.revenue}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[
            { key: "overview", label: "Monthly Chart" },
            { key: "monthly", label: "Month Details" },
            { key: "users", label: "Per User" },
          ].map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key as any)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Monthly Chart ── */}
        {activeTab === "overview" && (
          <div className="border rounded-xl p-5 bg-background">
            <div className="section-title">
              <BarChart2 size={16} />
              গত ৬ মাসের Server Copy Sales
            </div>

            {/* Count chart */}
            <p className="text-xs text-muted-foreground mb-2">Sales Count</p>
            <div className="bar-chart mb-6">
              {monthlyData.map((m) => (
                <div key={m.label} className="bar-wrap">
                  <div className="bar-value" style={{ color: "#667eea" }}>{m.count}</div>
                  <div
                    className="bar"
                    style={{
                      height: `${(m.count / maxMonthlyCount) * 120}px`,
                      background: "linear-gradient(180deg, #667eea, #764ba2)",
                    }}
                  />
                  <div className="bar-label">{m.shortLabel}</div>
                </div>
              ))}
            </div>

            {/* Revenue chart */}
            <p className="text-xs text-muted-foreground mb-2">Revenue (৳)</p>
            <div className="bar-chart">
              {monthlyData.map((m) => (
                <div key={m.label} className="bar-wrap">
                  <div className="bar-value" style={{ color: "#43e97b" }}>৳{m.revenue}</div>
                  <div
                    className="bar"
                    style={{
                      height: `${(m.revenue / maxMonthlyRevenue) * 120}px`,
                      background: "linear-gradient(180deg, #43e97b, #38f9d7)",
                    }}
                  />
                  <div className="bar-label">{m.shortLabel}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Month Details ── */}
        {activeTab === "monthly" && (
          <div className="border rounded-xl overflow-hidden bg-background">
            <div className="p-4 border-b">
              <div className="section-title mb-0">
                <Calendar size={16} />
                মাসওয়ারি বিস্তারিত
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">মাস</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Sales Count</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Revenue</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Avg/Day</th>
                </tr>
              </thead>
              <tbody>
                {[...monthlyData].reverse().map((m, i) => {
                  const daysInMonth = 30
                  const avg = (m.count / daysInMonth).toFixed(1)
                  return (
                    <tr key={m.label} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-sm">{m.label}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-primary">{m.count} টি</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-green-600">৳{m.revenue}</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">{avg}/day</td>
                    </tr>
                  )
                })}
                {/* Total row */}
                <tr className="border-t bg-muted/30">
                  <td className="px-4 py-3 font-bold text-sm">মোট</td>
                  <td className="px-4 py-3 text-right font-bold text-sm text-primary">{stats.total.count} টি</td>
                  <td className="px-4 py-3 text-right font-bold text-sm text-green-600">৳{stats.total.revenue}</td>
                  <td className="px-4 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ── Per User ── */}
        {activeTab === "users" && (
          <div className="border rounded-xl overflow-hidden bg-background">
            <div className="p-4 border-b">
              <div className="section-title mb-0">
                <Users size={16} />
                প্রতি User এর Sales Breakdown
              </div>
            </div>
            {userBreakdown.length === 0 ? (
              <p className="text-center py-10 text-sm text-muted-foreground">কোনো data নেই</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>User</th>
                      <th>Sales Count</th>
                      <th>Revenue</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBreakdown.map((u, i) => (
                      <tr key={u.email}>
                        <td style={{ color: "hsl(var(--muted-foreground))", width: "40px" }}>{i + 1}</td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div style={{
                              width: "32px", height: "32px", borderRadius: "50%",
                              background: "hsl(var(--primary)/0.1)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "13px", fontWeight: 700, color: "hsl(var(--primary))",
                              flexShrink: 0,
                            }}>
                              {(u.name || u.email)[0].toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: "13px" }}>{u.name}</p>
                              <p style={{ fontSize: "11px", color: "hsl(var(--muted-foreground))" }}>{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: "hsl(var(--primary))" }}>{u.count} টি</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: "#16a34a" }}>৳{u.revenue}</span>
                        </td>
                        <td>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${(u.count / maxUserCount) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  )
}