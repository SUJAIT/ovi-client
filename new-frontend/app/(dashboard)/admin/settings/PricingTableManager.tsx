/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"
// // app/(dashboard)/admin/settings/pricing-table-manager.tsx
// // Admin CRUD panel for the service pricing table.

// import { useState, useEffect } from "react"
// import {
//   Plus, Trash2, GripVertical, Save, ChevronDown, ChevronUp,
//   ToggleLeft, ToggleRight, Tag, Info, PackageCheck, User2, Banknote,
// } from "lucide-react"

// // ── Types ──────────────────────────────────────────────────────────────────────

// type TRow = {
//   _id?:         string
//   service:      string
//   description:  string
//   userProvides: string
//   deliverable:  string
//   price:        number | ""
//   unit:         string
//   available:    boolean
//   order:        number
// }

// type TSettings = {
//   pricingTableEnabled: boolean
//   pricingTableTitle:   string
//   pricingTableRows:    TRow[]
// }

// // ── API helpers (adjust import paths to your project) ─────────────────────────

// const fetchAdminSettings  = (): Promise<{ success: boolean; data: TSettings }> =>
//   fetch("/api/settings/admin", { credentials: "include" }).then((r) => r.json())

// const patchAdminSettings  = (body: Partial<TSettings>): Promise<{ success: boolean }> =>
//   fetch("/api/settings/admin", {
//     method:      "PATCH",
//     credentials: "include",
//     headers:     { "Content-Type": "application/json" },
//     body:        JSON.stringify(body),
//   }).then((r) => r.json())

// // ── Helpers ───────────────────────────────────────────────────────────────────

// const blank = (): TRow => ({
//   service: "", description: "", userProvides: "", deliverable: "",
//   price: "", unit: "প্রতি কপি", available: true, order: 0,
// })

// const UNIT_PRESETS = ["প্রতি কপি", "per request", "সর্বনিম্ন", "per month", "flat fee"]

// // ── CSS ───────────────────────────────────────────────────────────────────────

// const CSS = `
//   .ptm-wrap { font-family: system-ui, sans-serif; }
//   .ptm-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; }
//   .ptm-title  { font-size:16px; font-weight:700; display:flex; align-items:center; gap:8px; }
//   .ptm-badge  { font-size:11px; padding:3px 9px; border-radius:20px; font-weight:600;
//                 background:hsl(var(--primary)/0.12); color:hsl(var(--primary)); }
//   .ptm-toggle { display:flex; align-items:center; gap:7px; font-size:13px; font-weight:600;
//                 cursor:pointer; padding:7px 14px; border-radius:22px; border:1.5px solid hsl(var(--border));
//                 background:hsl(var(--card)); transition:all .18s; user-select:none; }
//   .ptm-toggle:hover { border-color:hsl(var(--primary)); background:hsl(var(--primary)/0.06); }
//   .ptm-toggle.on { background:hsl(var(--primary)/0.1); border-color:hsl(var(--primary)); color:hsl(var(--primary)); }

//   .ptm-meta-row { display:grid; grid-template-columns:1fr auto; gap:12px; align-items:end; margin-bottom:20px; }
//   .ptm-input { width:100%; padding:9px 13px; border-radius:10px; border:1.5px solid hsl(var(--border));
//                background:hsl(var(--background)); color:hsl(var(--foreground)); font-size:14px;
//                transition:border .18s; outline:none; box-sizing:border-box; }
//   .ptm-input:focus { border-color:hsl(var(--primary)); }
//   .ptm-label { font-size:12px; font-weight:600; color:hsl(var(--muted-foreground)); margin-bottom:5px; }

//   .ptm-rows { display:flex; flex-direction:column; gap:14px; }

//   .ptm-row { border-radius:16px; border:1.5px solid hsl(var(--border)); background:hsl(var(--card));
//              overflow:hidden; transition:box-shadow .18s; }
//   .ptm-row:hover { box-shadow:0 4px 18px rgba(0,0,0,0.07); }
//   .ptm-row.unavailable { opacity:.6; }

