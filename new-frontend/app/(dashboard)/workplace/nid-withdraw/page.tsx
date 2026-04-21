/* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client"

// // import { useState, useEffect } from "react"
// // import { auth } from "@/lib/firebase"

// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Calendar } from "@/components/ui/calendar"
// // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// // import {
// //   AlertCircle,
// //   Wallet,
// //   CalendarIcon,
// //   FileText,
// //   Download,
// //   MessageCircle,
// //   Info,
// // } from "lucide-react"
// // import { useUser } from "@/hooks/useUser"
// // import { format } from "date-fns"
// // import Swal from "sweetalert2"
// // import { createNidWithdrawRequest, getMyNidWithdrawRequests } from "@/lib/api.nidWithdraw"

// // // ── Progress step config ──────────────────────────────────────────
// // const STEPS = [
// //   { key: "pending",    label: "আবেদন জমা" },
// //   { key: "admin_seen", label: "Admin দেখেছেন" },
// //   { key: "accepted",  label: "গৃহীত হয়েছে" },
// //   { key: "cancelled", label: "বাতিল হয়েছে" },
// //   { key: "pdf_sent",  label: "PDF পাঠানো হয়েছে" },
// // ]

// // const STATUS_ORDER: Record<string, number> = {
// //   pending: 0,
// //   admin_seen: 1,
// //   accepted: 2,
// //   pdf_sent: 3,
// //   cancelled: -1,
// // }

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
// // }

// // // ── Progress Tracker Component ────────────────────────────────────
// // function ProgressTracker({ status }: { status: TNidWithdrawStatus }) {
// //   const isCancelled = status === "cancelled"
// //   const currentOrder = STATUS_ORDER[status]

// //   const normalSteps = STEPS.filter((s) => s.key !== "cancelled")

// //   if (isCancelled) {
// //     return (
// //       <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
// //         ✕ আবেদন বাতিল হয়েছে
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="mt-3 flex items-center gap-0">
// //       {normalSteps.map((step, idx) => {
// //         const stepOrder = STATUS_ORDER[step.key]
// //         const isDone = currentOrder >= stepOrder
// //         const isActive = currentOrder === stepOrder

// //         return (
// //           <div key={step.key} className="flex items-center">
// //             <div className="flex flex-col items-center">
// //               <div
// //                 className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all
// //                   ${isDone
// //                     ? "border-emerald-500 bg-emerald-500 text-white"
// //                     : "border-border bg-muted text-muted-foreground"
// //                   }
// //                   ${isActive ? "ring-2 ring-emerald-300 ring-offset-1" : ""}
// //                 `}
// //               >
// //                 {isDone ? "✓" : idx + 1}
// //               </div>
// //               <span
// //                 className={`mt-1 max-w-[60px] text-center text-[9px] leading-tight
// //                   ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}
// //                 `}
// //               >
// //                 {step.label}
// //               </span>
// //             </div>
// //             {idx < normalSteps.length - 1 && (
// //               <div
// //                 className={`mb-4 h-[2px] w-6 shrink-0 ${
// //                   currentOrder > stepOrder ? "bg-emerald-500" : "bg-border"
// //                 }`}
// //               />
// //             )}
// //           </div>
// //         )
// //       })}
// //     </div>
// //   )
// // }

// // // ── Main Page ─────────────────────────────────────────────────────
// // export default function NidWithdrawPage() {
// //   const { user, refreshWallet } = useUser()

// //   const [nidOrBirthCert, setNidOrBirthCert] = useState("")
// //   const [name, setName] = useState("")
// //   const [dob, setDob] = useState("")
// //   const [dobDate, setDobDate] = useState<Date | undefined>(undefined)
// //   const [calendarOpen, setCalendarOpen] = useState(false)
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState("")
// //   const [requests, setRequests] = useState<TRequest[]>([])
// //   const [listLoading, setListLoading] = useState(true)

// //   const isAdmin = user?.role === "admin" || user?.role === "super_admin"
// //   const balance = user?.wallet?.balance ?? 0

// //   const handleDateSelect = (date: Date | undefined) => {
// //     if (date) {
// //       setDobDate(date)
// //       setDob(format(date, "yyyy-MM-dd"))
// //       setCalendarOpen(false)
// //     }
// //   }

// //   const fetchMyRequests = async () => {
// //     try {
// //       const token = await auth.currentUser?.getIdToken()
// //       if (!token) return
// //       const res = await getMyNidWithdrawRequests(token)
// //       if (res.success) setRequests(res.data)
// //     } catch {
// //       // silent
// //     } finally {
// //       setListLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchMyRequests()
// //   }, [])

// //   const handleSubmit = async () => {
// //     setError("")

// //     if (!nidOrBirthCert.trim()) { setError("NID বা জন্ম নিবন্ধন নম্বর দিন"); return }
// //     if (!name.trim()) { setError("নাম দিন"); return }
// //     if (!dob) { setError("জন্ম তারিখ দিন"); return }
// //     if (!isAdmin && balance < 50) { setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"); return }

// //     setLoading(true)
// //     Swal.fire({
// //       title: "আবেদন জমা হচ্ছে...",
// //       html: "অনুগ্রহ করে অপেক্ষা করুন",
// //       allowOutsideClick: false,
// //       didOpen: () => Swal.showLoading(),
// //       background: "hsl(var(--card))",
// //       color: "hsl(var(--foreground))",
// //     })

// //     try {
// //       const token = await auth.currentUser?.getIdToken()
// //       if (!token) throw new Error("Token not found")

// //       const res = await createNidWithdrawRequest(token, {
// //         nidOrBirthCert: nidOrBirthCert.trim(),
// //         name: name.trim(),
// //         dob,
// //       })

// //       Swal.close()

// //       if (!res.success) {
// //         if (res.code === "INSUFFICIENT_BALANCE") {
// //           setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।")
// //         } else {
// //           setError(res.message || "সমস্যা হয়েছে")
// //         }
// //         return
// //       }

// //       await refreshWallet()
// //       await fetchMyRequests()

// //       setNidOrBirthCert("")
// //       setName("")
// //       setDob("")
// //       setDobDate(undefined)

// //       Swal.fire({
// //         icon: "success",
// //         title: "আবেদন সফল হয়েছে",
// //         text: "Admin process করলে আপনাকে নোটিফিকেশন পাঠানো হবে।",
// //         confirmButtonText: "ঠিক আছে",
// //         background: "hsl(var(--card))",
// //         color: "hsl(var(--foreground))",
// //         confirmButtonColor: "#0f172a",
// //       })
// //     } catch {
// //       Swal.close()
// //       setError("সার্ভার এরর। আবার চেষ্টা করুন।")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const getStatusBadge = (status: TNidWithdrawStatus) => {
// //     switch (status) {
// //       case "pending":    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
// //       case "admin_seen": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
// //       case "accepted":   return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
// //       case "cancelled":  return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
// //       case "pdf_sent":   return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
// //     }
// //   }

// //   const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
// //     pending:    "Pending",
// //     admin_seen: "দেখা হয়েছে",
// //     accepted:   "গৃহীত",
// //     cancelled:  "বাতিল",
// //     pdf_sent:   "PDF পাঠানো হয়েছে",
// //   }

// //   return (
// //     <div className="mx-auto max-w-3xl space-y-5 px-3 py-4 text-foreground sm:px-0 sm:py-0">

// //       {/* ── Header ──────────────────────────────────────────── */}
// //       <div className="flex items-center justify-between gap-3">
// //         <h1 className="text-xl font-bold text-foreground sm:text-2xl">
// //           NID কার্ড উত্তোলন
// //         </h1>
// //         {!isAdmin && (
// //           <Badge variant="outline" className="shrink-0 gap-1.5 px-3 py-1.5 text-sm">
// //             <Wallet className="size-4" />
// //             ৳{balance}
// //           </Badge>
// //         )}
// //       </div>

// //       {/* ── Notice ──────────────────────────────────────────── */}
// //       <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
// //         <div className="flex items-start gap-2.5">
// //           <Info className="mt-0.5 size-4 shrink-0 text-blue-500 dark:text-blue-400" />
// //           <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">
// //             NID কার্ড উত্তোলনের জন্য NID নম্বর অথবা জন্ম নিবন্ধন নম্বর দিয়ে আবেদন করুন।
// //             Admin প্রক্রিয়া করার পর আপনাকে PDF পাঠানো হবে।
// //           </p>
// //         </div>
// //       </div>

// //       {/* ── Form Card ───────────────────────────────────────── */}
// //       <Card className="border-border bg-card">
// //         <CardHeader className="pb-3">
// //           <CardTitle className="text-base text-foreground">আবেদন ফর্ম</CardTitle>
// //         </CardHeader>
// //         <CardContent className="space-y-4">

// //           {/* NID or Birth Cert */}
// //           <div className="space-y-1.5">
// //             <Label className="text-foreground">
// //               NID নম্বর অথবা জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span>
// //             </Label>
// //             <Input
// //               placeholder="NID নম্বর বা জন্ম নিবন্ধন নম্বর"
// //               value={nidOrBirthCert}
// //               onChange={(e) => setNidOrBirthCert(e.target.value)}
// //               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
// //             />
// //           </div>

// //           {/* Name */}
// //           <div className="space-y-1.5">
// //             <Label className="text-foreground">
// //               নাম <span className="text-red-500">*</span>
// //             </Label>
// //             <Input
// //               placeholder="আবেদনকারীর নাম"
// //               value={name}
// //               onChange={(e) => setName(e.target.value)}
// //               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
// //             />
// //           </div>

// //           {/* Date of Birth */}
// //           <div className="space-y-1.5">
// //             <Label className="text-foreground">
// //               জন্ম তারিখ <span className="text-red-500">*</span>
// //             </Label>
// //             <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
// //               <PopoverTrigger asChild>
// //                 <Button
// //                   variant="outline"
// //                   className="w-full justify-start gap-2 border-border bg-background font-normal text-foreground hover:bg-background"
// //                 >
// //                   <CalendarIcon className="size-4 text-muted-foreground" />
// //                   {dob ? (
// //                     <span>{format(dobDate!, "dd MMM yyyy")}</span>
// //                   ) : (
// //                     <span className="text-muted-foreground">তারিখ নির্বাচন করুন</span>
// //                   )}
// //                 </Button>
// //               </PopoverTrigger>
// //               <PopoverContent className="w-auto p-0" align="start">
// //                 <Calendar
// //                   mode="single"
// //                   selected={dobDate}
// //                   onSelect={handleDateSelect}
// //                   defaultMonth={dobDate}
// //                   captionLayout="dropdown"
// //                   fromYear={1940}
// //                   toYear={new Date().getFullYear()}
// //                   className="bg-card"
// //                 />
// //               </PopoverContent>
// //             </Popover>
// //           </div>

// //           {/* Error */}
// //           {error && (
// //             <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
// //               <AlertCircle className="size-4 shrink-0" />
// //               {error}
// //             </div>
// //           )}

// //           {/* Charge info */}
// //           {!isAdmin && (
// //             <p className="rounded-lg border border-border bg-muted/40 py-2.5 text-center text-sm text-muted-foreground">
// //               এই সেবার জন্য <span className="font-semibold text-primary">৳৫০</span> চার্জ কাটবে
// //             </p>
// //           )}

// //           {/* Loading */}
// //           {loading && (
// //             <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 py-5">
// //               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
// //               <p className="text-center text-sm text-muted-foreground">আবেদন জমা হচ্ছে...</p>
// //             </div>
// //           )}

// //           {/* Submit */}
// //           <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading}>
// //             <FileText className="size-4" />
// //             {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
// //           </Button>
// //         </CardContent>
// //       </Card>

// //       {/* ── My Requests ─────────────────────────────────────── */}
// //       <Card className="border-border bg-card">
// //         <CardHeader className="pb-3">
// //           <CardTitle className="text-base text-foreground">আমার আবেদন সমূহ</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           {listLoading ? (
// //             <div className="flex justify-center py-8">
// //               <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
// //             </div>
// //           ) : requests.length === 0 ? (
// //             <p className="py-8 text-center text-sm text-muted-foreground">কোনো আবেদন নেই</p>
// //           ) : (
// //             <div className="space-y-4">
// //               {requests.map((r) => (
// //                 <div
// //                   key={r._id}
// //                   className="rounded-xl border border-border bg-muted/20 px-4 py-3 space-y-2"
// //                 >
// //                   <div className="flex items-start justify-between gap-2">
// //                     <div>
// //                       <p className="text-sm font-semibold text-foreground">{r.name}</p>
// //                       <p className="text-xs text-muted-foreground">{r.nidOrBirthCert}</p>
// //                       <p className="text-xs text-muted-foreground">জন্ম: {r.dob}</p>
// //                     </div>
// //                     <div className="text-right shrink-0">
// //                       <span
// //                         className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}
// //                       >
// //                         {STATUS_LABEL[r.status]}
// //                       </span>
// //                       <p className="mt-1 text-[10px] text-muted-foreground">
// //                         {new Date(r.createdAt).toLocaleString("en-GB", {
// //                           day: "2-digit",
// //                           month: "short",
// //                           hour: "2-digit",
// //                           minute: "2-digit",
// //                         })}
// //                       </p>
// //                     </div>
// //                   </div>

