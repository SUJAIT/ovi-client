/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import { auth } from "@/lib/firebase"
// import {
//   RefreshCw, CheckCircle, XCircle, Clock, Wallet, Search,
//   BellRing, BellOff, User, Phone, Eye, EyeOff, MoreHorizontal
// } from "lucide-react"

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL
// const POLL_INTERVAL = 15_000

// type RR = {
//   _id: string
//   userId: { name?: string; email: string; wallet?: { balance: number } }
//   amount: number
//   bkashTrxID: string
//   senderNumber?: string // আমরা ব্যাকএন্ডে এটি যোগ করেছি
//   status: "pending" | "approved" | "rejected"
//   adminNote?: string
//   createdAt: string
// }

// export default function AdminRechargeRequestsPage() {
//   const [requests, setRequests] = useState<RR[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState<"pending" | "all" | "approved" | "rejected">("pending")
//   const [search, setSearch] = useState("")
//   const [actionId, setActionId] = useState<string | null>(null)
//   const [rejectModal, setRejectModal] = useState<{ id: string; note: string } | null>(null)
//   const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
//   const [pendingCount, setPendingCount] = useState(0)
//   const [showFullNumber, setShowFullNumber] = useState<string | null>(null)

//   // ── Audio/Alarm Logic ──────────────────────────────────────────
//   const [alarmActive, setAlarmActive] = useState(false)
//   const [alarmMuted, setAlarmMuted] = useState(false)
//   const audioCtxRef = useRef<AudioContext | null>(null)
//   const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
//   const lastPendingRef = useRef<number>(0)

//   const playBeep = (ctx: AudioContext) => {
//     const osc = ctx.createOscillator()
//     const gain = ctx.createGain()
//     osc.connect(gain); gain.connect(ctx.destination)
//     osc.type = "sine"; osc.frequency.setValueAtTime(880, ctx.currentTime)
//     gain.gain.setValueAtTime(0.4, ctx.currentTime)
//     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
//     osc.start(); osc.stop(ctx.currentTime + 0.4)
//   }

//   const startAlarm = useCallback(() => {
//     if (alarmMuted || alarmIntervalRef.current) return
//     if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
//     const ctx = audioCtxRef.current
//     playBeep(ctx)
//     alarmIntervalRef.current = setInterval(() => playBeep(ctx), 1200)
//     setAlarmActive(true)
//   }, [alarmMuted])

//   const stopAlarm = useCallback(() => {
//     if (alarmIntervalRef.current) { clearInterval(alarmIntervalRef.current); alarmIntervalRef.current = null }
//     setAlarmActive(false)
//   }, [])

//   // ── Data Fetching ──────────────────────────────────────────────
//   const fetchRequests = async (f = filter) => {
//     setLoading(true)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await fetch(`${BASE_URL}/recharge-request/all?status=${f}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       if (data.success) {
//         setRequests(data.data)
//         const count = data.pendingCount ?? 0
//         setPendingCount(count)
//         if (count > lastPendingRef.current && lastPendingRef.current !== -1 && !alarmMuted) startAlarm()
//         lastPendingRef.current = count
//       }
//     } catch { } finally { setLoading(false) }
//   }

//   const pollPendingCount = useCallback(async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await fetch(`${BASE_URL}/recharge-request/pending-count`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       if (!data.success) return
//       const count = data.pendingCount ?? 0
//       setPendingCount(count)
//       if (count > lastPendingRef.current) {
//         if (!alarmMuted) startAlarm()
//         if (filter === "pending" || filter === "all") fetchRequests(filter)
//       }
//       if (count === 0) stopAlarm()
//       lastPendingRef.current = count
//     } catch { }
//   }, [alarmMuted, filter, startAlarm, stopAlarm])

//   useEffect(() => {
//     lastPendingRef.current = -1
//     fetchRequests(filter)
//     const interval = setInterval(pollPendingCount, POLL_INTERVAL)
//     return () => { clearInterval(interval); stopAlarm() }
//   }, [filter, pollPendingCount])

