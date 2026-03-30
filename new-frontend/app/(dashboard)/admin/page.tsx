"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { getAllUsers, getAllTransactions } from "@/lib/api"
import {
  Users,
  Wallet,
  FileText,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type User = {
  _id: string
  name?: string
  email: string
  role: string
  wallet?: { balance: number; totalSpent: number; totalRecharge: number }
  createdAt?: string
}

type Transaction = {
  _id: string
  type: "credit" | "debit"
  service: string
  amount: number
  status: string
  createdAt: string
}

type Stats = {
  totalUsers: number
  totalRecharge: number
  totalSpent: number
  totalServerCopy: number
  todayServerCopy: number
  todayRecharge: number
  recentTransactions: Transaction[]
  recentUsers: User[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingRechargeCount, setPendingRechargeCount] = useState(0)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return

      const [usersRes, txRes] = await Promise.all([
        getAllUsers(token),
        getAllTransactions(token),
      ])

      // pending recharge requests count
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL
        const rrRes = await fetch(`${BASE_URL}/recharge-request/all?status=pending`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const rrData = await rrRes.json()
        if (rrData.success) setPendingRechargeCount(rrData.pendingCount ?? rrData.data?.length ?? 0)
      } catch {}

      const users: User[] = usersRes.success ? usersRes.data : []
      const transactions: Transaction[] = txRes.success ? txRes.data : []

      // ── Statistics calculate ──
      const today = new Date().toDateString()

      const totalUsers = users.filter((u) => u.role === "user").length
      const totalRecharge = transactions
        .filter((t) => t.type === "credit" && t.status === "success")
        .reduce((sum, t) => sum + t.amount, 0)
      const totalSpent = transactions
        .filter((t) => t.type === "debit" && t.status === "success")
        .reduce((sum, t) => sum + t.amount, 0)
      const totalServerCopy = transactions.filter(
        (t) => t.service === "server-copy" && t.status === "success"
      ).length
      const todayServerCopy = transactions.filter(
        (t) =>
          t.service === "server-copy" &&
          t.status === "success" &&
          new Date(t.createdAt).toDateString() === today
      ).length
      const todayRecharge = transactions
        .filter(
          (t) =>
            t.type === "credit" &&
            t.status === "success" &&
            new Date(t.createdAt).toDateString() === today
        )
        .reduce((sum, t) => sum + t.amount, 0)

      setStats({
        totalUsers,
        totalRecharge,
        totalSpent,
        totalServerCopy,
        todayServerCopy,
        todayRecharge,
        recentTransactions: transactions.slice(0, 8),
        recentUsers: users.filter((u) => u.role === "user").slice(0, 5),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })

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

  const statCards = [
    {
      title: "মোট Users",
      value: stats?.totalUsers ?? 0,
      suffix: "জন",
      icon: Users,
      color: "#667eea",
      shadow: "rgba(102,126,234,0.3)",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    },
    {
      title: "মোট Recharge",
      value: `৳${stats?.totalRecharge ?? 0}`,
      suffix: "",
      icon: Wallet,
      color: "#43e97b",
      shadow: "rgba(67,233,123,0.3)",
      gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    },
    {
      title: "মোট Server Copy",
      value: stats?.totalServerCopy ?? 0,
      suffix: "টি",
      icon: FileText,
      color: "#f093fb",
      shadow: "rgba(240,147,251,0.3)",
      gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    },
    {
      title: "মোট Revenue",
      value: `৳${stats?.totalSpent ?? 0}`,
      suffix: "",
      icon: TrendingUp,
      color: "#4facfe",
      shadow: "rgba(79,172,254,0.3)",
      gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            সিস্টেমের সার্বিক অবস্থা
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border rounded-lg px-3 py-2 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Pending Recharge Notification */}
      {pendingRechargeCount > 0 && (
        <Link href="/admin/recharge-requests">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", borderRadius: "12px",
            background: "rgba(245,158,11,0.08)", border: "1.5px solid rgba(245,158,11,0.35)",
            cursor: "pointer", transition: "background 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "10px",
                background: "rgba(245,158,11,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Bell size={18} color="#d97706" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#d97706" }}>
                  {pendingRechargeCount}টি Recharge Request অপেক্ষায় আছে
                </p>
                <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>
                  Approve করতে ক্লিক করুন
                </p>
              </div>
            </div>
            <span style={{
              background: "#d97706", color: "#fff",
              fontSize: 13, fontWeight: 800,
              padding: "4px 12px", borderRadius: "20px",
            }}>
              {pendingRechargeCount}
            </span>
          </div>
        </Link>
      )}

      {/* Today Stats */}
      <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border bg-muted/30">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">আজকের Server Copy</p>
          <p className="text-2xl font-bold text-primary">{stats?.todayServerCopy}</p>
          <p className="text-xs text-muted-foreground">টি</p>
        </div>
        <div className="text-center border-l">
          <p className="text-xs text-muted-foreground mb-1">আজকের Recharge</p>
          <p className="text-2xl font-bold text-green-600">৳{stats?.todayRecharge}</p>
          <p className="text-xs text-muted-foreground">টাকা</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              style={{
                background: card.gradient,
                boxShadow: `0 8px 20px ${card.shadow}`,
                borderRadius: "16px",
                padding: "20px 16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", right: "-10px", top: "-10px",
                width: "70px", height: "70px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
              }} />
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "12px",
              }}>
                <Icon size={20} color="#fff" />
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                {card.value}{card.suffix}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>
                {card.title}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom: Recent Transactions + Recent Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={16} />
              সাম্প্রতিক Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {stats?.recentTransactions.length === 0 ? (
                <p className="text-center py-6 text-sm text-muted-foreground">কোনো transaction নেই</p>
              ) : (
                stats?.recentTransactions.map((t) => (
                  <div key={t._id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                        {t.type === "credit"
                          ? <ArrowUpRight size={14} className="text-green-600" />
                          : <ArrowDownRight size={14} className="text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {t.service === "server-copy" ? "Server Copy" : "Recharge"}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(t.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${t.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                      {t.type === "credit" ? "+" : "-"}৳{t.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users size={16} />
              সাম্প্রতিক Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {stats?.recentUsers.length === 0 ? (
                <p className="text-center py-6 text-sm text-muted-foreground">কোনো user নেই</p>
              ) : (
                stats?.recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {(user.name || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      ৳{user.wallet?.balance ?? 0}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}