// //                   {/* Progress tracker */}
// //                   <ProgressTracker status={r.status} />

// //                   {/* Cancel note */}
// //                   {r.status === "cancelled" && r.cancelNote && (
// //                     <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
// //                       <strong>বাতিলের কারণ:</strong> {r.cancelNote}
// //                     </p>
// //                   )}

// //                   {/* PDF download */}
// //                   {r.status === "pdf_sent" && r.pdfUrl && (
// //                     <a
// //                       href={r.pdfUrl}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                       className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
// //                     >
// //                       <Download className="size-3.5" />
// //                       PDF ডাউনলোড করুন
// //                     </a>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>

// //       {/* ── Footer ──────────────────────────────────────────── */}
// //       <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
// //         <MessageCircle className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
// //         <p>
// //           সার্ভিস জনিত কোন সমস্যা হলে আমাদের{" "}
// //           <a
// //             href="https://wa.me/8801973346401?text=Hello%20"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
// //           >
// //             WhatsApp
// //           </a>{" "}
// //           এ যোগাযোগ করুন।
// //         </p>
// //       </div>
// //     </div>
// //   )
// // }





// "use client"

// import { useState, useEffect } from "react"
// import { auth } from "@/lib/firebase"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import {
//   AlertCircle,
//   Wallet,
//   CalendarIcon,
//   FileText,
//   Download,
//   MessageCircle,
//   Info,
//   Trash2,
// } from "lucide-react"
// import { useUser } from "@/hooks/useUser"
// import { format } from "date-fns"
// import Swal from "sweetalert2"
// import {
//   createNidWithdrawRequest,
//   getMyNidWithdrawRequests,
//   deleteNidWithdrawRequest,
// } from "@/lib/api.nidWithdraw"

// // ── Progress step config ──────────────────────────────────────────
// const STEPS = [
//   { key: "pending",    label: "আবেদন জমা" },
//   { key: "admin_seen", label: "Admin দেখেছেন" },
//   { key: "accepted",  label: "গৃহীত হয়েছে" },
//   { key: "cancelled", label: "বাতিল হয়েছে" },
//   { key: "pdf_sent",  label: "PDF পাঠানো হয়েছে" },
// ]

// const STATUS_ORDER: Record<string, number> = {
//   pending: 0,
//   admin_seen: 1,
//   accepted: 2,
//   pdf_sent: 3,
//   cancelled: -1,
// }

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
// }

// // ── Progress Tracker Component ────────────────────────────────────
// function ProgressTracker({ status }: { status: TNidWithdrawStatus }) {
//   const isCancelled = status === "cancelled"
//   const currentOrder = STATUS_ORDER[status]

//   const normalSteps = STEPS.filter((s) => s.key !== "cancelled")

//   if (isCancelled) {
//     return (
//       <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//         ✕ আবেদন বাতিল হয়েছে
//       </div>
//     )
//   }

//   return (
//     <div className="mt-3 flex items-center gap-0">
//       {normalSteps.map((step, idx) => {
//         const stepOrder = STATUS_ORDER[step.key]
//         const isDone = currentOrder >= stepOrder
//         const isActive = currentOrder === stepOrder

//         return (
//           <div key={step.key} className="flex items-center">
//             <div className="flex flex-col items-center">
//               <div
//                 className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all
//                   ${isDone
//                     ? "border-emerald-500 bg-emerald-500 text-white"
//                     : "border-border bg-muted text-muted-foreground"
//                   }
//                   ${isActive ? "ring-2 ring-emerald-300 ring-offset-1" : ""}
//                 `}
//               >
//                 {isDone ? "✓" : idx + 1}
//               </div>
//               <span
//                 className={`mt-1 max-w-[60px] text-center text-[9px] leading-tight
//                   ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}
//                 `}
//               >
//                 {step.label}
//               </span>
//             </div>
//             {idx < normalSteps.length - 1 && (
//               <div
//                 className={`mb-4 h-[2px] w-6 shrink-0 ${
//                   currentOrder > stepOrder ? "bg-emerald-500" : "bg-border"
//                 }`}
//               />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// // ── Main Page ─────────────────────────────────────────────────────
// export default function NidWithdrawPage() {
//   const { user, refreshWallet } = useUser()

//   const [nidOrBirthCert, setNidOrBirthCert] = useState("")
//   const [name, setName] = useState("")
//   const [dob, setDob] = useState("")
//   const [dobDate, setDobDate] = useState<Date | undefined>(undefined)
//   const [calendarOpen, setCalendarOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [requests, setRequests] = useState<TRequest[]>([])
//   const [listLoading, setListLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   const isAdmin = user?.role === "admin" || user?.role === "super_admin"
//   const balance = user?.wallet?.balance ?? 0

//   const handleDateSelect = (date: Date | undefined) => {
//     if (date) {
//       setDobDate(date)
//       setDob(format(date, "yyyy-MM-dd"))
//       setCalendarOpen(false)
//     }
//   }

//   const fetchMyRequests = async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await getMyNidWithdrawRequests(token)
//       if (res.success) setRequests(res.data)
//     } catch {
//       // silent
//     } finally {
//       setListLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchMyRequests()
//   }, [])

//   const handleSubmit = async () => {
//     setError("")

//     if (!nidOrBirthCert.trim()) { setError("NID বা জন্ম নিবন্ধন নম্বর দিন"); return }
//     if (!name.trim()) { setError("নাম দিন"); return }
//     if (!dob) { setError("জন্ম তারিখ দিন"); return }
//     if (!isAdmin && balance < 50) { setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"); return }

//     setLoading(true)
//     Swal.fire({
//       title: "আবেদন জমা হচ্ছে...",
//       html: "অনুগ্রহ করে অপেক্ষা করুন",
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//       background: "hsl(var(--card))",
//       color: "hsl(var(--foreground))",
//     })

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) throw new Error("Token not found")

//       const res = await createNidWithdrawRequest(token, {
//         nidOrBirthCert: nidOrBirthCert.trim(),
//         name: name.trim(),
//         dob,
//       })

//       Swal.close()

//       if (!res.success) {
//         if (res.code === "INSUFFICIENT_BALANCE") {
//           setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।")
//         } else {
//           setError(res.message || "সমস্যা হয়েছে")
//         }
//         return
//       }

//       await refreshWallet()
//       await fetchMyRequests()

//       setNidOrBirthCert("")
//       setName("")
//       setDob("")
//       setDobDate(undefined)

//       Swal.fire({
//         icon: "success",
//         title: "আবেদন সফল হয়েছে",
//         text: "Admin process করলে আপনাকে নোটিফিকেশন পাঠানো হবে।",
//         confirmButtonText: "ঠিক আছে",
//         background: "hsl(var(--card))",
//         color: "hsl(var(--foreground))",
//         confirmButtonColor: "#0f172a",
//       })
//     } catch {
//       Swal.close()
//       setError("সার্ভার এরর। আবার চেষ্টা করুন।")
//     } finally {
//       setLoading(false)
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
//       background: "hsl(var(--card))",
//       color: "hsl(var(--foreground))",
//     })
//     if (!confirm.isConfirmed) return

//     setDeletingId(id)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await deleteNidWithdrawRequest(token, id)
//       if (res.success) {
//         await fetchMyRequests()
//         Swal.fire({
//           icon: "success",
//           title: "মুছে ফেলা হয়েছে",
//           timer: 1500,
//           showConfirmButton: false,
//           background: "hsl(var(--card))",
//           color: "hsl(var(--foreground))",
//         })
//       } else {
//         Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//       }
//     } catch {
//       Swal.fire({ icon: "error", title: "সার্ভার এরর" })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   const getStatusBadge = (status: TNidWithdrawStatus) => {
//     switch (status) {
//       case "pending":    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
//       case "admin_seen": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
//       case "accepted":   return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
//       case "cancelled":  return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
//       case "pdf_sent":   return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
//     }
//   }

//   const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
//     pending:    "Pending",
//     admin_seen: "দেখা হয়েছে",
//     accepted:   "গৃহীত",
//     cancelled:  "বাতিল",
//     pdf_sent:   "PDF পাঠানো হয়েছে",
//   }

//   return (
//     <div className="mx-auto max-w-3xl space-y-5 px-3 py-4 text-foreground sm:px-0 sm:py-0">

//       {/* ── Header ──────────────────────────────────────────── */}
//       <div className="flex items-center justify-between gap-3">
//         <h1 className="text-xl font-bold text-foreground sm:text-2xl">
//           NID কার্ড উত্তোলন
//         </h1>
//         {!isAdmin && (
//           <Badge variant="outline" className="shrink-0 gap-1.5 px-3 py-1.5 text-sm">
//             <Wallet className="size-4" />
//             ৳{balance}
//           </Badge>
//         )}
//       </div>

//       {/* ── Notice ──────────────────────────────────────────── */}
//       <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
//         <div className="flex items-start gap-2.5">
//           <Info className="mt-0.5 size-4 shrink-0 text-blue-500 dark:text-blue-400" />
//           <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">
//             NID কার্ড উত্তোলনের জন্য NID নম্বর অথবা জন্ম নিবন্ধন নম্বর দিয়ে আবেদন করুন।
//             Admin প্রক্রিয়া করার পর আপনাকে PDF পাঠানো হবে।
//           </p>
//         </div>
//       </div>

//       {/* ── Form Card ───────────────────────────────────────── */}
//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base text-foreground">আবেদন ফর্ম</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">

//           {/* NID or Birth Cert */}
//           <div className="space-y-1.5">
//             <Label className="text-foreground">
//               NID নম্বর অথবা জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               placeholder="NID নম্বর বা জন্ম নিবন্ধন নম্বর"
//               value={nidOrBirthCert}
//               onChange={(e) => setNidOrBirthCert(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>

//           {/* Name */}
//           <div className="space-y-1.5">
//             <Label className="text-foreground">
//               নাম <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               placeholder="আবেদনকারীর নাম"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>

//           {/* Date of Birth */}
//           <div className="space-y-1.5">
//             <Label className="text-foreground">
//               জন্ম তারিখ <span className="text-red-500">*</span>
//             </Label>
//             <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2 border-border bg-background font-normal text-foreground hover:bg-background"
//                 >
//                   <CalendarIcon className="size-4 text-muted-foreground" />
//                   {dob ? (
//                     <span>{format(dobDate!, "dd MMM yyyy")}</span>
//                   ) : (
//                     <span className="text-muted-foreground">তারিখ নির্বাচন করুন</span>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={dobDate}
//                   onSelect={handleDateSelect}
//                   defaultMonth={dobDate}
//                   captionLayout="dropdown"
//                   fromYear={1940}
//                   toYear={new Date().getFullYear()}
//                   className="bg-card"
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//               <AlertCircle className="size-4 shrink-0" />
//               {error}
//             </div>
//           )}

//           {/* Charge info */}
//           {!isAdmin && (
//             <p className="rounded-lg border border-border bg-muted/40 py-2.5 text-center text-sm text-muted-foreground">
//               এই সেবার জন্য <span className="font-semibold text-primary">৳৫০</span> চার্জ কাটবে
//             </p>
//           )}

//           {/* Loading */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 py-5">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//               <p className="text-center text-sm text-muted-foreground">আবেদন জমা হচ্ছে...</p>
//             </div>
//           )}

