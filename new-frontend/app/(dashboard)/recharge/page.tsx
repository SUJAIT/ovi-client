"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { useUser } from "@/hooks/useUser"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const BKASH_NUMBER = "01836346401"
const QUICK_AMOUNTS = [100, 200, 500, 1000]

type MyRequest = {
  _id: string
  amount: number
  bkashTrxID: string
  status: "pending" | "approved" | "rejected"
  adminNote?: string
  createdAt: string
}

export default function RechargePage() {
  const { user } = useUser()
  const [amount, setAmount] = useState("")
  const [trxID, setTrxID] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copied, setCopied] = useState(false)
  const [myRequests, setMyRequests] = useState<MyRequest[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const balance = user?.wallet?.balance ?? 0

  const copyNumber = () => {
    navigator.clipboard.writeText(BKASH_NUMBER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fetchMyRequests = async () => {
    setHistoryLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(`${BASE_URL}/recharge-request/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setMyRequests(data.data)
    } catch {}
    finally { setHistoryLoading(false) }
  }

  useEffect(() => { fetchMyRequests() }, [])

  const handleSubmit = async () => {
    setError("")
    setSuccess("")
    if (!amount || Number(amount) < 10) { setError("সর্বনিম্ন ৳১০ দিন"); return }
    if (!trxID.trim()) { setError("bKash Transaction ID দিন"); return }

    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Login করুন")
      const res = await fetch(`${BASE_URL}/recharge-request/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount), bkashTrxID: trxID.trim() }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message); return }
      setSuccess("✅ Request submit হয়েছে! Admin verify করলে balance যোগ হবে।")
      setAmount(""); setTrxID("")
      fetchMyRequests()
    } catch (e: any) {
      setError(e.message || "সার্ভার এরর")
    } finally { setLoading(false) }
  }

  const statusBadge = (s: string) => {
    if (s === "approved") return { icon: <CheckCircle size={11} />, label: "Approved", color: "#16a34a", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)" }
    if (s === "rejected") return { icon: <XCircle size={11} />, label: "Rejected", color: "#dc2626", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" }
    return { icon: <Clock size={11} />, label: "Pending", color: "#d97706", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <>
      <style>{`
        .rc-wrap { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .rc-header { display: flex; align-items: center; justify-content: space-between; }
        .rc-title { font-size: 22px; font-weight: 700; }
        .rc-card { border: 1px solid hsl(var(--border)); border-radius: 16px; background: hsl(var(--background)); overflow: hidden; }
        .rc-card-header { padding: 16px 20px 12px; border-bottom: 1px solid hsl(var(--border)); }
        .rc-card-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .rc-card-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .bkash-box { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 12px; background: rgba(226,19,110,0.06); border: 1.5px solid rgba(226,19,110,0.2); }
        .bkash-icon { width: 48px; height: 48px; border-radius: 50%; background: #E2136E; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 700; flex-shrink: 0; }
        .bkash-number { font-size: 22px; font-weight: 800; letter-spacing: 1px; }
        .bkash-label { font-size: 11px; color: hsl(var(--muted-foreground)); margin-bottom: 2px; }
        .copy-btn { margin-left: auto; display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; flex-shrink: 0; }
        .step-label { font-size: 12px; font-weight: 600; color: hsl(var(--muted-foreground)); }
        .amounts-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .amt-btn { padding: 8px 4px; border-radius: 8px; border: 1.5px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; text-align: center; }
        .amt-btn.active { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-color: hsl(var(--primary)); }
        .field-label { font-size: 12px; font-weight: 600; margin-bottom: 6px; display: block; }
        .field-input { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1.5px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); font-size: 14px; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
        .field-input:focus { border-color: hsl(var(--primary)); }
        .field-hint { font-size: 11px; color: hsl(var(--muted-foreground)); margin-top: 4px; }
        .submit-btn { width: 100%; padding: 12px; border-radius: 12px; background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); font-size: 14px; font-weight: 700; border: none; cursor: pointer; transition: opacity 0.15s; }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .msg-error { padding: 10px 14px; border-radius: 8px; font-size: 13px; background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.25); }
        .msg-success { padding: 10px 14px; border-radius: 8px; font-size: 13px; background: rgba(34,197,94,0.08); color: #16a34a; border: 1px solid rgba(34,197,94,0.25); }
        .history-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid hsl(var(--border)); }
        .history-row:last-child { border-bottom: none; }
        .history-trx { font-family: monospace; font-size: 12px; font-weight: 600; color: hsl(var(--muted-foreground)); margin-top: 2px; }
        .status-pill { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .empty-text { padding: 24px; text-align: center; font-size: 13px; color: hsl(var(--muted-foreground)); }
        .history-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid hsl(var(--border)); }
        .refresh-btn { display: flex; align-items: center; gap: 4px; font-size: 12px; color: hsl(var(--muted-foreground)); background: none; border: none; cursor: pointer; }
        .warn-note { font-size: 11px; color: hsl(var(--muted-foreground)); text-align: center; }
      `}</style>

      <div className="rc-wrap">
        {/* Header */}
        <div className="rc-header">
          <h1 className="rc-title">ওয়ালেট রিচার্জ</h1>
          <Badge variant="outline" style={{ gap: "6px", padding: "6px 12px", fontSize: "13px" }}>
            <Wallet size={14} />
            ব্যালেন্স: ৳{balance}
          </Badge>
        </div>

        {/* Step 1 — bKash number */}
        <div className="rc-card">
          <div className="rc-card-header">
            <div className="rc-card-title">
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#E2136E", color: "#fff", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>১</span>
              এই নম্বরে bKash Payment করুন
            </div>
          </div>
          <div className="rc-card-body">
            <div className="bkash-box">
              <div className="bkash-icon">৳</div>
              <div>
                <div className="bkash-label">bKash Personal Number</div>
                <div className="bkash-number">{BKASH_NUMBER}</div>
              </div>
              <button
                className="copy-btn"
                onClick={copyNumber}
                style={{
                  background: copied ? "rgba(34,197,94,0.1)" : "rgba(226,19,110,0.1)",
                  color: copied ? "#16a34a" : "#E2136E",
                  border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(226,19,110,0.3)"}`,
                }}
              >
                {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="warn-note">⚠️ "Payment" করুন — "Send Money" নয়</p>
          </div>
        </div>

        {/* Step 2 — Submit form */}
        <div className="rc-card">
          <div className="rc-card-header">
            <div className="rc-card-title">
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>২</span>
              পরিমাণ ও Transaction ID দিন
            </div>
          </div>
          <div className="rc-card-body">

            {/* Quick amounts */}
            <div>
              <span className="field-label">পরিমাণ বেছে নিন</span>
              <div className="amounts-grid">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    className={`amt-btn${amount === String(a) ? " active" : ""}`}
                    onClick={() => setAmount(String(a))}
                  >
                    ৳{a}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div>
              <span className="field-label">অথবা পরিমাণ লিখুন</span>
              <input
                className="field-input"
                placeholder="০"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                type="number"
                min="10"
              />
              <p className="field-hint">সর্বনিম্ন ৳১০</p>
            </div>

            {/* TrxID */}
            <div>
              <span className="field-label">bKash Transaction ID <span style={{ color: "#dc2626" }}>*</span></span>
              <input
                className="field-input"
                placeholder="যেমন: 8KJ3T2G4H1"
                value={trxID}
                onChange={(e) => setTrxID(e.target.value)}
                style={{ fontFamily: "monospace", letterSpacing: "1px" }}
              />
              <p className="field-hint">bKash SMS-এ পাওয়া TrxID লিখুন</p>
            </div>

            {error && <div className="msg-error">{error}</div>}
            {success && <div className="msg-success">{success}</div>}

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={loading || !amount || !trxID.trim()}
            >
              {loading ? "Submit হচ্ছে..." : amount ? `৳${amount} — Request Submit করুন` : "পরিমাণ ও TrxID দিন"}
            </button>

            <p className="warn-note">Admin verify করার পর balance যোগ হবে (সাধারণত ১৫ মিনিট)</p>
          </div>
        </div>

        {/* My Requests */}
        <div className="rc-card">
          <div className="history-header">
            <span style={{ fontSize: 14, fontWeight: 600 }}>আমার Requests</span>
            <button className="refresh-btn" onClick={fetchMyRequests}>
              <RefreshCw size={12} className={historyLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
          {myRequests.length === 0 ? (
            <div className="empty-text">কোনো request নেই</div>
          ) : (
            myRequests.map((r) => {
              const b = statusBadge(r.status)
              return (
                <div key={r._id} className="history-row">
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>৳{r.amount}</div>
                    <div className="history-trx">TrxID: {r.bkashTrxID}</div>
                    <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{formatDate(r.createdAt)}</div>
                    {r.adminNote && <div style={{ fontSize: 11, color: "#dc2626", marginTop: 2 }}>❌ {r.adminNote}</div>}
                  </div>
                  <span
                    className="status-pill"
                    style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}
                  >
                    {b.icon} {b.label}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
