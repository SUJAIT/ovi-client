/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams }        from "next/navigation"
import { auth }             from "@/lib/firebase"
import { Button }           from "@/components/ui/button"
import { Input }            from "@/components/ui/input"
import { Label }            from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge }            from "@/components/ui/badge"
import { Calendar }         from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertCircle, Wallet, CalendarIcon, FileText,
  Download, MessageCircle, Info, Trash2, Loader2,
} from "lucide-react"
import { useUser }          from "@/hooks/useUser"
import { useNotifications } from "@/hooks/useNotifications"
import { format }           from "date-fns"
import Swal                 from "sweetalert2"
import {
  getAllServices,
  getMyServiceRequests,
  submitServiceRequest,
  serviceRequestDownloadFile,
  ICustomService,
  IServiceRequest,
    
  TServiceRequestStatus,
} from "@/lib/api.customService"

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_ORDER: Record<TServiceRequestStatus, number> = {
  pending: 0, admin_seen: 1, accepted: 2, completed: 3, cancelled: -1,
}

const STATUS_LABEL: Record<TServiceRequestStatus, string> = {
  pending: "Pending", admin_seen: "দেখা হয়েছে",
  accepted: "গৃহীত", cancelled: "বাতিল", completed: "সম্পন্ন",
}

const STEPS = [
  { key: "pending",    label: "আবেদন জমা" },
  { key: "admin_seen", label: "Admin দেখেছেন" },
  { key: "accepted",   label: "গৃহীত হয়েছে" },
  { key: "completed",  label: "সম্পন্ন হয়েছে" },
]

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

// ── Audio ─────────────────────────────────────────────────────────────────────

function playStatusSound() {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return
    const ctx = new AC(); let t = ctx.currentTime; const end = t + 3
    while (t < end) {
      const osc = ctx.createOscillator(); const g = ctx.createGain()
      osc.connect(g); g.connect(ctx.destination); osc.type = "triangle"
      osc.frequency.setValueAtTime(880, t); osc.frequency.exponentialRampToValueAtTime(640, t + 0.16)
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22); osc.start(t); osc.stop(t + 0.24); t += 0.8
    }
  } catch {}
}

// ── Progress Tracker ──────────────────────────────────────────────────────────

