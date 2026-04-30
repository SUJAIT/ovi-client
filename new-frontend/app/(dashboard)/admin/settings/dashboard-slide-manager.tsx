/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"
// app/(dashboard)/admin/settings/slide-manager.tsx

import { useEffect, useState } from "react"
import { Plus, Save, Trash2, Loader2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react"
import Swal       from "sweetalert2"
import { auth }   from "@/lib/firebase"
import { getAdminSettings, updateAdminSettings } from "@/lib/api"

// ── Types ─────────────────────────────────────────────────────────────────────

export type TSlide = {
  title:    string
  subtitle: string
  emoji:    string
  bg:       string
  accent:   string
  active:   boolean
  order:    number
}

// ── Preset gradients & accents ────────────────────────────────────────────────

const BG_PRESETS = [
  { label: "Dark Blue",  value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",  accent: "#e94560" },
  { label: "Dark Green", value: "linear-gradient(135deg, #0d1b2a 0%, #1b4332 50%, #2d6a4f 100%)",  accent: "#52b788" },
  { label: "Purple",     value: "linear-gradient(135deg, #2d0036 0%, #6a0572 50%, #ab1f91 100%)",  accent: "#e040fb" },
  { label: "Ocean",      value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",  accent: "#4facfe" },
  { label: "Sunset",     value: "linear-gradient(135deg, #1a0533 0%, #6b1a3a 50%, #c0392b 100%)",  accent: "#f7971e" },
  { label: "Forest",     value: "linear-gradient(135deg, #0a2e0a 0%, #1a5c1a 50%, #2e7d32 100%)",  accent: "#a5d6a7" },
  { label: "Midnight",   value: "linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)",  accent: "#bb86fc" },
  { label: "Gold",       value: "linear-gradient(135deg, #1a1100 0%, #3d2b00 50%, #7c5c00 100%)",  accent: "#ffd700" },
]

const emptySlide = (order: number): TSlide => ({
  title:    "",
  subtitle: "",
  emoji:    "🚀",
  bg:       BG_PRESETS[0].value,
  accent:   BG_PRESETS[0].accent,
  active:   true,
  order,
})

// ── Small preview card ────────────────────────────────────────────────────────

function SlidePreview({ slide }: { slide: TSlide }) {
  return (
    <div
      className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl"
      style={{ background: slide.bg }}
    >
      <div className="absolute right-[-10px] top-[-10px] h-20 w-20 rounded-full opacity-10"
        style={{ background: slide.accent }} />
      <div className="z-10 flex flex-col items-center gap-1 px-4 text-center">
        <span className="text-2xl leading-none">{slide.emoji || "🚀"}</span>
        <span className="text-sm font-bold text-white leading-tight line-clamp-1">
          {slide.title || "Slide Title"}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ color: slide.accent, background: "rgba(255,255,255,0.12)" }}
        >
          {slide.subtitle || "Subtitle"}
        </span>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SlideManager() {
  const [slides,  setSlides]  = useState<TSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  // ── Load ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        if (!token) return
        const res = await getAdminSettings(token)
        if (res?.success && res.data?.slides) {
          setSlides(
            [...res.data.slides].sort((a: TSlide, b: TSlide) => a.order - b.order)
          )
        }
      } catch { /* keep empty */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────

  const update = (idx: number, patch: Partial<TSlide>) =>
    setSlides((prev) => prev.map((s, i) => i === idx ? { ...s, ...patch } : s))

  const addSlide = () => {
    const newSlide = emptySlide(slides.length)
    setSlides((prev) => [...prev, newSlide])
    setExpanded(slides.length)
  }

  const removeSlide = async (idx: number) => {
    const confirm = await Swal.fire({
      title: "স্লাইড মুছবেন?", icon: "warning",
      showCancelButton: true, confirmButtonText: "হ্যাঁ, মুছুন",
      cancelButtonText: "না", confirmButtonColor: "#dc2626",
      background: "hsl(var(--card))", color: "hsl(var(--foreground))",
    })
    if (!confirm.isConfirmed) return
    setSlides((prev) =>
      prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i }))
    )
    setExpanded(null)
  }

  const moveSlide = (idx: number, dir: "up" | "down") => {
    const target = dir === "up" ? idx - 1 : idx + 1
    if (target < 0 || target >= slides.length) return
    const next = [...slides]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setSlides(next.map((s, i) => ({ ...s, order: i })))
    setExpanded(target)
  }

  const applyBgPreset = (idx: number, preset: typeof BG_PRESETS[number]) =>
    update(idx, { bg: preset.value, accent: preset.accent })

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    for (let i = 0; i < slides.length; i++) {
      if (!slides[i].title.trim()) {
        Swal.fire({ icon: "warning", title: `Slide ${i + 1} এর শিরোনাম খালি`, background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
        setExpanded(i)
        return
      }
    }

    setSaving(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Not authenticated")

      const payload = slides.map((s, i) => ({ ...s, order: i }))
      const res = await updateAdminSettings(token, { slides: payload } as any)

      if (!res?.success) throw new Error(res?.message || "Save failed")

      Swal.fire({
        icon: "success", title: "স্লাইড সংরক্ষিত হয়েছে",
        timer: 1800, showConfirmButton: false,
        background: "hsl(var(--card))", color: "hsl(var(--foreground))",
      })
    } catch (err: any) {
      Swal.fire({ icon: "error", title: err?.message || "সমস্যা হয়েছে", background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
    } finally { setSaving(false) }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-10">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="rounded-[28px] border border-border bg-card shadow-sm">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Slide Manager</h2>
          <p className="text-sm text-muted-foreground">Dashboard-এর Hero Slider পরিবর্তন করুন</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addSlide}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <Plus size={16} /> নতুন স্লাইড
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "সংরক্ষণ হচ্ছে..." : "Save করুন"}
          </button>
        </div>
      </div>

      {/* Slide list */}
      <div className="space-y-3 p-5 md:p-6">
        {slides.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            কোনো স্লাইড নেই। "নতুন স্লাইড" বোতামে ক্লিক করুন।
          </p>
        )}

        {slides.map((slide, idx) => {
          const isOpen = expanded === idx
          return (
            <div key={idx} className="overflow-hidden rounded-2xl border border-border bg-muted/20">

              {/* Collapsed row */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Preview thumbnail */}
                <div
                  className="h-10 w-16 shrink-0 rounded-lg"
                  style={{ background: slide.bg }}
                />

                {/* Info */}
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setExpanded(isOpen ? null : idx)}>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {slide.emoji} {slide.title || <span className="text-muted-foreground">শিরোনাম নেই</span>}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{slide.subtitle || "—"}</p>
                </div>

                {/* Controls */}
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => update(idx, { active: !slide.active })} title={slide.active ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                    className={`rounded-lg p-1.5 transition-colors ${slide.active ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-muted"}`}>
                    {slide.active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button disabled={idx === 0} onClick={() => moveSlide(idx, "up")}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30">
                    <ChevronUp size={16} />
                  </button>
                  <button disabled={idx === slides.length - 1} onClick={() => moveSlide(idx, "down")}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30">
                    <ChevronDown size={16} />
                  </button>
                  <button onClick={() => removeSlide(idx)}
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => setExpanded(isOpen ? null : idx)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted">
                    {isOpen ? "বন্ধ" : "সম্পাদনা"}
                  </button>
                </div>
              </div>

              {/* Expanded editor */}
              {isOpen && (
                <div className="border-t border-border px-4 pb-5 pt-4 space-y-5">

                  {/* Live preview */}
                  <SlidePreview slide={slide} />

                  {/* Text fields */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">শিরোনাম *</label>
                      <input className={inputCls} placeholder="ICTSeba-তে স্বাগতম !"
                        value={slide.title} onChange={(e) => update(idx, { title: e.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">সাব-টাইটেল</label>
                      <input className={inputCls} placeholder="সার্ভার কপি এখন আরও সহজ"
                        value={slide.subtitle} onChange={(e) => update(idx, { subtitle: e.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Emoji</label>
                      <input className={inputCls} placeholder="🚀" maxLength={4}
                        value={slide.emoji} onChange={(e) => update(idx, { emoji: e.target.value })} />
                    </div>
                  </div>

                  {/* Background preset picker */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Background Gradient</label>
                    <div className="flex flex-wrap gap-2">
                      {BG_PRESETS.map((p) => (
                        <button
                          key={p.value}
                          title={p.label}
                          onClick={() => applyBgPreset(idx, p)}
                          className={`h-9 w-14 rounded-lg transition-all ${slide.bg === p.value ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"}`}
                          style={{ background: p.value }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Custom BG / Accent */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Custom BG CSS (gradient)</label>
                      <input className={inputCls} placeholder="linear-gradient(...)"
                        value={slide.bg} onChange={(e) => update(idx, { bg: e.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Accent Colour (hex / rgb)</label>
                      <div className="flex gap-2">
                        <input type="color" value={slide.accent}
                          onChange={(e) => update(idx, { accent: e.target.value })}
                          className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-background p-1" />
                        <input className={inputCls} placeholder="#e94560"
                          value={slide.accent} onChange={(e) => update(idx, { accent: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {/* Active toggle */}
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                    <input type="checkbox" checked={slide.active}
                      onChange={(e) => update(idx, { active: e.target.checked })}
                      className="h-4 w-4 rounded" />
                    Dashboard-এ দেখাবে (Active)
                  </label>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