//           {/* Submit */}
//           <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading}>
//             <FileText className="size-4" />
//             {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* ── My Requests ─────────────────────────────────────── */}
//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base text-foreground">আমার আবেদন সমূহ</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {listLoading ? (
//             <div className="flex justify-center py-8">
//               <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//             </div>
//           ) : requests.length === 0 ? (
//             <p className="py-8 text-center text-sm text-muted-foreground">কোনো আবেদন নেই</p>
//           ) : (
//             <div className="space-y-4">
//               {requests.map((r) => (
//                 <div
//                   key={r._id}
//                   className="rounded-xl border border-border bg-muted/20 px-4 py-3 space-y-2"
//                 >
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <p className="text-sm font-semibold text-foreground">{r.name}</p>
//                       <p className="text-xs text-muted-foreground">{r.nidOrBirthCert}</p>
//                       <p className="text-xs text-muted-foreground">জন্ম: {r.dob}</p>
//                     </div>
//                     <div className="flex flex-col items-end gap-1.5 shrink-0">
//                       <span
//                         className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}
//                       >
//                         {STATUS_LABEL[r.status]}
//                       </span>
//                       <p className="text-[10px] text-muted-foreground">
//                         {new Date(r.createdAt).toLocaleString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                       {/* Delete button */}
//                       <button
//                         disabled={deletingId === r._id}
//                         onClick={() => handleDelete(r._id)}
//                         className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
//                       >
//                         <Trash2 size={10} />
//                         {deletingId === r._id ? "..." : "মুছুন"}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Progress tracker */}
//                   <ProgressTracker status={r.status} />

//                   {/* Cancel note */}
//                   {r.status === "cancelled" && r.cancelNote && (
//                     <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//                       <strong>বাতিলের কারণ:</strong> {r.cancelNote}
//                     </p>
//                   )}

//                   {/* PDF download */}
//                   {r.status === "pdf_sent" && r.pdfUrl && (
//                     <a
//                       href={r.pdfUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
//                     >
//                       <Download className="size-3.5" />
//                       PDF ডাউনলোড করুন
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ── Footer ──────────────────────────────────────────── */}
//       <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
//         <MessageCircle className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
//         <p>
//           সার্ভিস জনিত কোন সমস্যা হলে আমাদের{" "}
//           <a
//             href="https://wa.me/8801973346401?text=Hello%20"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
//           >
//             WhatsApp
//           </a>{" "}
//           এ যোগাযোগ করুন।
//         </p>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { auth } from "@/lib/firebase"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import {
//   AlertCircle,
//   Wallet,
//   CalendarIcon,
//   FileText,
//   Download,
//   MessageCircle,
//   Info,
//   Trash2,
// } from "lucide-react"
// import { useUser } from "@/hooks/useUser"
// import { format } from "date-fns"
// import Swal from "sweetalert2"
// import {
//   createNidWithdrawRequest,
//   getMyNidWithdrawRequests,
//   deleteNidWithdrawRequest,
// } from "@/lib/api.nidWithdraw"

// // ── Progress step config ──────────────────────────────────────────
// const STEPS = [
//   { key: "pending",    label: "আবেদন জমা" },
//   { key: "admin_seen", label: "Admin দেখেছেন" },
//   { key: "accepted",  label: "গৃহীত হয়েছে" },
//   { key: "cancelled", label: "বাতিল হয়েছে" },
//   { key: "pdf_sent",  label: "PDF পাঠানো হয়েছে" },
// ]

// const STATUS_ORDER: Record<string, number> = {
//   pending: 0,
//   admin_seen: 1,
//   accepted: 2,
//   pdf_sent: 3,
//   cancelled: -1,
// }

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
// }

// // ── Progress Tracker Component ────────────────────────────────────
// function ProgressTracker({ status }: { status: TNidWithdrawStatus }) {
//   const isCancelled = status === "cancelled"
//   const currentOrder = STATUS_ORDER[status]
//   const normalSteps = STEPS.filter((s) => s.key !== "cancelled")

//   if (isCancelled) {
//     return (
//       <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//         ✕ আবেদন বাতিল হয়েছে
//       </div>
//     )
//   }

//   return (
//     <div className="mt-3 flex items-center gap-0">
//       {normalSteps.map((step, idx) => {
//         const stepOrder = STATUS_ORDER[step.key]
//         const isDone = currentOrder >= stepOrder
//         const isActive = currentOrder === stepOrder

//         return (
//           <div key={step.key} className="flex items-center">
//             <div className="flex flex-col items-center">
//               <div
//                 className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all
//                   ${isDone
//                     ? "border-emerald-500 bg-emerald-500 text-white"
//                     : "border-border bg-muted text-muted-foreground"
//                   }
//                   ${isActive ? "ring-2 ring-emerald-300 ring-offset-1" : ""}
//                 `}
//               >
//                 {isDone ? "✓" : idx + 1}
//               </div>
//               <span
//                 className={`mt-1 max-w-[60px] text-center text-[9px] leading-tight
//                   ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}
//                 `}
//               >
//                 {step.label}
//               </span>
//             </div>
//             {idx < normalSteps.length - 1 && (
//               <div
//                 className={`mb-4 h-[2px] w-6 shrink-0 ${
//                   currentOrder > stepOrder ? "bg-emerald-500" : "bg-border"
//                 }`}
//               />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// // ── Main Page ─────────────────────────────────────────────────────
// export default function NidWithdrawPage() {
//   const { user, refreshWallet } = useUser()

//   const [nidOrBirthCert, setNidOrBirthCert] = useState("")
//   const [name, setName] = useState("")
//   const [dob, setDob] = useState("")
//   const [dobDate, setDobDate] = useState<Date | undefined>(undefined)
//   const [calendarOpen, setCalendarOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [requests, setRequests] = useState<TRequest[]>([])
//   const [listLoading, setListLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   const isAdmin = user?.role === "admin" || user?.role === "super_admin"
//   const balance = user?.wallet?.balance ?? 0

//   const handleDateSelect = (date: Date | undefined) => {
//     if (date) {
//       setDobDate(date)
//       setDob(format(date, "yyyy-MM-dd"))
//       setCalendarOpen(false)
//     }
//   }

//   const fetchMyRequests = async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await getMyNidWithdrawRequests(token)
//       if (res.success) setRequests(res.data)
//     } catch {
//       // silent
//     } finally {
//       setListLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchMyRequests()
//   }, [])

//   const handleSubmit = async () => {
//     setError("")

//     if (!nidOrBirthCert.trim()) { setError("NID বা জন্ম নিবন্ধন নম্বর দিন"); return }
//     if (!name.trim()) { setError("নাম দিন"); return }
//     if (!dob) { setError("জন্ম তারিখ দিন"); return }
//     if (!isAdmin && balance < 50) { setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"); return }

//     setLoading(true)
//     Swal.fire({
//       title: "আবেদন জমা হচ্ছে...",
//       html: "অনুগ্রহ করে অপেক্ষা করুন",
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//       background: "hsl(var(--card))",
//       color: "hsl(var(--foreground))",
//     })

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) throw new Error("Token not found")

//       const res = await createNidWithdrawRequest(token, {
//         nidOrBirthCert: nidOrBirthCert.trim(),
//         name: name.trim(),
//         dob,
//       })

//       Swal.close()

//       if (!res.success) {
//         if (res.code === "INSUFFICIENT_BALANCE") {
//           setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।")
//         } else {
//           setError(res.message || "সমস্যা হয়েছে")
//         }
//         return
//       }

//       await refreshWallet()
//       await fetchMyRequests()

//       setNidOrBirthCert("")
//       setName("")
//       setDob("")
//       setDobDate(undefined)

//       Swal.fire({
//         icon: "success",
//         title: "আবেদন সফল হয়েছে",
//         text: "Admin process করলে আপনাকে নোটিফিকেশন পাঠানো হবে।",
//         confirmButtonText: "ঠিক আছে",
//         background: "hsl(var(--card))",
//         color: "hsl(var(--foreground))",
//         confirmButtonColor: "#0f172a",
//       })
//     } catch {
//       Swal.close()
//       setError("সার্ভার এরর। আবার চেষ্টা করুন।")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const confirm = await Swal.fire({
//       title: "আবেদন মুছবেন?",
//       text: "এই আবেদনটি আপনার ইতিহাস থেকে স্থায়ীভাবে মুছে যাবে।",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, মুছুন",
//       cancelButtonText: "না",
//       confirmButtonColor: "#ef4444",
//       background: "hsl(var(--card))",
//       color: "hsl(var(--foreground))",
//     })
//     if (!confirm.isConfirmed) return

//     setDeletingId(id)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await deleteNidWithdrawRequest(token, id)
//       if (res.success) {
//         await fetchMyRequests()
//         Swal.fire({
//           icon: "success",
//           title: "মুছে ফেলা হয়েছে",
//           timer: 1500,
//           showConfirmButton: false,
//           background: "hsl(var(--card))",
//           color: "hsl(var(--foreground))",
//         })
//       } else {
//         Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//       }
//     } catch {
//       Swal.fire({ icon: "error", title: "সার্ভার এরর" })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   const getStatusBadge = (status: TNidWithdrawStatus) => {
//     switch (status) {
//       case "pending":    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
//       case "admin_seen": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
//       case "accepted":   return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
//       case "cancelled":  return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
//       case "pdf_sent":   return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
//     }
//   }

//   const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
//     pending:    "Pending",
//     admin_seen: "দেখা হয়েছে",
//     accepted:   "গৃহীত",
//     cancelled:  "বাতিল",
//     pdf_sent:   "PDF পাঠানো হয়েছে",
//   }

//   return (
//     <div className="mx-auto max-w-3xl space-y-5 px-3 py-4 text-foreground sm:px-0 sm:py-0">

//       {/* ── Header ──────────────────────────────────────────── */}
//       <div className="flex items-center justify-between gap-3">
//         <h1 className="text-xl font-bold text-foreground sm:text-2xl">
//           NID কার্ড উত্তোলন
//         </h1>
//         {!isAdmin && (
//           <Badge variant="outline" className="shrink-0 gap-1.5 px-3 py-1.5 text-sm">
//             <Wallet className="size-4" />
//             ৳{balance}
//           </Badge>
//         )}
//       </div>

//       {/* ── Notice ──────────────────────────────────────────── */}
//       <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
//         <div className="flex items-start gap-2.5">
//           <Info className="mt-0.5 size-4 shrink-0 text-blue-500 dark:text-blue-400" />
//           <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">
//             NID কার্ড উত্তোলনের জন্য NID নম্বর অথবা জন্ম নিবন্ধন নম্বর দিয়ে আবেদন করুন।
//             Admin প্রক্রিয়া করার পর আপনাকে PDF পাঠানো হবে।
//           </p>
//         </div>
//       </div>

//       {/* ── Form Card ───────────────────────────────────────── */}
//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base text-foreground">আবেদন ফর্ম</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">

