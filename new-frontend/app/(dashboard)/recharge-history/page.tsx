"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { getMyTransactions } from "@/lib/api"
import { Search, Filter, ArrowUpCircle, ArrowDownCircle, X, CheckCircle2 } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────
type Transaction = {
  _id: string
  type: "credit" | "debit"
  amount: number
  service: "server-copy" | "recharge"
  nid?: string
  balanceBefore: number
  balanceAfter: number
  status: "success" | "failed"
  note?: string
  createdAt: string
}

// ── Helpers ────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const time = d.toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit", hour12: true })
  const date = d.toLocaleDateString("en-BD", { day: "2-digit", month: "2-digit", year: "2-digit" })
  return { time, date, full: `${time} ${date}` }
}

function getServiceLabel(service: string) {
  if (service === "server-copy") return "সার্ভার কপি"
  if (service === "recharge") return "ওয়ালেট রিচার্জ"
  return service
}

export default function RechargeHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all")
  const [selected, setSelected] = useState<Transaction | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        if (!token) return
        const res = await getMyTransactions(token)
        if (res.success) setTransactions(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  // Filter + search
  const filtered = transactions.filter((t) => {
    const matchFilter = filter === "all" || t.type === filter
    const matchSearch =
      !search ||
      t.nid?.includes(search) ||
      getServiceLabel(t.service).includes(search) ||
      t._id.includes(search)
    return matchFilter && matchSearch
  })

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #131313 0%, #bab0b4 100%)",
        borderRadius: "16px",
        padding: "24px 20px 20px",
        marginBottom: "16px",
        color: "#fff",
      }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
          লেনদেনের ইতিহাস
        </h1>
        <p style={{ fontSize: "13px", opacity: 0.8 }}>
          সর্বশেষ ৫০টি লেনদেন
        </p>

        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "10px",
          padding: "8px 14px",
          marginTop: "14px",
          gap: "8px",
        }}>
          <Search size={15} color="rgba(255,255,255,0.7)" />
          <input
            placeholder="TrxID বা NID দিয়ে খুঁজুন"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "13px",
              flex: 1,
            }}
          />
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {(["all", "credit", "debit"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              background: filter === f ? "#E2136E" : "#f3f4f6",
              color: filter === f ? "#fff" : "#555",
              transition: "all 0.2s",
            }}
          >
            {f === "all" ? "সব" : f === "credit" ? "রিচার্জ" : "খরচ"}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>

        {loading && (
          <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
            লোড হচ্ছে...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
            কোনো লেনদেন নেই
          </div>
        )}

        {filtered.map((t, i) => {
          const { time, date } = formatDate(t.createdAt)
          const isCredit = t.type === "credit"

          return (
            <div
              key={t._id}
              onClick={() => setSelected(t)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 16px",
                borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                cursor: "pointer",
                transition: "background 0.15s",
                gap: "12px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Icon */}
              <div style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: isCredit ? "#dcfce7" : "#fce4ec",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {isCredit
                  ? <ArrowDownCircle size={20} color="#16a34a" />
                  : <ArrowUpCircle size={20} color="#E2136E" />
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>
                  {getServiceLabel(t.service)}
                </div>
                <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
                  {time} · {date}
                  {t.nid && ` · NID: ${t.nid}`}
                </div>
              </div>

              {/* Amount */}
              <div style={{ textAlign: "right" }}>
                <div style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: isCredit ? "#16a34a" : "#E2136E",
                }}>
                  {isCredit ? "+" : "-"} ৳{t.amount}
                </div>
                <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>
                  ব্যালেন্স: ৳{t.balanceAfter}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: "#ccc", fontSize: "16px" }}>›</div>
            </div>
          )
        })}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 9999,
            padding: "0 0 0 0",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              width: "100%",
              maxWidth: "600px",
              padding: "24px 20px 32px",
              animation: "slideUp 0.3s ease",
            }}
          >
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}</style>

            {/* Close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700 }}>লেনদেনের বিবরণ</h3>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Status */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <CheckCircle2 size={48} color="#16a34a" style={{ margin: "0 auto 8px" }} />
              <div style={{
                fontSize: "32px",
                fontWeight: 800,
                color: selected.type === "credit" ? "#16a34a" : "#E2136E",
              }}>
                {selected.type === "credit" ? "+" : "-"} ৳{selected.amount}
              </div>
              <div style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                {getServiceLabel(selected.service)}
              </div>
            </div>

            {/* Details */}
            <div style={{
              background: "#f9fafb",
              borderRadius: "12px",
              overflow: "hidden",
            }}>
              {[
                ["তারিখ ও সময়", formatDate(selected.createdAt).full],
                ["ধরন", selected.type === "credit" ? "জমা" : "খরচ"],
                ["সেবা", getServiceLabel(selected.service)],
                ...(selected.nid ? [["NID নম্বর", selected.nid]] : []),
                ["আগের ব্যালেন্স", `৳${selected.balanceBefore}`],
                ["পরের ব্যালেন্স", `৳${selected.balanceAfter}`],
                ["স্ট্যাটাস", selected.status === "success" ? "✅ সফল" : "❌ ব্যর্থ"],
                ...(selected.note ? [["নোট", selected.note]] : []),
                ["TrxID", selected._id.slice(-12)],
              ].map(([label, value], i, arr) => (
                <div key={label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "11px 16px",
                  borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none",
                }}>
                  <span style={{ fontSize: "13px", color: "#888" }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", textAlign: "right", maxWidth: "60%" }}>{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}