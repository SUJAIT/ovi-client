// // "use client"

// // import { useState, useEffect, useCallback } from "react"
// // import { auth } from "@/lib/firebase"

// // import {
// //   Eye,
// //   CheckCircle,
// //   XCircle,
// //   FileUp,
// //   Clock,
// //   User,
// //   Search,
// //   Download,
// //   Copy,
// //   Check,
// //   ExternalLink,
// // } from "lucide-react"
// // import Swal from "sweetalert2"
// // import { getAllNidWithdrawRequests, nidWithdrawAccept, nidWithdrawCancel, nidWithdrawMarkSeen, nidWithdrawSendPdf } from "@/lib/api.nidWithdraw"

// // type TNidWithdrawStatus = "pending" | "admin_seen" | "accepted" | "cancelled" | "pdf_sent"

// // type TRequest = {
// //   _id: string
// //   nidOrBirthCert: string
// //   name: string
// //   dob: string
// //   status: TNidWithdrawStatus
// //   cancelNote?: string
// //   pdfUrl?: string
// //   createdAt: string
// //   userId?: {
// //     _id: string
// //     name?: string
// //     email?: string
// //     wallet?: { balance: number }
// //   }
// // }

// // const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
// //   pending: "Pending",
// //   admin_seen: "দেখা হয়েছে",
// //   accepted: "গৃহীত",
// //   cancelled: "বাতিল",
// //   pdf_sent: "PDF পাঠানো হয়েছে",
// // }

// // function getStatusBadge(status: TNidWithdrawStatus) {
// //   switch (status) {
// //     case "pending":
// //       return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
// //     case "admin_seen":
// //       return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
// //     case "accepted":
// //       return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
// //     case "cancelled":
// //       return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
// //     case "pdf_sent":
// //       return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
// //   }
// // }

// // // ── CopyButton ────────────────────────────────────────────────────
// // function CopyButton({ value, label }: { value: string; label?: string }) {
// //   const [copied, setCopied] = useState(false)

// //   const handleCopy = async (e: React.MouseEvent) => {
// //     e.stopPropagation()
// //     try {
// //       await navigator.clipboard.writeText(value)
// //       setCopied(true)
// //       setTimeout(() => setCopied(false), 1800)
// //     } catch {
// //       // fallback
// //       const el = document.createElement("textarea")
// //       el.value = value
// //       document.body.appendChild(el)
// //       el.select()
// //       document.execCommand("copy")
// //       document.body.removeChild(el)
// //       setCopied(true)
// //       setTimeout(() => setCopied(false), 1800)
// //     }
// //   }

// //   return (
// //     <button
// //       onClick={handleCopy}
// //       title={`Copy ${label ?? value}`}
// //       className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-all
// //         ${copied
// //           ? "border-emerald-400 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400"
// //           : "border-border bg-muted/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
// //         }`}
// //     >
// //       {copied ? <Check size={9} /> : <Copy size={9} />}
// //       {copied ? "Copied!" : (label ?? "Copy")}
// //     </button>
// //   )
// // }

// // // ── Details Modal ─────────────────────────────────────────────────
// // function DetailsModal({ request, onClose }: { request: TRequest; onClose: () => void }) {
// //   return (
// //     <div
// //       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
// //       onClick={onClose}
// //     >
// //       <div
// //         className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         {/* Header */}
// //         <div className="flex items-center justify-between border-b border-border px-6 py-4">
// //           <h2 className="text-base font-bold text-foreground">আবেদনের বিবরণ</h2>
// //           <button
// //             onClick={onClose}
// //             className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         {/* Body */}
// //         <div className="space-y-4 px-6 py-5">

// //           {/* Applicant Details */}
// //           <div>
// //             <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Applicant Details</p>
// //             <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">

// //               {/* Name */}
// //               <div className="flex items-center justify-between gap-3">
// //                 <div className="min-w-0">
// //                   <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Name</p>
// //                   <p className="mt-0.5 truncate text-sm font-bold text-foreground">{request.name}</p>
// //                 </div>
// //                 <CopyButton value={request.name} label="Name" />
// //               </div>

// //               <div className="h-px bg-border" />

// //               {/* Number */}
// //               <div className="flex items-center justify-between gap-3">
// //                 <div className="min-w-0">
// //                   <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">NID / Birth Cert No.</p>
// //                   <p className="mt-0.5 font-mono text-sm font-bold text-foreground">{request.nidOrBirthCert}</p>
// //                 </div>
// //                 <CopyButton value={request.nidOrBirthCert} label="Number" />
// //               </div>

// //               <div className="h-px bg-border" />

// //               {/* DOB */}
// //               <div className="flex items-center justify-between gap-3">
// //                 <div className="min-w-0">
// //                   <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date of Birth</p>
// //                   <p className="mt-0.5 text-sm font-bold text-foreground">{request.dob}</p>
// //                 </div>
// //                 <CopyButton value={request.dob} label="DOB" />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Meta */}
// //           <div className="rounded-xl border border-border bg-muted/10 px-4 py-3 space-y-2 text-sm">
// //             <div className="flex items-center justify-between">
// //               <span className="text-[11px] text-muted-foreground">Requested At</span>
// //               <span className="text-[12px] font-medium text-foreground">
// //                 {new Date(request.createdAt).toLocaleString("en-GB", {
// //                   day: "2-digit", month: "short", year: "numeric",
// //                   hour: "2-digit", minute: "2-digit",
// //                 })}
// //               </span>
// //             </div>
// //             <div className="flex items-center justify-between">
// //               <span className="text-[11px] text-muted-foreground">Status</span>
// //               <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(request.status)}`}>
// //                 {STATUS_LABEL[request.status]}
// //               </span>
// //             </div>
// //             {request.userId?.name && (
// //               <div className="flex items-center justify-between">
// //                 <span className="text-[11px] text-muted-foreground">User</span>
// //                 <span className="text-[12px] font-medium text-foreground">{request.userId.name}</span>
// //               </div>
// //             )}
// //             {request.userId?.email && (
// //               <div className="flex items-center justify-between">
// //                 <span className="text-[11px] text-muted-foreground">Email</span>
// //                 <span className="text-[12px] text-muted-foreground">{request.userId.email}</span>
// //               </div>
// //             )}
// //           </div>

// //           {/* Cancel note */}
// //           {request.status === "cancelled" && request.cancelNote && (
// //             <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
// //               <strong>বাতিলের কারণ:</strong> {request.cancelNote}
// //             </div>
// //           )}

// //           {/* PDF link */}
// //           {request.status === "pdf_sent" && request.pdfUrl && (
// //             <a
// //               href={request.pdfUrl}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300"
// //             >
// //               <ExternalLink size={12} /> PDF দেখুন / ডাউনলোড করুন
// //             </a>
// //           )}
// //         </div>