//           <div className="space-y-1.5">
//             <Label className="text-foreground">
//               NID নম্বর অথবা জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               placeholder="NID নম্বর বা জন্ম নিবন্ধন নম্বর"
//               value={nidOrBirthCert}
//               onChange={(e) => setNidOrBirthCert(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <Label className="text-foreground">
//               নাম <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               placeholder="আবেদনকারীর নাম"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <Label className="text-foreground">
//               জন্ম তারিখ <span className="text-red-500">*</span>
//             </Label>
//             <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start gap-2 border-border bg-background font-normal text-foreground hover:bg-background"
//                 >
//                   <CalendarIcon className="size-4 text-muted-foreground" />
//                   {dob ? (
//                     <span>{format(dobDate!, "dd MMM yyyy")}</span>
//                   ) : (
//                     <span className="text-muted-foreground">তারিখ নির্বাচন করুন</span>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={dobDate}
//                   onSelect={handleDateSelect}
//                   defaultMonth={dobDate}
//                   captionLayout="dropdown"
//                   fromYear={1940}
//                   toYear={new Date().getFullYear()}
//                   className="bg-card"
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           {error && (
//             <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//               <AlertCircle className="size-4 shrink-0" />
//               {error}
//             </div>
//           )}

//           {!isAdmin && (
//             <p className="rounded-lg border border-border bg-muted/40 py-2.5 text-center text-sm text-muted-foreground">
//               এই সেবার জন্য <span className="font-semibold text-primary">৳৫০</span> চার্জ কাটবে
//             </p>
//           )}

//           {loading && (
//             <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 py-5">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//               <p className="text-center text-sm text-muted-foreground">আবেদন জমা হচ্ছে...</p>
//             </div>
//           )}

//           <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading}>
//             <FileText className="size-4" />
//             {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* ── My Requests ─────────────────────────────────────── */}
//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-base text-foreground">আমার আবেদন সমূহ</CardTitle>
//             {requests.length > 0 && (
//               <span className="text-[11px] text-muted-foreground">
//                 সর্বশেষ {requests.length}টি দেখানো হচ্ছে
//               </span>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           {listLoading ? (
//             <div className="flex justify-center py-8">
//               <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//             </div>
//           ) : requests.length === 0 ? (
//             <p className="py-8 text-center text-sm text-muted-foreground">কোনো আবেদন নেই</p>
//           ) : (
//             <div className="space-y-4">
//               {requests.map((r) => (
//                 <div
//                   key={r._id}
//                   className="rounded-xl border border-border bg-muted/20 px-4 py-3 space-y-2"
//                 >
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <p className="text-sm font-semibold text-foreground">{r.name}</p>
//                       <p className="text-xs text-muted-foreground">{r.nidOrBirthCert}</p>
//                       <p className="text-xs text-muted-foreground">জন্ম: {r.dob}</p>
//                     </div>
//                     <div className="flex flex-col items-end gap-1.5 shrink-0">
//                       <span
//                         className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}
//                       >
//                         {STATUS_LABEL[r.status]}
//                       </span>
//                       <p className="text-[10px] text-muted-foreground">
//                         {new Date(r.createdAt).toLocaleString("en-GB", {
//                           day: "2-digit",
//                           month: "short",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                       <button
//                         disabled={deletingId === r._id}
//                         onClick={() => handleDelete(r._id)}
//                         className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
//                       >
//                         <Trash2 size={10} />
//                         {deletingId === r._id ? "..." : "মুছুন"}
//                       </button>
//                     </div>
//                   </div>

//                   <ProgressTracker status={r.status} />

//                   {r.status === "cancelled" && r.cancelNote && (
//                     <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//                       <strong>বাতিলের কারণ:</strong> {r.cancelNote}
//                     </p>
//                   )}

//                   {r.status === "pdf_sent" && r.pdfUrl && (
//                     <a
//                       href={r.pdfUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
//                     >
//                       <Download className="size-3.5" />
//                       PDF ডাউনলোড করুন
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ── Footer ──────────────────────────────────────────── */}
//       <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
//         <MessageCircle className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
//         <p>
//           সার্ভিস জনিত কোন সমস্যা হলে আমাদের{" "}
//           <a
//             href="https://wa.me/8801973346401?text=Hello%20"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
//           >
//             WhatsApp
//           </a>{" "}
//           এ যোগাযোগ করুন।
//         </p>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import { auth } from "@/lib/firebase"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import {
//   AlertCircle, Wallet, CalendarIcon, FileText,
//   Download, MessageCircle, Info, Trash2,
// } from "lucide-react"
// import { useUser } from "@/hooks/useUser"

// import { format } from "date-fns"
// import Swal from "sweetalert2"
// import {
//   createNidWithdrawRequest,
//   getMyNidWithdrawRequests,
//   deleteNidWithdrawRequest,
// } from "@/lib/api.nidWithdraw"
// import { useNotifications } from "@/hooks/useNotifications"

// const STEPS = [
//   { key: "pending",    label: "আবেদন জমা" },
//   { key: "admin_seen", label: "Admin দেখেছেন" },
//   { key: "accepted",   label: "গৃহীত হয়েছে" },
//   { key: "pdf_sent",   label: "PDF পাঠানো হয়েছে" },
// ]

// const STATUS_ORDER: Record<string, number> = {
//   pending: 0, admin_seen: 1, accepted: 2, pdf_sent: 3, cancelled: -1,
// }

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
// }

// const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
//   pending: "Pending", admin_seen: "দেখা হয়েছে", accepted: "গৃহীত",
//   cancelled: "বাতিল", pdf_sent: "PDF পাঠানো হয়েছে",
// }

// function playStatusSound() {
//   try {
//     const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
//     if (!AudioCtx) return
//     const ctx = new AudioCtx()
//     const duration = 3
//     const interval = 0.8
//     const endTime = ctx.currentTime + duration

//     let t = ctx.currentTime
//     while (t < endTime) {
//       const osc = ctx.createOscillator()
//       const gain = ctx.createGain()
//       osc.connect(gain)
//       gain.connect(ctx.destination)
//       osc.type = "triangle"
//       osc.frequency.setValueAtTime(880, t)
//       osc.frequency.exponentialRampToValueAtTime(640, t + 0.16)
//       gain.gain.setValueAtTime(0.0001, t)
//       gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02)
//       gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
//       osc.start(t)
//       osc.stop(t + 0.24)
//       t += interval
//     }
//   } catch {}
// }

// function ProgressTracker({ status }: { status: TNidWithdrawStatus }) {
//   const isCancelled = status === "cancelled"
//   const currentOrder = STATUS_ORDER[status]

//   if (isCancelled) {
//     return (
//       <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//         ✕ আবেদন বাতিল হয়েছে
//       </div>
//     )
//   }

//   return (
//     <div className="mt-3 flex items-center gap-0">
//       {STEPS.map((step, idx) => {
//         const stepOrder = STATUS_ORDER[step.key]
//         const isDone = currentOrder >= stepOrder
//         const isActive = currentOrder === stepOrder
//         return (
//           <div key={step.key} className="flex items-center">
//             <div className="flex flex-col items-center">
//               <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all
//                 ${isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-muted text-muted-foreground"}
//                 ${isActive ? "ring-2 ring-emerald-300 ring-offset-1" : ""}`}>
//                 {isDone ? "✓" : idx + 1}
//               </div>
//               <span className={`mt-1 max-w-[60px] text-center text-[9px] leading-tight
//                 ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
//                 {step.label}
//               </span>
//             </div>
//             {idx < STEPS.length - 1 && (
//               <div className={`mb-4 h-[2px] w-6 shrink-0 ${currentOrder > stepOrder ? "bg-emerald-500" : "bg-border"}`} />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// function getStatusBadge(status: TNidWithdrawStatus) {
//   switch (status) {
//     case "pending":    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
//     case "admin_seen": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
//     case "accepted":   return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
//     case "cancelled":  return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
//     case "pdf_sent":   return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
//   }
// }

// export default function NidWithdrawPage() {
//   const { user, refreshWallet } = useUser()
//   const { notifications } = useNotifications()

//   const [nidOrBirthCert, setNidOrBirthCert] = useState("")
//   const [name, setName] = useState("")
//   const [dob, setDob] = useState("")
//   const [dobDate, setDobDate] = useState<Date | undefined>(undefined)
//   const [calendarOpen, setCalendarOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [requests, setRequests] = useState<TRequest[]>([])
//   const [listLoading, setListLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   const seenUpdateIds = useRef<Set<string>>(new Set())
//   const isAdmin = user?.role === "admin" || user?.role === "super_admin"
//   const balance = user?.wallet?.balance ?? 0

//   const fetchMyRequests = useCallback(async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await getMyNidWithdrawRequests(token)
//       if (res.success) setRequests(res.data)
//     } catch {
//     } finally {
//       setListLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchMyRequests()
//   }, [fetchMyRequests])

//   // ── Live socket update ────────────────────────────────────────
//   useEffect(() => {
//     const latest = notifications.find((n) => n.type === "nid_withdraw_status_update")
//     if (!latest) return
//     if (seenUpdateIds.current.has(latest._id)) return
//     seenUpdateIds.current.add(latest._id)

//     const data = (latest.data ?? {}) as {
//       requestId?: string
//       status?: TNidWithdrawStatus
//       cancelNote?: string
//       pdfUrl?: string
//     }
//     if (!data.requestId || !data.status) return

//     setRequests((prev) =>
//       prev.map((r) =>
//         r._id === data.requestId
//           ? {
//               ...r,
//               status: data.status!,
//               ...(data.cancelNote ? { cancelNote: data.cancelNote } : {}),
//               ...(data.pdfUrl ? { pdfUrl: data.pdfUrl } : {}),
//             }
//           : r
//       )
//     )

//     playStatusSound()
//   }, [notifications])

//   const handleDateSelect = (date: Date | undefined) => {
//     if (date) {
//       setDobDate(date)
//       setDob(format(date, "yyyy-MM-dd"))
//       setCalendarOpen(false)
//     }
//   }

//   const handleSubmit = async () => {
//     setError("")
//     if (!nidOrBirthCert.trim()) { setError("NID বা জন্ম নিবন্ধন নম্বর দিন"); return }
//     if (!name.trim()) { setError("নাম দিন"); return }
//     if (!dob) { setError("জন্ম তারিখ দিন"); return }
//     if (!isAdmin && balance < 50) { setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"); return }

//     setLoading(true)
//     Swal.fire({
//       title: "আবেদন জমা হচ্ছে...", html: "অনুগ্রহ করে অপেক্ষা করুন",
//       allowOutsideClick: false, didOpen: () => Swal.showLoading(),
//       background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//     })

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) throw new Error("Token not found")

//       const res = await createNidWithdrawRequest(token, {
//         nidOrBirthCert: nidOrBirthCert.trim(), name: name.trim(), dob,
//       })

//       Swal.close()

//       if (!res.success) {
//         setError(res.code === "INSUFFICIENT_BALANCE"
//           ? "পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"
//           : res.message || "সমস্যা হয়েছে")
//         return
//       }

//       await refreshWallet()
//       await fetchMyRequests()
//       setNidOrBirthCert(""); setName(""); setDob(""); setDobDate(undefined)

//       Swal.fire({
//         icon: "success", title: "আবেদন সফল হয়েছে",
//         text: "Admin process করলে আপনাকে নোটিফিকেশন পাঠানো হবে।",
//         confirmButtonText: "ঠিক আছে",
//         background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//         confirmButtonColor: "#0f172a",
//       })
//     } catch {
//       Swal.close()
//       setError("সার্ভার এরর। আবার চেষ্টা করুন।")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const confirm = await Swal.fire({
//       title: "আবেদন মুছবেন?",
//       text: "এই আবেদনটি আপনার ইতিহাস থেকে স্থায়ীভাবে মুছে যাবে।",
//       icon: "warning", showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, মুছুন", cancelButtonText: "না",
//       confirmButtonColor: "#ef4444",
//       background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//     })
//     if (!confirm.isConfirmed) return

//     setDeletingId(id)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await deleteNidWithdrawRequest(token, id)
//       if (res.success) {
//         await fetchMyRequests()
//         Swal.fire({ icon: "success", title: "মুছে ফেলা হয়েছে", timer: 1500, showConfirmButton: false,
//           background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
//       } else {
//         Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//       }
//     } catch {
//       Swal.fire({ icon: "error", title: "সার্ভার এরর" })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   return (
//     <div className="mx-auto max-w-3xl space-y-5 px-3 py-4 text-foreground sm:px-0 sm:py-0">

//       <div className="flex items-center justify-between gap-3">
//         <h1 className="text-xl font-bold text-foreground sm:text-2xl">NID কার্ড উত্তোলন</h1>
//         {!isAdmin && (
//           <Badge variant="outline" className="shrink-0 gap-1.5 px-3 py-1.5 text-sm">
//             <Wallet className="size-4" />৳{balance}
//           </Badge>
//         )}
//       </div>

//       <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
//         <div className="flex items-start gap-2.5">
//           <Info className="mt-0.5 size-4 shrink-0 text-blue-500 dark:text-blue-400" />
//           <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">
//             NID কার্ড উত্তোলনের জন্য NID নম্বর অথবা জন্ম নিবন্ধন নম্বর দিয়ে আবেদন করুন।
//             Admin প্রক্রিয়া করার পর আপনাকে PDF পাঠানো হবে।
//           </p>
//         </div>
//       </div>

//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base text-foreground">আবেদন ফর্ম</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-1.5">
//             <Label className="text-foreground">NID নম্বর অথবা জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span></Label>
//             <Input placeholder="NID নম্বর বা জন্ম নিবন্ধন নম্বর" value={nidOrBirthCert}
//               onChange={(e) => setNidOrBirthCert(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground" />
//           </div>
//           <div className="space-y-1.5">
//             <Label className="text-foreground">নাম <span className="text-red-500">*</span></Label>
//             <Input placeholder="আবেদনকারীর নাম" value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground" />
//           </div>
//           <div className="space-y-1.5">
//             <Label className="text-foreground">জন্ম তারিখ <span className="text-red-500">*</span></Label>
//             <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="w-full justify-start gap-2 border-border bg-background font-normal text-foreground hover:bg-background">
//                   <CalendarIcon className="size-4 text-muted-foreground" />
//                   {dob ? <span>{format(dobDate!, "dd MMM yyyy")}</span>
//                     : <span className="text-muted-foreground">তারিখ নির্বাচন করুন</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar mode="single" selected={dobDate} onSelect={handleDateSelect}
//                   defaultMonth={dobDate} captionLayout="dropdown"
//                   fromYear={1940} toYear={new Date().getFullYear()} className="bg-card" />
//               </PopoverContent>
//             </Popover>
//           </div>