//   // ── Handlers ───────────────────────────────────────────────────
//   const handleApprove = async (id: string, amount: number, name: string) => {
//     if (!confirm(`Confirm approve ৳${amount} for ${name}?`)) return
//     setActionId(id); setMsg(null)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       const res = await fetch(`${BASE_URL}/recharge-request/${id}/approve`, {
//         method: "PATCH", headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await res.json()
//       setMsg({ text: data.message, ok: data.success })
//       if (data.success) fetchRequests(filter)
//     } catch { setMsg({ text: "Error occurred", ok: false }) }
//     finally { setActionId(null) }
//   }

//   const handleReject = async () => {
//     if (!rejectModal) return
//     setActionId(rejectModal.id); setMsg(null)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       const res = await fetch(`${BASE_URL}/recharge-request/${rejectModal.id}/reject`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ adminNote: rejectModal.note }),
//       })
//       const data = await res.json()
//       setMsg({ text: data.message, ok: data.success })
//       if (data.success) { setRejectModal(null); fetchRequests(filter) }
//     } catch { setMsg({ text: "Error occurred", ok: false }) }
//     finally { setActionId(null) }
//   }

//   const filtered = requests.filter((r) => {
//     const q = search.toLowerCase()
//     return r.bkashTrxID.toLowerCase().includes(q) ||
//       r.userId?.name?.toLowerCase().includes(q) ||
//       r.senderNumber?.includes(q)
//   })

//   // ── UI Helpers ─────────────────────────────────────────────────
//   const getStatusBadge = (status: string) => {
//     const styles = {
//       pending: "bg-amber-100 text-amber-700 border-amber-200",
//       approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
//       rejected: "bg-rose-100 text-rose-700 border-rose-200",
//     }
//     return styles[status as keyof typeof styles] || ""
//   }

//   return (
//     <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-slate-900">
//       <div className="max-w-7xl mx-auto">

//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <Wallet className="text-pink-600" /> Recharge Dashboard
//               {pendingCount > 0 && (
//                 <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
//                   {pendingCount} Pending
//                 </span>
//               )}
//             </h1>
//             <p className="text-sm text-slate-500 mt-1">Manage user bKash recharge requests efficiently</p>
//           </div>
//           <button
//             onClick={() => fetchRequests(filter)}
//             className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-sm font-medium"
//           >
//             <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
//           </button>
//         </div>

//         {/* Alarm Banner */}
//         {alarmActive && (
//           <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-6 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
//             <div className="flex items-center gap-3 text-amber-800 font-semibold">
//               <div className="bg-amber-500 p-2 rounded-lg text-white shadow-lg shadow-amber-200">
//                 <BellRing size={20} className="animate-bounce" />
//               </div>
//               নতুন রিকোয়েস্ট এসেছে! চেক করুন।
//             </div>
//             <button onClick={() => { stopAlarm(); setAlarmMuted(true) }} className="px-4 py-2 bg-white border border-amber-200 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-100">
//               MUTE ALARM
//             </button>
//           </div>
//         )}

//         {/* Filters & Search */}
//         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
//           <div className="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto">
//             {(["pending", "all", "approved", "rejected"] as const).map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`flex-1 lg:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? "bg-white shadow-sm text-pink-600" : "text-slate-500 hover:text-slate-700"
//                   }`}
//               >
//                 {f.toUpperCase()}
//               </button>
//             ))}
//           </div>

//           <div className="relative w-full lg:w-72">
//             <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-slate-400" size={16} />
//             <input
//               type="text"
//               placeholder="TrxID, Name or Number..."
//               className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500/20 outline-none"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/50 border-bottom border-slate-100">
//                   <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">User Details</th>
//                   <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Payment Info</th>
//                   <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading ? (
//                   <tr><td colSpan={4} className="py-20 text-center text-slate-400">Loading requests...</td></tr>
//                 ) : filtered.length === 0 ? (
//                   <tr><td colSpan={4} className="py-20 text-center text-slate-400">No requests found.</td></tr>
//                 ) : (
//                   filtered.map((r) => (
//                     <tr key={r._id} className="hover:bg-slate-50/50 transition-colors group">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
//                             {r.userId?.name?.[0] || <User size={18} />}
//                           </div>
//                           <div>
//                             <div className="text-sm font-bold text-slate-800">{r.userId?.name || "Anonymous"}</div>
//                             <div className="text-[11px] text-slate-500">{r.userId?.email}</div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                           <div className="text-lg font-black text-emerald-600">৳{r.amount}</div>
//                           <div className="flex items-center gap-2">
//                             <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-600 uppercase tracking-tighter">
//                               {r.bkashTrxID}
//                             </span>