// //         <div className="border-t border-border px-6 py-4 text-right">
// //           <button
// //             onClick={onClose}
// //             className="rounded-lg border border-border px-5 py-2 text-sm text-muted-foreground hover:bg-muted"
// //           >
// //             বন্ধ করুন
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // // ── Main Page ─────────────────────────────────────────────────────
// // export default function AdminNidWithdrawPage() {
// //   const [requests, setRequests] = useState<TRequest[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [actionId, setActionId] = useState<string | null>(null)
// //   const [statusFilter, setStatusFilter] = useState("all")
// //   const [search, setSearch] = useState("")
// //   const [cancelModal, setCancelModal] = useState<{ id: string; note: string } | null>(null)
// //   const [pdfModal, setPdfModal] = useState<{ id: string; url: string } | null>(null)
// //   const [detailsRequest, setDetailsRequest] = useState<TRequest | null>(null)

// //   const fetchAll = useCallback(async () => {
// //     try {
// //       const token = await auth.currentUser?.getIdToken()
// //       if (!token) return
// //       const res = await getAllNidWithdrawRequests(token, statusFilter)
// //       if (res.success) setRequests(res.data)
// //     } catch {
// //     } finally {
// //       setLoading(false)
// //     }
// //   }, [statusFilter])

// //   useEffect(() => {
// //     setLoading(true)
// //     fetchAll()
// //   }, [fetchAll])

// //   const filtered = requests.filter((r) => {
// //     if (!search) return true
// //     const q = search.toLowerCase()
// //     return (
// //       r.name?.toLowerCase().includes(q) ||
// //       r.nidOrBirthCert?.toLowerCase().includes(q) ||
// //       r.userId?.name?.toLowerCase().includes(q) ||
// //       r.userId?.email?.toLowerCase().includes(q)
// //     )
// //   })

// //   const withToken = async (cb: (token: string) => Promise<void>) => {
// //     const token = await auth.currentUser?.getIdToken()
// //     if (!token) return
// //     await cb(token)
// //   }

// //   const handleMarkSeen = async (id: string) => {
// //     setActionId(id)
// //     try {
// //       await withToken(async (token) => {
// //         const res = await nidWithdrawMarkSeen(token, id)
// //         if (res.success) {
// //           await fetchAll()
// //           Swal.fire({ icon: "success", title: "Marked as seen", timer: 1500, showConfirmButton: false })
// //         } else {
// //           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
// //         }
// //       })
// //     } finally {
// //       setActionId(null)
// //     }
// //   }

// //   const handleAccept = async (id: string) => {
// //     const confirm = await Swal.fire({
// //       title: "Accept করবেন?",
// //       text: "Request টি গৃহীত হবে।",
// //       icon: "question",
// //       showCancelButton: true,
// //       confirmButtonText: "হ্যাঁ, Accept করুন",
// //       cancelButtonText: "না",
// //       confirmButtonColor: "#10b981",
// //     })
// //     if (!confirm.isConfirmed) return

// //     setActionId(id)
// //     try {
// //       await withToken(async (token) => {
// //         const res = await nidWithdrawAccept(token, id)
// //         if (res.success) {
// //           await fetchAll()
// //           Swal.fire({ icon: "success", title: "Accepted!", timer: 1500, showConfirmButton: false })
// //         } else {
// //           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
// //         }
// //       })
// //     } finally {
// //       setActionId(null)
// //     }
// //   }

// //   const handleCancel = async () => {
// //     if (!cancelModal) return
// //     if (!cancelModal.note.trim() || cancelModal.note.trim().length < 3) {
// //       Swal.fire({ icon: "warning", title: "বাতিলের কারণ লিখুন (কমপক্ষে ৩ অক্ষর)" })
// //       return
// //     }

// //     setActionId(cancelModal.id)
// //     const id = cancelModal.id
// //     const note = cancelModal.note
// //     setCancelModal(null)

// //     try {
// //       await withToken(async (token) => {
// //         const res = await nidWithdrawCancel(token, id, note)
// //         if (res.success) {
// //           await fetchAll()
// //           Swal.fire({ icon: "success", title: "বাতিল এবং ৳৫০ রিফান্ড হয়েছে", timer: 2000, showConfirmButton: false })
// //         } else {
// //           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
// //         }
// //       })
// //     } finally {
// //       setActionId(null)
// //     }
// //   }

// //   const handleSendPdf = async () => {
// //     if (!pdfModal) return
// //     if (!pdfModal.url.trim()) {
// //       Swal.fire({ icon: "warning", title: "PDF URL দিন" })
// //       return
// //     }

// //     setActionId(pdfModal.id)
// //     const id = pdfModal.id
// //     const url = pdfModal.url
// //     setPdfModal(null)

// //     try {
// //       await withToken(async (token) => {
// //         const res = await nidWithdrawSendPdf(token, id, url)
// //         if (res.success) {
// //           await fetchAll()
// //           Swal.fire({ icon: "success", title: "PDF পাঠানো হয়েছে!", timer: 1500, showConfirmButton: false })
// //         } else {
// //           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
// //         }
// //       })
// //     } finally {
// //       setActionId(null)
// //     }
// //   }

// //   return (
// //     <div className="space-y-5 text-foreground">
// //       {/* Header */}
// //       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <h1 className="text-xl font-bold text-foreground sm:text-2xl">NID কার্ড উত্তোলন — Admin</h1>
// //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //           <span className="rounded-full border border-border bg-muted px-3 py-1">
// //             মোট: {requests.length}
// //           </span>
// //           <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
// //             Pending: {requests.filter((r) => r.status === "pending").length}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Filters */}
// //       <div className="flex flex-col gap-3 sm:flex-row">
// //         <div className="relative flex-1">
// //           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
// //           <input
// //             type="text"
// //             placeholder="নাম, NID নম্বর বা Email..."
// //             className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //           />
// //         </div>
// //         <select
// //           value={statusFilter}
// //           onChange={(e) => setStatusFilter(e.target.value)}
// //           className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
// //         >
// //           <option value="all">সব Status</option>
// //           <option value="pending">Pending</option>
// //           <option value="admin_seen">দেখা হয়েছে</option>
// //           <option value="accepted">গৃহীত</option>
// //           <option value="cancelled">বাতিল</option>
// //           <option value="pdf_sent">PDF পাঠানো হয়েছে</option>
// //         </select>
// //       </div>

// //       {/* Table */}
// //       <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
// //         <div className="overflow-x-auto">
// //           <table className="w-full border-collapse text-left">
// //             <thead>
// //               <tr className="border-b border-border bg-muted/30">
// //                 <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">#</th>
// //                 <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">User</th>
// //                 <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">আবেদনের তথ্য</th>
// //                 <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
// //                 <th className="px-4 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
// //               </tr>
// //             </thead>

// //             <tbody className="divide-y divide-border">
// //               {loading ? (
// //                 <tr>
// //                   <td colSpan={5} className="py-20 text-center text-muted-foreground">Loading...</td>
// //                 </tr>
// //               ) : filtered.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={5} className="py-20 text-center text-muted-foreground">কোনো আবেদন নেই</td>
// //                 </tr>
// //               ) : (
// //                 filtered.map((r, idx) => (
// //                   <tr key={r._id} className="group transition-colors hover:bg-muted/20">
// //                     <td className="px-4 py-4 text-sm text-muted-foreground">{idx + 1}</td>