//           {error && (
//             <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//               <AlertCircle className="size-4 shrink-0" />{error}
//             </div>
//           )}

//           {!isAdmin && (
//             <p className="rounded-lg border border-border bg-muted/40 py-2.5 text-center text-sm text-muted-foreground">
//               এই সেবার জন্য <span className="font-semibold text-primary">৳৫০</span> চার্জ কাটবে
//             </p>
//           )}

//           {loading && (
//             <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 py-5">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//               <p className="text-center text-sm text-muted-foreground">আবেদন জমা হচ্ছে...</p>
//             </div>
//           )}

//           <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading}>
//             <FileText className="size-4" />
//             {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
//           </Button>
//         </CardContent>
//       </Card>

//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-base text-foreground">আমার আবেদন সমূহ</CardTitle>
//             {requests.length > 0 && (
//               <span className="text-[11px] text-muted-foreground">সর্বশেষ {requests.length}টি দেখানো হচ্ছে</span>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           {listLoading ? (
//             <div className="flex justify-center py-8">
//               <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//             </div>
//           ) : requests.length === 0 ? (
//             <p className="py-8 text-center text-sm text-muted-foreground">কোনো আবেদন নেই</p>
//           ) : (
//             <div className="space-y-4">
//               {requests.map((r) => (
//                 <div key={r._id} className="rounded-xl border border-border bg-muted/20 px-4 py-3 space-y-2">
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <p className="text-sm font-semibold text-foreground">{r.name}</p>
//                       <p className="text-xs text-muted-foreground">{r.nidOrBirthCert}</p>
//                       <p className="text-xs text-muted-foreground">জন্ম: {r.dob}</p>
//                     </div>
//                     <div className="flex flex-col items-end gap-1.5 shrink-0">
//                       <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}>
//                         {STATUS_LABEL[r.status]}
//                       </span>
//                       <p className="text-[10px] text-muted-foreground">
//                         {new Date(r.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
//                       </p>
//                       <button disabled={deletingId === r._id} onClick={() => handleDelete(r._id)}
//                         className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
//                         <Trash2 size={10} />
//                         {deletingId === r._id ? "..." : "মুছুন"}
//                       </button>
//                     </div>
//                   </div>

//                   <ProgressTracker status={r.status} />

//                   {r.status === "cancelled" && r.cancelNote && (
//                     <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//                       <strong>বাতিলের কারণ:</strong> {r.cancelNote}
//                     </p>
//                   )}

//                   {r.status === "pdf_sent" && r.pdfUrl && (
//                     <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer"
//                       className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20">
//                       <Download className="size-3.5" />PDF ডাউনলোড করুন
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
//         <MessageCircle className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
//         <p>
//           সার্ভিস জনিত কোন সমস্যা হলে আমাদের{" "}
//           <a href="https://wa.me/8801973346401?text=Hello%20" target="_blank" rel="noopener noreferrer"
//             className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
//             WhatsApp
//           </a>{" "}
//           এ যোগাযোগ করুন।
//         </p>
//       </div>
//     </div>
//   )
// }
















// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import { auth } from "@/lib/firebase"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import {
//   AlertCircle, Wallet, CalendarIcon, FileText,
//   Download, MessageCircle, Info, Trash2,
// } from "lucide-react"
// import { useUser } from "@/hooks/useUser"

// import { format } from "date-fns"
// import Swal from "sweetalert2"
// import {
//   createNidWithdrawRequest,
//   getMyNidWithdrawRequests,
//   deleteNidWithdrawRequest,
// } from "@/lib/api.nidWithdraw"
// import { useNotifications } from "@/hooks/useNotifications"

// const STEPS = [
//   { key: "pending", label: "আবেদন জমা" },
//   { key: "admin_seen", label: "Admin দেখেছেন" },
//   { key: "accepted", label: "গৃহীত হয়েছে" },
//   { key: "pdf_sent", label: "PDF পাঠানো হয়েছে" },
// ]

// const STATUS_ORDER: Record<string, number> = {
//   pending: 0, admin_seen: 1, accepted: 2, pdf_sent: 3, cancelled: -1,
// }

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
// }

// const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
//   pending: "Pending", admin_seen: "দেখা হয়েছে", accepted: "গৃহীত",
//   cancelled: "বাতিল", pdf_sent: "PDF পাঠানো হয়েছে",
// }

// function playStatusSound() {
//   try {
//     const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
//     if (!AudioCtx) return
//     const ctx = new AudioCtx()
//     const duration = 3
//     const interval = 0.8
//     const endTime = ctx.currentTime + duration

//     let t = ctx.currentTime
//     while (t < endTime) {
//       const osc = ctx.createOscillator()
//       const gain = ctx.createGain()
//       osc.connect(gain)
//       gain.connect(ctx.destination)
//       osc.type = "triangle"
//       osc.frequency.setValueAtTime(880, t)
//       osc.frequency.exponentialRampToValueAtTime(640, t + 0.16)
//       gain.gain.setValueAtTime(0.0001, t)
//       gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02)
//       gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
//       osc.start(t)
//       osc.stop(t + 0.24)
//       t += interval
//     }
//   } catch {}
// }

// function ProgressTracker({ status }: { status: TNidWithdrawStatus }) {
//   const isCancelled = status === "cancelled"
//   const currentOrder = STATUS_ORDER[status]

//   if (isCancelled) {
//     return (
//       <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//         ✕ আবেদন বাতিল হয়েছে
//       </div>
//     )
//   }

//   return (
//     <div className="mt-3 flex items-center gap-0">
//       {STEPS.map((step, idx) => {
//         const stepOrder = STATUS_ORDER[step.key]
//         const isDone = currentOrder >= stepOrder
//         const isActive = currentOrder === stepOrder
//         return (
//           <div key={step.key} className="flex items-center">
//             <div className="flex flex-col items-center">
//               <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all
//                 ${isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-muted text-muted-foreground"}
//                 ${isActive ? "ring-2 ring-emerald-300 ring-offset-1" : ""}`}>
//                 {isDone ? "✓" : idx + 1}
//               </div>
//               <span className={`mt-1 max-w-[60px] text-center text-[9px] leading-tight
//                 ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
//                 {step.label}
//               </span>
//             </div>
//             {idx < STEPS.length - 1 && (
//               <div className={`mb-4 h-[2px] w-6 shrink-0 ${currentOrder > stepOrder ? "bg-emerald-500" : "bg-border"}`} />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// function getStatusBadge(status: TNidWithdrawStatus) {
//   switch (status) {
//     case "pending": return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
//     case "admin_seen": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
//     case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
//     case "cancelled": return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
//     case "pdf_sent": return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
//   }
// }

// export default function NidWithdrawPage() {
//   const { user, refreshWallet } = useUser()
//   const { notifications } = useNotifications()

//   const [nidOrBirthCert, setNidOrBirthCert] = useState("")
//   const [name, setName] = useState("")
//   const [dob, setDob] = useState("")
//   const [dobDate, setDobDate] = useState<Date | undefined>(undefined)
//   const [calendarOpen, setCalendarOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [requests, setRequests] = useState<TRequest[]>([])
//   const [listLoading, setListLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   const seenUpdateIds = useRef<Set<string>>(new Set())
//   const isAdmin = user?.role === "admin" || user?.role === "super_admin"
//   const balance = user?.wallet?.balance ?? 0

//   const fetchMyRequests = useCallback(async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await getMyNidWithdrawRequests(token)
//       if (res.success) setRequests(res.data)
//     } catch {
//     } finally {
//       setListLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchMyRequests()
//   }, [fetchMyRequests])

//   useEffect(() => {
//     const latest = notifications.find((n) => n.type === "nid_withdraw_status_update")
//     if (!latest) return
//     if (seenUpdateIds.current.has(latest._id)) return
//     seenUpdateIds.current.add(latest._id)

//     const data = (latest.data ?? {}) as {
//       requestId?: string
//       status?: TNidWithdrawStatus
//       cancelNote?: string
//       pdfUrl?: string
//     }
//        const nextStatus = data.status
//     if (!data.requestId || !nextStatus) return

//     setRequests((prev) =>
//       prev.map((r) =>
//         r._id === data.requestId
//           ? {
//               ...r,
//               status: nextStatus,
//               ...(data.cancelNote ? { cancelNote: data.cancelNote } : {}),
//               ...(data.pdfUrl ? { pdfUrl: data.pdfUrl } : {}),
//             }
//           : r
//       )
//     )


//     if (data.status === "cancelled") {
//       void refreshWallet()
//     }

//     playStatusSound()
//   }, [notifications, refreshWallet])

//   const handleDateSelect = (date: Date | undefined) => {
//     if (date) {
//       setDobDate(date)
//       setDob(format(date, "yyyy-MM-dd"))
//       setCalendarOpen(false)
//     }
//   }

//   const handleSubmit = async () => {
//     setError("")
//     if (!nidOrBirthCert.trim()) { setError("NID বা জন্ম নিবন্ধন নম্বর দিন"); return }
//     if (!name.trim()) { setError("নাম দিন"); return }
//     if (!dob) { setError("জন্ম তারিখ দিন"); return }
//     if (!isAdmin && balance < 50) { setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"); return }

//     setLoading(true)
//     Swal.fire({
//       title: "আবেদন জমা হচ্ছে...", html: "অনুগ্রহ করে অপেক্ষা করুন",
//       allowOutsideClick: false, didOpen: () => Swal.showLoading(),
//       background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//     })

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) throw new Error("Token not found")

//       const res = await createNidWithdrawRequest(token, {
//         nidOrBirthCert: nidOrBirthCert.trim(), name: name.trim(), dob,
//       })

//       Swal.close()

//       if (!res.success) {
//         setError(res.code === "INSUFFICIENT_BALANCE"
//           ? "পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"
//           : res.message || "সমস্যা হয়েছে")
//         return
//       }

//       await refreshWallet()
//       await fetchMyRequests()
//       setNidOrBirthCert("")
//       setName("")
//       setDob("")
//       setDobDate(undefined)

//       Swal.fire({
//         icon: "success", title: "আবেদন সফল হয়েছে",
//         text: "Admin process করলে আপনাকে নোটিফিকেশন পাঠানো হবে।",
//         confirmButtonText: "ঠিক আছে",
//         background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//         confirmButtonColor: "#0f172a",
//       })
//     } catch {
//       Swal.close()
//       setError("সার্ভার এরর। আবার চেষ্টা করুন।")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const confirm = await Swal.fire({
//       title: "আবেদন মুছবেন?",
//       text: "এই আবেদনটি আপনার ইতিহাস থেকে স্থায়ীভাবে মুছে যাবে।",
//       icon: "warning", showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, মুছুন", cancelButtonText: "না",
//       confirmButtonColor: "#ef4444",
//       background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//     })
//     if (!confirm.isConfirmed) return

//     setDeletingId(id)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await deleteNidWithdrawRequest(token, id)
//       if (res.success) {
//         await fetchMyRequests()
//         Swal.fire({
//           icon: "success",
//           title: "মুছে ফেলা হয়েছে",
//           timer: 1500,
//           showConfirmButton: false,
//           background: "hsl(var(--card))",
//           color: "hsl(var(--foreground))",
//         })
//       } else {
//         Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//       }
//     } catch {
//       Swal.fire({ icon: "error", title: "সার্ভার এরর" })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   return (
//     <div className="mx-auto max-w-3xl space-y-5 px-3 py-4 text-foreground sm:px-0 sm:py-0">
//       <div className="flex items-center justify-between gap-3">
//         <h1 className="text-xl font-bold text-foreground sm:text-2xl">NID কার্ড উত্তোলন</h1>
//         {!isAdmin && (
//           <Badge variant="outline" className="shrink-0 gap-1.5 px-3 py-1.5 text-sm">
//             <Wallet className="size-4" />৳{balance}
//           </Badge>
//         )}
//       </div>

//       <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
//         <div className="flex items-start gap-2.5">
//           <Info className="mt-0.5 size-4 shrink-0 text-blue-500 dark:text-blue-400" />
//           <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">
//             NID কার্ড উত্তোলনের জন্য NID নম্বর অথবা জন্ম নিবন্ধন নম্বর দিয়ে আবেদন করুন।
//             Admin প্রক্রিয়া করার পর আপনাকে PDF পাঠানো হবে।
//           </p>
//         </div>
//       </div>

