"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { getAllUsers, rechargeWallet } from "@/lib/api"
import { RefreshCw, Wallet, Users, ShieldCheck, ShieldX, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL //|| "https://ovi-workstation-backend.onrender.com"

type User = {
  _id: string
  name?: string
  email: string
  role: "user" | "admin" | "super_admin"
  wallet?: { balance: number; totalSpent: number; totalRecharge: number }
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [rechargeData, setRechargeData] = useState<{ userId: string; amount: string; note: string; name: string } | null>(null)
  const [rechargeLoading, setRechargeLoading] = useState(false)
  const [roleLoading, setRoleLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const data = await getAllUsers(token)
      if (data.success) setUsers(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  // ── Role Change ───────────────────────────────────────────────
  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    setRoleLoading(userId)
    setMessage(null)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return

      const res = await fetch(`${BASE_URL}/user/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role: newRole }),
      })
      const data = await res.json()

      if (data.success) {
        setMessage({
          text: `✅ Role successfully changed to ${newRole}`,
          type: "success",
        })
        fetchUsers()
      } else {
        setMessage({ text: `❌ ${data.message}`, type: "error" })
      }
    } catch {
      setMessage({ text: "❌ Error occurred", type: "error" })
    } finally {
      setRoleLoading(null)
    }
  }

  // ── Wallet Recharge ───────────────────────────────────────────
  const handleRecharge = async () => {
    if (!rechargeData) return
    const amt = parseInt(rechargeData.amount)
    if (!amt || amt <= 0) {
      setMessage({ text: "সঠিক পরিমাণ দিন", type: "error" })
      return
    }

    setRechargeLoading(true)
    setMessage(null)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const data = await rechargeWallet(token, rechargeData.userId, amt, rechargeData.note)
      if (data.success) {
        setMessage({ text: `✅ ৳${amt} successfully added to ${rechargeData.name}`, type: "success" })
        setRechargeData(null)
        fetchUsers()
      } else {
        setMessage({ text: `❌ ${data.message}`, type: "error" })
      }
    } catch {
      setMessage({ text: "❌ Error occurred", type: "error" })
    } finally {
      setRechargeLoading(false)
    }
  }

  // ── Filter ────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  const getRoleBadge = (role: string) => {
    if (role === "super_admin") return { label: "Super Admin", bg: "rgba(139,92,246,0.1)", color: "#7c3aed", border: "rgba(139,92,246,0.3)" }
    if (role === "admin") return { label: "Admin", bg: "rgba(59,130,246,0.1)", color: "#2563eb", border: "rgba(59,130,246,0.3)" }
    return { label: "User", bg: "rgba(34,197,94,0.1)", color: "#16a34a", border: "rgba(34,197,94,0.3)" }
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users size={22} /> সব Users
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8 w-48 h-9 text-sm"
              placeholder="নাম বা email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-1.5 h-9">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`px-4 py-2.5 rounded-lg text-sm font-medium border ${
          message.type === "success"
            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30"
            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30"
        }`}>
          {message.text}
        </div>
      )}

      {/* Recharge Modal */}
      {rechargeData && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet size={16} />
              Wallet Recharge — {rechargeData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Amount (৳) *</label>
                <Input
                  type="number"
                  placeholder="পরিমাণ লিখুন"
                  value={rechargeData.amount}
                  onChange={(e) => setRechargeData({ ...rechargeData, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
                <Input
                  placeholder="Note"
                  value={rechargeData.note}
                  onChange={(e) => setRechargeData({ ...rechargeData, note: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRecharge} disabled={rechargeLoading} className="flex-1">
                {rechargeLoading ? "Processing..." : "Recharge করুন"}
              </Button>
              <Button variant="outline" onClick={() => setRechargeData(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "মোট Users", value: users.filter(u => u.role === "user").length, color: "#16a34a" },
          { label: "মোট Admins", value: users.filter(u => u.role === "admin").length, color: "#2563eb" },
          { label: "Super Admins", value: users.filter(u => u.role === "super_admin").length, color: "#7c3aed" },
        ].map((s) => (
          <div key={s.label} className="border rounded-xl p-4 text-center bg-background">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-muted/50 border-b">
                {["SL", "Name", "Email", "Role", "Balance", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    কোনো user নেই
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => {
                  const badge = getRoleBadge(user.role)
                  const isSuper = user.role === "super_admin"
                  return (
                    <tr key={user._id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                            {(user.name || user.email)[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{user.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <span style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        {user.role === "user" ? (
                          <span className="text-green-600">৳{user.wallet?.balance ?? 0}</span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {isSuper ? (
                          <span className="text-xs text-muted-foreground">Protected</span>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Role Toggle */}
                            {user.role === "user" ? (
                              <button
                                onClick={() => handleRoleChange(user._id, "admin")}
                                disabled={roleLoading === user._id}
                                style={{
                                  display: "flex", alignItems: "center", gap: "4px",
                                  padding: "5px 10px", borderRadius: "6px",
                                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                                  background: "rgba(59,130,246,0.1)", color: "#2563eb",
                                  border: "1px solid rgba(59,130,246,0.3)",
                                  opacity: roleLoading === user._id ? 0.6 : 1,
                                }}
                              >
                                <ShieldCheck size={12} />
                                {roleLoading === user._id ? "..." : "Make Admin"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(user._id, "user")}
                                disabled={roleLoading === user._id}
                                style={{
                                  display: "flex", alignItems: "center", gap: "4px",
                                  padding: "5px 10px", borderRadius: "6px",
                                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                                  background: "rgba(239,68,68,0.1)", color: "#dc2626",
                                  border: "1px solid rgba(239,68,68,0.3)",
                                  opacity: roleLoading === user._id ? 0.6 : 1,
                                }}
                              >
                                <ShieldX size={12} />
                                {roleLoading === user._id ? "..." : "Remove Admin"}
                              </button>
                            )}

                            {/* Recharge — শুধু user এর জন্য */}
                            {user.role === "user" && (
                              <button
                                onClick={() => setRechargeData({
                                  userId: user._id,
                                  amount: "",
                                  note: "",
                                  name: user.name || user.email,
                                })}
                                style={{
                                  display: "flex", alignItems: "center", gap: "4px",
                                  padding: "5px 10px", borderRadius: "6px",
                                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                                  background: "rgba(34,197,94,0.1)", color: "#16a34a",
                                  border: "1px solid rgba(34,197,94,0.3)",
                                }}
                              >
                                <Wallet size={12} />
                                Recharge
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}