//                             {/* Number logic: Show last 3, toggle full on click */}
//                             <div
//                               onClick={() => setShowFullNumber(showFullNumber === r._id ? null : r._id)}
//                               className="flex items-center gap-1 cursor-pointer bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-[10px] font-bold hover:bg-pink-100"
//                             >
//                               <Phone size={10} />
//                               {showFullNumber === r._id ? (
//                                 r.senderNumber
//                               ) : (
//                                 `***${r.senderNumber?.slice(-3)}`
//                               )}
//                               {showFullNumber === r._id ? <EyeOff size={10} /> : <Eye size={10} />}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}>
//                           {r.status === "pending" && <Clock size={12} />}
//                           {r.status === "approved" && <CheckCircle size={12} />}
//                           {r.status === "rejected" && <XCircle size={12} />}
//                           {r.status}
//                         </div>
//                         <div className="text-[10px] text-slate-400 mt-1">
//                           {new Date(r.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-right">
//                         {r.status === "pending" ? (
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               onClick={() => handleApprove(r._id, r.amount, r.userId?.name || "User")}
//                               className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all"
//                               title="Approve"
//                             >
//                               <CheckCircle size={18} />
//                             </button>
//                             <button
//                               onClick={() => setRejectModal({ id: r._id, note: "" })}
//                               className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all"
//                               title="Reject"
//                             >
//                               <XCircle size={18} />
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="text-slate-300"><MoreHorizontal size={20} className="inline" /></div>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-[11px] font-medium text-slate-500 uppercase">
//             <span>Showing {filtered.length} Requests</span>
//             <span>🔄 Polling Active</span>
//           </div>
//         </div>
//       </div>

//       {/* Reject Modal */}
//       {rejectModal && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
//             <h3 className="text-lg font-bold mb-2">Reject Request</h3>
//             <p className="text-sm text-slate-500 mb-4">ইউজারকে রিজেক্ট করার কারণ জানাতে পারেন (ঐচ্ছিক)।</p>
//             <textarea
//               className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-rose-500/20 mb-4 h-24 resize-none"
//               placeholder="Ex: Invalid Transaction ID"
//               value={rejectModal.note}
//               onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
//             />
//             <div className="flex gap-3">
//               <button onClick={() => setRejectModal(null)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
//               <button onClick={handleReject} className="flex-1 py-3 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-200">Reject Now</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import { auth } from "@/lib/firebase"
// import {
//   RefreshCw,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Wallet,
//   Search,
//   BellRing,
//   User,
//   Phone,
//   Eye,
//   EyeOff,
//   MoreHorizontal,
// } from "lucide-react"

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL
// const POLL_INTERVAL = 15_000

// type RR = {
//   _id: string
//   userId: { name?: string; email: string; wallet?: { balance: number } }
//   amount: number
//   bkashTrxID: string
//   senderNumber?: string
//   status: "pending" | "approved" | "rejected"
//   adminNote?: string
//   createdAt: string
// }

// export default function AdminRechargeRequestsPage() {
//   const [requests, setRequests] = useState<RR[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState<"pending" | "all" | "approved" | "rejected">("pending")
//   const [search, setSearch] = useState("")
//   const [actionId, setActionId] = useState<string | null>(null)
//   const [rejectModal, setRejectModal] = useState<{ id: string; note: string } | null>(null)
//   const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
//   const [pendingCount, setPendingCount] = useState(0)
//   const [showFullNumber, setShowFullNumber] = useState<string | null>(null)

//   const [alarmActive, setAlarmActive] = useState(false)
//   const [alarmMuted, setAlarmMuted] = useState(false)
//   const audioCtxRef = useRef<AudioContext | null>(null)
//   const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
//   const lastPendingRef = useRef<number>(0)

//   const playBeep = (ctx: AudioContext) => {
//     const osc = ctx.createOscillator()
//     const gain = ctx.createGain()
//     osc.connect(gain)
//     gain.connect(ctx.destination)
//     osc.type = "sine"
//     osc.frequency.setValueAtTime(880, ctx.currentTime)
//     gain.gain.setValueAtTime(0.4, ctx.currentTime)
//     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
//     osc.start()
//     osc.stop(ctx.currentTime + 0.4)
//   }