//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base text-foreground">আবেদন ফর্ম</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-1.5">
//             <Label className="text-foreground">NID নম্বর অথবা জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span></Label>
//             <Input
//               placeholder="NID নম্বর বা জন্ম নিবন্ধন নম্বর"
//               value={nidOrBirthCert}
//               onChange={(e) => setNidOrBirthCert(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <Label className="text-foreground">নাম <span className="text-red-500">*</span></Label>
//             <Input
//               placeholder="আবেদনকারীর নাম"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <Label className="text-foreground">জন্ম তারিখ <span className="text-red-500">*</span></Label>
//             <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="w-full justify-start gap-2 border-border bg-background font-normal text-foreground hover:bg-background">
//                   <CalendarIcon className="size-4 text-muted-foreground" />
//                   {dob ? <span>{format(dobDate!, "dd MMM yyyy")}</span> : <span className="text-muted-foreground">তারিখ নির্বাচন করুন</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={dobDate}
//                   onSelect={handleDateSelect}
//                   defaultMonth={dobDate}
//                   captionLayout="dropdown"
//                   fromYear={1940}
//                   toYear={new Date().getFullYear()}
//                   className="bg-card"
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           {error && (
//             <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//               <AlertCircle className="size-4 shrink-0" />{error}
//             </div>
//           )}

//           {!isAdmin && (
//             <p className="rounded-lg border border-border bg-muted/40 py-2.5 text-center text-sm text-muted-foreground">
//               এই সেবার জন্য <span className="font-semibold text-primary">৳৫০</span> চার্জ কাটবে
//             </p>
//           )}

//           {loading && (
//             <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 py-5">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//               <p className="text-center text-sm text-muted-foreground">আবেদন জমা হচ্ছে...</p>
//             </div>
//           )}

//           <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading}>
//             <FileText className="size-4" />
//             {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
//           </Button>
//         </CardContent>
//       </Card>

//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-base text-foreground">আমার আবেদন সমূহ</CardTitle>
//             {requests.length > 0 && (
//               <span className="text-[11px] text-muted-foreground">সর্বশেষ {requests.length}টি দেখানো হচ্ছে</span>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           {listLoading ? (
//             <div className="flex justify-center py-8">
//               <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//             </div>
//           ) : requests.length === 0 ? (
//             <p className="py-8 text-center text-sm text-muted-foreground">কোনো আবেদন নেই</p>
//           ) : (
//             <div className="space-y-4">
//               {requests.map((r) => (
//                 <div key={r._id} className="space-y-2 rounded-xl border border-border bg-muted/20 px-4 py-3">
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <p className="text-sm font-semibold text-foreground">{r.name}</p>
//                       <p className="text-xs text-muted-foreground">{r.nidOrBirthCert}</p>
//                       <p className="text-xs text-muted-foreground">জন্ম: {r.dob}</p>
//                     </div>
//                     <div className="flex shrink-0 flex-col items-end gap-1.5">
//                       <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}>
//                         {STATUS_LABEL[r.status]}
//                       </span>
//                       <p className="text-[10px] text-muted-foreground">
//                         {new Date(r.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
//                       </p>
//                       <button
//                         disabled={deletingId === r._id}
//                         onClick={() => handleDelete(r._id)}
//                         className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
//                       >
//                         <Trash2 size={10} />
//                         {deletingId === r._id ? "..." : "মুছুন"}
//                       </button>
//                     </div>
//                   </div>

//                   <ProgressTracker status={r.status} />

//                   {r.status === "cancelled" && r.cancelNote && (
//                     <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//                       <strong>বাতিলের কারণ:</strong> {r.cancelNote}
//                     </p>
//                   )}

//                   {r.status === "pdf_sent" && r.pdfUrl && (
//                     <a
//                       href={r.pdfUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
//                     >
//                       <Download className="size-3.5" />PDF ডাউনলোড করুন
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
//         <MessageCircle className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
//         <p>
//           সার্ভিস জনিত কোন সমস্যা হলে আমাদের{" "}
//           <a
//             href="https://wa.me/8801973346401?text=Hello%20"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
//           >
//             WhatsApp
//           </a>{" "}
//           এ যোগাযোগ করুন।
//         </p>
//       </div>
//     </div>
//   )
// }




// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import { auth } from "@/lib/firebase"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import {
//   AlertCircle, Wallet, CalendarIcon, FileText,
//   Download, MessageCircle, Info, Trash2,
// } from "lucide-react"
// import { useUser } from "@/hooks/useUser"

// import { format } from "date-fns"
// import Swal from "sweetalert2"
// import {
//   createNidWithdrawRequest,
//   getMyNidWithdrawRequests,
//   deleteNidWithdrawRequest,
// } from "@/lib/api.nidWithdraw"
// import { useNotifications } from "@/hooks/useNotifications"

// const STEPS = [
//   { key: "pending", label: "আবেদন জমা" },
//   { key: "admin_seen", label: "Admin দেখেছেন" },
//   { key: "accepted", label: "গৃহীত হয়েছে" },
//   { key: "pdf_sent", label: "PDF পাঠানো হয়েছে" },
// ]

// const STATUS_ORDER: Record<string, number> = {
//   pending: 0, admin_seen: 1, accepted: 2, pdf_sent: 3, cancelled: -1,
// }

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
// }

// const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
//   pending: "Pending", admin_seen: "দেখা হয়েছে", accepted: "গৃহীত",
//   cancelled: "বাতিল", pdf_sent: "PDF পাঠানো হয়েছে",
// }

// function playStatusSound() {
//   try {
//     const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
//     if (!AudioCtx) return
//     const ctx = new AudioCtx()
//     const duration = 3
//     const interval = 0.8
//     const endTime = ctx.currentTime + duration

//     let t = ctx.currentTime
//     while (t < endTime) {
//       const osc = ctx.createOscillator()
//       const gain = ctx.createGain()
//       osc.connect(gain)
//       gain.connect(ctx.destination)
//       osc.type = "triangle"
//       osc.frequency.setValueAtTime(880, t)
//       osc.frequency.exponentialRampToValueAtTime(640, t + 0.16)
//       gain.gain.setValueAtTime(0.0001, t)
//       gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02)
//       gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
//       osc.start(t)
//       osc.stop(t + 0.24)
//       t += interval
//     }
//   } catch {}
// }

// function ProgressTracker({ status }: { status: TNidWithdrawStatus }) {
//   const isCancelled = status === "cancelled"
//   const currentOrder = STATUS_ORDER[status]

//   if (isCancelled) {
//     return (
//       <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//         ✕ আবেদন বাতিল হয়েছে
//       </div>
//     )
//   }

//   return (
//     <div className="mt-3 flex items-center gap-0">
//       {STEPS.map((step, idx) => {
//         const stepOrder = STATUS_ORDER[step.key]
//         const isDone = currentOrder >= stepOrder
//         const isActive = currentOrder === stepOrder
//         return (
//           <div key={step.key} className="flex items-center">
//             <div className="flex flex-col items-center">
//               <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all
//                 ${isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-muted text-muted-foreground"}
//                 ${isActive ? "ring-2 ring-emerald-300 ring-offset-1" : ""}`}>
//                 {isDone ? "✓" : idx + 1}
//               </div>
//               <span className={`mt-1 max-w-[60px] text-center text-[9px] leading-tight
//                 ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
//                 {step.label}
//               </span>
//             </div>
//             {idx < STEPS.length - 1 && (
//               <div className={`mb-4 h-[2px] w-6 shrink-0 ${currentOrder > stepOrder ? "bg-emerald-500" : "bg-border"}`} />
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// function getStatusBadge(status: TNidWithdrawStatus) {
//   switch (status) {
//     case "pending": return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
//     case "admin_seen": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
//     case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
//     case "cancelled": return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
//     case "pdf_sent": return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
//   }
// }

// function parseFlexibleDate(value: string): Date | undefined {
//   const input = value.trim()
//   if (!input) return undefined

//   const parts = input.split(/[./-]/).map((part) => part.trim())
//   if (parts.length !== 3 || parts.some((part) => !/^\d+$/.test(part))) return undefined

//   let year = 0
//   let month = 0
//   let day = 0

//   if (parts[0].length === 4) {
//     year = Number(parts[0])
//     month = Number(parts[1])
//     day = Number(parts[2])
//   } else if (parts[2].length === 4) {
//     day = Number(parts[0])
//     month = Number(parts[1])
//     year = Number(parts[2])
//   } else {
//     return undefined
//   }

//   if (
//     !Number.isInteger(year) ||
//     !Number.isInteger(month) ||
//     !Number.isInteger(day) ||
//     year < 1900 ||
//     year > new Date().getFullYear() ||
//     month < 1 ||
//     month > 12 ||
//     day < 1 ||
//     day > 31
//   ) {
//     return undefined
//   }

//   const date = new Date(year, month - 1, day)
//   if (
//     date.getFullYear() !== year ||
//     date.getMonth() !== month - 1 ||
//     date.getDate() !== day
//   ) {
//     return undefined
//   }

//   return date
// }

// export default function NidWithdrawPage() {
//   const { user, refreshWallet } = useUser()
//   const { notifications } = useNotifications()

//   const [nidOrBirthCert, setNidOrBirthCert] = useState("")
//   const [name, setName] = useState("")
//   const [dob, setDob] = useState("")
//   const [dobInput, setDobInput] = useState("")
//   const [dobDate, setDobDate] = useState<Date | undefined>(undefined)
//   const [calendarOpen, setCalendarOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [requests, setRequests] = useState<TRequest[]>([])
//   const [listLoading, setListLoading] = useState(true)
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   const seenUpdateIds = useRef<Set<string>>(new Set())
//   const isAdmin = user?.role === "admin" || user?.role === "super_admin"
//   const balance = user?.wallet?.balance ?? 0

//   const fetchMyRequests = useCallback(async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await getMyNidWithdrawRequests(token)
//       if (res.success) setRequests(res.data)
//     } catch {
//     } finally {
//       setListLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchMyRequests()
//   }, [fetchMyRequests])

//   useEffect(() => {
//     const latest = notifications.find((n) => n.type === "nid_withdraw_status_update")
//     if (!latest) return
//     if (seenUpdateIds.current.has(latest._id)) return
//     seenUpdateIds.current.add(latest._id)

//     const data = (latest.data ?? {}) as {
//       requestId?: string
//       status?: TNidWithdrawStatus
//       cancelNote?: string
//       pdfUrl?: string
//     }
//        const nextStatus = data.status
//     if (!data.requestId || !nextStatus) return

//     setRequests((prev) =>
//       prev.map((r) =>
//         r._id === data.requestId
//           ? {
//               ...r,
//               status: nextStatus,
//               ...(data.cancelNote ? { cancelNote: data.cancelNote } : {}),
//               ...(data.pdfUrl ? { pdfUrl: data.pdfUrl } : {}),
//             }
//           : r
//       )
//     )


//     if (data.status === "cancelled") {
//       void refreshWallet()
//     }

//     playStatusSound()
//   }, [notifications, refreshWallet])

//   const handleDateSelect = (date: Date | undefined) => {
//     if (date) {
//       const formattedDate = format(date, "yyyy-MM-dd")
//       setDobDate(date)
//       setDob(formattedDate)
//       setDobInput(formattedDate)
//       setCalendarOpen(false)
//       setError((prev) => (prev === "সঠিক জন্ম তারিখ দিন" ? "" : prev))
//     }
//   }

//   const handleDobInputChange = (value: string) => {
//     setDobInput(value)

//     if (!value.trim()) {
//       setDob("")
//       setDobDate(undefined)
//       setError((prev) => (prev === "সঠিক জন্ম তারিখ দিন" ? "" : prev))
//       return
//     }

//     const parsedDate = parseFlexibleDate(value)
//     if (parsedDate) {
//       setDob(format(parsedDate, "yyyy-MM-dd"))
//       setDobDate(parsedDate)
//       setError((prev) => (prev === "সঠিক জন্ম তারিখ দিন" ? "" : prev))
//     } else {
//       setDob("")
//       setDobDate(undefined)
//     }
//   }

//   const handleDobBlur = () => {
//     if (!dobInput.trim()) return

//     const parsedDate = parseFlexibleDate(dobInput)
//     if (!parsedDate) {
//       setDob("")
//       setDobDate(undefined)
//       setError("সঠিক জন্ম তারিখ দিন")
//       return
//     }

//     const formattedDate = format(parsedDate, "yyyy-MM-dd")
//     setDob(formattedDate)
//     setDobInput(formattedDate)
//     setDobDate(parsedDate)
//     setError((prev) => (prev === "সঠিক জন্ম তারিখ দিন" ? "" : prev))
//   }

//   const handleSubmit = async () => {
//     setError("")

//     if (dobInput.trim()) {
//       const parsedDate = parseFlexibleDate(dobInput)
//       if (!parsedDate) {
//         setError("সঠিক জন্ম তারিখ দিন")
//         return
//       }
//       const formattedDate = format(parsedDate, "yyyy-MM-dd")
//       setDob(formattedDate)
//       setDobInput(formattedDate)
//       setDobDate(parsedDate)
//     }

//     if (!nidOrBirthCert.trim()) { setError("NID বা জন্ম নিবন্ধন নম্বর দিন"); return }
//     if (!name.trim()) { setError("নাম দিন"); return }
//     if (!dobInput.trim()) { setError("জন্ম তারিখ দিন"); return }
//     if (!dob) { setError("সঠিক জন্ম তারিখ দিন"); return }
//     if (!isAdmin && balance < 50) { setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"); return }

//     setLoading(true)
//     Swal.fire({
//       title: "আবেদন জমা হচ্ছে...", html: "অনুগ্রহ করে অপেক্ষা করুন",
//       allowOutsideClick: false, didOpen: () => Swal.showLoading(),
//       background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//     })

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) throw new Error("Token not found")

//       const res = await createNidWithdrawRequest(token, {
//         nidOrBirthCert: nidOrBirthCert.trim(), name: name.trim(), dob,
//       })

//       Swal.close()

//       if (!res.success) {
//         setError(res.code === "INSUFFICIENT_BALANCE"
//           ? "পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"
//           : res.message || "সমস্যা হয়েছে")
//         return
//       }

//       await refreshWallet()
//       await fetchMyRequests()
//       setNidOrBirthCert("")
//       setName("")
//       setDob("")
//       setDobInput("")
//       setDobDate(undefined)

//       Swal.fire({
//         icon: "success", title: "আবেদন সফল হয়েছে",
//         text: "Admin process করলে আপনাকে নোটিফিকেশন পাঠানো হবে।",
//         confirmButtonText: "ঠিক আছে",
//         background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//         confirmButtonColor: "#0f172a",
//       })
//     } catch {
//       Swal.close()
//       setError("সার্ভার এরর। আবার চেষ্টা করুন।")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const confirm = await Swal.fire({
//       title: "আবেদন মুছবেন?",
//       text: "এই আবেদনটি আপনার ইতিহাস থেকে স্থায়ীভাবে মুছে যাবে।",
//       icon: "warning", showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, মুছুন", cancelButtonText: "না",
//       confirmButtonColor: "#ef4444",
//       background: "hsl(var(--card))", color: "hsl(var(--foreground))",
//     })
//     if (!confirm.isConfirmed) return

//     setDeletingId(id)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await deleteNidWithdrawRequest(token, id)
//       if (res.success) {
//         await fetchMyRequests()
//         Swal.fire({
//           icon: "success",
//           title: "মুছে ফেলা হয়েছে",
//           timer: 1500,
//           showConfirmButton: false,
//           background: "hsl(var(--card))",
//           color: "hsl(var(--foreground))",
//         })
//       } else {
//         Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
//       }
//     } catch {
//       Swal.fire({ icon: "error", title: "সার্ভার এরর" })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   return (
//     <div className="mx-auto max-w-3xl space-y-5 px-3 py-4 text-foreground sm:px-0 sm:py-0">
//       <div className="flex items-center justify-between gap-3">
//         <h1 className="text-xl font-bold text-foreground sm:text-2xl">NID কার্ড উত্তোলন</h1>
//         {!isAdmin && (
//           <Badge variant="outline" className="shrink-0 gap-1.5 px-3 py-1.5 text-sm">
//             <Wallet className="size-4" />৳{balance}
//           </Badge>
//         )}
//       </div>

//       <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
//         <div className="flex items-start gap-2.5">
//           <Info className="mt-0.5 size-4 shrink-0 text-blue-500 dark:text-blue-400" />
//           <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">
//             NID কার্ড উত্তোলনের জন্য NID নম্বর অথবা জন্ম নিবন্ধন নম্বর দিয়ে আবেদন করুন।
//             Admin প্রক্রিয়া করার পর আপনাকে PDF পাঠানো হবে।
//           </p>
//         </div>
//       </div>

//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base text-foreground">আবেদন ফর্ম</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-1.5">
//             <Label className="text-foreground">NID নম্বর অথবা জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span></Label>
//             <Input
//               placeholder="NID নম্বর বা জন্ম নিবন্ধন নম্বর"
//               value={nidOrBirthCert}
//               onChange={(e) => setNidOrBirthCert(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <Label className="text-foreground">নাম <span className="text-red-500">*</span></Label>
//             <Input
//               placeholder="আবেদনকারীর নাম"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <Label className="text-foreground">জন্ম তারিখ <span className="text-red-500">*</span></Label>
//             <div className="relative">
//               <Input
//                 placeholder="YYYY-MM-DD"
//                 value={dobInput}
//                 onChange={(e) => handleDobInputChange(e.target.value)}
//                 onBlur={handleDobBlur}
//                 className="border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground"
//               />
//               <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
//                   >
//                     <CalendarIcon className="size-4" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="end">
//                   <Calendar
//                     mode="single"
//                     selected={dobDate}
//                     onSelect={handleDateSelect}
//                     defaultMonth={dobDate}
//                     captionLayout="dropdown"
//                     fromYear={1940}
//                     toYear={new Date().getFullYear()}
//                     className="bg-card"
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//           </div>

//           {error && (
//             <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//               <AlertCircle className="size-4 shrink-0" />{error}
//             </div>
//           )}

//           {!isAdmin && (
//             <p className="rounded-lg border border-border bg-muted/40 py-2.5 text-center text-sm text-muted-foreground">
//               এই সেবার জন্য <span className="font-semibold text-primary">৳৫০</span> চার্জ কাটবে
//             </p>
//           )}

//           {loading && (
//             <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 py-5">
//               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//               <p className="text-center text-sm text-muted-foreground">আবেদন জমা হচ্ছে...</p>
//             </div>
//           )}

//           <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading}>
//             <FileText className="size-4" />
//             {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
//           </Button>
//         </CardContent>
//       </Card>

//       <Card className="border-border bg-card">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-base text-foreground">আমার আবেদন সমূহ</CardTitle>
//             {requests.length > 0 && (
//               <span className="text-[11px] text-muted-foreground">সর্বশেষ {requests.length}টি দেখানো হচ্ছে</span>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           {listLoading ? (
//             <div className="flex justify-center py-8">
//               <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//             </div>
//           ) : requests.length === 0 ? (
//             <p className="py-8 text-center text-sm text-muted-foreground">কোনো আবেদন নেই</p>
//           ) : (
//             <div className="space-y-4">
//               {requests.map((r) => (
//                 <div key={r._id} className="space-y-2 rounded-xl border border-border bg-muted/20 px-4 py-3">
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <p className="text-sm font-semibold text-foreground">{r.name}</p>
//                       <p className="text-xs text-muted-foreground">{r.nidOrBirthCert}</p>
//                       <p className="text-xs text-muted-foreground">জন্ম: {r.dob}</p>
//                     </div>
//                     <div className="flex shrink-0 flex-col items-end gap-1.5">
//                       <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}>
//                         {STATUS_LABEL[r.status]}
//                       </span>
//                       <p className="text-[10px] text-muted-foreground">
//                         {new Date(r.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
//                       </p>
//                       <button
//                         disabled={deletingId === r._id}
//                         onClick={() => handleDelete(r._id)}
//                         className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
//                       >
//                         <Trash2 size={10} />
//                         {deletingId === r._id ? "..." : "মুছুন"}
//                       </button>
//                     </div>
//                   </div>

//                   <ProgressTracker status={r.status} />

//                   {r.status === "cancelled" && r.cancelNote && (
//                     <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
//                       <strong>বাতিলের কারণ:</strong> {r.cancelNote}
//                     </p>
//                   )}

//                   {r.status === "pdf_sent" && r.pdfUrl && (
//                     <a
//                       href={r.pdfUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
//                     >
//                       <Download className="size-3.5" />PDF ডাউনলোড করুন
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
//         <MessageCircle className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
//         <p>
//           সার্ভিস জনিত কোন সমস্যা হলে আমাদের{" "}
//           <a
//             href="https://wa.me/8801973346401?text=Hello%20"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
//           >
//             WhatsApp
//           </a>{" "}
//           এ যোগাযোগ করুন।
//         </p>
//       </div>
//     </div>
//   )
// }




"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertCircle, Wallet, CalendarIcon, FileText,
  Download, MessageCircle, Info, Trash2, Loader2,
} from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { format } from "date-fns"
import Swal from "sweetalert2"
import {
  createNidWithdrawRequest,
  getMyNidWithdrawRequests,
  deleteNidWithdrawRequest,
  nidWithdrawDownloadFile,
} from "@/lib/api.nidWithdraw"
import { useNotifications } from "@/hooks/useNotifications"