//   .ptm-row-head { display:flex; align-items:center; gap:10px; padding:13px 16px;
//                   background:hsl(var(--muted)/0.4); cursor:pointer; }
//   .ptm-row-grip { color:hsl(var(--muted-foreground)); flex-shrink:0; cursor:grab; }
//   .ptm-row-name { flex:1; font-size:14px; font-weight:700; color:hsl(var(--foreground)); }
//   .ptm-row-price{ font-size:13px; font-weight:700; color:hsl(var(--primary)); white-space:nowrap; }
//   .ptm-row-avail{ display:flex; align-items:center; gap:5px; font-size:12px; font-weight:600;
//                   padding:4px 10px; border-radius:20px; cursor:pointer; transition:all .18s; }
//   .ptm-row-avail.on  { background:rgba(52,211,153,0.14); color:#10b981; }
//   .ptm-row-avail.off { background:rgba(239,68,68,0.12); color:#ef4444; }
//   .ptm-row-del { color:hsl(var(--muted-foreground)); cursor:pointer; padding:4px;
//                  border-radius:7px; transition:all .18s; flex-shrink:0; }
//   .ptm-row-del:hover { background:rgba(239,68,68,0.1); color:#ef4444; }

//   .ptm-row-body { padding:16px; display:grid; grid-template-columns:1fr 1fr; gap:14px; }
//   .ptm-row-body-full { grid-column:1/-1; }
//   .ptm-field { display:flex; flex-direction:column; gap:5px; }
//   .ptm-field-icon { display:flex; align-items:center; gap:5px; color:hsl(var(--muted-foreground)); }

//   .ptm-price-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
//   .ptm-select { appearance:none; cursor:pointer; }

//   .ptm-add-btn { margin-top:16px; width:100%; padding:11px; border-radius:12px; border:2px dashed hsl(var(--border));
//                  background:transparent; color:hsl(var(--muted-foreground)); font-size:13px; font-weight:600;
//                  cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px;
//                  transition:all .18s; }
//   .ptm-add-btn:hover { border-color:hsl(var(--primary)); color:hsl(var(--primary)); background:hsl(var(--primary)/0.05); }

//   .ptm-save-row { display:flex; justify-content:flex-end; margin-top:20px; }
//   .ptm-save-btn { display:flex; align-items:center; gap:8px; padding:10px 24px; border-radius:12px;
//                   border:none; background:hsl(var(--primary)); color:hsl(var(--primary-foreground));
//                   font-size:14px; font-weight:700; cursor:pointer; transition:opacity .18s; }
//   .ptm-save-btn:hover { opacity:.88; }
//   .ptm-save-btn:disabled { opacity:.5; cursor:not-allowed; }

//   .ptm-toast { position:fixed; bottom:24px; right:24px; padding:12px 20px; border-radius:12px;
//                font-size:13px; font-weight:600; color:#fff; z-index:9999;
//                animation:ptm-in .25s ease; box-shadow:0 6px 20px rgba(0,0,0,0.16); }
//   .ptm-toast.ok  { background:#10b981; }
//   .ptm-toast.err { background:#ef4444; }
//   @keyframes ptm-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

//   @media(max-width:600px) {
//     .ptm-row-body { grid-template-columns:1fr; }
//     .ptm-row-body-full { grid-column:1; }
//     .ptm-price-row { grid-template-columns:1fr; }
//   }
// `

// // ── Component ─────────────────────────────────────────────────────────────────

// export default function PricingTableManager() {
//   const [enabled,  setEnabled]  = useState(true)
//   const [title,    setTitle]    = useState("আমাদের সেবা ও মূল্য তালিকা")
//   const [rows,     setRows]     = useState<TRow[]>([])
//   const [expanded, setExpanded] = useState<number | null>(null)
//   const [saving,   setSaving]   = useState(false)
//   const [toast,    setToast]    = useState<{ msg: string; type: "ok" | "err" } | null>(null)