//   const startAlarm = useCallback(() => {
//     if (alarmMuted || alarmIntervalRef.current) return
//     if (!audioCtxRef.current) {
//       audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
//     }
//     const ctx = audioCtxRef.current
//     playBeep(ctx)
//     alarmIntervalRef.current = setInterval(() => playBeep(ctx), 1200)
//     setAlarmActive(true)
//   }, [alarmMuted])

//   const stopAlarm = useCallback(() => {
//     if (alarmIntervalRef.current) {
//       clearInterval(alarmIntervalRef.current)
//       alarmIntervalRef.current = null
//     }
//     setAlarmActive(false)
//   }, [])

//   const fetchRequests = async (f = filter) => {
//     setLoading(true)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const res = await fetch(`${BASE_URL}/recharge-request/all?status=${f}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const data = await res.json()
//       if (data.success) {
//         setRequests(data.data)
//         const count = data.pendingCount ?? 0
//         setPendingCount(count)

//         if (count > lastPendingRef.current && lastPendingRef.current !== -1 && !alarmMuted) {
//           startAlarm()
//         }

//         lastPendingRef.current = count
//       }
//     } catch {
//     } finally {
//       setLoading(false)
//     }
//   }

//   const pollPendingCount = useCallback(async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const res = await fetch(`${BASE_URL}/recharge-request/pending-count`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const data = await res.json()
//       if (!data.success) return

//       const count = data.pendingCount ?? 0
//       setPendingCount(count)

//       if (count > lastPendingRef.current) {
//         if (!alarmMuted) startAlarm()
//         if (filter === "pending" || filter === "all") fetchRequests(filter)
//       }

//       if (count === 0) stopAlarm()
//       lastPendingRef.current = count
//     } catch {}
//   }, [alarmMuted, filter, startAlarm, stopAlarm])

//   useEffect(() => {
//     lastPendingRef.current = -1
//     fetchRequests(filter)
//     const interval = setInterval(pollPendingCount, POLL_INTERVAL)

//     return () => {
//       clearInterval(interval)
//       stopAlarm()
//     }
//   }, [filter, pollPendingCount, stopAlarm])

//   const handleApprove = async (id: string, amount: number, name: string) => {
//     if (!confirm(`Confirm approve ৳${amount} for ${name}?`)) return

//     setActionId(id)
//     setMsg(null)

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       const res = await fetch(`${BASE_URL}/recharge-request/${id}/approve`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       const data = await res.json()
//       setMsg({ text: data.message, ok: data.success })
//       if (data.success) fetchRequests(filter)
//     } catch {
//       setMsg({ text: "Error occurred", ok: false })
//     } finally {
//       setActionId(null)
//     }
//   }

//   const handleReject = async () => {
//     if (!rejectModal) return

//     setActionId(rejectModal.id)
//     setMsg(null)

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       const res = await fetch(`${BASE_URL}/recharge-request/${rejectModal.id}/reject`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ adminNote: rejectModal.note }),
//       })

//       const data = await res.json()
//       setMsg({ text: data.message, ok: data.success })

//       if (data.success) {
//         setRejectModal(null)
//         fetchRequests(filter)
//       }
//     } catch {
//       setMsg({ text: "Error occurred", ok: false })
//     } finally {
//       setActionId(null)
//     }
//   }

//   const filtered = requests.filter((r) => {
//     const q = search.toLowerCase()
//     return (
//       r.bkashTrxID.toLowerCase().includes(q) ||
//       r.userId?.name?.toLowerCase().includes(q) ||
//       r.senderNumber?.includes(q)
//     )
//   })

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
//       approved: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
//       rejected: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
//     }

//     return styles[status as keyof typeof styles] || ""
//   }

//   return (
//     <div className="min-h-screen bg-background p-4 font-sans text-foreground md:p-8">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
//           <div>
//             <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
//               <Wallet className="text-pink-600 dark:text-pink-400" />
//               Recharge Dashboard
//               {pendingCount > 0 && (
//                 <span className="animate-pulse rounded-full bg-rose-500 px-2 py-1 text-xs text-white">
//                   {pendingCount} Pending
//                 </span>
//               )}
//             </h1>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Manage user bKash recharge requests efficiently
//             </p>
//           </div>

