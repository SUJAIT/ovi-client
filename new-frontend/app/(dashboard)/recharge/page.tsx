"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle, Clock, XCircle, Send, AlertCircle } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { auth } from "@/lib/firebase"

const BKASH_NUMBER = "01836346401"
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
  const balance = user?.wallet?.balance ?? 0

  // ── Form state
  const [trxID, setTrxID] = useState("")
  const [amount, setAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  // ── Copy bKash number state
  const [copied, setCopied] = useState(false)

  // ── My request history
  const [myRequests, setMyRequests] = useState<MyRequest[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const copyNumber = () => {
    navigator.clipboard.writeText(BKASH_NUMBER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fetchMyRequests = async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(`${BASE_URL}/recharge-request/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setMyRequests(data.data)
    } catch {}
    finally { setLoadingHistory(false) }
  }

  useEffect(() => { fetchMyRequests() }, [])

  const handleSubmit = async () => {
    setMsg(null)

    const cleanTrx = trxID.trim().toUpperCase()
    const parsedAmount = Number(amount)

    // ── Client-side validation
    if (!cleanTrx || cleanTrx.length < 3) {
      setMsg({ text: "বৈধ bKash Transaction ID দিন", ok: false })
      return
    }
    if (!amount || isNaN(parsedAmount) || parsedAmount < 10) {
      setMsg({ text: "সর্বনিম্ন ৳১০ টাকা দিন", ok: false })
      return
    }

    setSubmitting(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) {
        setMsg({ text: "লগইন করুন", ok: false })
        return
      }

      const res = await fetch(`${BASE_URL}/recharge-request/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bkashTrxID: cleanTrx, amount: parsedAmount }),
      })

      const data = await res.json()
      setMsg({ text: data.message, ok: data.success })

      if (data.success) {
        setTrxID("")
        setAmount("")
        fetchMyRequests() // refresh history
      }
    } catch {
      setMsg({ text: "নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন", ok: false })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })

  const statusInfo = (s: string) => {
    if (s === "approved") return { color: "#16a34a", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", label: "Approved", icon: <CheckCircle size={11} /> }
    if (s === "rejected") return { color: "#dc2626", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", label: "Rejected", icon: <XCircle size={11} /> }
    return { color: "#d97706", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", label: "Pending", icon: <Clock size={11} /> }
  }

  return (
    <>
      <style>{`
        .rc-page { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

        /* ── Header */
        .rc-header { display: flex; align-items: center; justify-content: space-between; }
        .rc-title { font-size: 22px; font-weight: 700; }

        /* ── Card */
        .rc-card { border: 1px solid hsl(var(--border)); border-radius: 16px; background: hsl(var(--card)); overflow: hidden; }
        .rc-card-header { padding: 14px 20px 0; font-size: 13px; font-weight: 600; color: hsl(var(--muted-foreground)); letter-spacing: 0.3px; }
        .rc-card-body { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 14px; }

        /* ── bKash box */
        .bkash-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; background: rgba(226,19,110,0.06); border: 1.5px solid rgba(226,19,110,0.2); }
        .bkash-dot { width: 44px; height: 44px; border-radius: 50%; background: #E2136E; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 800; flex-shrink: 0; }
        .bkash-num { font-size: 20px; font-weight: 800; }
        .bkash-sub { font-size: 11px; color: hsl(var(--muted-foreground)); margin-bottom: 2px; }
        .copy-btn { margin-left: auto; display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 8px; cursor: pointer; border: none; font-size: 12px; font-weight: 600; transition: all 0.2s; }

        /* ── Form inputs */
        .field-wrap { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 12px; font-weight: 600; color: hsl(var(--muted-foreground)); }
        .field-input {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 14px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .field-input:focus { border-color: hsl(var(--primary)); box-shadow: 0 0 0 3px hsl(var(--primary)/0.12); }
        .field-input::placeholder { color: hsl(var(--muted-foreground)/0.7); }
        .field-input.mono { font-family: monospace; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }

        /* ── Submit button */
        .submit-btn {
          width: 100%; padding: 12px; border-radius: 12px;
          background: hsl(var(--primary)); color: hsl(var(--primary-foreground));
          font-size: 14px; font-weight: 700; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.15s, transform 0.1s;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Message */
        .msg-box { padding: 11px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .msg-ok { background: rgba(34,197,94,0.08); color: #16a34a; border: 1px solid rgba(34,197,94,0.25); }
        .msg-err { background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.25); }

        /* ── Instruction steps */
        .steps { display: flex; flex-direction: column; gap: 10px; }
        .step { display: flex; align-items: flex-start; gap: 12px; }
        .step-num { width: 24px; height: 24px; border-radius: 50%; background: hsl(var(--primary)/0.12); color: hsl(var(--primary)); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .step-text { font-size: 13px; color: hsl(var(--foreground)); line-height: 1.5; }
        .step-text b { font-weight: 700; }

        .warn-note { font-size: 12px; text-align: center; color: hsl(var(--muted-foreground)); }

        /* ── History table */
        .hist-table-wrap { border-radius: 10px; overflow: hidden; border: 1px solid hsl(var(--border)); }
        .hist-table { width: 100%; border-collapse: collapse; }
        .hist-table th { padding: 9px 12px; text-align: left; font-size: 11px; font-weight: 700; color: hsl(var(--muted-foreground)); background: hsl(var(--muted)/0.5); white-space: nowrap; }
        .hist-table td { padding: 10px 12px; font-size: 12px; border-top: 1px solid hsl(var(--border)); }
        .hist-table tr:hover td { background: hsl(var(--muted)/0.3); }
        .mono { font-family: monospace; font-weight: 700; font-size: 12px; }
        .s-pill { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; white-space: nowrap; }
        .empty-hist { text-align: center; padding: 28px; color: hsl(var(--muted-foreground)); font-size: 13px; }
      `}</style>

      <div className="rc-page">

        {/* ── Header */}
        <div className="rc-header">
          <h1 className="rc-title">ওয়ালেট রিচার্জ</h1>
          <Badge variant="outline">
            <Wallet size={13} style={{ marginRight: 4 }} />
            ব্যালেন্স: ৳{balance}
          </Badge>
        </div>

        {/* ── Step 1: Send bKash */}
        <div className="rc-card">
          <div className="rc-card-header">STEP 1 — bKash এ পেমেন্ট করুন</div>
          <div className="rc-card-body">
            <div className="bkash-row">
              <div className="bkash-dot">৳</div>
              <div>
                <div className="bkash-sub">bKash Personal Number</div>
                <div className="bkash-num">{BKASH_NUMBER}</div>
              </div>
              <button
                className="copy-btn"
                onClick={copyNumber}
                style={{
                  background: copied ? "#dcfce7" : "#fce7f3",
                  color: copied ? "#16a34a" : "#E2136E",
                }}
              >
                {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="warn-note">⚠️ "Payment" করুন — "Send Money" নয়</p>

            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>
                <div className="step-text">উপরের নম্বরে <b>bKash Payment</b> করুন</div>
              </div>
              <div className="step">
                <div className="step-num">2</div>
                <div className="step-text">bKash থেকে পাওয়া <b>Transaction ID</b> কপি করুন (যেমন: 8G6A1B2C3D)</div>
              </div>
              <div className="step">
                <div className="step-num">3</div>
                <div className="step-text">নিচের ফর্মে TrxID ও Amount দিয়ে <b>Submit</b> করুন</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Step 2: Submit form */}
        <div className="rc-card">
          <div className="rc-card-header">STEP 2 — Request জমা দিন</div>
          <div className="rc-card-body">

            {/* Message */}
            {msg && (
              <div className={`msg-box ${msg.ok ? "msg-ok" : "msg-err"}`}>
                {msg.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                {msg.text}
              </div>
            )}

            {/* TrxID */}
            <div className="field-wrap">
              <label className="field-label">bKash Transaction ID *</label>
              <input
                className="field-input mono"
                placeholder="যেমন: 8G6A1B2C3D"
                value={trxID}
                onChange={(e) => setTrxID(e.target.value.toUpperCase())}
                maxLength={30}
                disabled={submitting}
              />
            </div>

            {/* Amount */}
            <div className="field-wrap">
              <label className="field-label">পরিমাণ (টাকা) *</label>
              <input
                className="field-input"
                type="number"
                placeholder="সর্বনিম্ন ১০"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={10}
                disabled={submitting}
              />
            </div>

            <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Submit হচ্ছে...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Request Submit করুন
                </>
              )}
            </button>

            <p className="warn-note">
              ✅ Admin verify করার পর আপনার balance automatically যোগ হবে
            </p>
          </div>
        </div>

        {/* ── My request history */}
        <div className="rc-card">
          <div className="rc-card-header">আমার Recharge History</div>
          <div className="rc-card-body" style={{ padding: "14px 0 0" }}>
            {loadingHistory ? (
              <div className="empty-hist">লোড হচ্ছে...</div>
            ) : myRequests.length === 0 ? (
              <div className="empty-hist">কোনো request নেই</div>
            ) : (
              <div className="hist-table-wrap" style={{ margin: "0 0 4px" }}>
                <table className="hist-table">
                  <thead>
                    <tr>
                      <th>TrxID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.map((r) => {
                      const si = statusInfo(r.status)
                      return (
                        <tr key={r._id}>
                          <td><span className="mono">{r.bkashTrxID}</span></td>
                          <td style={{ fontWeight: 700 }}>৳{r.amount}</td>
                          <td>
                            <span
                              className="s-pill"
                              style={{ background: si.bg, color: si.color, border: `1px solid ${si.border}` }}
                            >
                              {si.icon} {si.label}
                            </span>
                            {r.adminNote && (
                              <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>
                                {r.adminNote}
                              </div>
                            )}
                          </td>
                          <td style={{ color: "hsl(var(--muted-foreground))", whiteSpace: "nowrap" }}>
                            {formatDate(r.createdAt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}