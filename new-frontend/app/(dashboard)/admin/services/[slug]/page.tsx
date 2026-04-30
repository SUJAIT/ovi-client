/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams }        from "next/navigation"
import { auth }             from "@/lib/firebase"
import {
  Eye, CheckCircle, XCircle, Clock, User,
  Search, Copy, X, Check, Loader2, Upload, Download, FileText,
} from "lucide-react"
import Swal                 from "sweetalert2"
import { useNotifications } from "@/hooks/useNotifications"
import {
  getAllServicesAdmin,
  getAllServiceRequests,
  markServiceRequestSeen,
  acceptServiceRequest,
  // completeServiceRequest,
  cancelServiceRequest,
  adminDeleteServiceRequest,
  serviceRequestUploadFile,
  serviceRequestDownloadFile,
  ICustomService,
  IServiceRequest,
  TServiceRequestStatus,
  TInputFieldType,
} from "@/lib/api.customService"

// ── Constants ─────────────────────────────────────────────────────────────────

const ALLOWED_EXTENSIONS = ".pdf,.doc,.docx"
const MAX_FILE_SIZE_MB   = 20
const MAX_FILE_SIZE_B    = MAX_FILE_SIZE_MB * 1024 * 1024
const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<TServiceRequestStatus, string> = {
  pending: "Pending", admin_seen: "দেখা হয়েছে",
  accepted: "গৃহীত", cancelled: "বাতিল", completed: "সম্পন্ন",
}

function getStatusBadge(status: TServiceRequestStatus) {
  const m: Record<TServiceRequestStatus, string> = {
    pending:    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
    admin_seen: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30",
    accepted:   "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
    cancelled:  "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30",
    completed:  "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30",
  }
  return m[status]
}

const formatDate = (d: string) =>
  new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

function playBeep() {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return
    const ctx = new AC(); const osc = ctx.createOscillator(); const g = ctx.createGain()
    osc.connect(g); g.connect(ctx.destination); osc.type = "triangle"
    osc.frequency.setValueAtTime(880, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.16)
    g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22); osc.start(); osc.stop(ctx.currentTime + 0.24)
  } catch {}
}

// ── DetailField ───────────────────────────────────────────────────────────────

const FIELD_ICON: Record<TInputFieldType, string> = { normal: "📝", dob: "🎂", bigbox: "📄" }

function DetailField({ label, value, onCopy, buttonLabel }: { label: string; value: string; onCopy: () => void; buttonLabel: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => { onCopy(); setCopied(true); setTimeout(() => setCopied(false), 1800) }
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 break-all text-sm font-bold text-foreground sm:text-base">{value}</p>
        </div>
        <button type="button" onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted">
          {copied ? <Check size={12} /> : <Copy size={12} />}{buttonLabel}
        </button>
      </div>
    </div>
  )
}

// ── Upload Modal Type ─────────────────────────────────────────────────────────