//   useEffect(() => {
//     fetchAdminSettings().then((res) => {
//       if (res.success) {
//         setEnabled(res.data.pricingTableEnabled ?? true)
//         setTitle(res.data.pricingTableTitle ?? "আমাদের সেবা ও মূল্য তালিকা")
//         setRows((res.data.pricingTableRows ?? []).sort((a, b) => a.order - b.order))
//       }
//     })
//   }, [])

//   const showToast = (msg: string, type: "ok" | "err") => {
//     setToast({ msg, type })
//     setTimeout(() => setToast(null), 3000)
//   }

//   const update = (i: number, patch: Partial<TRow>) =>
//     setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))

//   const addRow = () => {
//     setRows((prev) => [...prev, { ...blank(), order: prev.length }])
//     setExpanded(rows.length)
//   }

//   const removeRow = (i: number) => {
//     setRows((prev) => prev.filter((_, idx) => idx !== i).map((r, idx) => ({ ...r, order: idx })))
//     if (expanded === i) setExpanded(null)
//   }

//   const toggleAvail = (i: number) =>
//     update(i, { available: !rows[i].available })

//   const save = async () => {
//     for (const r of rows) {
//       if (!r.service.trim()) { showToast("প্রতিটি সেবার নাম দিন", "err"); return }
//       if (r.price === "" || Number(r.price) < 0) { showToast("সব মূল্য সঠিকভাবে দিন", "err"); return }
//     }
//     setSaving(true)
//     const payload = {
//       pricingTableEnabled: enabled,
//       pricingTableTitle:   title,
//       pricingTableRows:    rows.map((r, i) => ({ ...r, price: Number(r.price), order: i })),
//     }
//     const res = await patchAdminSettings(payload)
//     setSaving(false)
//     showToast(res.success ? "সংরক্ষিত হয়েছে ✓" : "সংরক্ষণ ব্যর্থ হয়েছে", res.success ? "ok" : "err")
//   }

//   return (
//     <div className="ptm-wrap">
//       <style>{CSS}</style>

//       {/* Header */}
//       <div className="ptm-header">
//         <div className="ptm-title">
//           <Tag size={17} />
//           সেবা ও মূল্য তালিকা
//           <span className="ptm-badge">{rows.length} টি সেবা</span>
//         </div>
//         <div
//           className={`ptm-toggle ${enabled ? "on" : ""}`}
//           onClick={() => setEnabled((v) => !v)}
//         >
//           {enabled
//             ? <><ToggleRight size={18} /> চালু</>
//             : <><ToggleLeft  size={18} /> বন্ধ</>}
//         </div>
//       </div>

//       {/* Table title field */}
//       <div className="ptm-meta-row">
//         <div>
//           <div className="ptm-label">টেবিলের শিরোনাম</div>
//           <input
//             className="ptm-input"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="আমাদের সেবা ও মূল্য তালিকা"
//           />
//         </div>
//       </div>

//       {/* Rows */}
//       <div className="ptm-rows">
//         {rows.map((row, i) => (
//           <div key={i} className={`ptm-row ${row.available ? "" : "unavailable"}`}>
//             {/* Row header */}
//             <div className="ptm-row-head" onClick={() => setExpanded(expanded === i ? null : i)}>
//               <GripVertical size={16} className="ptm-row-grip" />
//               <div className="ptm-row-name">{row.service || <span style={{color:"hsl(var(--muted-foreground))"}}>নতুন সেবা...</span>}</div>
//               {row.price !== "" && (
//                 <div className="ptm-row-price">৳{row.price} <span style={{fontWeight:400,fontSize:11}}>{row.unit}</span></div>
//               )}
//               <div
//                 className={`ptm-row-avail ${row.available ? "on" : "off"}`}
//                 onClick={(e) => { e.stopPropagation(); toggleAvail(i) }}
//               >
//                 {row.available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
//                 {row.available ? "চালু" : "বন্ধ"}
//               </div>
//               <div className="ptm-row-del" onClick={(e) => { e.stopPropagation(); removeRow(i) }}>
//                 <Trash2 size={15} />
//               </div>
//               {expanded === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
//             </div>