function ProgressTracker({ status }: { status: TServiceRequestStatus }) {
  if (status === "cancelled") {
    return (
      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
        ✕ আবেদন বাতিল হয়েছে
      </div>
    )
  }
  const cur = STATUS_ORDER[status]
  return (
    <div className="mt-3 flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const so = STATUS_ORDER[step.key as TServiceRequestStatus]
        const done = cur >= so; const active = cur === so
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all
                ${done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-muted text-muted-foreground"}
                ${active ? "ring-2 ring-emerald-300 ring-offset-1" : ""}`}>
                {done ? "✓" : idx + 1}
              </div>
              <span className={`mt-1 max-w-[60px] text-center text-[9px] leading-tight
                ${done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`mb-4 h-[2px] w-6 shrink-0 ${cur > so ? "bg-emerald-500" : "bg-border"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function parseFlexibleDate(value: string): Date | undefined {
  const input = value.trim()
  if (!input) return undefined
  const parts = input.split(/[./-]/).map((p) => p.trim())
  if (parts.length !== 3 || parts.some((p) => !/^\d+$/.test(p))) return undefined
  let y = 0, m = 0, d = 0
  if (parts[0].length === 4) { y = +parts[0]; m = +parts[1]; d = +parts[2] }
  else if (parts[2].length === 4) { d = +parts[0]; m = +parts[1]; y = +parts[2] }
  else return undefined
  if (y < 1900 || y > new Date().getFullYear() || m < 1 || m > 12 || d < 1 || d > 31) return undefined
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return undefined
  return date
}

// ── DOB Field Component ───────────────────────────────────────────────────────
// Standalone component so it can own its own local state without re-rendering siblings

function DobFieldInput({
  label, required, placeholder, value, onChange
}: {
  label: string; required: boolean; placeholder?: string; value: string; onChange: (v: string) => void
}) {
  const [dobInput, setDobInput]         = useState(value)
  const [dobDate, setDobDate]           = useState<Date | undefined>(() => parseFlexibleDate(value))
  const [calendarOpen, setCalendarOpen] = useState(false)

  const syncText = (val: string) => {
    setDobInput(val)
    const parsed = parseFlexibleDate(val)
    if (parsed) { const f = format(parsed, "yyyy-MM-dd"); setDobDate(parsed); onChange(f) }
    else onChange(val)
  }

  const handleBlur = () => {
    if (!dobInput.trim()) return
    const parsed = parseFlexibleDate(dobInput)
    if (parsed) { const f = format(parsed, "yyyy-MM-dd"); setDobDate(parsed); setDobInput(f); onChange(f) }
  }

  const handleCalSelect = (date: Date | undefined) => {
    if (!date) return
    const f = format(date, "yyyy-MM-dd"); setDobDate(date); setDobInput(f); onChange(f); setCalendarOpen(false)
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-foreground">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          placeholder={placeholder || "YYYY-MM-DD"}
          value={dobInput}
          onChange={(e) => syncText(e.target.value)}
          onBlur={handleBlur}
          className="border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground"
        />
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground">
              <CalendarIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={dobDate} onSelect={handleCalSelect}
              defaultMonth={dobDate} captionLayout="dropdown"
              fromYear={1940} toYear={new Date().getFullYear()} className="bg-card" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ServicePage() {
  const params = useParams()
  const slug   = params?.slug as string

  const { user, refreshWallet } = useUser()
  const { notifications }       = useNotifications()

  const [service,      setService]      = useState<ICustomService | null>(null)
  const [svcLoading,   setSvcLoading]   = useState(true)
  const [requests,     setRequests]     = useState<IServiceRequest[]>([])
  const [listLoading,  setListLoading]  = useState(true)
  const [values,       setValues]       = useState<Record<number, string>>({})
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState("")
  const [deletingId,   setDeletingId]   = useState<string | null>(null)
  const [downloadingId,setDownloadingId]= useState<string | null>(null)

  const seenIds  = useRef<Set<string>>(new Set())
  const isAdmin  = user?.role === "admin" || user?.role === "super_admin"
  const balance  = user?.wallet?.balance ?? 0

  // ── Load service ───────────────────────────────────────────────────────────

  useEffect(() => {
    getAllServices()
      .then((res) => {
        if (res.success) {
          const svc = (res.data as ICustomService[]).find((s) => s.slug === slug)
          if (svc) {
            setService(svc)
            const init: Record<number, string> = {}
            svc.form.fields.forEach((_, i) => { init[i] = "" })
            setValues(init)
          }
        }
      })
      .finally(() => setSvcLoading(false))
  }, [slug])

  // ── Load history ───────────────────────────────────────────────────────────

  const fetchRequests = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await getMyServiceRequests(token, slug)
      if (res.success) {
        const sorted = [...(res.data as IServiceRequest[])]
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 10)
        setRequests(sorted)
      }
    } finally { setListLoading(false) }
  }, [slug])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  // ── Real-time status update from socket ────────────────────────────────────

  useEffect(() => {
    const STATUS_TYPES = ["service_request_seen","service_request_accepted","service_request_completed","service_request_cancelled"]
    const latest = notifications.find((n) => STATUS_TYPES.includes(n.type))
    if (!latest) return
    if (seenIds.current.has(latest._id)) return
    seenIds.current.add(latest._id)

    const data = (latest.data ?? {}) as {
      requestId?: string; status?: TServiceRequestStatus
      cancelNote?: string; refundAmount?: number; hasFile?: boolean
    }
    if (!data.requestId || !data.status) return

    // Update progress in place — no reload needed
    setRequests((prev) =>
      prev.map((r) =>
        r._id === data.requestId
          ? { ...r, status: data.status!, ...(data.cancelNote ? { cancelNote: data.cancelNote } : {}) }
          : r
      )
    )

    // Refund: update wallet balance immediately in UI
    if (data.status === "cancelled") {
      void refreshWallet()
    }

    // If file was uploaded, re-fetch to get file metadata for download button
    if (data.status === "completed" && data.hasFile) {
      void fetchRequests()
    }

    playStatusSound()
  }, [notifications, refreshWallet, fetchRequests])

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!service) return
    setError("")

    for (let i = 0; i < service.form.fields.length; i++) {
      const f = service.form.fields[i]
      if (f.required && !values[i]?.trim()) { setError(`"${f.label}" পূরণ করা আবশ্যক`); return }
    }

    const priceNum = parseInt(service.card.price.replace(/[^\d]/g, ""), 10) || 0
    if (!isAdmin && priceNum > 0 && balance < priceNum) {
      setError("পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।"); return
    }

    const fields = service.form.fields.map((f, i) => ({ label: f.label, value: values[i] ?? "", type: f.type }))

    setLoading(true)
    Swal.fire({
      title: "আবেদন জমা হচ্ছে...", html: "অনুগ্রহ করে অপেক্ষা করুন",
      allowOutsideClick: false, didOpen: () => Swal.showLoading(),
      background: "hsl(var(--card))", color: "hsl(var(--foreground))",
    })

    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Not authenticated")
      const res = await submitServiceRequest(token, slug, fields)
      Swal.close()

      if (!res.success) {
        setError(res.code === "INSUFFICIENT_BALANCE" ? "পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।" : res.message || "সমস্যা হয়েছে")
        return
      }

      await refreshWallet()
      await fetchRequests()
      const init: Record<number, string> = {}
      service.form.fields.forEach((_, i) => { init[i] = "" })
      setValues(init)

      Swal.fire({
        icon: "success", title: "আবেদন সফল হয়েছে",
        text: "Admin process করলে আপনাকে নোটিফিকেশন পাঠানো হবে।",
        confirmButtonText: "ঠিক আছে",
        background: "hsl(var(--card))", color: "hsl(var(--foreground))",
        confirmButtonColor: "#0f172a",
      })
    } catch {
      Swal.close(); setError("সার্ভার এরর। আবার চেষ্টা করুন।")
    } finally { setLoading(false) }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "আবেদন মুছবেন?", text: "এই আবেদনটি আপনার ইতিহাস থেকে স্থায়ীভাবে মুছে যাবে।",
      icon: "warning", showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছুন", cancelButtonText: "না",
      confirmButtonColor: "#ef4444",
      background: "hsl(var(--card))", color: "hsl(var(--foreground))",
    })
    if (!confirm.isConfirmed) return

    setDeletingId(id)
    try {
      setRequests((prev) => prev.filter((r) => r._id !== id))
      Swal.fire({ icon: "success", title: "মুছে ফেলা হয়েছে", timer: 1500, showConfirmButton: false, background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
    } finally { setDeletingId(null) }
  }

  // ── Download ───────────────────────────────────────────────────────────────

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

  // ── Render ─────────────────────────────────────────────────────────────────

  if (svcLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )

  if (!service) return (
    <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">সার্ভিস পাওয়া যায়নি।</div>
  )

  const priceNum  = parseInt(service.card.price.replace(/[^\d]/g, ""), 10) || 0
  const canAfford = isAdmin || priceNum === 0 || balance >= priceNum

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-3 py-4 text-foreground sm:px-0 sm:py-0">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          {service.header?.title || service.card.title}
        </h1>
        {!isAdmin && (
          <Badge variant="outline" className="shrink-0 gap-1.5 px-3 py-1.5 text-sm">
            <Wallet className="size-4" />৳{balance}
          </Badge>
        )}
      </div>

      {/* Notice */}
      {service.notice?.active && service.notice.text && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 size-4 shrink-0 text-blue-500 dark:text-blue-400" />
            <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">{service.notice.text}</p>
          </div>
        </div>
      )}

      {/* Balance warning */}
      {!isAdmin && !canAfford && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="size-4 shrink-0" />
          পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ৳{balance}, প্রয়োজন {service.card.price}।
        </div>
      )}

      {/* Form */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-foreground">{service.form.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {service.form.fields.sort((a, b) => a.order - b.order).map((field, idx) => {
            if (field.type === "dob") {
              return (
                <DobFieldInput
                  key={field._id ?? idx}
                  label={field.label}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[idx] ?? ""}
                  onChange={(v) => setValues((prev) => ({ ...prev, [idx]: v }))}
                />
              )
            }
            if (field.type === "bigbox") {
              return (
                <div key={field._id ?? idx} className="space-y-1.5">
                  <Label className="text-foreground">
                    {field.label}{field.required && <span className="ml-1 text-red-500">*</span>}
                  </Label>
                  <textarea rows={4}
                    placeholder={field.placeholder || `${field.label} বিস্তারিত লিখুন`}
                    value={values[idx] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [idx]: e.target.value }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )
            }
            return (
              <div key={field._id ?? idx} className="space-y-1.5">
                <Label className="text-foreground">
                  {field.label}{field.required && <span className="ml-1 text-red-500">*</span>}
                </Label>
                <Input placeholder={field.placeholder || `${field.label} লিখুন`}
                  value={values[idx] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [idx]: e.target.value }))}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )
          })}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <AlertCircle className="size-4 shrink-0" />{error}
            </div>
          )}

          {!isAdmin && priceNum > 0 && (
            <p className="rounded-lg border border-border bg-muted/40 py-2.5 text-center text-sm text-muted-foreground">
              এই সেবার জন্য <span className="font-semibold text-primary">{service.card.price}</span> চার্জ কাটবে
            </p>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/20 py-5">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-center text-sm text-muted-foreground">আবেদন জমা হচ্ছে...</p>
            </div>
          )}

          <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading || !canAfford}>
            <FileText className="size-4" />
            {loading ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
          </Button>
        </CardContent>
      </Card>

      {/* History */}
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
                    <div className="min-w-0 flex-1">
                      {r.fields.slice(0, 2).map((f, i) => (
                        <p key={i} className={`truncate ${i === 0 ? "text-sm font-semibold text-foreground" : "text-xs text-muted-foreground"}`}>
                          {i === 0 ? f.value : `${f.label}: ${f.value}`}
                        </p>
                      ))}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(r.status)}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(r.createdAt!).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <button disabled={deletingId === r._id} onClick={() => handleDelete(r._id)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
                        <Trash2 size={10} />{deletingId === r._id ? "..." : "মুছুন"}
                      </button>
                    </div>
                  </div>

                  <ProgressTracker status={r.status} />

                  {r.status === "cancelled" && r.cancelNote && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                      <strong>বাতিলের কারণ:</strong> {r.cancelNote}
                    </p>
                  )}

                  {r.status === "completed" && r.file?.fileKey && (
                    <button
                      onClick={() => handleDownload(r)}
                      disabled={downloadingId === r._id}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                    >
                      {downloadingId === r._id
                        ? <><Loader2 className="size-3.5 animate-spin" />ডাউনলোড হচ্ছে...</>
                        : <><Download className="size-3.5" />{r.file.fileName ? `ডাউনলোড করুন — ${r.file.fileName}` : "ফাইল ডাউনলোড করুন"}</>
                      }
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <MessageCircle className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
        <p>
          সার্ভিস জনিত কোন সমস্যা হলে আমাদের{" "}
          <a href="https://wa.me/8801973346401?text=Hello%20" target="_blank" rel="noopener noreferrer"
            className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
            WhatsApp
          </a>{" "}এ যোগাযোগ করুন।
        </p>
      </div>
    </div>
  )
}