type TUploadModal = { id: string; file: File | null; dragOver: boolean }

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminServiceRequestsPage() {
  const params = useParams()
  const slug   = params?.slug as string

  const { notifications } = useNotifications()

  const [service,       setService]       = useState<ICustomService | null>(null)
  const [requests,      setRequests]      = useState<IServiceRequest[]>([])
  const [loading,       setLoading]       = useState(true)
  const [actionId,      setActionId]      = useState<string | null>(null)
  const [statusFilter,  setStatusFilter]  = useState("all")
  const [search,        setSearch]        = useState("")
  const [cancelModal,   setCancelModal]   = useState<{ id: string; note: string } | null>(null)
  const [detailsModal,  setDetailsModal]  = useState<IServiceRequest | null>(null)
  const [uploadModal,   setUploadModal]   = useState<TUploadModal | null>(null)
  const [uploadingId,   setUploadingId]   = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [muted,         setMuted]         = useState(false)

  const seenNotifIds = useRef<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return

      const [svcRes, reqRes] = await Promise.all([
        getAllServicesAdmin(token),
        getAllServiceRequests(token, slug, statusFilter !== "all" ? statusFilter : undefined),
      ])

      if (svcRes.success) {
        const svc = (svcRes.data as ICustomService[]).find((s) => s.slug === slug)
        if (svc) setService(svc)
      }

      if (reqRes.success) {
        const data     = reqRes.data as IServiceRequest[]
        const ACTIVE   = ["pending", "admin_seen", "accepted"]
        const active   = data.filter((r) => ACTIVE.includes(r.status)).sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
        const done     = data.filter((r) => !ACTIVE.includes(r.status)).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        setRequests([...active, ...done])
      }
    } finally { setLoading(false) }
  }, [slug, statusFilter])

  useEffect(() => { setLoading(true); fetchAll() }, [fetchAll])

  // ── Realtime: new request ──────────────────────────────────────────────────

  useEffect(() => {
    const latest = notifications.find((n) => n.type === "custom_service_request")
    if (!latest) return
    const data = (latest.data ?? {}) as { serviceSlug?: string }
    if (data.serviceSlug !== slug) return
    if (seenNotifIds.current.has(latest._id)) return
    seenNotifIds.current.add(latest._id)
    void fetchAll()
    if (!muted) playBeep()
    void Swal.fire({ toast: true, position: "top-end", icon: "info", title: latest.title, text: latest.message, showConfirmButton: false, timer: 5000, timerProgressBar: true })
  }, [notifications, fetchAll, muted, slug])

  // ── Helpers ────────────────────────────────────────────────────────────────

  const withToken = async (cb: (token: string) => Promise<void>) => {
    const token = await auth.currentUser?.getIdToken()
    if (!token) return
    await cb(token)
  }

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      void Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Copied", showConfirmButton: false, timer: 1400, timerProgressBar: true, background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
    } catch { void Swal.fire({ icon: "error", title: "Copy failed" }) }
  }

  // ── Action handlers ────────────────────────────────────────────────────────

  const handleMarkSeen = async (id: string) => {
    setActionId(id)
    try {
      await withToken(async (token) => {
        const res = await markServiceRequestSeen(token, id)
        if (res.success) setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "admin_seen" } : r))
        else Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
      })
    } finally { setActionId(null) }
  }

  const handleAccept = async (id: string) => {
    const confirm = await Swal.fire({ title: "Accept করবেন?", icon: "question", showCancelButton: true, confirmButtonText: "হ্যাঁ, Accept করুন", cancelButtonText: "না", confirmButtonColor: "#10b981" })
    if (!confirm.isConfirmed) return
    setActionId(id)
    try {
      await withToken(async (token) => {
        const res = await acceptServiceRequest(token, id)
        if (res.success) { setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "accepted" } : r)); Swal.fire({ icon: "success", title: "Accepted!", timer: 1500, showConfirmButton: false }) }
        else Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
      })
    } finally { setActionId(null) }
  }

  // const handleComplete = async (id: string) => {
  //   const confirm = await Swal.fire({ title: "সম্পন্ন করবেন?", icon: "question", showCancelButton: true, confirmButtonText: "হ্যাঁ", cancelButtonText: "না", confirmButtonColor: "#8b5cf6" })
  //   if (!confirm.isConfirmed) return
  //   setActionId(id)
  //   try {
  //     await withToken(async (token) => {
  //       const res = await completeServiceRequest(token, id)
  //       if (res.success) { setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "completed" } : r)); Swal.fire({ icon: "success", title: "সম্পন্ন হয়েছে!", timer: 1500, showConfirmButton: false }) }
  //       else Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
  //     })
  //   } finally { setActionId(null) }
  // }

  const handleCancel = async () => {
    if (!cancelModal) return
    if (!cancelModal.note.trim() || cancelModal.note.trim().length < 3) { Swal.fire({ icon: "warning", title: "বাতিলের কারণ লিখুন (কমপক্ষে ৩ অক্ষর)" }); return }
    const id = cancelModal.id; const note = cancelModal.note
    setActionId(id); setCancelModal(null)
    try {
      await withToken(async (token) => {
        const res = await cancelServiceRequest(token, id, note)
        if (res.success) { setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "cancelled", cancelNote: note } : r)); Swal.fire({ icon: "success", title: res.message || "বাতিল হয়েছে", timer: 2000, showConfirmButton: false }) }
        else Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
      })
    } finally { setActionId(null) }
  }

  const handleAdminDelete = async (id: string) => {
    const confirm = await Swal.fire({ title: "তালিকা থেকে সরাবেন?", icon: "warning", showCancelButton: true, confirmButtonText: "হ্যাঁ, সরান", cancelButtonText: "না", confirmButtonColor: "#ef4444" })
    if (!confirm.isConfirmed) return
    try {
      await withToken(async (token) => {
        const res = await adminDeleteServiceRequest(token, id)
        if (res.success) { setRequests((prev) => prev.filter((r) => r._id !== id)); Swal.fire({ icon: "success", title: "সরানো হয়েছে", timer: 1500, showConfirmButton: false }) }
        else Swal.fire({ icon: "error", title: res.message || "সমস্যা হয়েছে" })
      })
    } catch { /**/ }
  }

  // ── File upload ────────────────────────────────────────────────────────────

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_MIME.has(file.type)) return "শুধুমাত্র PDF, DOC, DOCX ফাইল গ্রহণযোগ্য"
    if (file.size > MAX_FILE_SIZE_B) return `ফাইল সর্বোচ্চ ${MAX_FILE_SIZE_MB} MB হতে পারে`
    return null
  }

  const handleFileSelect = (file: File) => {
    const err = validateFile(file)
    if (err) { Swal.fire({ icon: "warning", title: err, background: "hsl(var(--card))", color: "hsl(var(--foreground))" }); return }
    setUploadModal((prev) => prev ? { ...prev, file } : prev)
  }

  const handleUploadSubmit = async () => {
    if (!uploadModal?.file || !uploadModal.id) return
    const id = uploadModal.id; const file = uploadModal.file
    setUploadingId(id); setUploadModal(null)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Not authenticated")
      const res = await serviceRequestUploadFile(token, slug, id, file)
      if (res.success) {
        await fetchAll()
        Swal.fire({ icon: "success", title: "ফাইল আপলোড হয়েছে!", text: "ফাইল সফলভাবে পাঠানো হয়েছে।", timer: 2000, showConfirmButton: false, background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
      } else {
        Swal.fire({ icon: "error", title: res.message || "আপলোড ব্যর্থ হয়েছে", background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
      }
    } catch { Swal.fire({ icon: "error", title: "সার্ভার এরর।", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }) }
    finally { setUploadingId(null) }
  }

  // ── File download ──────────────────────────────────────────────────────────

  const handleDownload = async (r: IServiceRequest) => {
    if (downloadingId) return
    setDownloadingId(r._id)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Not authenticated")
      await serviceRequestDownloadFile(token, slug, r._id)
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "ডাউনলোড ব্যর্থ হয়েছে", text: err?.message || "আবার চেষ্টা করুন।", background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
    } finally { setDownloadingId(null) }
  }

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filtered = requests.filter((r) => {
    if (!search) return true
    const q    = search.toLowerCase()
    const user = typeof r.userId === "object" ? r.userId : null
    return (
      user?.name?.toLowerCase().includes(q) ||
      user?.email?.toLowerCase().includes(q) ||
      r.fields.some((f) => f.value.toLowerCase().includes(q))
    )
  })

  const title     = service?.card.title || slug
  const pendingCt = requests.filter((r) => r.status === "pending").length

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 text-foreground">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title} — Admin</h1>
          <button onClick={() => setMuted((c) => !c)}
            className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
            {muted ? "Muted" : "Sound On"}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full border border-border bg-muted px-3 py-1">মোট: {requests.length}</span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">Pending: {pendingCt}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input type="text" placeholder="নাম, Email বা তথ্য..."
            className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="admin_seen">seen</option>
          <option value="accepted">accepted</option>
          <option value="cancelled">cancelled</option>
          <option value="completed">completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["#", "User", "আবেদনের তথ্য", "Status", "Actions"].map((h) => (
                  <th key={h} className={`px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-sm text-muted-foreground">No requests found</td></tr>
              ) : (
                filtered.map((r, idx) => {
                  const user    = typeof r.userId === "object" ? r.userId : null
                  const isActive = ["pending", "admin_seen", "accepted"].includes(r.status)
                  const isBusy   = actionId === r._id
                  const hasFile  = !!r.file?.fileKey

                  return (
                    <tr key={r._id} className="group transition-colors hover:bg-muted/20">

                      <td className="px-5 py-4 text-sm text-muted-foreground">{idx + 1}</td>

                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {user?.name?.[0] || <User size={18} />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{user?.name || "Anonymous"}</div>
                            <div className="text-[11px] text-muted-foreground">{user?.email}</div>
                            <div className="text-[10px] text-muted-foreground">Balance: ৳{user?.wallet?.balance ?? "—"}</div>
                          </div>
                        </div>
                      </td>

                      {/* Fields */}
                      <td className="px-5 py-4">
                        <div className="space-y-3">
                          <button type="button" onClick={() => setDetailsModal(r)}
                            className="w-full rounded-xl border border-border bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                              {r.fields.slice(0, 3).map((f, i) => (
                                <div key={i} className="min-w-0">
                                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</p>
                                  <p className="mt-1 break-words text-sm font-bold text-foreground">{f.value}</p>
                                </div>
                              ))}
                            </div>
                          </button>

                          <div className="flex flex-wrap items-center gap-2">
                            <button type="button" onClick={() => setDetailsModal(r)}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted">
                              <Eye size={13} /> View Details
                            </button>
                            <p className="text-[10px] text-muted-foreground">{formatDate(r.createdAt!)}</p>
                            {r.status === "cancelled" && r.cancelNote && (
                              <p className="text-[11px] text-red-600 dark:text-red-400">✕ {r.cancelNote}</p>
                            )}
                            {uploadingId === r._id && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400">
                                <Loader2 size={10} className="animate-spin" /> Uploading...
                              </span>
                            )}
                            {hasFile && (
                              <button onClick={() => handleDownload(r)} disabled={downloadingId === r._id}
                                className="inline-flex items-center gap-1 text-[11px] text-purple-600 underline underline-offset-2 hover:text-purple-700 disabled:opacity-60 dark:text-purple-400">
                                {downloadingId === r._id
                                  ? <><Loader2 size={10} className="animate-spin" /> Downloading...</>
                                  : <><Download size={10} /> {r.file!.fileName || "View File"}</>}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}>
                          {r.status === "pending"    && <Clock size={11} />}
                          {r.status === "admin_seen" && <Eye size={11} />}
                          {r.status === "accepted"   && <CheckCircle size={11} />}
                          {r.status === "cancelled"  && <XCircle size={11} />}
                          {r.status === "completed"  && <CheckCircle size={11} />}
                          {STATUS_LABEL[r.status]}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {r.status === "pending" && (
                            <button disabled={isBusy} onClick={() => handleMarkSeen(r._id)}
                              className="flex items-center gap-1 rounded-lg bg-blue-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-blue-600 disabled:opacity-60">
                              <Eye size={13} />have seen
                            </button>
                          )}
                          {(r.status === "pending" || r.status === "admin_seen") && (
                            <button disabled={isBusy} onClick={() => handleAccept(r._id)}
                              className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-60">
                              <CheckCircle size={13} /> Accept
                            </button>
                          )}
                          {/* {isActive && (
                            <button disabled={isBusy} onClick={() => handleComplete(r._id)}
                              className="flex items-center gap-1 rounded-lg bg-purple-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-purple-600 disabled:opacity-60">
                              <CheckCircle size={13} /> সম্পন্ন
                            </button>
                          )} */}
                          {isActive && (
                            <button disabled={isBusy} onClick={() => setCancelModal({ id: r._id, note: "" })}
                              className="flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-rose-600 disabled:opacity-60">
                              <XCircle size={13} /> Cancel
                            </button>
                          )}
                          {/* File upload button — same as nid-withdraw */}
                          {isActive && (
                            <button disabled={uploadingId === r._id}
                              onClick={() => setUploadModal({ id: r._id, file: null, dragOver: false })}
                              className="flex items-center gap-1 rounded-lg bg-violet-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-violet-600 disabled:opacity-60">
                              {uploadingId === r._id
                                ? <><Loader2 size={13} className="animate-spin" /> Uploading...</>
                                : <><Upload size={13} /> Upload File</>}
                            </button>
                          )}
                          {!isActive && (
                            <button disabled={isBusy} onClick={() => handleAdminDelete(r._id)}
                              className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-sm hover:bg-muted disabled:opacity-60">
                              🗑️ Delete
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
      {detailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={() => setDetailsModal(null)}>
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setDetailsModal(null)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground">
              <X size={18} />
            </button>
            <div className="border-b border-border px-5 py-5 sm:px-6">
              <div className="pr-12">
                <h2 className="text-lg font-bold text-foreground sm:text-xl">Applicant Details</h2>
                <p className="mt-1 text-sm text-muted-foreground">দ্রুত কপি করে ম্যানুয়ালি প্রসেস করার জন্য বিস্তারিত তথ্য।</p>
              </div>
            </div>
            <div className="max-h-[65vh] overflow-y-auto space-y-4 px-5 py-5 sm:px-6">
              <div className="grid gap-3">
                {detailsModal.fields.map((f, i) => (
                  <DetailField key={i} label={`${FIELD_ICON[f.type]} ${f.label}`} value={f.value} buttonLabel={`Copy ${f.label}`} onCopy={() => handleCopy(f.value)} />
                ))}
              </div>
              <div className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Requested At</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{formatDate(detailsModal.createdAt!)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${getStatusBadge(detailsModal.status)}`}>
                      {STATUS_LABEL[detailsModal.status]}
                    </span>
                  </div>
                </div>
              </div>
              {detailsModal.status === "cancelled" && detailsModal.cancelNote && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  <span className="font-semibold">Cancel Note:</span> {detailsModal.cancelNote}
                </div>
              )}
              {detailsModal.file?.fileKey && (
                <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 dark:border-purple-500/30 dark:bg-purple-500/10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="shrink-0 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">{detailsModal.file.fileName}</p>
                        <p className="text-[10px] text-purple-600/70 dark:text-purple-400/70">Local Storage</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload(detailsModal)} disabled={downloadingId === detailsModal._id}
                      className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 disabled:opacity-60 dark:border-purple-500/30 dark:bg-purple-900/20 dark:text-purple-300">
                      {downloadingId === detailsModal._id
                        ? <><Loader2 size={13} className="animate-spin" /> ডাউনলোড হচ্ছে...</>
                        : <><Download size={13} /> ডাউনলোড</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-border px-6 py-4 text-right">
              <button onClick={() => setDetailsModal(null)} className="rounded-lg border border-border px-5 py-2 text-sm text-muted-foreground hover:bg-muted">বন্ধ করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal — identical to nid-withdraw pattern */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-base font-bold text-foreground">ফাইল আপলোড করুন</h3>
              <button onClick={() => setUploadModal(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div
                className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-colors cursor-pointer
                  ${uploadModal.dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"}`}
                onDragOver={(e) => { e.preventDefault(); setUploadModal((m) => m ? { ...m, dragOver: true } : m) }}
                onDragLeave={() => setUploadModal((m) => m ? { ...m, dragOver: false } : m)}
                onDrop={(e) => {
                  e.preventDefault()
                  setUploadModal((m) => m ? { ...m, dragOver: false } : m)
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleFileSelect(file)
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} className="text-muted-foreground" />
                {uploadModal.file ? (
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{uploadModal.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadModal.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">ফাইল drag করুন অথবা click করে নির্বাচন করুন</p>
                    <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX · সর্বোচ্চ {MAX_FILE_SIZE_MB} MB</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept={ALLOWED_EXTENSIONS} className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }} />
              </div>
              <div className="flex gap-3">
                <button onClick={handleUploadSubmit} disabled={!uploadModal.file}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
                  <Upload size={16} /> ফাইল পাঠান
                </button>
                <button onClick={() => setUploadModal(null)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted">
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="mb-1 text-base font-bold text-foreground">বাতিলের কারণ</h3>
            <p className="mb-3 text-sm text-muted-foreground">ব্যবহারকারীকে দেখানো হবে এবং পরিমাণ রিফান্ড হবে।</p>
            <textarea rows={3} value={cancelModal.note}
              onChange={(e) => setCancelModal((m) => m ? { ...m, note: e.target.value } : m)}
              placeholder="কারণ লিখুন..."
              className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={handleCancel} className="flex-1 rounded-xl bg-rose-500 py-2 text-sm font-semibold text-white hover:bg-rose-600">বাতিল নিশ্চিত করুন</button>
              <button onClick={() => setCancelModal(null)} className="flex-1 rounded-xl border border-border py-2 text-sm text-muted-foreground hover:bg-muted">ফিরে যান</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
