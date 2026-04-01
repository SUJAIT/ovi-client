"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { auth } from "@/lib/firebase"
import { RefreshCw, CheckCircle, XCircle, Clock, Wallet, Search, BellRing, BellOff } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const POLL_INTERVAL = 15_000 // poll every 15 seconds

type RR = {
  _id: string
  userId: { name?: string; email: string; wallet?: { balance: number } }
  amount: number
  bkashTrxID: string
  status: "pending" | "approved" | "rejected"
  adminNote?: string
  createdAt: string
}

// ── Generate a simple beep using Web Audio API ────────────────────
function playBeep(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = "sine"
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.4)
}

export default function AdminRechargeRequestsPage() {
  const [requests, setRequests] = useState<RR[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"pending" | "all" | "approved" | "rejected">("pending")
  const [search, setSearch] = useState("")
  const [actionId, setActionId] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ id: string; note: string } | null>(null)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  // ── Notification / alarm state
  const [alarmActive, setAlarmActive] = useState(false)
  const [alarmMuted, setAlarmMuted] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastPendingRef = useRef<number>(0)

  // ── Start continuous alarm (beep every 1.2s) ─────────────────────
  const startAlarm = useCallback(() => {
    if (alarmMuted || alarmIntervalRef.current) return
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    const ctx = audioCtxRef.current
    playBeep(ctx)
    alarmIntervalRef.current = setInterval(() => playBeep(ctx), 1200)
    setAlarmActive(true)
  }, [alarmMuted])

  const stopAlarm = useCallback(() => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current)
      alarmIntervalRef.current = null
    }
    setAlarmActive(false)
  }, [])

  const muteAlarm = () => {
    stopAlarm()
    setAlarmMuted(true)
  }

  // ── Fetch full list ───────────────────────────────────────────────
  const fetchRequests = async (f = filter) => {
    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(`${BASE_URL}/recharge-request/all?status=${f}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setRequests(data.data)
        const count = data.pendingCount ?? 0
        setPendingCount(count)
        // trigger alarm if new pending arrived
        if (count > lastPendingRef.current && lastPendingRef.current !== -1) {
          if (!alarmMuted) startAlarm()
        }
        lastPendingRef.current = count
      }
    } catch {}
    finally { setLoading(false) }
  }

  // ── Lightweight poll for pending count only ───────────────────────
  const pollPendingCount = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(`${BASE_URL}/recharge-request/pending-count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!data.success) return

      const count: number = data.pendingCount ?? 0
      setPendingCount(count)

      // New request arrived since last poll?
      if (count > lastPendingRef.current) {
        if (!alarmMuted) startAlarm()
        // Refresh table if we're on pending/all tab
        if (filter === "pending" || filter === "all") {
          fetchRequests(filter)
        }
      }

      // No more pending — stop alarm
      if (count === 0) stopAlarm()

      lastPendingRef.current = count
    } catch {}
  }, [alarmMuted, filter, startAlarm, stopAlarm])

  // ── Initial load + set up polling ────────────────────────────────
  useEffect(() => {
    lastPendingRef.current = -1 // suppress alarm on first load
    fetchRequests(filter).then(() => {
      // After initial load, set ref to current count (no alarm)
      // lastPendingRef already updated inside fetchRequests
    })
    const interval = setInterval(pollPendingCount, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, []) // mount only

  useEffect(() => { fetchRequests(filter) }, [filter])

  // ── Stop alarm when admin opens the page (seen) ───────────────────
  useEffect(() => {
    stopAlarm()
    setAlarmMuted(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Approve ───────────────────────────────────────────────────────
  const handleApprove = async (id: string, amount: number, name: string) => {
    if (!confirm(`৳${amount} approve করবেন "${name}"-এর জন্য?`)) return
    setActionId(id); setMsg(null)
    try {
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch(`${BASE_URL}/recharge-request/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setMsg({ text: data.message, ok: data.success })
      if (data.success) fetchRequests(filter)
    } catch { setMsg({ text: "Error occurred", ok: false }) }
    finally { setActionId(null) }
  }

  // ── Reject ────────────────────────────────────────────────────────
  const handleReject = async () => {
    if (!rejectModal) return
    setActionId(rejectModal.id); setMsg(null)
    try {
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch(`${BASE_URL}/recharge-request/${rejectModal.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adminNote: rejectModal.note }),
      })
      const data = await res.json()
      setMsg({ text: data.message, ok: data.success })
      if (data.success) { setRejectModal(null); fetchRequests(filter) }
    } catch { setMsg({ text: "Error occurred", ok: false }) }
    finally { setActionId(null) }
  }

  const filtered = requests.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      r.bkashTrxID.toLowerCase().includes(q) ||
      r.userId?.name?.toLowerCase().includes(q) ||
      r.userId?.email?.toLowerCase().includes(q)
    )
  })

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

  const sBadge = (s: string) => {
    if (s === "approved") return { color: "#16a34a", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", label: "Approved", icon: <CheckCircle size={10} /> }
    if (s === "rejected") return { color: "#dc2626", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", label: "Rejected", icon: <XCircle size={10} /> }
    return { color: "#d97706", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", label: "Pending", icon: <Clock size={10} /> }
  }

  return (
    <>
      <style>{`
        .rr-wrap { max-width: 1000px; margin: 0 auto; }
        .rr-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
        .rr-title { font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .pending-badge { background: #dc2626; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
        .top-actions { display: flex; align-items: center; gap: 8px; }
        .refresh-btn { display: flex; align-items: center; gap: 6px; font-size: 13px; color: hsl(var(--muted-foreground)); border: 1px solid hsl(var(--border)); border-radius: 8px; padding: 7px 12px; background: none; cursor: pointer; transition: color 0.15s; }
        .refresh-btn:hover { color: hsl(var(--foreground)); }

        /* ── Alarm banner */
        @keyframes pulse-border { 0%,100%{border-color:rgba(245,158,11,0.4)} 50%{border-color:rgba(245,158,11,0.9)} }
        .alarm-banner { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-radius: 12px; background: rgba(245,158,11,0.1); border: 1.5px solid rgba(245,158,11,0.4); margin-bottom: 16px; animation: pulse-border 1s ease-in-out infinite; }
        .alarm-text { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; color: #d97706; }
        .alarm-mute { display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 8px; background: rgba(245,158,11,0.15); color: #d97706; border: none; cursor: pointer; font-size: 12px; font-weight: 600; }

        .filters { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
        .filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .filter-tab { padding: 6px 14px; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .filter-tab.active { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-color: hsl(var(--primary)); }
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: hsl(var(--muted-foreground)); }
        .search-input { padding: 7px 10px 7px 30px; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); font-size: 13px; outline: none; width: 200px; transition: border-color 0.15s; }
        .search-input:focus { border-color: hsl(var(--primary)); }
        .msg-box { padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; margin-bottom: 14px; }
        .msg-ok { background: rgba(34,197,94,0.08); color: #16a34a; border: 1px solid rgba(34,197,94,0.25); }
        .msg-err { background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.25); }
        .table-wrap { border: 1px solid hsl(var(--border)); border-radius: 14px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; min-width: 680px; }
        thead tr { background: hsl(var(--muted)/0.5); }
        th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: hsl(var(--muted-foreground)); letter-spacing: 0.4px; white-space: nowrap; }
        tbody tr { border-top: 1px solid hsl(var(--border)); transition: background 0.15s; }
        tbody tr:hover { background: hsl(var(--muted)/0.3); }
        td { padding: 12px 14px; font-size: 13px; vertical-align: middle; }
        .user-avatar { width: 34px; height: 34px; border-radius: 50%; background: hsl(var(--primary)/0.12); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: hsl(var(--primary)); flex-shrink: 0; }
        .trx-mono { font-family: monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; }
        .s-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .action-approve { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.15s; background: rgba(34,197,94,0.12); color: #16a34a; }
        .action-approve:disabled { opacity: 0.5; cursor: not-allowed; }
        .action-reject { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.15s; background: rgba(239,68,68,0.1); color: #dc2626; margin-left: 6px; }
        .action-reject:disabled { opacity: 0.5; cursor: not-allowed; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px; }
        .modal-box { background: hsl(var(--background)); border: 1px solid hsl(var(--border)); border-radius: 14px; padding: 24px; width: 100%; max-width: 360px; }
        .modal-title { font-size: 15px; font-weight: 700; margin-bottom: 14px; }
        .modal-input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); font-size: 14px; outline: none; margin-bottom: 14px; box-sizing: border-box; }
        .modal-input:focus { border-color: hsl(var(--primary)); }
        .modal-btns { display: flex; gap: 8px; }
        .modal-reject-btn { flex: 1; padding: 10px; border-radius: 8px; background: #dc2626; color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer; }
        .modal-reject-btn:disabled { opacity: 0.6; }
        .modal-cancel-btn { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid hsl(var(--border)); background: none; color: hsl(var(--foreground)); font-size: 13px; font-weight: 600; cursor: pointer; }
        .empty-cell { text-align: center; padding: 48px; color: hsl(var(--muted-foreground)); }
        .footer-note { font-size: 12px; color: hsl(var(--muted-foreground)); text-align: center; margin-top: 12px; }
        .poll-note { font-size: 11px; color: hsl(var(--muted-foreground)); text-align: right; margin-bottom: 6px; }
      `}</style>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Reject করার কারণ (optional)</div>
            <input
              className="modal-input"
              placeholder="কারণ লিখুন..."
              value={rejectModal.note}
              onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
            />
            <div className="modal-btns">
              <button className="modal-reject-btn" onClick={handleReject} disabled={!!actionId}>
                {actionId ? "..." : "Reject করুন"}
              </button>
              <button className="modal-cancel-btn" onClick={() => setRejectModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="rr-wrap">
        {/* Header */}
        <div className="rr-top">
          <h1 className="rr-title">
            <Wallet size={22} />
            Recharge Requests
            {pendingCount > 0 && <span className="pending-badge">{pendingCount} pending</span>}
          </h1>
          <div className="top-actions">
            <button className="refresh-btn" onClick={() => fetchRequests(filter)}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Alarm banner — shows when new pending request arrives */}
        {alarmActive && (
          <div className="alarm-banner">
            <div className="alarm-text">
              <BellRing size={18} />
              নতুন Recharge Request এসেছে! ({pendingCount}টি pending)
            </div>
            <button className="alarm-mute" onClick={muteAlarm}>
              <BellOff size={13} />
              Mute
            </button>
          </div>
        )}

        {/* Message */}
        {msg && <div className={`msg-box ${msg.ok ? "msg-ok" : "msg-err"}`}>{msg.text}</div>}

        {/* Polling note */}
        <p className="poll-note">🔄 Auto-refresh প্রতি {POLL_INTERVAL / 1000}s</p>

        {/* Filters */}
        <div className="filters">
          <div className="filter-tabs">
            {(["pending", "all", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                className={`filter-tab${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "pending" ? "⏳ Pending" : f === "all" ? "সব" : f === "approved" ? "✅ Approved" : "❌ Rejected"}
              </button>
            ))}
          </div>
          <div className="search-wrap">
            <Search size={13} className="search-icon" />
            <input
              className="search-input"
              placeholder="TrxID, নাম, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>USER</th>
                <th>AMOUNT</th>
                <th>BKASH TRX ID</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="empty-cell">
                  <RefreshCw size={20} style={{ margin: "0 auto 8px", display: "block", opacity: 0.4 }} className="animate-spin" />
                  লোড হচ্ছে...
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="empty-cell">কোনো request নেই</td></tr>
              ) : (
                filtered.map((r, i) => {
                  const b = sBadge(r.status)
                  const name = r.userId?.name || r.userId?.email || "—"
                  return (
                    <tr key={r._id}>
                      <td style={{ color: "hsl(var(--muted-foreground))", fontSize: 12 }}>{i + 1}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="user-avatar">{name[0].toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{r.userId?.name || "—"}</div>
                            <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{r.userId?.email}</div>
                            <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                              Balance: ৳{r.userId?.wallet?.balance ?? "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: "#16a34a", fontSize: 15 }}>৳{r.amount}</td>
                      <td><span className="trx-mono">{r.bkashTrxID}</span></td>
                      <td>
                        <span className="s-pill" style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                          {b.icon} {b.label}
                        </span>
                        {r.adminNote && (
                          <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 3 }}>
                            {r.adminNote}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", whiteSpace: "nowrap" }}>
                        {formatDate(r.createdAt)}
                      </td>
                      <td>
                        {r.status === "pending" ? (
                          <>
                            <button
                              className="action-approve"
                              onClick={() => handleApprove(r._id, r.amount, name)}
                              disabled={actionId === r._id}
                            >
                              <CheckCircle size={12} />
                              {actionId === r._id ? "..." : "Approve"}
                            </button>
                            <button
                              className="action-reject"
                              onClick={() => setRejectModal({ id: r._id, note: "" })}
                              disabled={actionId === r._id}
                            >
                              <XCircle size={12} />
                              Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="footer-note">{filtered.length} টি request দেখাচ্ছে</div>
      </div>
    </>
  )
}