// //                     {/* User */}
// //                     <td className="px-4 py-4">
// //                       <div className="flex items-center gap-3">
// //                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
// //                           {r.userId?.name?.[0] || <User size={16} />}
// //                         </div>
// //                         <div className="min-w-0">
// //                           <div className="truncate text-sm font-bold text-foreground">
// //                             {r.userId?.name || "Anonymous"}
// //                           </div>
// //                           <div className="truncate text-[11px] text-muted-foreground">{r.userId?.email}</div>
// //                           <div className="text-[10px] text-muted-foreground">
// //                             ৳{r.userId?.wallet?.balance ?? "—"}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </td>

// //                     {/* Info — clean layout with copy buttons + view details */}
// //                     <td className="px-4 py-4">
// //                       <div className="space-y-2">

// //                         {/* Name row */}
// //                         <div className="flex items-center gap-2">
// //                           <div className="min-w-0 flex-1">
// //                             <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Name</p>
// //                             <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
// //                           </div>
// //                           <CopyButton value={r.name} label="Name" />
// //                         </div>

// //                         {/* Number row */}
// //                         <div className="flex items-center gap-2">
// //                           <div className="min-w-0 flex-1">
// //                             <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Number</p>
// //                             <p className="font-mono text-[12px] font-semibold text-foreground">{r.nidOrBirthCert}</p>
// //                           </div>
// //                           <CopyButton value={r.nidOrBirthCert} label="Number" />
// //                         </div>

// //                         {/* DOB row */}
// //                         <div className="flex items-center gap-2">
// //                           <div className="min-w-0 flex-1">
// //                             <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">DOB</p>
// //                             <p className="text-[12px] font-semibold text-foreground">{r.dob}</p>
// //                           </div>
// //                           <CopyButton value={r.dob} label="DOB" />
// //                         </div>

// //                         {/* Meta + view button */}
// //                         <div className="flex items-center gap-2 pt-0.5">
// //                           <p className="text-[10px] text-muted-foreground">
// //                             {new Date(r.createdAt).toLocaleString("en-GB", {
// //                               day: "2-digit", month: "short",
// //                               hour: "2-digit", minute: "2-digit",
// //                             })}
// //                           </p>
// //                           <button
// //                             onClick={() => setDetailsRequest(r)}
// //                             className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
// //                           >
// //                             <Eye size={9} /> Details
// //                           </button>
// //                         </div>

// //                         {/* Cancel note */}
// //                         {r.status === "cancelled" && r.cancelNote && (
// //                           <p className="text-[11px] text-red-600 dark:text-red-400">✕ {r.cancelNote}</p>
// //                         )}

// //                         {/* PDF link */}
// //                         {r.status === "pdf_sent" && r.pdfUrl && (
// //                           <a
// //                             href={r.pdfUrl}
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="inline-flex items-center gap-1 text-[11px] text-purple-600 underline underline-offset-2 hover:text-purple-700 dark:text-purple-400"
// //                           >
// //                             <Download size={10} /> PDF দেখুন
// //                           </a>
// //                         )}
// //                       </div>
// //                     </td>

// //                     {/* Status */}
// //                     <td className="px-4 py-4">
// //                       <span
// //                         className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}
// //                       >
// //                         {r.status === "pending" && <Clock size={11} />}
// //                         {r.status === "admin_seen" && <Eye size={11} />}
// //                         {r.status === "accepted" && <CheckCircle size={11} />}
// //                         {r.status === "cancelled" && <XCircle size={11} />}
// //                         {r.status === "pdf_sent" && <FileUp size={11} />}
// //                         {STATUS_LABEL[r.status]}
// //                       </span>
// //                     </td>

// //                     {/* Actions */}
// //                     <td className="px-4 py-4 text-right">
// //                       <div className="flex items-center justify-end gap-1.5 flex-wrap">
// //                         {r.status === "pending" && (
// //                           <button
// //                             disabled={actionId === r._id}
// //                             onClick={() => handleMarkSeen(r._id)}
// //                             className="flex items-center gap-1 rounded-lg bg-blue-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-blue-600 disabled:opacity-60"
// //                           >
// //                             <Eye size={13} /> দেখেছেন
// //                           </button>
// //                         )}
// //                         {(r.status === "pending" || r.status === "admin_seen") && (
// //                           <button
// //                             disabled={actionId === r._id}
// //                             onClick={() => handleAccept(r._id)}
// //                             className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-emerald-600 disabled:opacity-60"
// //                           >
// //                             <CheckCircle size={13} /> Accept
// //                           </button>
// //                         )}
// //                         {["pending", "admin_seen", "accepted"].includes(r.status) && (
// //                           <button
// //                             disabled={actionId === r._id}
// //                             onClick={() => setCancelModal({ id: r._id, note: "" })}
// //                             className="flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-rose-600 disabled:opacity-60"
// //                           >
// //                             <XCircle size={13} /> বাতিল
// //                           </button>
// //                         )}
// //                         {["pending", "admin_seen", "accepted"].includes(r.status) && (
// //                           <button
// //                             disabled={actionId === r._id}
// //                             onClick={() => setPdfModal({ id: r._id, url: "" })}
// //                             className="flex items-center gap-1 rounded-lg bg-purple-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-purple-600 disabled:opacity-60"
// //                           >
// //                             <FileUp size={13} /> PDF পাঠান
// //                           </button>
// //                         )}
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* Details Modal */}
// //       {detailsRequest && (
// //         <DetailsModal request={detailsRequest} onClose={() => setDetailsRequest(null)} />
// //       )}

// //       {/* Cancel Modal */}
// //       {cancelModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
// //           <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
// //             <h2 className="mb-4 text-base font-bold text-foreground">বাতিলের কারণ লিখুন</h2>
// //             <textarea
// //               rows={3}
// //               placeholder="কারণ লিখুন (কমপক্ষে ৩ অক্ষর)"
// //               value={cancelModal.note}
// //               onChange={(e) => setCancelModal({ ...cancelModal, note: e.target.value })}
// //               className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-rose-500/30 placeholder:text-muted-foreground"
// //             />
// //             <p className="mt-2 text-xs text-muted-foreground">
// //               Request বাতিল হলে ৳৫০ স্বয়ংক্রিয়ভাবে user-কে ফেরত দেওয়া হবে।
// //             </p>
// //             <div className="mt-4 flex justify-end gap-2">
// //               <button
// //                 onClick={() => setCancelModal(null)}
// //                 className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
// //               >
// //                 বাতিল করুন
// //               </button>
// //               <button
// //                 onClick={handleCancel}
// //                 className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-600"
// //               >
// //                 নিশ্চিত করুন
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* PDF Modal */}
// //       {pdfModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
// //           <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
// //             <h2 className="mb-4 text-base font-bold text-foreground">PDF URL দিন</h2>
// //             <input
// //               type="url"
// //               placeholder="https://... (PDF link)"
// //               value={pdfModal.url}
// //               onChange={(e) => setPdfModal({ ...pdfModal, url: e.target.value })}
// //               className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-muted-foreground"
// //             />
// //             <p className="mt-2 text-xs text-muted-foreground">
// //               Google Drive, Dropbox বা যেকোনো public PDF link দিন। User সরাসরি download করতে পারবেন।
// //             </p>
// //             <div className="mt-4 flex justify-end gap-2">
// //               <button
// //                 onClick={() => setPdfModal(null)}
// //                 className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
// //               >
// //                 বাতিল করুন
// //               </button>
// //               <button
// //                 onClick={handleSendPdf}
// //                 className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-bold text-white hover:bg-purple-600"
// //               >
// //                 PDF পাঠান
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }



// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { auth } from "@/lib/firebase"

// import {
//   Eye,
//   CheckCircle,
//   XCircle,
//   FileUp,
//   Clock,
//   User,
//   Search,
//   Download,
//   Copy,
//   Check,
//   ExternalLink,
//   Trash2,
// } from "lucide-react"
// import Swal from "sweetalert2"
// import {
//   getAllNidWithdrawRequests,
//   nidWithdrawAccept,
//   nidWithdrawCancel,
//   nidWithdrawMarkSeen,
//   nidWithdrawSendPdf,
//   deleteNidWithdrawRequest,
// } from "@/lib/api.nidWithdraw"

// type TNidWithdrawStatus = "pending" | "admin_seen" | "accepted" | "cancelled" | "pdf_sent"

// type TRequest = {
//   _id: string
//   nidOrBirthCert: string
//   name: string
//   dob: string
//   status: TNidWithdrawStatus
//   cancelNote?: string
//   pdfUrl?: string
//   createdAt: string
//   userId?: {
//     _id: string
//     name?: string
//     email?: string
//     wallet?: { balance: number }
//   }
// }

// const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
//   pending: "Pending",
//   admin_seen: "দেখা হয়েছে",
//   accepted: "গৃহীত",
//   cancelled: "বাতিল",
//   pdf_sent: "PDF পাঠানো হয়েছে",
// }

// function getStatusBadge(status: TNidWithdrawStatus) {
//   switch (status) {
//     case "pending":
//       return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
//     case "admin_seen":
//       return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
//     case "accepted":
//       return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
//     case "cancelled":
//       return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
//     case "pdf_sent":
//       return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
//   }
// }

// // ── CopyButton ────────────────────────────────────────────────────
// function CopyButton({ value, label }: { value: string; label?: string }) {
//   const [copied, setCopied] = useState(false)

//   const handleCopy = async (e: React.MouseEvent) => {
//     e.stopPropagation()
//     try {
//       await navigator.clipboard.writeText(value)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 1800)
//     } catch {
//       const el = document.createElement("textarea")
//       el.value = value
//       document.body.appendChild(el)
//       el.select()
//       document.execCommand("copy")
//       document.body.removeChild(el)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 1800)
//     }
//   }

//   return (
//     <button
//       onClick={handleCopy}
//       title={`Copy ${label ?? value}`}
//       className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-all
//         ${copied
//           ? "border-emerald-400 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400"
//           : "border-border bg-muted/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
//         }`}
//     >
//       {copied ? <Check size={9} /> : <Copy size={9} />}
//       {copied ? "Copied!" : (label ?? "Copy")}
//     </button>
//   )
// }

// // ── Details Modal ─────────────────────────────────────────────────
// function DetailsModal({ request, onClose }: { request: TRequest; onClose: () => void }) {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between border-b border-border px-6 py-4">
//           <h2 className="text-base font-bold text-foreground">আবেদনের বিবরণ</h2>
//           <button
//             onClick={onClose}
//             className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="space-y-4 px-6 py-5">
//           <div>
//             <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Applicant Details</p>
//             <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
//               <div className="flex items-center justify-between gap-3">
//                 <div className="min-w-0">
//                   <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Name</p>
//                   <p className="mt-0.5 truncate text-sm font-bold text-foreground">{request.name}</p>
//                 </div>
//                 <CopyButton value={request.name} label="Name" />
//               </div>
//               <div className="h-px bg-border" />
//               <div className="flex items-center justify-between gap-3">
//                 <div className="min-w-0">
//                   <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">NID / Birth Cert No.</p>
//                   <p className="mt-0.5 font-mono text-sm font-bold text-foreground">{request.nidOrBirthCert}</p>
//                 </div>
//                 <CopyButton value={request.nidOrBirthCert} label="Number" />
//               </div>
//               <div className="h-px bg-border" />
//               <div className="flex items-center justify-between gap-3">
//                 <div className="min-w-0">
//                   <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date of Birth</p>
//                   <p className="mt-0.5 text-sm font-bold text-foreground">{request.dob}</p>
//                 </div>
//                 <CopyButton value={request.dob} label="DOB" />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-xl border border-border bg-muted/10 px-4 py-3 space-y-2 text-sm">
//             <div className="flex items-center justify-between">
//               <span className="text-[11px] text-muted-foreground">Requested At</span>
//               <span className="text-[12px] font-medium text-foreground">
//                 {new Date(request.createdAt).toLocaleString("en-GB", {
//                   day: "2-digit", month: "short", year: "numeric",
//                   hour: "2-digit", minute: "2-digit",
//                 })}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-[11px] text-muted-foreground">Status</span>
//               <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(request.status)}`}>
//                 {STATUS_LABEL[request.status]}
//               </span>
//             </div>
//             {request.userId?.name && (
//               <div className="flex items-center justify-between">
//                 <span className="text-[11px] text-muted-foreground">User</span>
//                 <span className="text-[12px] font-medium text-foreground">{request.userId.name}</span>
//               </div>
//             )}
//             {request.userId?.email && (
//               <div className="flex items-center justify-between">
//                 <span className="text-[11px] text-muted-foreground">Email</span>
//                 <span className="text-[12px] text-muted-foreground">{request.userId.email}</span>
//               </div>
//             )}
//           </div>

//           {request.status === "cancelled" && request.cancelNote && (
//             <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//               <strong>বাতিলের কারণ:</strong> {request.cancelNote}
//             </div>
//           )}

//           {request.status === "pdf_sent" && request.pdfUrl && (
//             <a
//               href={request.pdfUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300"
//             >
//               <ExternalLink size={12} /> PDF দেখুন / ডাউনলোড করুন
//             </a>
//           )}
//         </div>

//         <div className="border-t border-border px-6 py-4 text-right">
//           <button
//             onClick={onClose}
//             className="rounded-lg border border-border px-5 py-2 text-sm text-muted-foreground hover:bg-muted"
//           >
//             বন্ধ করুন
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ── Main Page ─────────────────────────────────────────────────────
// export default function AdminNidWithdrawPage() {
//   const [requests, setRequests] = useState<TRequest[]>([])
//   const [loading, setLoading] = useState(true)
//   const [actionId, setActionId] = useState<string | null>(null)
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [search, setSearch] = useState("")
//   const [cancelModal, setCancelModal] = useState<{ id: string; note: string } | null>(null)
//   const [pdfModal, setPdfModal] = useState<{ id: string; url: string } | null>(null)
//   const [detailsRequest, setDetailsRequest] = useState<TRequest | null>(null)