//           <button
//             onClick={() => fetchRequests(filter)}
//             className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted"
//           >
//             <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>

//         {alarmActive && (
//           <div className="mb-6 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-in fade-in slide-in-from-top-4 dark:border-amber-500/30 dark:bg-amber-500/10">
//             <div className="flex items-center gap-3 font-semibold text-amber-800 dark:text-amber-300">
//               <div className="rounded-lg bg-amber-500 p-2 text-white shadow-lg shadow-amber-200 dark:shadow-none">
//                 <BellRing size={20} className="animate-bounce" />
//               </div>
//               নতুন রিকোয়েস্ট এসেছে! চেক করুন।
//             </div>
//             <button
//               onClick={() => {
//                 stopAlarm()
//                 setAlarmMuted(true)
//               }}
//               className="rounded-lg border border-amber-200 bg-white px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-background dark:text-amber-300 dark:hover:bg-amber-500/10"
//             >
//               MUTE ALARM
//             </button>
//           </div>
//         )}

//         {msg && (
//           <div
//             className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
//               msg.ok
//                 ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
//                 : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
//             }`}
//           >
//             {msg.text}
//           </div>
//         )}

//         <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row">
//           <div className="flex w-full rounded-xl bg-muted p-1 lg:w-auto">
//             {(["pending", "all", "approved", "rejected"] as const).map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`flex-1 rounded-lg px-5 py-2 text-xs font-bold transition-all lg:flex-none ${
//                   filter === f
//                     ? "bg-background text-pink-600 shadow-sm dark:text-pink-400"
//                     : "text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 {f.toUpperCase()}
//               </button>
//             ))}
//           </div>

//           <div className="relative w-full lg:w-72">
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//               size={16}
//             />
//             <input
//               type="text"
//               placeholder="TrxID, Name or Number..."
//               className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-pink-500/20"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse text-left">
//               <thead>
//                 <tr className="border-b border-border bg-muted/30">
//                   <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                     User Details
//                   </th>
//                   <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                     Payment Info
//                   </th>
//                   <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-border">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={4} className="py-20 text-center text-muted-foreground">
//                       Loading requests...
//                     </td>
//                   </tr>
//                 ) : filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="py-20 text-center text-muted-foreground">
//                       No requests found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filtered.map((r) => (
//                     <tr key={r._id} className="group transition-colors hover:bg-muted/20">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
//                             {r.userId?.name?.[0] || <User size={18} />}
//                           </div>
//                           <div>
//                             <div className="text-sm font-bold text-foreground">
//                               {r.userId?.name || "Anonymous"}
//                             </div>
//                             <div className="text-[11px] text-muted-foreground">
//                               {r.userId?.email}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div className="flex flex-col gap-1">
//                           <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
//                             ৳{r.amount}
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
//                               {r.bkashTrxID}
//                             </span>

//                             <div
//                               onClick={() =>
//                                 setShowFullNumber(showFullNumber === r._id ? null : r._id)
//                               }
//                               className="flex cursor-pointer items-center gap-1 rounded bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-700 hover:bg-pink-100 dark:bg-pink-500/10 dark:text-pink-300 dark:hover:bg-pink-500/20"
//                             >
//                               <Phone size={10} />
//                               {showFullNumber === r._id
//                                 ? r.senderNumber
//                                 : `***${r.senderNumber?.slice(-3)}`}
//                               {showFullNumber === r._id ? <EyeOff size={10} /> : <Eye size={10} />}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4">
//                         <div
//                           className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getStatusBadge(
//                             r.status
//                           )}`}
//                         >
//                           {r.status === "pending" && <Clock size={12} />}
//                           {r.status === "approved" && <CheckCircle size={12} />}
//                           {r.status === "rejected" && <XCircle size={12} />}
//                           {r.status}
//                         </div>
//                         <div className="mt-1 text-[10px] text-muted-foreground">
//                           {new Date(r.createdAt).toLocaleString("en-GB", {
//                             day: "2-digit",
//                             month: "short",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-right">
//                         {r.status === "pending" ? (
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               disabled={actionId === r._id}
//                               onClick={() => handleApprove(r._id, r.amount, r.userId?.name || "User")}
//                               className="rounded-lg bg-emerald-500 p-2 text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-600 disabled:opacity-60 dark:shadow-none"
//                               title="Approve"
//                             >
//                               <CheckCircle size={18} />
//                             </button>
//                             <button
//                               disabled={actionId === r._id}
//                               onClick={() => setRejectModal({ id: r._id, note: "" })}
//                               className="rounded-lg bg-rose-500 p-2 text-white shadow-lg shadow-rose-100 transition-all hover:bg-rose-600 disabled:opacity-60 dark:shadow-none"
//                               title="Reject"
//                             >
//                               <XCircle size={18} />
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="text-muted-foreground">
//                             <MoreHorizontal size={20} className="inline" />
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3 text-[11px] font-medium uppercase text-muted-foreground">
//             <span>Showing {filtered.length} Requests</span>
//             <span>Polling Active</span>
//           </div>
//         </div>
//       </div>

