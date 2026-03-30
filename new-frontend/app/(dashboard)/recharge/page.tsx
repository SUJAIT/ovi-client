"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle } from "lucide-react"
import { useUser } from "@/hooks/useUser"
const BKASH_NUMBER = "01836346401"
const WHATSAPP_LINK =
  "https://wa.me/8801315015900?text=Hello,%20ami%20payment%20korechi.%20Transaction%20ID:%20"// ← এখানে তোমার WhatsApp number বসাও

export default function RechargePage() {
    const { user } = useUser()
  const [copied, setCopied] = useState(false)
const balance = user?.wallet?.balance ?? 0
  const copyNumber = () => {
    navigator.clipboard.writeText(BKASH_NUMBER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

  }

  return (
    <>
      <style>{`
        .rc-wrap { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .rc-header { display: flex; align-items: center; justify-content: space-between; }
        .rc-title { font-size: 22px; font-weight: 700; }

        .rc-card { border: 1px solid hsl(var(--border)); border-radius: 16px; background: hsl(var(--background)); }

        .rc-card-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

        .bkash-box {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border-radius: 12px;
          background: rgba(226,19,110,0.06);
          border: 1.5px solid rgba(226,19,110,0.2);
        }

        .bkash-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #E2136E;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          font-weight: 700;
        }

        .bkash-number {
          font-size: 22px;
          font-weight: 800;
        }

        .copy-btn {
          margin-left: auto;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          border: none;
          font-size: 12px;
          font-weight: 600;
        }

        .note-box {
          background: rgba(59,130,246,0.08);
          border: 1px solid rgba(59,130,246,0.2);
          padding: 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.6;
        }

        .whatsapp-btn {
          display: block;
          text-align: center;
          padding: 12px;
          border-radius: 12px;
          background: #25D366;
          color: white;
          font-weight: 700;
          text-decoration: none;
        }

        .warn {
          font-size: 12px;
          text-align: center;
          color: gray;
        }
      `}</style>

      <div className="rc-wrap">

        {/* Header */}
        <div className="rc-header">
          <h1 className="rc-title">ওয়ালেট রিচার্জ</h1>
       <Badge variant="outline">
  <Wallet size={14} />
  ব্যালেন্স: ৳{balance}
</Badge>
        </div>

        {/* bKash Box */}
        <div className="rc-card">
          <div className="rc-card-body">
            <div className="bkash-box">
              <div className="bkash-icon">৳</div>

              <div>
                <div style={{ fontSize: 12, color: "gray" }}>
                  bKash Personal Number
                </div>
                <div className="bkash-number">{BKASH_NUMBER}</div>
              </div>

              <button
                className="copy-btn"
                onClick={copyNumber}
                style={{
                  background: copied ? "#dcfce7" : "#fce7f3",
                  color: copied ? "green" : "#E2136E",
                }}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <p className="warn">
              ⚠️ "Payment" করুন — "Send Money" নয়
            </p>
          </div>
        </div>

        {/* Instruction */}
        <div className="rc-card">
          <div className="rc-card-body">

            <div className="note-box">
              ✅ পেমেন্ট সম্পন্ন করার পর নিচের WhatsApp এ যোগাযোগ করুন। <br /><br />

              👉 আপনার <b>Transaction ID</b> দিন <br />
              👉 অথবা <b>Screenshot</b> পাঠান <br /><br />

              ⏱️ Admin verify করার পর balance add করা হবে।
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              className="whatsapp-btn"
            >
              WhatsApp এ যোগাযোগ করুন
            </a>

          </div>
        </div>

      </div>
    </>
  )
}