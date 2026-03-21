"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ovi-workstation-backend.onrender.com"

export default function MockBkashPage() {
  const params = useSearchParams()
  const router = useRouter()

  const paymentID = params.get("paymentID") || ""
  const amount = params.get("amount") || "0"

  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [pin, setPin] = useState("")
  const [step, setStep] = useState<"phone" | "otp" | "pin" | "processing">("phone")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePhoneSubmit = () => {
    if (phone.length !== 11) { setError("সঠিক নম্বর দিন"); return }
    setError(""); setStep("otp")
  }

  const handleOtpSubmit = () => {
    if (otp !== "123456") { setError("OTP ভুল। Test OTP: 123456"); return }
    setError(""); setStep("pin")
  }

  // ── Fix: mock-callback JSON API call করো — redirect নয় ──────────
  const handlePinSubmit = async () => {
    if (pin !== "12121") { setError("PIN ভুল। Test PIN: 12121"); return }
    setError("")
    setLoading(true)
    setStep("processing")

    try {
      const res = await fetch(
        `${BASE_URL}/payment/mock-callback?paymentID=${paymentID}&status=success`,
        { method: "GET" }
      )

      const data = await res.json()

      if (data.success) {
        router.push(`/payment/success?amount=${data.amount}&trxID=${data.trxID}`)
      } else {
        router.push(`/payment/failed?reason=${data.reason || "error"}`)
      }
    } catch {
      router.push(`/payment/failed?reason=mock_error`)
    }
  }

  const handleCancel = async () => {
    try {
      await fetch(`${BASE_URL}/payment/mock-callback?paymentID=${paymentID}&status=cancel`)
    } catch {}
    router.push(`/payment/failed?reason=cancel`)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "360px", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>

        <div style={{ background: "#E2136E", padding: "20px", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "2px" }}>bKash</div>
          <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>TEST MODE — Sandbox</div>
        </div>

        <div style={{ background: "#fce4ec", padding: "12px 20px", textAlign: "center", borderBottom: "1px solid #f8bbd0" }}>
          <div style={{ fontSize: "13px", color: "#666" }}>পরিশোধের পরিমাণ</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#E2136E" }}>৳{amount}</div>
        </div>

        <div style={{ padding: "20px" }}>

          {step === "phone" && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "6px" }}>bKash নম্বর</label>
                <input type="tel" placeholder="01XXXXXXXXX" value={phone}
                  onChange={(e) => setPhone(e.target.value)} maxLength={11} style={inputStyle} />
                <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>Test: যেকোনো ১১ সংখ্যার নম্বর</div>
              </div>
              {error && <div style={errorStyle}>{error}</div>}
              <button onClick={handlePhoneSubmit} style={btnStyle}>পরবর্তী</button>
            </div>
          )}

          {step === "otp" && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "6px" }}>OTP কোড</label>
                <input type="number" placeholder="OTP" value={otp}
                  onChange={(e) => setOtp(e.target.value)} maxLength={6} style={inputStyle} />
                <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>Test OTP: <strong>123456</strong></div>
              </div>
              {error && <div style={errorStyle}>{error}</div>}
              <button onClick={handleOtpSubmit} style={btnStyle}>যাচাই করুন</button>
            </div>
          )}

          {step === "pin" && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "6px" }}>bKash PIN</label>
                <input type="password" placeholder="PIN" value={pin}
                  onChange={(e) => setPin(e.target.value)} maxLength={5} style={inputStyle} />
                <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>Test PIN: <strong>12121</strong></div>
              </div>
              {error && <div style={errorStyle}>{error}</div>}
              <button onClick={handlePinSubmit} style={btnStyle} disabled={loading}>
                {loading ? "Processing..." : "পেমেন্ট করুন"}
              </button>
            </div>
          )}

          {step === "processing" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
              <div style={{ color: "#E2136E", fontWeight: "bold" }}>Processing...</div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "6px" }}>পেমেন্ট verify হচ্ছে</div>
            </div>
          )}

          {step !== "processing" && (
            <button onClick={handleCancel} style={{ width: "100%", padding: "10px", marginTop: "10px", background: "transparent", border: "1px solid #ddd", borderRadius: "4px", color: "#999", cursor: "pointer", fontSize: "13px" }}>
              বাতিল করুন
            </button>
          )}

        </div>

        <div style={{ padding: "12px", textAlign: "center", background: "#fafafa", borderTop: "1px solid #eee", fontSize: "11px", color: "#aaa" }}>
          🔒 Mock Payment — Development Only
        </div>

      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "15px", outline: "none", boxSizing: "border-box" }
const btnStyle: React.CSSProperties = { width: "100%", padding: "12px", background: "#E2136E", color: "#fff", border: "none", borderRadius: "4px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }
const errorStyle: React.CSSProperties = { color: "#dc2626", fontSize: "12px", marginBottom: "10px", padding: "6px 10px", background: "#fef2f2", borderRadius: "4px" }