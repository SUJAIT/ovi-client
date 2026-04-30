/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
// components/admin/settings/server-copy-manager.tsx
// Admin UI to edit Server Copy page heading, notice, and service charge.
// Plugs into the same PATCH /settings/admin endpoint used by MarqueeManager.

import { useEffect, useState } from "react"
import { Save, Loader2, Info } from "lucide-react"
import Swal from "sweetalert2"
import { auth } from "@/lib/firebase"
import { getAdminSettings, updateAdminSettings } from "@/lib/api"

type TServerCopyFields = {
  serverCopyCharge: number
  serverCopyTitle: string
  serverCopyNotice: string
}

const DEFAULTS: TServerCopyFields = {
  serverCopyCharge: 70,
  serverCopyTitle: "সার্ভার কপি",
  serverCopyNotice: "NID অবশ্যই ১০ বা ১৭ সংখ্যার হতে হবে। যদি সংখ্যা ১৩ অঙ্কের হয়, তাহলে NID নম্বরের পূর্বে জন্মসাল যোগ করে ১৭ অঙ্কের করে সার্ভার কপি তৈরি করুন।",
}

export default function ServerCopyManager() {
  const [fields, setFields] = useState<TServerCopyFields>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // ── Load current settings ──────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        if (!token) return
        const res = await getAdminSettings(token)
        if (res?.success && res.data) {
          setFields({
            serverCopyCharge: res.data.serverCopyCharge ?? DEFAULTS.serverCopyCharge,
            serverCopyTitle: res.data.serverCopyTitle ?? DEFAULTS.serverCopyTitle,
            serverCopyNotice: res.data.serverCopyNotice ?? DEFAULTS.serverCopyNotice,
          })
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!fields.serverCopyTitle.trim()) {
      Swal.fire({ icon: "warning", title: "Page শিরোনাম খালি রাখা যাবে না", background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
      return
    }

    const charge = Number(fields.serverCopyCharge)
    if (!Number.isFinite(charge) || charge < 0) {
      Swal.fire({ icon: "warning", title: "সঠিক মূল্য দিন (০ বা তার বেশি)", background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
      return
    }

    setSaving(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Not authenticated")

      // updateAdminSettings sends a partial patch — only these keys are updated
      const res = await updateAdminSettings(token, {
        serverCopyCharge: charge,
        serverCopyTitle: fields.serverCopyTitle.trim(),
        serverCopyNotice: fields.serverCopyNotice.trim(),
      } as any)

      if (res?.success) {
        Swal.fire({ icon: "success", title: "সংরক্ষিত হয়েছে", timer: 1800, showConfirmButton: false, background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
      } else {
        throw new Error(res?.message || "Update failed")
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", title: err?.message || "সমস্যা হয়েছে", background: "hsl(var(--card))", color: "hsl(var(--foreground))" })
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
  const labelCls = "block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide"

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-10">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Server Copy Page Settings</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Change page title, notice and service charge</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Saving ..." : "Save"}
        </button>
      </div>

      <div className="space-y-5 px-6 py-5">

        {/* Title */}
        <div>
          <label className={labelCls}>Page Title (Heading)</label>
          <input
            className={inputCls}
            value={fields.serverCopyTitle}
            onChange={(e) => setFields((f) => ({ ...f, serverCopyTitle: e.target.value }))}
            placeholder="সার্ভার কপি"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">The user's server copy will appear as H1 on the page.</p>
        </div>

        {/* Charge */}
        <div>
          <label className={labelCls}>Service Charge (BDT)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">৳</span>
            <input
              type="number"
              min={0}
              step={1}
              className={`${inputCls} pl-7`}
              value={fields.serverCopyCharge}
              onChange={(e) => setFields((f) => ({ ...f, serverCopyCharge: Number(e.target.value) }))}
              placeholder="70"
            />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            The amount that will be deducted from the user. If you enter 0, it will be free.
            This value is also used directly in the backend — the user will see it upon page reload.
          </p>
        </div>

        {/* Notice */}
        <div>
          <label className={labelCls}>Notice Board Text</label>
          <textarea
            rows={3}
            className={inputCls}
            value={fields.serverCopyNotice}
            onChange={(e) => setFields((f) => ({ ...f, serverCopyNotice: e.target.value }))}
            placeholder="NID অবশ্যই ১০ বা ১৭ সংখ্যার হতে হবে..."
          />
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Info className="size-3 shrink-0" />
          It will be shown in the blue notice card on the server copy page. If left empty, the notice will be hidden.

          </p>
        </div>
      </div>
    </div>
  )
}