// ── Types ─────────────────────────────────────────────────────────────────────

const STEPS = [
  { key: "pending",    label: "আবেদন জমা" },
  { key: "admin_seen", label: "Admin দেখেছেন" },
  { key: "accepted",   label: "গৃহীত হয়েছে" },
  { key: "pdf_sent",   label: "ফাইল পাঠানো হয়েছে" },
]

const STATUS_ORDER: Record<string, number> = {
  pending: 0, admin_seen: 1, accepted: 2, pdf_sent: 3, cancelled: -1,
}

type TNidWithdrawStatus = "pending" | "admin_seen" | "accepted" | "cancelled" | "pdf_sent"

type TFileMetadata = {
  fileKey:         string
  fileName:        string
  fileType:        string
  storageProvider: "local" | "legacy"
  uploadedAt:      string
}

type TRequest = {
  _id:            string
  nidOrBirthCert: string
  name:           string
  dob:            string
  status:         TNidWithdrawStatus
  cancelNote?:    string
  // Legacy field — may still exist on old records
  pdfUrl?:        string
  // New field — present after admin uploads a file
  file?:          TFileMetadata
  createdAt:      string
}

const STATUS_LABEL: Record<TNidWithdrawStatus, string> = {
  pending:    "Pending",
  admin_seen: "দেখা হয়েছে",
  accepted:   "গৃহীত",
  cancelled:  "বাতিল",
  pdf_sent:   "ফাইল পাঠানো হয়েছে",
}

// ── Audio ─────────────────────────────────────────────────────────────────────

