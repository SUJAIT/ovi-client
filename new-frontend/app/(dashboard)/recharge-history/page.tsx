// "use client"

// import { useEffect, useState } from "react"
// import { auth } from "@/lib/firebase"
// import { getMyTransactions } from "@/lib/api"
// import { Search, Filter, ArrowUpCircle, ArrowDownCircle, X, CheckCircle2 } from "lucide-react"

// // ── Types ──────────────────────────────────────────────────────────
// type Transaction = {
//   _id: string
//   type: "credit" | "debit"
//   amount: number
//   service: "server-copy" | "recharge"
//   nid?: string
//   balanceBefore: number
//   balanceAfter: number
//   status: "success" | "failed"
//   note?: string
//   createdAt: string
// }

// // ── Helpers ────────────────────────────────────────────────────────
// function formatDate(dateStr: string) {
//   const d = new Date(dateStr)
//   const time = d.toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit", hour12: true })
//   const date = d.toLocaleDateString("en-BD", { day: "2-digit", month: "2-digit", year: "2-digit" })
//   return { time, date, full: `${time} ${date}` }
// }

// function getServiceLabel(service: string) {
//   if (service === "server-copy") return "সার্ভার কপি"
//   if (service === "recharge") return "ওয়ালেট রিচার্জ"
//   return service
// }

// export default function RechargeHistoryPage() {
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState("")
//   const [filter, setFilter] = useState<"all" | "credit" | "debit">("all")
//   const [selected, setSelected] = useState<Transaction | null>(null)

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const token = await auth.currentUser?.getIdToken()
//         if (!token) return
//         const res = await getMyTransactions(token)
//         if (res.success) setTransactions(res.data)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetch()
//   }, [])

//   // Filter + search
//   const filtered = transactions.filter((t) => {
//     const matchFilter = filter === "all" || t.type === filter
//     const matchSearch =
//       !search ||
//       t.nid?.includes(search) ||
//       getServiceLabel(t.service).includes(search) ||
//       t._id.includes(search)
//     return matchFilter && matchSearch
//   })

//   return (
//     <div className="max-w-2xl mx-auto">

//       {/* ── Header ── */}
//       <div style={{
//         background: "linear-gradient(135deg, #131313 0%, #bab0b4 100%)",
//         borderRadius: "16px",
//         padding: "24px 20px 20px",
//         marginBottom: "16px",
//         color: "#fff",
//       }}>
//         <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
//           লেনদেনের ইতিহাস
//         </h1>
//         <p style={{ fontSize: "13px", opacity: 0.8 }}>
//           সর্বশেষ ৫০টি লেনদেন
//         </p>

//         {/* Search */}
//         <div style={{
//           display: "flex",
//           alignItems: "center",
//           background: "rgba(255,255,255,0.15)",
//           borderRadius: "10px",
//           padding: "8px 14px",
//           marginTop: "14px",
//           gap: "8px",
//         }}>
//           <Search size={15} color="rgba(255,255,255,0.7)" />
//           <input
//             placeholder="TrxID বা NID দিয়ে খুঁজুন"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{
//               background: "transparent",
//               border: "none",
//               outline: "none",
//               color: "#fff",
//               fontSize: "13px",
//               flex: 1,
//             }}
//           />
//         </div>
//       </div>

//       {/* ── Filter Tabs ── */}
//       <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
//         {(["all", "credit", "debit"] as const).map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             style={{
//               padding: "6px 16px",
//               borderRadius: "20px",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "13px",
//               fontWeight: 600,
//               background: filter === f ? "#E2136E" : "#f3f4f6",
//               color: filter === f ? "#fff" : "#555",
//               transition: "all 0.2s",
//             }}
//           >
//             {f === "all" ? "সব" : f === "credit" ? "রিচার্জ" : "খরচ"}
//           </button>
//         ))}
//       </div>

//       {/* ── List ── */}
//       <div style={{
//         background: "#fff",
//         borderRadius: "16px",
//         overflow: "hidden",
//         boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//       }}>