//             {/* Row body */}
//             {expanded === i && (
//               <div className="ptm-row-body">

//                 {/* Service name */}
//                 <div className="ptm-field ptm-row-body-full">
//                   <div className="ptm-label"><span className="ptm-field-icon"><Tag size={12} /> সেবার নাম</span></div>
//                   <input className="ptm-input" value={row.service}
//                     onChange={(e) => update(i, { service: e.target.value })}
//                     placeholder="যেমন: সার্ভার কপি" />
//                 </div>

//                 {/* Description */}
//                 <div className="ptm-field ptm-row-body-full">
//                   <div className="ptm-label"><span className="ptm-field-icon"><Info size={12} /> বিবরণ</span></div>
//                   <input className="ptm-input" value={row.description}
//                     onChange={(e) => update(i, { description: e.target.value })}
//                     placeholder="সেবাটি সম্পর্কে সংক্ষিপ্ত বিবরণ" />
//                 </div>

//                 {/* User provides */}
//                 <div className="ptm-field">
//                   <div className="ptm-label"><span className="ptm-field-icon"><User2 size={12} /> ব্যবহারকারী দেবেন</span></div>
//                   <input className="ptm-input" value={row.userProvides}
//                     onChange={(e) => update(i, { userProvides: e.target.value })}
//                     placeholder="যেমন: NID নম্বর ও জন্ম তারিখ" />
//                 </div>

//                 {/* Deliverable */}
//                 <div className="ptm-field">
//                   <div className="ptm-label"><span className="ptm-field-icon"><PackageCheck size={12} /> ব্যবহারকারী পাবেন</span></div>
//                   <input className="ptm-input" value={row.deliverable}
//                     onChange={(e) => update(i, { deliverable: e.target.value })}
//                     placeholder="যেমন: PDF কপি (ডাউনলোডযোগ্য)" />
//                 </div>

//                 {/* Price + Unit */}
//                 <div className="ptm-field ptm-row-body-full">
//                   <div className="ptm-label"><span className="ptm-field-icon"><Banknote size={12} /> মূল্য ও একক</span></div>
//                   <div className="ptm-price-row">
//                     <input className="ptm-input" type="number" min={0} value={row.price}
//                       onChange={(e) => update(i, { price: e.target.value === "" ? "" : Number(e.target.value) })}
//                       placeholder="০" />
//                     <select className="ptm-input ptm-select" value={row.unit}
//                       onChange={(e) => update(i, { unit: e.target.value })}>
//                       {UNIT_PRESETS.map((u) => <option key={u} value={u}>{u}</option>)}
//                       {!UNIT_PRESETS.includes(row.unit) && <option value={row.unit}>{row.unit}</option>}
//                     </select>
//                   </div>
//                 </div>

//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Add row */}
//       <button className="ptm-add-btn" onClick={addRow}>
//         <Plus size={16} /> নতুন সেবা যোগ করুন
//       </button>

//       {/* Save */}
//       <div className="ptm-save-row">
//         <button className="ptm-save-btn" onClick={save} disabled={saving}>
//           <Save size={15} />
//           {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
//         </button>
//       </div>

//       {toast && (
//         <div className={`ptm-toast ${toast.type}`}>{toast.msg}</div>
//       )}
//     </div>
//   )
// }


"use client"

import { useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import Swal from "sweetalert2"
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Info,
  Loader2,
  PackageCheck,
  Plus,
  Save,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
  User2,
} from "lucide-react"
import { auth } from "@/lib/firebase"
import {
  getPricingTableSettings,
  updatePricingTableSettings,
  type TPricingTableRow,
} from "@/lib/tabledata.api"

type TEditablePricingRow = Omit<TPricingTableRow, "price"> & {
  price: number | ""
}

