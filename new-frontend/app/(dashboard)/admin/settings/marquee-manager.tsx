/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Plus, Save, Trash2, Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase"
import { getAdminSettings, updateAdminSettings } from "@/lib/api"

type TMarqueeItem = {
  text: string
  active: boolean
  order: number
}

type TSettingsData = {
  marqueeEnabled: boolean
  marqueeSpeed: number
  marqueeItems: TMarqueeItem[]
}

const defaultSettings: TSettingsData = {
  marqueeEnabled: true,
  marqueeSpeed: 50,
  marqueeItems: [],
}

export default function MarqueeManager() {
  const [marqueeEnabled, setMarqueeEnabled] = useState(true)
  const [marqueeSpeed, setMarqueeSpeed] = useState(50)
  const [items, setItems] = useState<TMarqueeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) throw new Error("Please login again")

        const token = await currentUser.getIdToken()
        const result = await getAdminSettings(token)

        if (!result?.success) {
          throw new Error(result?.message || "Failed to load settings")
        }

        const data: TSettingsData = result?.data || defaultSettings
        setMarqueeEnabled(data.marqueeEnabled ?? true)
        setMarqueeSpeed(data.marqueeSpeed ?? 50)
        setItems(data.marqueeItems ?? [])
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "লোড ব্যর্থ হয়েছে",
          text: error.message || "Settings load করা যায়নি",
          confirmButtonColor: "#0f172a",
          background: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const addItem = () => {
    setItems((prev) => [...prev, { text: "", active: true, order: prev.length }])
  }

  const updateItem = (
    index: number,
    key: keyof TMarqueeItem,
    value: string | boolean | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    )
  }

  const removeItem = async (index: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "নোটিশ মুছবেন?",
      text: "এই marquee notice টি remove হয়ে যাবে।",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#334155",
      background: "hsl(var(--card))",
      color: "hsl(var(--foreground))",
    })

    if (!result.isConfirmed) return

    setItems((prev) =>
      prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i }))
    )
  }

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const updated = [...items]
    ;[updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]]

    setItems(updated.map((item, i) => ({ ...item, order: i })))
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error("Please login again")

      if (!Number.isFinite(marqueeSpeed) || marqueeSpeed < 1 || marqueeSpeed > 100) {
        throw new Error("Speed must be between 1 and 100")
      }

      const cleanedItems = items
        .map((item, index) => ({
          text: item.text.trim(),
          active: item.active,
          order: index,
        }))
        .filter((item) => item.text.length > 0)

      if (cleanedItems.length === 0) {
        throw new Error("কমপক্ষে একটি notice দিতে হবে")
      }

      const token = await currentUser.getIdToken()
      const result = await updateAdminSettings(token, {
        marqueeEnabled,
        marqueeSpeed,
        marqueeItems: cleanedItems,
      })

      if (!result?.success) {
        throw new Error(result?.message || "Save failed")
      }

      setItems(cleanedItems)

      await Swal.fire({
        icon: "success",
        title: "সফলভাবে সেভ হয়েছে",
        text: result.message || "Settings updated successfully",
        confirmButtonColor: "#0f172a",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
      })
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "সেভ ব্যর্থ হয়েছে",
        text: error.message || "Save failed",
        confirmButtonColor: "#0f172a",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 size={18} className="animate-spin" />
          Loading settings...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Marquee Control</h2>
          <p className="text-sm text-muted-foreground">
            Dashboard notice bar admin থেকে manage করুন
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-primary dark:text-primary-foreground dark:hover:opacity-90"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-4">
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Marquee Status
          </label>
          <button
            onClick={() => setMarqueeEnabled((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              marqueeEnabled
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
            }`}
          >
            {marqueeEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Speed
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={marqueeSpeed}
            onChange={(e) => setMarqueeSpeed(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            বেশি value হলে marquee দ্রুত চলবে, কম value হলে ধীরে চলবে।
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Notice Items
        </h3>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Plus size={16} />
          Add Notice
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-muted/30 p-4"
          >
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(index, "text", e.target.value)}
                placeholder="নোটিশ লিখুন"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveItem(index, "up")}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  Up
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  Down
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={(e) => updateItem(index, "active", e.target.checked)}
                />
                Active
              </label>

              <span className="text-xs text-muted-foreground">Order: {index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