//         {loading && (
//           <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
//             লোড হচ্ছে...
//           </div>
//         )}

//         {!loading && filtered.length === 0 && (
//           <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
//             কোনো লেনদেন নেই
//           </div>
//         )}

//         {filtered.map((t, i) => {
//           const { time, date } = formatDate(t.createdAt)
//           const isCredit = t.type === "credit"

//           return (
//             <div
//               key={t._id}
//               onClick={() => setSelected(t)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 padding: "14px 16px",
//                 borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
//                 cursor: "pointer",
//                 transition: "background 0.15s",
//                 gap: "12px",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
//               onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//             >
//               {/* Icon */}
//               <div style={{
//                 width: "42px",
//                 height: "42px",
//                 borderRadius: "50%",
//                 background: isCredit ? "#dcfce7" : "#fce4ec",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}>
//                 {isCredit
//                   ? <ArrowDownCircle size={20} color="#16a34a" />
//                   : <ArrowUpCircle size={20} color="#E2136E" />
//                 }
//               </div>

//               {/* Info */}
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>
//                   {getServiceLabel(t.service)}
//                 </div>
//                 <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
//                   {time} · {date}
//                   {t.nid && ` · NID: ${t.nid}`}
//                 </div>
//               </div>

//               {/* Amount */}
//               <div style={{ textAlign: "right" }}>
//                 <div style={{
//                   fontSize: "15px",
//                   fontWeight: 700,
//                   color: isCredit ? "#16a34a" : "#E2136E",
//                 }}>
//                   {isCredit ? "+" : "-"} ৳{t.amount}
//                 </div>
//                 <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>
//                   ব্যালেন্স: ৳{t.balanceAfter}
//                 </div>
//               </div>

//               {/* Arrow */}
//               <div style={{ color: "#ccc", fontSize: "16px" }}>›</div>
//             </div>
//           )
//         })}
//       </div>

//       {/* ── Detail Modal ── */}
//       {selected && (
//         <div
//           onClick={() => setSelected(null)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "flex-end",
//             justifyContent: "center",
//             zIndex: 9999,
//             padding: "0 0 0 0",
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               background: "#fff",
//               borderRadius: "20px 20px 0 0",
//               width: "100%",
//               maxWidth: "600px",
//               padding: "24px 20px 32px",
//               animation: "slideUp 0.3s ease",
//             }}
//           >
//             <style>{`
//               @keyframes slideUp {
//                 from { transform: translateY(100%); }
//                 to { transform: translateY(0); }
//               }
//             `}</style>

//             {/* Close */}
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//               <h3 style={{ fontSize: "17px", fontWeight: 700 }}>লেনদেনের বিবরণ</h3>
//               <button
//                 onClick={() => setSelected(null)}
//                 style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
//               >
//                 <X size={16} />
//               </button>
//             </div>

//             {/* Status */}
//             <div style={{ textAlign: "center", marginBottom: "24px" }}>
//               <CheckCircle2 size={48} color="#16a34a" style={{ margin: "0 auto 8px" }} />
//               <div style={{
//                 fontSize: "32px",
//                 fontWeight: 800,
//                 color: selected.type === "credit" ? "#16a34a" : "#E2136E",
//               }}>
//                 {selected.type === "credit" ? "+" : "-"} ৳{selected.amount}
//               </div>
//               <div style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
//                 {getServiceLabel(selected.service)}
//               </div>
//             </div>