const DEFAULT_TITLE = "আমাদের সেবা ও মূল্য তালিকা"
const UNIT_PRESETS = ["প্রতি কপি", "per request", "সর্বনিম্ন", "per month", "flat fee"]

const blankRow = (order: number): TEditablePricingRow => ({
  service: "",
  description: "",
  userProvides: "",
  deliverable: "",
  price: "",
  unit: "প্রতি কপি",
  available: true,
  order,
})

const normalizeRows = (rows: TPricingTableRow[] = []): TEditablePricingRow[] =>
  [...rows]
    .sort((a, b) => a.order - b.order)
    .map((row, index) => ({
      ...row,
      price: Number.isFinite(Number(row.price)) ? Number(row.price) : "",
      order: index,
    }))

export default function PricingTableManager() {
  const [enabled, setEnabled] = useState(true)
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [rows, setRows] = useState<TEditablePricingRow[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const activeCount = useMemo(() => rows.filter((row) => row.available).length, [rows])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) throw new Error("Please login again")

        const token = await currentUser.getIdToken()
        const result = await getPricingTableSettings(token)

        if (!result?.success) {
          throw new Error(result?.message || "Failed to load pricing settings")
        }

        setEnabled(result.data?.pricingTableEnabled ?? true)
        setTitle(result.data?.pricingTableTitle || DEFAULT_TITLE)
        setRows(normalizeRows(result.data?.pricingTableRows ?? []))
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "লোড ব্যর্থ হয়েছে",
          text: error.message || "Pricing settings load করা যায়নি",
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

  const updateRow = (index: number, patch: Partial<TEditablePricingRow>) => {
    setRows((prev) =>
      prev.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row))
    )
  }

  const addRow = () => {
    setRows((prev) => {
      const next = [...prev, blankRow(prev.length)]
      setExpanded(next.length - 1)
      return next
    })
  }

  const removeRow = async (index: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "সেবাটি মুছবেন?",
      text: "এই pricing row টি তালিকা থেকে remove হয়ে যাবে।",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#334155",
      background: "hsl(var(--card))",
      color: "hsl(var(--foreground))",
    })

    if (!result.isConfirmed) return

    setRows((prev) =>
      prev.filter((_, rowIndex) => rowIndex !== index).map((row, order) => ({ ...row, order }))
    )
    setExpanded((prev) => (prev === index ? null : prev && prev > index ? prev - 1 : prev))
  }

  const moveRow = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= rows.length) return

    setRows((prev) => {
      const updated = [...prev]
      ;[updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]]
      return updated.map((row, order) => ({ ...row, order }))
    })
    setExpanded(targetIndex)
  }

  const validateRows = () => {
    if (!title.trim()) return "টেবিলের শিরোনাম দিন"

    for (const row of rows) {
      if (!row.service.trim()) return "প্রতিটি সেবার নাম দিন"
      if (row.price === "" || Number(row.price) < 0) return "সব মূল্য সঠিকভাবে দিন"
    }

    return null
  }

  const handleSave = async () => {
    const validationError = validateRows()
    if (validationError) {
      Swal.fire({
        icon: "error",
        title: "তথ্য অসম্পূর্ণ",
        text: validationError,
        confirmButtonColor: "#0f172a",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
      })
      return
    }

    setSaving(true)

    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error("Please login again")

      const pricingTableRows = rows.map((row, order) => ({
        ...row,
        service: row.service.trim(),
        description: row.description.trim(),
        userProvides: row.userProvides.trim(),
        deliverable: row.deliverable.trim(),
        price: Number(row.price),
        unit: row.unit.trim() || "প্রতি কপি",
        order,
      }))

      const token = await currentUser.getIdToken()
      const result = await updatePricingTableSettings(token, {
        pricingTableEnabled: enabled,
        pricingTableTitle: title.trim(),
        pricingTableRows,
      })

      if (!result?.success) {
        throw new Error(result?.message || "Save failed")
      }

      setTitle(title.trim())
      setRows(pricingTableRows)

      await Swal.fire({
        icon: "success",
        title: "সফলভাবে সেভ হয়েছে",
        text: result.message || "Pricing table updated successfully",
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
          Loading pricing table...
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Pricing Table Control</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {rows.length} services
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
              {activeCount} active
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Service price, requirements, deliverables, and availability manage করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setEnabled((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              enabled
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            }`}
          >
            {enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            {enabled ? "Enabled" : "Disabled"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-primary dark:text-primary-foreground dark:hover:opacity-90"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-border bg-background p-4">
        <label className="mb-2 block text-sm font-semibold text-foreground">
          Table Title
        </label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={DEFAULT_TITLE}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Service Rows
        </h3>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
            No services added yet.
          </div>
        ) : (
          rows.map((row, index) => {
            const isExpanded = expanded === index

            return (
              <div
                key={row._id || index}
                className={`overflow-hidden rounded-2xl border border-border bg-background ${
                  row.available ? "" : "opacity-65"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : index)}
                  className="flex w-full items-center gap-3 bg-muted/35 px-4 py-3 text-left"
                >
                  <GripVertical size={16} className="shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-foreground">
                      {row.service || "নতুন সেবা..."}
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                      {row.description || "No description added"}
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-bold text-primary">
                      {row.price === "" ? "৳0" : `৳${row.price}`}
                    </div>
                    <div className="text-xs text-muted-foreground">{row.unit}</div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExpanded && (
                  <div className="grid gap-4 p-4 md:grid-cols-2">
                    <Field label="সেবার নাম" icon={<Tag size={13} />} className="md:col-span-2">
                      <input
                        value={row.service}
                        onChange={(event) => updateRow(index, { service: event.target.value })}
                        placeholder="যেমন: সার্ভার কপি"
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                    </Field>

                    <Field label="বিবরণ" icon={<Info size={13} />} className="md:col-span-2">
                      <input
                        value={row.description}
                        onChange={(event) => updateRow(index, { description: event.target.value })}
                        placeholder="সেবাটি সম্পর্কে সংক্ষিপ্ত বিবরণ"
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                    </Field>

                    <Field label="ব্যবহারকারী দেবেন" icon={<User2 size={13} />}>
                      <input
                        value={row.userProvides}
                        onChange={(event) => updateRow(index, { userProvides: event.target.value })}
                        placeholder="যেমন: NID নম্বর ও জন্ম তারিখ"
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                    </Field>

                    <Field label="ব্যবহারকারী পাবেন" icon={<PackageCheck size={13} />}>
                      <input
                        value={row.deliverable}
                        onChange={(event) => updateRow(index, { deliverable: event.target.value })}
                        placeholder="যেমন: PDF কপি"
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                    </Field>

                    <Field label="মূল্য" icon={<Banknote size={13} />}>
                      <input
                        type="number"
                        min={0}
                        value={row.price}
                        onChange={(event) =>
                          updateRow(index, {
                            price: event.target.value === "" ? "" : Number(event.target.value),
                          })
                        }
                        placeholder="0"
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      />
                    </Field>

                    <Field label="একক" icon={<Tag size={13} />}>
                      <select
                        value={row.unit}
                        onChange={(event) => updateRow(index, { unit: event.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary"
                      >
                        {UNIT_PRESETS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                        {!UNIT_PRESETS.includes(row.unit) && (
                          <option value={row.unit}>{row.unit}</option>
                        )}
                      </select>
                    </Field>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 p-3 md:col-span-2">
                      <button
                        type="button"
                        onClick={() => updateRow(index, { available: !row.available })}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                          row.available
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {row.available ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                        {row.available ? "Available" : "Unavailable"}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveRow(index, "up")}
                          disabled={index === 0}
                          className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-45"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveRow(index, "down")}
                          disabled={index === rows.length - 1}
                          className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-45"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  icon,
  className = "",
  children,
}: {
  label: string
  icon: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  )
}