//       {rejectModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
//             <h3 className="mb-2 text-lg font-bold text-foreground">Reject Request</h3>
//             <p className="mb-4 text-sm text-muted-foreground">
//               ইউজারকে রিজেক্ট করার কারণ জানাতে পারেন (ঐচ্ছিক)।
//             </p>
//             <textarea
//               className="mb-4 h-24 w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rose-500/20"
//               placeholder="Ex: Invalid Transaction ID"
//               value={rejectModal.note}
//               onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
//             />
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setRejectModal(null)}
//                 className="flex-1 rounded-xl py-3 text-sm font-bold text-muted-foreground hover:bg-muted"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReject}
//                 className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-bold text-white hover:bg-rose-600"
//               >
//                 Reject Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// 3rd version   

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { auth } from "@/lib/firebase"
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  Search,
  BellRing,
  User,
  Phone,
  Eye,
  EyeOff,
  MoreHorizontal,
  MinusCircle,
} from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const POLL_INTERVAL = 15_000

type RR = {
  _id: string
  userId: {
    _id: string
    name?: string
    email: string
    wallet?: { balance: number }
  }
  amount: number
  bkashTrxID: string
  senderNumber?: string
  status: "pending" | "approved" | "rejected"
  adminNote?: string
  createdAt: string
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
  const [showFullNumber, setShowFullNumber] = useState<string | null>(null)

  // ─── Wallet Correction State ───────────────────────────────
  const [correctionModal, setCorrectionModal] = useState<{
    id: string
    userId: string
    name: string
    email: string
    balance?: number
    amount: string
    reason: string
  } | null>(null)
  const [correctionLoading, setCorrectionLoading] = useState(false)
  // ──────────────────────────────────────────────────────────

  const [alarmActive, setAlarmActive] = useState(false)
  const [alarmMuted, setAlarmMuted] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastPendingRef = useRef<number>(0)

  const playBeep = (ctx: AudioContext) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  }

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

        if (count > lastPendingRef.current && lastPendingRef.current !== -1 && !alarmMuted) {
          startAlarm()
        }

        lastPendingRef.current = count
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const pollPendingCount = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return

      const res = await fetch(`${BASE_URL}/recharge-request/pending-count`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!data.success) return

      const count = data.pendingCount ?? 0
      setPendingCount(count)

      if (count > lastPendingRef.current) {
        if (!alarmMuted) startAlarm()
        if (filter === "pending" || filter === "all") fetchRequests(filter)
      }

      if (count === 0) stopAlarm()
      lastPendingRef.current = count
    } catch {}
  }, [alarmMuted, filter, startAlarm, stopAlarm])

  useEffect(() => {
    lastPendingRef.current = -1
    fetchRequests(filter)
    const interval = setInterval(pollPendingCount, POLL_INTERVAL)

    return () => {
      clearInterval(interval)
      stopAlarm()
    }
  }, [filter, pollPendingCount, stopAlarm])

  const handleApprove = async (id: string, amount: number, name: string) => {
    if (!confirm(`Confirm approve ৳${amount} for ${name}?`)) return

    setActionId(id)
    setMsg(null)

    try {
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch(`${BASE_URL}/recharge-request/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      setMsg({ text: data.message, ok: data.success })
      if (data.success) fetchRequests(filter)
    } catch {
      setMsg({ text: "Error occurred", ok: false })
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async () => {
    if (!rejectModal) return

    setActionId(rejectModal.id)
    setMsg(null)

    try {
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch(`${BASE_URL}/recharge-request/${rejectModal.id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNote: rejectModal.note }),
      })

      const data = await res.json()
      setMsg({ text: data.message, ok: data.success })

      if (data.success) {
        setRejectModal(null)
        fetchRequests(filter)
      }
    } catch {
      setMsg({ text: "Error occurred", ok: false })
    } finally {
      setActionId(null)
    }
  }

  // ─── Wallet Correction Handler ─────────────────────────────
  const handleWalletCorrection = async () => {
    if (!correctionModal) return

    const parsedAmount = Number(correctionModal.amount)
    if (!correctionModal.amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setMsg({ text: "Amount must be a positive number", ok: false })
      return
    }
    if (!correctionModal.reason.trim() || correctionModal.reason.trim().length < 5) {
      setMsg({ text: "Please provide a meaningful reason (min 5 characters)", ok: false })
      return
    }

    setCorrectionLoading(true)
    setMsg(null)

    try {
      const token = await auth.currentUser?.getIdToken()
      const res = await fetch(`${BASE_URL}/transaction/admin/wallet-correction`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: correctionModal.userId,
          amount: parsedAmount,
          reason: correctionModal.reason.trim(),
        }),
      })

      const data = await res.json()
      setMsg({ text: data.message, ok: data.success })

      if (data.success) {
        setCorrectionModal(null)
        fetchRequests(filter)
      }
    } catch {
      setMsg({ text: "Error occurred during wallet correction", ok: false })
    } finally {
      setCorrectionLoading(false)
    }
  }
  // ──────────────────────────────────────────────────────────

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase()
    return (
      r.bkashTrxID.toLowerCase().includes(q) ||
      r.userId?.name?.toLowerCase().includes(q) ||
      r.senderNumber?.includes(q)
    )
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      pending:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
      approved:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
      rejected:
        "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    }

    return styles[status as keyof typeof styles] || ""
  }

  return (
    <div className="min-h-screen bg-background p-4 font-sans text-foreground md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Wallet className="text-pink-600 dark:text-pink-400" />
              Recharge Dashboard
              {pendingCount > 0 && (
                <span className="animate-pulse rounded-full bg-rose-500 px-2 py-1 text-xs text-white">
                  {pendingCount} Pending
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage user bKash recharge requests efficiently
            </p>
          </div>

          <button
            onClick={() => fetchRequests(filter)}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {alarmActive && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-in fade-in slide-in-from-top-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <div className="flex items-center gap-3 font-semibold text-amber-800 dark:text-amber-300">
              <div className="rounded-lg bg-amber-500 p-2 text-white shadow-lg shadow-amber-200 dark:shadow-none">
                <BellRing size={20} className="animate-bounce" />
              </div>
              নতুন রিকোয়েস্ট এসেছে! চেক করুন।
            </div>
            <button
              onClick={() => {
                stopAlarm()
                setAlarmMuted(true)
              }}
              className="rounded-lg border border-amber-200 bg-white px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-background dark:text-amber-300 dark:hover:bg-amber-500/10"
            >
              MUTE ALARM
            </button>
          </div>
        )}

        {msg && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
              msg.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row">
          <div className="flex w-full rounded-xl bg-muted p-1 lg:w-auto">
            {(["pending", "all", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 rounded-lg px-5 py-2 text-xs font-bold transition-all lg:flex-none ${
                  filter === f
                    ? "bg-background text-pink-600 shadow-sm dark:text-pink-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              placeholder="TrxID, Name or Number..."
              className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-pink-500/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Payment Info
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-muted-foreground">
                      Loading requests...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-muted-foreground">
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r._id} className="group transition-colors hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
                            {r.userId?.name?.[0] || <User size={18} />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">
                              {r.userId?.name || "Anonymous"}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {r.userId?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                            ৳{r.amount}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                              {r.bkashTrxID}
                            </span>

                            <div
                              onClick={() =>
                                setShowFullNumber(showFullNumber === r._id ? null : r._id)
                              }
                              className="flex cursor-pointer items-center gap-1 rounded bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-700 hover:bg-pink-100 dark:bg-pink-500/10 dark:text-pink-300 dark:hover:bg-pink-500/20"
                            >
                              <Phone size={10} />
                              {showFullNumber === r._id
                                ? r.senderNumber
                                : `***${r.senderNumber?.slice(-3)}`}
                              {showFullNumber === r._id ? <EyeOff size={10} /> : <Eye size={10} />}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getStatusBadge(
                            r.status
                          )}`}
                        >
                          {r.status === "pending" && <Clock size={12} />}
                          {r.status === "approved" && <CheckCircle size={12} />}
                          {r.status === "rejected" && <XCircle size={12} />}
                          {r.status}
                        </div>
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          {new Date(r.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {r.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={actionId === r._id}
                              onClick={() =>
                                handleApprove(r._id, r.amount, r.userId?.name || "User")
                              }
                              className="rounded-lg bg-emerald-500 p-2 text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-600 disabled:opacity-60 dark:shadow-none"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              disabled={actionId === r._id}
                              onClick={() => setRejectModal({ id: r._id, note: "" })}
                              className="rounded-lg bg-rose-500 p-2 text-white shadow-lg shadow-rose-100 transition-all hover:bg-rose-600 disabled:opacity-60 dark:shadow-none"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : r.status === "approved" ? (
                          // ─── Correction button for approved rows ───
                          <button
                            onClick={() =>
                              setCorrectionModal({
                                id: r._id,
                                userId: r.userId?._id,
                                name: r.userId?.name || "Anonymous",
                                email: r.userId?.email,
                                balance: r.userId?.wallet?.balance,
                                amount: "",
                                reason: "",
                              })
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-600 transition-all hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                            title="Wallet Correction"
                          >
                            <MinusCircle size={13} />
                            Correction
                          </button>
                        ) : (
                          <div className="text-muted-foreground">
                            <MoreHorizontal size={20} className="inline" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3 text-[11px] font-medium uppercase text-muted-foreground">
            <span>Showing {filtered.length} Requests</span>
            <span>Polling Active</span>
          </div>
        </div>
      </div>

      {/* ─── Reject Modal (unchanged) ─────────────────────────── */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="mb-2 text-lg font-bold text-foreground">Reject Request</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              ইউজারকে রিজেক্ট করার কারণ জানাতে পারেন (ঐচ্ছিক)।
            </p>
            <textarea
              className="mb-4 h-24 w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rose-500/20"
              placeholder="Ex: Invalid Transaction ID"
              value={rejectModal.note}
              onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 rounded-xl py-3 text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-bold text-white hover:bg-rose-600"
              >
                Reject Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Wallet Correction Modal ──────────────────────────── */}
      {correctionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
                {correctionModal.name?.[0] || "U"}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Wallet Correction</h3>
                <p className="text-[11px] text-muted-foreground">Admin balance deduction</p>
              </div>
            </div>

            {/* User Info Card */}
            <div className="mb-4 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-muted-foreground">User</span>
                <span className="font-bold text-foreground">{correctionModal.name}</span>
              </div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {correctionModal.email}
                </span>
              </div>
              {correctionModal.balance !== undefined && (
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Current Balance</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    ৳{correctionModal.balance}
                  </span>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="mb-3">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Deduction Amount (BDT)
              </label>
              <input
                type="number"
                min={1}
                placeholder="Enter amount..."
                className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm font-bold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground focus:ring-2 focus:ring-rose-500/20"
                value={correctionModal.amount}
                onChange={(e) =>
                  setCorrectionModal({ ...correctionModal, amount: e.target.value })
                }
              />
            </div>

            {/* Reason Textarea */}
            <div className="mb-5">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Reason
              </label>
              <textarea
                className="h-24 w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rose-500/20"
                placeholder="Ex: Wrong recharge corrected, Duplicate recharge reverted..."
                value={correctionModal.reason}
                onChange={(e) =>
                  setCorrectionModal({ ...correctionModal, reason: e.target.value })
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                disabled={correctionLoading}
                onClick={() => setCorrectionModal(null)}
                className="flex-1 rounded-xl py-3 text-sm font-bold text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={correctionLoading}
                onClick={handleWalletCorrection}
                className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-bold text-white transition-all hover:bg-rose-600 disabled:opacity-60"
              >
                {correctionLoading ? "Processing..." : "Confirm Deduction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}