//             {/* Details */}
//             <div style={{
//               background: "#f9fafb",
//               borderRadius: "12px",
//               overflow: "hidden",
//             }}>
//               {[
//                 ["তারিখ ও সময়", formatDate(selected.createdAt).full],
//                 ["ধরন", selected.type === "credit" ? "জমা" : "খরচ"],
//                 ["সেবা", getServiceLabel(selected.service)],
//                 ...(selected.nid ? [["NID নম্বর", selected.nid]] : []),
//                 ["আগের ব্যালেন্স", `৳${selected.balanceBefore}`],
//                 ["পরের ব্যালেন্স", `৳${selected.balanceAfter}`],
//                 ["স্ট্যাটাস", selected.status === "success" ? "✅ সফল" : "❌ ব্যর্থ"],
//                 ...(selected.note ? [["নোট", selected.note]] : []),
//                 ["TrxID", selected._id.slice(-12)],
//               ].map(([label, value], i, arr) => (
//                 <div key={label} style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   padding: "11px 16px",
//                   borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none",
//                 }}>
//                   <span style={{ fontSize: "13px", color: "#888" }}>{label}</span>
//                   <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", textAlign: "right", maxWidth: "60%" }}>{value}</span>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { getMyTransactions } from "@/lib/api"
import {
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  X,
  CheckCircle2,
} from "lucide-react"

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

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const time = d.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  const date = d.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
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
    const fetchTransactions = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        if (!token) return

        const res = await getMyTransactions(token)
        if (res.success) setTransactions(res.data)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const filtered = transactions.filter((t) => {
    const matchFilter = filter === "all" || t.type === filter
    const q = search.trim().toLowerCase()

    const matchSearch =
      !q ||
      t.nid?.toLowerCase().includes(q) ||
      getServiceLabel(t.service).toLowerCase().includes(q) ||
      t._id.toLowerCase().includes(q)

    return matchFilter && matchSearch
  })

  return (
    <div className="mx-auto max-w-2xl text-foreground">
      <div
        className="mb-4 rounded-2xl border border-white/10 px-5 pb-5 pt-6 text-white"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(71,85,105,1) 100%)",
        }}
      >
        <h1 className="mb-1 text-xl font-bold">লেনদেনের ইতিহাস</h1>
        <p className="text-xs text-white/80">সর্বশেষ ৫০টি লেনদেন</p>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur">
          <Search size={15} className="text-white/70" />
          <input
            placeholder="TrxID বা NID দিয়ে খুঁজুন"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60"
          />
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        {(["all", "credit", "debit"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f
                ? "bg-pink-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f === "all" ? "সব" : f === "credit" ? "রিচার্জ" : "খরচ"}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {loading && (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            লোড হচ্ছে...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            কোনো লেনদেন নেই
          </div>
        )}

        {!loading &&
          filtered.map((t, i) => {
            const { time, date } = formatDate(t.createdAt)
            const isCredit = t.type === "credit"

            return (
              <div
                key={t._id}
                onClick={() => setSelected(t)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-4 transition hover:bg-muted/30 ${
                  i < filtered.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
                    isCredit
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300"
                  }`}
                >
                  {isCredit ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    {getServiceLabel(t.service)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {time} · {date}
                    {t.nid && ` · NID: ${t.nid}`}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-bold ${
                      isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-pink-600 dark:text-pink-400"
                    }`}
                  >
                    {isCredit ? "+" : "-"} ৳{t.amount}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    ব্যালেন্স: ৳{t.balanceAfter}
                  </div>
                </div>

                <div className="text-lg text-muted-foreground">›</div>
              </div>
            )
          })}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[600px] rounded-t-[22px] border border-border bg-card px-5 pb-8 pt-6 text-foreground shadow-2xl"
            style={{ animation: "slideUp 0.3s ease" }}
          >
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}</style>

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">লেনদেনের বিবরণ</h3>
              <button
                onClick={() => setSelected(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-6 text-center">
              <CheckCircle2
                size={48}
                className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400"
              />
              <div
                className={`text-3xl font-extrabold ${
                  selected.type === "credit"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-pink-600 dark:text-pink-400"
                }`}
              >
                {selected.type === "credit" ? "+" : "-"} ৳{selected.amount}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {getServiceLabel(selected.service)}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
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
                <div
                  key={label}
                  className={`flex justify-between px-4 py-3 ${
                    i < arr.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="max-w-[60%] text-right text-sm font-semibold text-foreground">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