//   const fetchAll = useCallback(async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await getAllNidWithdrawRequests(token, statusFilter)
//       if (res.success) setRequests(res.data)
//     } catch {
//     } finally {
//       setLoading(false)
//     }
//   }, [statusFilter])

//   useEffect(() => {
//     setLoading(true)
//     fetchAll()
//   }, [fetchAll])

//   const filtered = requests.filter((r) => {
//     if (!search) return true
//     const q = search.toLowerCase()
//     return (
//       r.name?.toLowerCase().includes(q) ||
//       r.nidOrBirthCert?.toLowerCase().includes(q) ||
//       r.userId?.name?.toLowerCase().includes(q) ||
//       r.userId?.email?.toLowerCase().includes(q)
//     )
//   })

//   const withToken = async (cb: (token: string) => Promise<void>) => {
//     const token = await auth.currentUser?.getIdToken()
//     if (!token) return
//     await cb(token)
//   }

//   const handleMarkSeen = async (id: string) => {
//     setActionId(id)
//     try {
//       await withToken(async (token) => {
//         const res = await nidWithdrawMarkSeen(token, id)
//         if (res.success) {
//           await fetchAll()
//           Swal.fire({ icon: "success", title: "Marked as seen", timer: 1500, showConfirmButton: false })
//         } else {
//           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//         }
//       })
//     } finally {
//       setActionId(null)
//     }
//   }

//   const handleAccept = async (id: string) => {
//     const confirm = await Swal.fire({
//       title: "Accept করবেন?",
//       text: "Request টি গৃহীত হবে।",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, Accept করুন",
//       cancelButtonText: "না",
//       confirmButtonColor: "#10b981",
//     })
//     if (!confirm.isConfirmed) return

//     setActionId(id)
//     try {
//       await withToken(async (token) => {
//         const res = await nidWithdrawAccept(token, id)
//         if (res.success) {
//           await fetchAll()
//           Swal.fire({ icon: "success", title: "Accepted!", timer: 1500, showConfirmButton: false })
//         } else {
//           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//         }
//       })
//     } finally {
//       setActionId(null)
//     }
//   }

//   const handleCancel = async () => {
//     if (!cancelModal) return
//     if (!cancelModal.note.trim() || cancelModal.note.trim().length < 3) {
//       Swal.fire({ icon: "warning", title: "বাতিলের কারণ লিখুন (কমপক্ষে ৩ অক্ষর)" })
//       return
//     }

//     setActionId(cancelModal.id)
//     const id = cancelModal.id
//     const note = cancelModal.note
//     setCancelModal(null)

//     try {
//       await withToken(async (token) => {
//         const res = await nidWithdrawCancel(token, id, note)
//         if (res.success) {
//           await fetchAll()
//           Swal.fire({ icon: "success", title: "বাতিল এবং ৳৫০ রিফান্ড হয়েছে", timer: 2000, showConfirmButton: false })
//         } else {
//           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//         }
//       })
//     } finally {
//       setActionId(null)
//     }
//   }

//   const handleSendPdf = async () => {
//     if (!pdfModal) return
//     if (!pdfModal.url.trim()) {
//       Swal.fire({ icon: "warning", title: "PDF URL দিন" })
//       return
//     }

//     setActionId(pdfModal.id)
//     const id = pdfModal.id
//     const url = pdfModal.url
//     setPdfModal(null)

//     try {
//       await withToken(async (token) => {
//         const res = await nidWithdrawSendPdf(token, id, url)
//         if (res.success) {
//           await fetchAll()
//           Swal.fire({ icon: "success", title: "PDF পাঠানো হয়েছে!", timer: 1500, showConfirmButton: false })
//         } else {
//           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//         }
//       })
//     } finally {
//       setActionId(null)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const confirm = await Swal.fire({
//       title: "আবেদন মুছবেন?",
//       text: "এই আবেদনটি স্থায়ীভাবে মুছে যাবে।",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, মুছুন",
//       cancelButtonText: "না",
//       confirmButtonColor: "#ef4444",
//     })
//     if (!confirm.isConfirmed) return

//     setActionId(id)
//     try {
//       await withToken(async (token) => {
//         const res = await deleteNidWithdrawRequest(token, id)
//         if (res.success) {
//           await fetchAll()
//           Swal.fire({ icon: "success", title: "মুছে ফেলা হয়েছে", timer: 1500, showConfirmButton: false })
//         } else {
//           Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//         }
//       })
//     } finally {
//       setActionId(null)
//     }
//   }

//   return (
//     <div className="space-y-5 text-foreground">
//       {/* Header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <h1 className="text-xl font-bold text-foreground sm:text-2xl">NID কার্ড উত্তোলন — Admin</h1>
//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <span className="rounded-full border border-border bg-muted px-3 py-1">
//             মোট: {requests.length}
//           </span>
//           <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
//             Pending: {requests.filter((r) => r.status === "pending").length}
//           </span>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col gap-3 sm:flex-row">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
//           <input
//             type="text"
//             placeholder="নাম, NID নম্বর বা Email..."
//             className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
//         >
//           <option value="all">সব Status</option>
//           <option value="pending">Pending</option>
//           <option value="admin_seen">দেখা হয়েছে</option>
//           <option value="accepted">গৃহীত</option>
//           <option value="cancelled">বাতিল</option>
//           <option value="pdf_sent">PDF পাঠানো হয়েছে</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr className="border-b border-border bg-muted/30">
//                 <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">#</th>
//                 <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">User</th>
//                 <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">আবেদনের তথ্য</th>
//                 <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
//                 <th className="px-4 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-border">
//               {loading ? (
//                 <tr>
//                   <td colSpan={5} className="py-20 text-center text-muted-foreground">Loading...</td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="py-20 text-center text-muted-foreground">কোনো আবেদন নেই</td>
//                 </tr>
//               ) : (
//                 filtered.map((r, idx) => (
//                   <tr key={r._id} className="group transition-colors hover:bg-muted/20">
//                     <td className="px-4 py-4 text-sm text-muted-foreground">{idx + 1}</td>