function playStatusSound() {
  try {
    const AudioCtx = window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx      = new AudioCtx()
    const duration = 3
    const interval = 0.8
    const endTime  = ctx.currentTime + duration

    let t = ctx.currentTime
    while (t < endTime) {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "triangle"
      osc.frequency.setValueAtTime(880, t)
      osc.frequency.exponentialRampToValueAtTime(640, t + 0.16)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
      osc.start(t)
      osc.stop(t + 0.24)
      t += interval
    }
  } catch {}
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProgressTracker({ status }: { status: TNidWithdrawStatus }) {
  const isCancelled  = status === "cancelled"
  const currentOrder = STATUS_ORDER[status]

  if (isCancelled) {
    return (
      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
        ✕ আবেদন বাতিল হয়েছে
      </div>
    )
  }

  return (
    <div className="mt-3 flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const stepOrder = STATUS_ORDER[step.key]
        const isDone    = currentOrder >= stepOrder
        const isActive  = currentOrder === stepOrder
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all
                ${isDone  ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-muted text-muted-foreground"}
                ${isActive ? "ring-2 ring-emerald-300 ring-offset-1" : ""}`}>
                {isDone ? "✓" : idx + 1}
              </div>
              <span className={`mt-1 max-w-[60px] text-center text-[9px] leading-tight
                ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`mb-4 h-[2px] w-6 shrink-0 ${currentOrder > stepOrder ? "bg-emerald-500" : "bg-border"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function getStatusBadge(status: TNidWithdrawStatus) {
  switch (status) {
    case "pending":    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
    case "admin_seen": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30"
    case "accepted":   return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
    case "cancelled":  return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30"
    case "pdf_sent":   return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30"
  }
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function parseFlexibleDate(value: string): Date | undefined {
  const input = value.trim()
  if (!input) return undefined

  const parts = input.split(/[./-]/).map((part) => part.trim())
  if (parts.length !== 3 || parts.some((part) => !/^\d+$/.test(part))) return undefined

  let year = 0, month = 0, day = 0

  if (parts[0].length === 4) {
    year = Number(parts[0]); month = Number(parts[1]); day = Number(parts[2])
  } else if (parts[2].length === 4) {
    day = Number(parts[0]); month = Number(parts[1]); year = Number(parts[2])
  } else {
    return undefined
  }

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) ||
      year < 1900 || year > new Date().getFullYear() ||
      month < 1 || month > 12 || day < 1 || day > 31) {
    return undefined
  }

  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }

  return date
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns true if this request has a downloadable file.
 * Handles both new local files and legacy pdfUrl records.
 */
const hasDownloadableFile = (r: TRequest): boolean => {
  if (r.status !== "pdf_sent") return false
  return !!(r.file?.fileKey || r.pdfUrl)
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NidWithdrawPage() {
  const { user, refreshWallet } = useUser()
  const { notifications }       = useNotifications()

  const [nidOrBirthCert, setNidOrBirthCert] = useState("")
  const [name,           setName]           = useState("")
  const [dob,            setDob]            = useState("")
  const [dobInput,       setDobInput]       = useState("")
  const [dobDate,        setDobDate]        = useState<Date | undefined>(undefined)
  const [calendarOpen,   setCalendarOpen]   = useState(false)
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState("")
  const [requests,       setRequests]       = useState<TRequest[]>([])
  const [listLoading,    setListLoading]    = useState(true)
  const [deletingId,     setDeletingId]     = useState<string | null>(null)
  // Track which request is currently being downloaded
  const [downloadingId,  setDownloadingId]  = useState<string | null>(null)

  const seenUpdateIds = useRef<Set<string>>(new Set())
  const isAdmin  = user?.role === "admin" || user?.role === "super_admin"
  const balance  = user?.wallet?.balance ?? 0

  const fetchMyRequests = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await getMyNidWithdrawRequests(token)
      if (res.success) setRequests(res.data)
    } catch {
      // silent
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMyRequests()
  }, [fetchMyRequests])

  // ── Realtime status updates ────────────────────────────────────────────────
  useEffect(() => {
    const latest = notifications.find((n) => n.type === "nid_withdraw_status_update")
    if (!latest) return
    if (seenUpdateIds.current.has(latest._id)) return
    seenUpdateIds.current.add(latest._id)

    const data = (latest.data ?? {}) as {
      requestId?: string
      status?:    TNidWithdrawStatus
      cancelNote?: string
      // New backend sends hasFile + fileName instead of pdfUrl
      hasFile?:   boolean
      fileName?:  string
      // Legacy backend may still send pdfUrl
      pdfUrl?:    string
    }

    const nextStatus = data.status
    if (!data.requestId || !nextStatus) return

    setRequests((prev) =>
      prev.map((r) => {
        if (r._id !== data.requestId) return r

        const updated: TRequest = {
          ...r,
          status: nextStatus,
          ...(data.cancelNote ? { cancelNote: data.cancelNote } : {}),
          // Legacy pdfUrl — keep if sent
          ...(data.pdfUrl ? { pdfUrl: data.pdfUrl } : {}),
        }

        // For new local file uploads: we don't get the full file object
        // in the socket payload — just hasFile=true. We re-fetch to get
        // the full file metadata so the download button works correctly.
        return updated
      })
    )

    // If a file was sent via new upload, re-fetch to get full file metadata
    if (nextStatus === "pdf_sent" && data.hasFile) {
      void fetchMyRequests()
    }

    if (nextStatus === "cancelled") {
      void refreshWallet()
    }

    playStatusSound()
  }, [notifications, refreshWallet, fetchMyRequests])

  // ── Date handlers ──────────────────────────────────────────────────────────

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      setDobDate(date)
      setDob(formattedDate)
      setDobInput(formattedDate)
      setCalendarOpen(false)
      setError((prev) => (prev === "সঠিক জন্ম তারিখ দিন" ? "" : prev))
    }
  }

  const handleDobInputChange = (value: string) => {
    setDobInput(value)
    if (!value.trim()) {
      setDob(""); setDobDate(undefined)
      setError((prev) => (prev === "সঠিক জন্ম তারিখ দিন" ? "" : prev))
      return
    }
    const parsedDate = parseFlexibleDate(value)
    if (parsedDate) {
      setDob(format(parsedDate, "yyyy-MM-dd")); setDobDate(parsedDate)
      setError((prev) => (prev === "সঠিক জন্ম তারিখ দিন" ? "" : prev))
    } else {
      setDob(""); setDobDate(undefined)
    }
  }

  const handleDobBlur = () => {
    if (!dobInput.trim()) return
    const parsedDate = parseFlexibleDate(dobInput)
    if (!parsedDate) {
      setDob(""); setDobDate(undefined); setError("সঠিক জন্ম তারিখ দিন"); return
    }
    const formattedDate = format(parsedDate, "yyyy-MM-dd")
    setDob(formattedDate); setDobInput(formattedDate); setDobDate(parsedDate)
    setError((prev) => (prev === "সঠিক জন্ম তারিখ দিন" ? "" : prev))
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError("")

    if (dobInput.trim()) {
      const parsedDate = parseFlexibleDate(dobInput)
      if (!parsedDate) { setError("সঠিক জন্ম তারিখ দিন"); return }
      const formattedDate = format(parsedDate, "yyyy-MM-dd")
      setDob(formattedDate); setDobInput(formattedDate); setDobDate(parsedDate)
    }

    if (!nidOrBirthCert.trim()) { setError("NID বা জন্ম নিবন্ধন নম্বর দিন"); return }
    if (!name.trim())           { setError("নাম দিন"); return }
    if (!dobInput.trim())       { setError("জন্ম তারিখ দিন"); return }
    if (!dob)                   { setError("সঠিক জন্ম তারিখ দিন"); return }
    if (!isAdmin && balance < 50) { setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"); return }

    setLoading(true)
    Swal.fire({
      title: "আবেদন জমা হচ্ছে...", html: "অনুগ্রহ করে অপেক্ষা করুন",
      allowOutsideClick: false, didOpen: () => Swal.showLoading(),
      background: "hsl(var(--card))", color: "hsl(var(--foreground))",
    })

    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Token not found")

      const res = await createNidWithdrawRequest(token, {
        nidOrBirthCert: nidOrBirthCert.trim(), name: name.trim(), dob,
      })

      Swal.close()

      if (!res.success) {
        setError(res.code === "INSUFFICIENT_BALANCE"
          ? "পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"
          : res.message || "সমস্যা হয়েছে")
        return
      }

      await refreshWallet()
      await fetchMyRequests()
      setNidOrBirthCert(""); setName(""); setDob(""); setDobInput(""); setDobDate(undefined)

      Swal.fire({
        icon: "success", title: "আবেদন সফল হয়েছে",
        text: "Admin process করলে আপনাকে নোটিফিকেশন পাঠানো হবে।",
        confirmButtonText: "ঠিক আছে",
        background: "hsl(var(--card))", color: "hsl(var(--foreground))",
        confirmButtonColor: "#0f172a",
      })
    } catch {
      Swal.close()
      setError("সার্ভার এরর। আবার চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "আবেদন মুছবেন?",
      text: "এই আবেদনটি আপনার ইতিহাস থেকে স্থায়ীভাবে মুছে যাবে।",
      icon: "warning", showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছুন", cancelButtonText: "না",
      confirmButtonColor: "#ef4444",
      background: "hsl(var(--card))", color: "hsl(var(--foreground))",
    })
    if (!confirm.isConfirmed) return

    setDeletingId(id)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await deleteNidWithdrawRequest(token, id)
      if (res.success) {
        await fetchMyRequests()
        Swal.fire({
          icon: "success", title: "মুছে ফেলা হয়েছে",
          timer: 1500, showConfirmButton: false,
          background: "hsl(var(--card))", color: "hsl(var(--foreground))",
        })
      } else {
        Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
      }
    } catch {
      Swal.fire({ icon: "error", title: "সার্ভার এরর" })
    } finally {
      setDeletingId(null)
    }
  }

  // ── Download ───────────────────────────────────────────────────────────────

  /**
   * Unified download handler.
   * - New local files  → calls GET /:id/download with auth → streams blob
   * - Legacy pdfUrl    → same endpoint (backend redirects), blob is returned
   *
   * We always go through the backend endpoint so auth is enforced.
   */
  const handleDownload = async (r: TRequest) => {
    if (downloadingId) return
    setDownloadingId(r._id)

    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Not authenticated")

      await nidWithdrawDownloadFile(token, r._id)
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "ডাউনলোড ব্যর্থ হয়েছে",
        text: err?.message || "আবার চেষ্টা করুন।",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
      })
    } finally {
      setDownloadingId(null)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-3 py-4 text-foreground sm:px-0 sm:py-0">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">NID কার্ড উত্তোলন</h1>
        {!isAdmin && (
          <Badge variant="outline" className="shrink-0 gap-1.5 px-3 py-1.5 text-sm">
            <Wallet className="size-4" />৳{balance}
          </Badge>
        )}
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-500 dark:text-blue-400" />
          <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">
            NID কার্ড উত্তোলনের জন্য NID নম্বর অথবা জন্ম নিবন্ধন নম্বর দিয়ে আবেদন করুন।
            Admin প্রক্রিয়া করার পর আপনাকে ফাইল পাঠানো হবে।
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-foreground">আবেদন ফর্ম</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-foreground">NID নম্বর অথবা জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span></Label>
            <Input
              placeholder="NID নম্বর বা জন্ম নিবন্ধন নম্বর"
              value={nidOrBirthCert}
              onChange={(e) => setNidOrBirthCert(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">নাম <span className="text-red-500">*</span></Label>
            <Input
              placeholder="আবেদনকারীর নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">জন্ম তারিখ <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                placeholder="YYYY-MM-DD"
                value={dobInput}
                onChange={(e) => handleDobInputChange(e.target.value)}
                onBlur={handleDobBlur}
                className="border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground"
              />
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  >
                    <CalendarIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single" selected={dobDate} onSelect={handleDateSelect}
                    defaultMonth={dobDate} captionLayout="dropdown"
                    fromYear={1940} toYear={new Date().getFullYear()} className="bg-card"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <AlertCircle className="size-4 shrink-0" />{error}
            </div>
          )}

          {!isAdmin && (
            <p className="rounded-lg border border-border bg-muted/40 py-2.5 text-center text-sm text-muted-foreground">
              এই সেবার জন্য <span className="font-semibold text-primary">৳৫০</span> চার্জ কাটবে
            </p>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 py-5">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-center text-sm text-muted-foreground">আবেদন জমা হচ্ছে...</p>
            </div>
          )}

          <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading}>
            <FileText className="size-4" />
            {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
          </Button>
        </CardContent>
      </Card>

      {/* ── Request list ── */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-foreground">আমার আবেদন সমূহ</CardTitle>
            {requests.length > 0 && (
              <span className="text-[11px] text-muted-foreground">সর্বশেষ {requests.length}টি দেখানো হচ্ছে</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {listLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : requests.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">কোনো আবেদন নেই</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r._id} className="space-y-2 rounded-xl border border-border bg-muted/20 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.nidOrBirthCert}</p>
                      <p className="text-xs text-muted-foreground">জন্ম: {r.dob}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(r.createdAt).toLocaleString("en-GB", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                      <button
                        disabled={deletingId === r._id}
                        onClick={() => handleDelete(r._id)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                      >
                        <Trash2 size={10} />
                        {deletingId === r._id ? "..." : "মুছুন"}
                      </button>
                    </div>
                  </div>

                  <ProgressTracker status={r.status} />

                  {r.status === "cancelled" && r.cancelNote && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                      <strong>বাতিলের কারণ:</strong> {r.cancelNote}
                    </p>
                  )}

                  {/* ── Download button — works for both local files and legacy pdfUrl ── */}
                  {hasDownloadableFile(r) && (
                    <button
                      onClick={() => handleDownload(r)}
                      disabled={downloadingId === r._id}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                    >
                      {downloadingId === r._id ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          ডাউনলোড হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Download className="size-3.5" />
                          {r.file?.fileName
                            ? `ডাউনলোড করুন — ${r.file.fileName}`
                            : "ফাইল ডাউনলোড করুন"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <MessageCircle className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
        <p>
          সার্ভিস জনিত কোন সমস্যা হলে আমাদের{" "}
          <a
            href="https://wa.me/8801973346401?text=Hello%20"
            target="_blank" rel="noopener noreferrer"
            className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            WhatsApp
          </a>{" "}
          এ যোগাযোগ করুন।
        </p>
      </div>
    </div>
  )
}