//                     {/* User */}
//                     <td className="px-4 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
//                           {r.userId?.name?.[0] || <User size={16} />}
//                         </div>
//                         <div className="min-w-0">
//                           <div className="truncate text-sm font-bold text-foreground">
//                             {r.userId?.name || "Anonymous"}
//                           </div>
//                           <div className="truncate text-[11px] text-muted-foreground">{r.userId?.email}</div>
//                           <div className="text-[10px] text-muted-foreground">
//                             ৳{r.userId?.wallet?.balance ?? "—"}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Info */}
//                     <td className="px-4 py-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2">
//                           <div className="min-w-0 flex-1">
//                             <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Name</p>
//                             <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
//                           </div>
//                           <CopyButton value={r.name} label="Name" />
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="min-w-0 flex-1">
//                             <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Number</p>
//                             <p className="font-mono text-[12px] font-semibold text-foreground">{r.nidOrBirthCert}</p>
//                           </div>
//                           <CopyButton value={r.nidOrBirthCert} label="Number" />
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="min-w-0 flex-1">
//                             <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">DOB</p>
//                             <p className="text-[12px] font-semibold text-foreground">{r.dob}</p>
//                           </div>
//                           <CopyButton value={r.dob} label="DOB" />
//                         </div>
//                         <div className="flex items-center gap-2 pt-0.5">
//                           <p className="text-[10px] text-muted-foreground">
//                             {new Date(r.createdAt).toLocaleString("en-GB", {
//                               day: "2-digit", month: "short",
//                               hour: "2-digit", minute: "2-digit",
//                             })}
//                           </p>
//                           <button
//                             onClick={() => setDetailsRequest(r)}
//                             className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
//                           >
//                             <Eye size={9} /> Details
//                           </button>
//                         </div>
//                         {r.status === "cancelled" && r.cancelNote && (
//                           <p className="text-[11px] text-red-600 dark:text-red-400">✕ {r.cancelNote}</p>
//                         )}
//                         {r.status === "pdf_sent" && r.pdfUrl && (
//                           <a
//                             href={r.pdfUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-1 text-[11px] text-purple-600 underline underline-offset-2 hover:text-purple-700 dark:text-purple-400"
//                           >
//                             <Download size={10} /> PDF দেখুন
//                           </a>
//                         )}
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="px-4 py-4">
//                       <span
//                         className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}
//                       >
//                         {r.status === "pending" && <Clock size={11} />}
//                         {r.status === "admin_seen" && <Eye size={11} />}
//                         {r.status === "accepted" && <CheckCircle size={11} />}
//                         {r.status === "cancelled" && <XCircle size={11} />}
//                         {r.status === "pdf_sent" && <FileUp size={11} />}
//                         {STATUS_LABEL[r.status]}
//                       </span>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-4 py-4 text-right">
//                       <div className="flex items-center justify-end gap-1.5 flex-wrap">
//                         {r.status === "pending" && (
//                           <button
//                             disabled={actionId === r._id}
//                             onClick={() => handleMarkSeen(r._id)}
//                             className="flex items-center gap-1 rounded-lg bg-blue-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-blue-600 disabled:opacity-60"
//                           >
//                             <Eye size={13} /> দেখেছেন
//                           </button>
//                         )}
//                         {(r.status === "pending" || r.status === "admin_seen") && (
//                           <button
//                             disabled={actionId === r._id}
//                             onClick={() => handleAccept(r._id)}
//                             className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-emerald-600 disabled:opacity-60"
//                           >
//                             <CheckCircle size={13} /> Accept
//                           </button>
//                         )}
//                         {["pending", "admin_seen", "accepted"].includes(r.status) && (
//                           <button
//                             disabled={actionId === r._id}
//                             onClick={() => setCancelModal({ id: r._id, note: "" })}
//                             className="flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-rose-600 disabled:opacity-60"
//                           >
//                             <XCircle size={13} /> বাতিল
//                           </button>
//                         )}
//                         {["pending", "admin_seen", "accepted"].includes(r.status) && (
//                           <button
//                             disabled={actionId === r._id}
//                             onClick={() => setPdfModal({ id: r._id, url: "" })}
//                             className="flex items-center gap-1 rounded-lg bg-purple-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-purple-600 disabled:opacity-60"
//                           >
//                             <FileUp size={13} /> PDF পাঠান
//                           </button>
//                         )}
//                         {/* Delete — always visible for admin */}
//                         <button
//                           disabled={actionId === r._id}
//                           onClick={() => handleDelete(r._id)}
//                           className="flex items-center gap-1 rounded-lg bg-gray-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-gray-600 disabled:opacity-60"
//                         >
//                           <Trash2 size={13} /> মুছুন
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Details Modal */}
//       {detailsRequest && (
//         <DetailsModal request={detailsRequest} onClose={() => setDetailsRequest(null)} />
//       )}

//       {/* Cancel Modal */}
//       {cancelModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
//             <h2 className="mb-4 text-base font-bold text-foreground">বাতিলের কারণ লিখুন</h2>
//             <textarea
//               rows={3}
//               placeholder="কারণ লিখুন (কমপক্ষে ৩ অক্ষর)"
//               value={cancelModal.note}
//               onChange={(e) => setCancelModal({ ...cancelModal, note: e.target.value })}
//               className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-rose-500/30 placeholder:text-muted-foreground"
//             />
//             <p className="mt-2 text-xs text-muted-foreground">
//               Request বাতিল হলে ৳৫০ স্বয়ংক্রিয়ভাবে user-কে ফেরত দেওয়া হবে।
//             </p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button onClick={() => setCancelModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">
//                 বাতিল করুন
//               </button>
//               <button onClick={handleCancel} className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-600">
//                 নিশ্চিত করুন
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PDF Modal */}
//       {pdfModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
//           <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
//             <h2 className="mb-4 text-base font-bold text-foreground">PDF URL দিন</h2>
//             <input
//               type="url"
//               placeholder="https://... (PDF link)"
//               value={pdfModal.url}
//               onChange={(e) => setPdfModal({ ...pdfModal, url: e.target.value })}
//               className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-muted-foreground"
//             />
//             <p className="mt-2 text-xs text-muted-foreground">
//               Google Drive, Dropbox বা যেকোনো public PDF link দিন। User সরাসরি download করতে পারবেন।
//             </p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button onClick={() => setPdfModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">
//                 বাতিল করুন
//               </button>
//               <button onClick={handleSendPdf} className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-bold text-white hover:bg-purple-600">
//                 PDF পাঠান
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



"use client"

import { useState, useEffect, useCallback } from "react"
import { auth } from "@/lib/firebase"

import {
  Eye,
  CheckCircle,
  XCircle,
  FileUp,
  Clock,
  User,
  Search,
  Download,
  Copy,
  Check,
  ExternalLink,
  Trash2,
} from "lucide-react"
import Swal from "sweetalert2"
import {
  getAllNidWithdrawRequests,
  nidWithdrawAccept,
  nidWithdrawCancel,
  nidWithdrawMarkSeen,
  nidWithdrawSendPdf,
  nidWithdrawAdminDelete,
  nidWithdrawAdminBulkDeleteCompleted,
} from "@/lib/api.nidWithdraw"

type TNidWithdrawStatus = "pending" | "admin_seen" | "accepted" | "cancelled" | "pdf_sent"

type TRequest = {
  _id: string
  nidOrBirthCert: string
  name: string
  dob: string
  status: TNidWithdrawStatus
  cancelNote?: string
  pdfUrl?: string
  createdAt: string
  userId?: {
    _id: string
    name?: string
    email?: string
    wallet?: { balance: number }
  }
}

const COMPLETED_STATUSES: TNidWithdrawStatus[] = ["pdf_sent", "cancelled"]

const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
  pending: "Pending",
  admin_seen: "দেখা হয়েছে",
  accepted: "গৃহীত",
  cancelled: "বাতিল",
  pdf_sent: "PDF পাঠানো হয়েছে",
}

function getStatusBadge(status: TNidWithdrawStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
    case "admin_seen":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
    case "pdf_sent":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
  }
}

// ── CopyButton ────────────────────────────────────────────────────
function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const el = document.createElement("textarea")
      el.value = value
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label ?? value}`}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-all
        ${copied
          ? "border-emerald-400 bg-emerald-50 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "border-border bg-muted/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
        }`}
    >
      {copied ? <Check size={9} /> : <Copy size={9} />}
      {copied ? "Copied!" : (label ?? "Copy")}
    </button>
  )
}

// ── Details Modal ─────────────────────────────────────────────────
function DetailsModal({ request, onClose }: { request: TRequest; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-bold text-foreground">আবেদনের বিবরণ</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Applicant Details</p>
            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Name</p>
                  <p className="mt-0.5 truncate text-sm font-bold text-foreground">{request.name}</p>
                </div>
                <CopyButton value={request.name} label="Name" />
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">NID / Birth Cert No.</p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-foreground">{request.nidOrBirthCert}</p>
                </div>
                <CopyButton value={request.nidOrBirthCert} label="Number" />
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date of Birth</p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">{request.dob}</p>
                </div>
                <CopyButton value={request.dob} label="DOB" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/10 px-4 py-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Requested At</span>
              <span className="text-[12px] font-medium text-foreground">
                {new Date(request.createdAt).toLocaleString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Status</span>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(request.status)}`}>
                {STATUS_LABEL[request.status]}
              </span>
            </div>
            {request.userId?.name && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">User</span>
                <span className="text-[12px] font-medium text-foreground">{request.userId.name}</span>
              </div>
            )}
            {request.userId?.email && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Email</span>
                <span className="text-[12px] text-muted-foreground">{request.userId.email}</span>
              </div>
            )}
          </div>

          {request.status === "cancelled" && request.cancelNote && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <strong>বাতিলের কারণ:</strong> {request.cancelNote}
            </div>
          )}

          {request.status === "pdf_sent" && request.pdfUrl && (
            <a
              href={request.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300"
            >
              <ExternalLink size={12} /> PDF দেখুন / ডাউনলোড করুন
            </a>
          )}
        </div>

        <div className="border-t border-border px-6 py-4 text-right">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-5 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function AdminNidWithdrawPage() {
  const [requests, setRequests] = useState<TRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [cancelModal, setCancelModal] = useState<{ id: string; note: string } | null>(null)
  const [pdfModal, setPdfModal] = useState<{ id: string; url: string } | null>(null)
  const [detailsRequest, setDetailsRequest] = useState<TRequest | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await getAllNidWithdrawRequests(token, statusFilter)
      if (res.success) setRequests(res.data)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    setLoading(true)
    fetchAll()
  }, [fetchAll])

  const filtered = requests.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.name?.toLowerCase().includes(q) ||
      r.nidOrBirthCert?.toLowerCase().includes(q) ||
      r.userId?.name?.toLowerCase().includes(q) ||
      r.userId?.email?.toLowerCase().includes(q)
    )
  })

  const completedCount = requests.filter((r) => COMPLETED_STATUSES.includes(r.status)).length

  const withToken = async (cb: (token: string) => Promise<void>) => {
    const token = await auth.currentUser?.getIdToken()
    if (!token) return
    await cb(token)
  }

  const handleMarkSeen = async (id: string) => {
    setActionId(id)
    try {
      await withToken(async (token) => {
        const res = await nidWithdrawMarkSeen(token, id)
        if (res.success) {
          await fetchAll()
          Swal.fire({ icon: "success", title: "Marked as seen", timer: 1500, showConfirmButton: false })
        } else {
          Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
        }
      })
    } finally {
      setActionId(null)
    }
  }

  const handleAccept = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Accept করবেন?",
      text: "Request টি গৃহীত হবে।",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, Accept করুন",
      cancelButtonText: "না",
      confirmButtonColor: "#10b981",
    })
    if (!confirm.isConfirmed) return

    setActionId(id)
    try {
      await withToken(async (token) => {
        const res = await nidWithdrawAccept(token, id)
        if (res.success) {
          await fetchAll()
          Swal.fire({ icon: "success", title: "Accepted!", timer: 1500, showConfirmButton: false })
        } else {
          Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
        }
      })
    } finally {
      setActionId(null)
    }
  }

  const handleCancel = async () => {
    if (!cancelModal) return
    if (!cancelModal.note.trim() || cancelModal.note.trim().length < 3) {
      Swal.fire({ icon: "warning", title: "বাতিলের কারণ লিখুন (কমপক্ষে ৩ অক্ষর)" })
      return
    }

    setActionId(cancelModal.id)
    const id = cancelModal.id
    const note = cancelModal.note
    setCancelModal(null)

    try {
      await withToken(async (token) => {
        const res = await nidWithdrawCancel(token, id, note)
        if (res.success) {
          await fetchAll()
          Swal.fire({ icon: "success", title: "বাতিল এবং ৳৫০ রিফান্ড হয়েছে", timer: 2000, showConfirmButton: false })
        } else {
          Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
        }
      })
    } finally {
      setActionId(null)
    }
  }

  const handleSendPdf = async () => {
    if (!pdfModal) return
    if (!pdfModal.url.trim()) {
      Swal.fire({ icon: "warning", title: "PDF URL দিন" })
      return
    }

    setActionId(pdfModal.id)
    const id = pdfModal.id
    const url = pdfModal.url
    setPdfModal(null)

    try {
      await withToken(async (token) => {
        const res = await nidWithdrawSendPdf(token, id, url)
        if (res.success) {
          await fetchAll()
          Swal.fire({ icon: "success", title: "PDF পাঠানো হয়েছে!", timer: 1500, showConfirmButton: false })
        } else {
          Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
        }
      })
    } finally {
      setActionId(null)
    }
  }

  // Admin soft-delete single (completed only)
  const handleAdminDelete = async (id: string, status: TNidWithdrawStatus) => {
    if (!COMPLETED_STATUSES.includes(status)) {
      Swal.fire({
        icon: "warning",
        title: "মুছা যাবে না",
        text: "শুধুমাত্র সম্পন্ন আবেদন (PDF পাঠানো / বাতিল) মুছা যাবে।",
      })
      return
    }

    const confirm = await Swal.fire({
      title: "Admin তালিকা থেকে সরাবেন?",
      text: "এটি শুধু Admin তালিকা থেকে লুকাবে। User history অক্ষুণ্ণ থাকবে।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, সরিয়ে দিন",
      cancelButtonText: "না",
      confirmButtonColor: "#6b7280",
    })
    if (!confirm.isConfirmed) return

    setActionId(id)
    try {
      await withToken(async (token) => {
        const res = await nidWithdrawAdminDelete(token, id)
        if (res.success) {
          await fetchAll()
          Swal.fire({ icon: "success", title: "তালিকা থেকে সরানো হয়েছে", timer: 1500, showConfirmButton: false })
        } else {
          Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
        }
      })
    } finally {
      setActionId(null)
    }
  }

  // Admin bulk soft-delete all completed
  const handleBulkDeleteCompleted = async () => {
    if (completedCount === 0) {
      Swal.fire({ icon: "info", title: "কোনো সম্পন্ন আবেদন নেই" })
      return
    }

    const confirm = await Swal.fire({
      title: `${completedCount}টি সম্পন্ন আবেদন সরাবেন?`,
      text: "PDF পাঠানো ও বাতিল সব আবেদন Admin তালিকা থেকে সরানো হবে। User history অক্ষুণ্ণ থাকবে।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, সব সরিয়ে দিন",
      cancelButtonText: "না",
      confirmButtonColor: "#6b7280",
    })
    if (!confirm.isConfirmed) return

    setBulkLoading(true)
    try {
      await withToken(async (token) => {
        const res = await nidWithdrawAdminBulkDeleteCompleted(token)
        if (res.success) {
          await fetchAll()
          Swal.fire({ icon: "success", title: res.message || "সরানো হয়েছে", timer: 2000, showConfirmButton: false })
        } else {
          Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
        }
      })
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="space-y-5 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">NID কার্ড উত্তোলন — Admin</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full border border-border bg-muted px-3 py-1">
            মোট: {requests.length}
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Pending: {requests.filter((r) => r.status === "pending").length}
          </span>
          {completedCount > 0 && (
            <button
              disabled={bulkLoading}
              onClick={handleBulkDeleteCompleted}
              className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700/40 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Trash2 size={11} />
              {bulkLoading ? "সরানো হচ্ছে..." : `Delete All Completed (${completedCount})`}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="নাম, NID নম্বর বা Email..."
            className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">সব Status</option>
          <option value="pending">Pending</option>
          <option value="admin_seen">দেখা হয়েছে</option>
          <option value="accepted">গৃহীত</option>
          <option value="cancelled">বাতিল</option>
          <option value="pdf_sent">PDF পাঠানো হয়েছে</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">#</th>
                <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">আবেদনের তথ্য</th>
                <th className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground">কোনো আবেদন নেই</td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const isCompleted = COMPLETED_STATUSES.includes(r.status)
                  return (
                    <tr
                      key={r._id}
                      className={`group transition-colors hover:bg-muted/20 ${isCompleted ? "opacity-70" : ""}`}
                    >
                      <td className="px-4 py-4 text-sm text-muted-foreground">{idx + 1}</td>

                      {/* User */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {r.userId?.name?.[0] || <User size={16} />}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-foreground">
                              {r.userId?.name || "Anonymous"}
                            </div>
                            <div className="truncate text-[11px] text-muted-foreground">{r.userId?.email}</div>
                            <div className="text-[10px] text-muted-foreground">
                              ৳{r.userId?.wallet?.balance ?? "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Info */}
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Name</p>
                              <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
                            </div>
                            <CopyButton value={r.name} label="Name" />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Number</p>
                              <p className="font-mono text-[12px] font-semibold text-foreground">{r.nidOrBirthCert}</p>
                            </div>
                            <CopyButton value={r.nidOrBirthCert} label="Number" />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">DOB</p>
                              <p className="text-[12px] font-semibold text-foreground">{r.dob}</p>
                            </div>
                            <CopyButton value={r.dob} label="DOB" />
                          </div>
                          <div className="flex items-center gap-2 pt-0.5">
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(r.createdAt).toLocaleString("en-GB", {
                                day: "2-digit", month: "short",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                            <button
                              onClick={() => setDetailsRequest(r)}
                              className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                            >
                              <Eye size={9} /> Details
                            </button>
                          </div>
                          {r.status === "cancelled" && r.cancelNote && (
                            <p className="text-[11px] text-red-600 dark:text-red-400">✕ {r.cancelNote}</p>
                          )}
                          {r.status === "pdf_sent" && r.pdfUrl && (
                            <a
                              href={r.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-purple-600 underline underline-offset-2 hover:text-purple-700 dark:text-purple-400"
                            >
                              <Download size={10} /> PDF দেখুন
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}
                        >
                          {r.status === "pending" && <Clock size={11} />}
                          {r.status === "admin_seen" && <Eye size={11} />}
                          {r.status === "accepted" && <CheckCircle size={11} />}
                          {r.status === "cancelled" && <XCircle size={11} />}
                          {r.status === "pdf_sent" && <FileUp size={11} />}
                          {STATUS_LABEL[r.status]}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {r.status === "pending" && (
                            <button
                              disabled={actionId === r._id}
                              onClick={() => handleMarkSeen(r._id)}
                              className="flex items-center gap-1 rounded-lg bg-blue-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-blue-600 disabled:opacity-60"
                            >
                              <Eye size={13} /> দেখেছেন
                            </button>
                          )}
                          {(r.status === "pending" || r.status === "admin_seen") && (
                            <button
                              disabled={actionId === r._id}
                              onClick={() => handleAccept(r._id)}
                              className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-emerald-600 disabled:opacity-60"
                            >
                              <CheckCircle size={13} /> Accept
                            </button>
                          )}
                          {["pending", "admin_seen", "accepted"].includes(r.status) && (
                            <button
                              disabled={actionId === r._id}
                              onClick={() => setCancelModal({ id: r._id, note: "" })}
                              className="flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-rose-600 disabled:opacity-60"
                            >
                              <XCircle size={13} /> বাতিল
                            </button>
                          )}
                          {["pending", "admin_seen", "accepted"].includes(r.status) && (
                            <button
                              disabled={actionId === r._id}
                              onClick={() => setPdfModal({ id: r._id, url: "" })}
                              className="flex items-center gap-1 rounded-lg bg-purple-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-purple-600 disabled:opacity-60"
                            >
                              <FileUp size={13} /> PDF পাঠান
                            </button>
                          )}
                          {/* Admin delete — only for completed */}
                          {isCompleted && (
                            <button
                              disabled={actionId === r._id}
                              onClick={() => handleAdminDelete(r._id, r.status)}
                              className="flex items-center gap-1 rounded-lg bg-gray-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-gray-600 disabled:opacity-60"
                              title="Admin তালিকা থেকে সরান"
                            >
                              <Trash2 size={13} /> সরান
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {detailsRequest && (
        <DetailsModal request={detailsRequest} onClose={() => setDetailsRequest(null)} />
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-base font-bold text-foreground">বাতিলের কারণ লিখুন</h2>
            <textarea
              rows={3}
              placeholder="কারণ লিখুন (কমপক্ষে ৩ অক্ষর)"
              value={cancelModal.note}
              onChange={(e) => setCancelModal({ ...cancelModal, note: e.target.value })}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-rose-500/30 placeholder:text-muted-foreground"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Request বাতিল হলে ৳৫০ স্বয়ংক্রিয়ভাবে user-কে ফেরত দেওয়া হবে।
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setCancelModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">
                বাতিল করুন
              </button>
              <button onClick={handleCancel} className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-600">
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {pdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-base font-bold text-foreground">PDF URL দিন</h2>
            <input
              type="url"
              placeholder="https://... (PDF link)"
              value={pdfModal.url}
              onChange={(e) => setPdfModal({ ...pdfModal, url: e.target.value })}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-muted-foreground"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Google Drive, Dropbox বা যেকোনো public PDF link দিন। User সরাসরি download করতে পারবেন।
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setPdfModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">
                বাতিল করুন
              </button>
              <button onClick={handleSendPdf} className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-bold text-white hover:bg-purple-600">
                PDF পাঠান
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}