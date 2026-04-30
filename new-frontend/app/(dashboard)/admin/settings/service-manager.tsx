// "use client"

// import { useState, useEffect } from "react"
// import { auth } from "@/lib/firebase"
// import {
//   getAllServicesAdmin,
//   createCustomService,
//   updateCustomService,
//   deleteCustomService,
//   ICustomService,
//   IInputField,
//   TInputFieldType,
// } from "@/lib/api.customService"

// // ── Helpers ───────────────────────────────────────────────────────────────────

// const emptyService = (): Omit<ICustomService, "_id" | "createdAt" | "updatedAt"> => ({
//   slug: "",
//   isActive: true,
//   header:  { title: "", subtitle: "" },
//   notice:  { text: "", active: true },
//   form:    { name: "", fields: [] },
//   card: {
//     title:       "",
//     gradient:    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     shadowColor: "rgba(102,126,234,0.35)",
//     icon:        "FileText",
//     price:       "৳0",
//     priceLabel:  "প্রতিটি",
//   },
// })

// const emptyField = (order: number): Omit<IInputField, "_id"> => ({
//   type:        "normal",
//   label:       "",
//   placeholder: "",
//   required:    true,
//   order,
// })

// const GRADIENTS = [
//   { label: "Purple", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", shadow: "rgba(102,126,234,0.35)" },
//   { label: "Pink",   value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", shadow: "rgba(245,87,108,0.35)" },
//   { label: "Cyan",   value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", shadow: "rgba(79,172,254,0.35)" },
//   { label: "Green",  value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", shadow: "rgba(67,233,123,0.35)" },
//   { label: "Orange", value: "linear-gradient(135deg, #fa8231 0%, #f7b733 100%)", shadow: "rgba(250,130,49,0.35)" },
//   { label: "Red",    value: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)", shadow: "rgba(231,76,60,0.35)" },
//   { label: "Dark",   value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", shadow: "rgba(26,26,46,0.45)" },
//   { label: "Teal",   value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", shadow: "rgba(17,153,142,0.35)" },
// ]

// const ICONS = ["FileText", "Wallet", "TrendingUp", "CreditCard", "IdCard", "Landmark", "Phone", "Shield", "Star", "Globe"]

// const FIELD_TYPE_LABELS: Record<TInputFieldType, string> = {
//   normal: "Normal Input (নাম, নম্বর ইত্যাদি)",
//   dob:    "Date of Birth Input (জন্ম তারিখ)",
//   bigbox: "Big Box Input (বড় টেক্সট বক্স)",
// }

// // ── Component ─────────────────────────────────────────────────────────────────

// export default function ServiceManager() {
//   const [services, setServices]       = useState<ICustomService[]>([])
//   const [loading, setLoading]         = useState(true)
//   const [saving, setSaving]           = useState(false)
//   const [error, setError]             = useState("")
//   const [success, setSuccess]         = useState("")
//   const [editingId, setEditingId]     = useState<string | null>(null)
//   const [showForm, setShowForm]       = useState(false)
//   const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

//   type FormState = Omit<ICustomService, "_id" | "createdAt" | "updatedAt">
//   const [form, setForm] = useState<FormState>(emptyService())

//   const load = async () => {
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const result = await getAllServicesAdmin(token)
//       if (result.success) setServices(result.data)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { load() }, [])

//   const openCreate = () => {
//     setEditingId(null)
//     setForm(emptyService())
//     setShowForm(true)
//     setError("")
//     setSuccess("")
//   }

//   const openEdit = (svc: ICustomService) => {
//     setEditingId(svc._id)
//     setForm({
//       slug:     svc.slug,
//       isActive: svc.isActive,
//       header:   svc.header  ?? { title: "", subtitle: "" },
//       notice:   svc.notice  ?? { text: "", active: true },
//       form:     svc.form,
//       card:     svc.card,
//     })
//     setShowForm(true)
//     setError("")
//     setSuccess("")
//   }

//   const handleSave = async () => {
//     if (!form.slug.trim())         return setError("Slug আবশ্যক")
//     if (!form.form.name.trim())    return setError("Form নাম আবশ্যক")
//     if (!form.card.title.trim())   return setError("Card শিরোনাম আবশ্যক")

//     setSaving(true)
//     setError("")
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       let result
//       if (editingId) {
//         result = await updateCustomService(token, editingId, form)
//       } else {
//         result = await createCustomService(token, form)
//       }

//       if (!result.success) {
//         setError(result.message || "There is a problem")
//         return
//       }

//       setSuccess(editingId ? "Service has been updated!" : "New service created!")
//       setShowForm(false)
//       load()
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const token = await auth.currentUser?.getIdToken()
//     if (!token) return
//     const result = await deleteCustomService(token, id)
//     if (result.success) {
//       setConfirmDelete(null)
//       setSuccess("Service has been deleted!")
//       load()
//     } else {
//       setError(result.message || "There is a problem while deleting the service")
//     }
//   }

//   const addField = () => {
//     setForm((f) => ({
//       ...f,
//       form: { ...f.form, fields: [...f.form.fields, emptyField(f.form.fields.length)] },
//     }))
//   }

//   const updateField = (idx: number, patch: Partial<IInputField>) => {
//     setForm((f) => {
//       const fields = f.form.fields.map((field, i) => i === idx ? { ...field, ...patch } : field)
//       return { ...f, form: { ...f.form, fields } }
//     })
//   }

//   const removeField = (idx: number) => {
//     setForm((f) => ({
//       ...f,
//       form: { ...f.form, fields: f.form.fields.filter((_, i) => i !== idx) },
//     }))
//   }

//   // ── Render ──────────────────────────────────────────────────────────────────
//   if (loading) return <div className="p-6 text-sm text-muted-foreground">loading...</div>

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//       {/* Header */}
//       <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
//         <div>
//           <h2 className="text-lg font-bold text-slate-800">Workplace Services manage</h2>
//           <p className="mt-0.5 text-xs text-slate-500">Create new services, update or delete existing services</p>
//         </div>
//         <button
//           onClick={openCreate}
//           className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
//         >
//           + Create Service
//         </button>
//       </div>

//       {/* Alerts */}
//       {success && (
//         <div className="mx-6 mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
//           ✅ {success}
//         </div>
//       )}
//       {error && !showForm && (
//         <div className="mx-6 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
//           ⚠️ {error}
//         </div>
//       )}

//       {/* Service List */}
//       <div className="divide-y divide-slate-100 px-6 py-4">
//         {services.length === 0 && (
//           <p className="py-8 text-center text-sm text-slate-400">No services created yet.</p>
//         )}
//         {services.map((svc) => (
//           <div key={svc._id} className="flex items-center gap-4 py-4">
//             {/* Mini card preview */}
//             <div
//               className="h-10 w-10 flex-shrink-0 rounded-xl"
//               style={{ background: svc.card.gradient }}
//             />
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-slate-800 truncate">{svc.card.title}</p>
//               <p className="text-xs text-slate-400">/{svc.slug} · {svc.card.price} · {svc.isActive ? "active" : "inactive"}</p>
//             </div>
//             <div className="flex gap-2 flex-shrink-0">
//               <button
//                 onClick={() => openEdit(svc)}
//                 className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => setConfirmDelete(svc._id)}
//                 className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Delete Confirm Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
//             <h3 className="mb-2 text-base font-bold text-slate-800">Delete the service?</h3>
//             <p className="mb-5 text-sm text-slate-500">This service and all related requests will be permanently deleted.</p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => handleDelete(confirmDelete)}
//                 className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
//               >
//             Yes, delete
//               </button>
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Create / Edit Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
//           <div className="mx-auto my-6 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//               <h3 className="text-base font-bold text-slate-800">
//                 {editingId ? "Edit Service" : "Create Service"}
//               </h3>
//               <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
//             </div>

//             <div className="space-y-6 p-6">
//               {error && (
//                 <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
//                   ⚠️ {error}
//                 </div>
//               )}

//               {/* ── Basic Info ─────────────────────────────────────────── */}
//               <Section title="🔧 Basic Info">
//                 <Field label="Slug (URL key, e.g. passport-copy)">
//                   <input
//                     className={INPUT}
//                     value={form.slug}
//                     onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s/g, "-") }))}
//                     placeholder="passport-copy"
//                     disabled={!!editingId}
//                   />
//                 </Field>
//                 <Field label="Active">
//                   <label className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={form.isActive}
//                       onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
//                       className="h-4 w-4 rounded"
//                     />
//                     Keep service active
//                   </label>
//                 </Field>
//               </Section>

//               {/* ── Header ────────────────────────────────────────────── */}
//               <Section title="📌 Header">
//                 <Field label="Title">
//                   <input
//                     className={INPUT}
//                     value={form.header?.title ?? ""}
//                     onChange={(e) => setForm((f) => ({ ...f, header: { ...f.header!, title: e.target.value } }))}
//                     placeholder="Passport Copy Service"
//                   />
//                 </Field>
//                 <Field label="Subtitle (Optional)">
//                   <input
//                     className={INPUT}
//                     value={form.header?.subtitle ?? ""}
//                     onChange={(e) => setForm((f) => ({ ...f, header: { ...f.header!, subtitle: e.target.value } }))}
//                     placeholder="Fast and Reliable Service"
//                   />
//                 </Field>
//               </Section>

//               {/* ── Notice ────────────────────────────────────────────── */}
//               <Section title="📢 Notice Header">
//                 <Field label="Notice Text">
//                   <input
//                     className={INPUT}
//                     value={form.notice?.text ?? ""}
//                     onChange={(e) => setForm((f) => ({ ...f, notice: { ...f.notice!, text: e.target.value } }))}
//                     placeholder="Please fill out all information correctly before submitting your application."
//                   />
//                 </Field>
//                 <Field label="Show Notice?">
//                   <label className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={form.notice?.active ?? true}
//                       onChange={(e) => setForm((f) => ({ ...f, notice: { ...f.notice!, active: e.target.checked } }))}
//                       className="h-4 w-4 rounded"
//                     />
//                     Active
//                   </label>
//                 </Field>
//               </Section>

//               {/* ── Form ──────────────────────────────────────────────── */}
//               <Section title="📝 Form">
//                 <Field label="Form Name">
//                   <input
//                     className={INPUT}
//                     value={form.form.name}
//                     onChange={(e) => setForm((f) => ({ ...f, form: { ...f.form, name: e.target.value } }))}
//                     placeholder="Application"
//                   />
//                 </Field>

//                 {/* Fields */}
//                 <div className="space-y-3">
//                   <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Input Fields</p>
//                   {form.form.fields.map((field, idx) => (
//                     <div key={idx} className="rounded-xl border border-slate-200 p-4 space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs font-semibold text-slate-500">Field #{idx + 1}</span>
//                         <button
//                           onClick={() => removeField(idx)}
//                           className="text-xs text-red-500 hover:text-red-700"
//                         >
//                           ✕ Remove
//                         </button>
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         <Field label="Type">
//                           <select
//                             className={INPUT}
//                             value={field.type}
//                             onChange={(e) => updateField(idx, { type: e.target.value as TInputFieldType })}
//                           >
//                             {(Object.keys(FIELD_TYPE_LABELS) as TInputFieldType[]).map((t) => (
//                               <option key={t} value={t}>{FIELD_TYPE_LABELS[t]}</option>
//                             ))}
//                           </select>
//                         </Field>
//                         <Field label="Label">
//                           <input
//                             className={INPUT}
//                             value={field.label}
//                             onChange={(e) => updateField(idx, { label: e.target.value })}
//                             placeholder="Full Name"
//                           />
//                         </Field>
//                         <Field label="Placeholder (Optional)">
//                           <input
//                             className={INPUT}
//                             value={field.placeholder ?? ""}
//                             onChange={(e) => updateField(idx, { placeholder: e.target.value })}
//                             placeholder="Full Name"
//                           />
//                         </Field>
//                         <Field label="Required?">
//                           <label className="flex items-center gap-2 text-sm mt-1">
//                             <input
//                               type="checkbox"
//                               checked={field.required}
//                               onChange={(e) => updateField(idx, { required: e.target.checked })}
//                               className="h-4 w-4 rounded"
//                             />
//                             Required
//                           </label>
//                         </Field>
//                       </div>
//                     </div>
//                   ))}
//                   <button
//                     onClick={addField}
//                     className="w-full rounded-xl border-2 border-dashed border-blue-200 py-2 text-sm text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
//                   >
//                     + Add Input Field
//                   </button>
//                 </div>
//               </Section>

//               {/* ── Dashboard Card ─────────────────────────────────────── */}
//               <Section title="🎴 Dashboard Card">
//                 <div className="grid grid-cols-2 gap-4">
//                   <Field label="Card Title">
//                     <input
//                       className={INPUT}
//                       value={form.card.title}
//                       onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card, title: e.target.value } }))}
//                       placeholder="Example Service"
//                     />
//                   </Field>
//                   <Field label="Icon (lucide name)">
//                     <select
//                       className={INPUT}
//                       value={form.card.icon}
//                       onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card, icon: e.target.value } }))}
//                     >
//                       {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
//                     </select>
//                   </Field>
//                   <Field label="Price">
//                     <input
//                       className={INPUT}
//                       value={form.card.price}
//                       onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card, price: e.target.value } }))}
//                       placeholder="৳৫০"
//                     />
//                   </Field>
//                   <Field label="Price Label">
//                     <input
//                       className={INPUT}
//                       value={form.card.priceLabel}
//                       onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card, priceLabel: e.target.value } }))}
//                       placeholder="প্রতিটি"
//                     />
//                   </Field>
//                 </div>

//                 {/* Color / Gradient picker */}
//                 <Field label="Color (Gradient)">
//                   <div className="flex flex-wrap gap-2 mt-1">
//                     {GRADIENTS.map((g) => (
//                       <button
//                         key={g.value}
//                         title={g.label}
//                         onClick={() => setForm((f) => ({
//                           ...f,
//                           card: { ...f.card, gradient: g.value, shadowColor: g.shadow },
//                         }))}
//                         className={`h-8 w-8 rounded-lg transition-all ${form.card.gradient === g.value ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : ""}`}
//                         style={{ background: g.value }}
//                       />
//                     ))}
//                   </div>
//                 </Field>

//                 {/* Preview */}
//                 <div className="mt-2">
//                   <p className="text-xs font-semibold text-slate-500 mb-2">Card Preview</p>
//                   <div
//                     className="w-44 rounded-2xl p-4 text-white"
//                     style={{ background: form.card.gradient, boxShadow: `0 8px 20px ${form.card.shadowColor}` }}
//                   >
//                     <div className="mb-2 h-9 w-9 rounded-xl bg-white/25 flex items-center justify-center text-lg">
//                       📄
//                     </div>
//                     <p className="text-sm font-bold leading-tight">{form.card.title || "Card Title"}</p>
//                     <p className="mt-1 text-lg font-extrabold">{form.card.price || "৳0"}</p>
//                     <p className="text-[10px] text-white/70">{form.card.priceLabel}</p>
//                   </div>
//                 </div>
//               </Section>
//             </div>

//             {/* Footer */}
//             <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
//               >
//                 {saving ? "সংরক্ষণ হচ্ছে..." : editingId ? "আপডেট করুন" : "সার্ভিস তৈরি করুন"}
//               </button>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
//               >
//                 বাতিল
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Small helpers ─────────────────────────────────────────────────────────────

// const INPUT = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300"

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-3">
//       <p className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-1">{title}</p>
//       {children}
//     </div>
//   )
// }

// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-xs font-medium text-slate-500">{label}</label>
//       {children}
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import {
  getAllServicesAdmin,
  createCustomService,
  updateCustomService,
  deleteCustomService,
  ICustomService,
  IInputField,
  TInputFieldType,
} from "@/lib/api.customService"

// ── Helpers & Constants ───────────────────────────────────────────────────────

const emptyService = (): Omit<ICustomService, "_id" | "createdAt" | "updatedAt"> => ({
  slug: "",
  isActive: true,
  header:  { title: "", subtitle: "" },
  notice:  { text: "", active: true },
  form:    { name: "", fields: [] },
  card: {
    title:       "",
    gradient:    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    shadowColor: "rgba(102,126,234,0.35)",
    icon:        "FileText",
    price:       "৳0",
    priceLabel:  "প্রতিটি",
  },
})

const emptyField = (order: number): Omit<IInputField, "_id"> => ({
  type:        "normal",
  label:       "",
  placeholder: "",
  required:    true,
  order,
})

const GRADIENTS = [
  { label: "Purple", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", shadow: "rgba(102,126,234,0.35)" },
  { label: "Pink",   value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", shadow: "rgba(245,87,108,0.35)" },
  { label: "Cyan",   value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", shadow: "rgba(79,172,254,0.35)" },
  { label: "Green",  value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", shadow: "rgba(67,233,123,0.35)" },
  { label: "Orange", value: "linear-gradient(135deg, #fa8231 0%, #f7b733 100%)", shadow: "rgba(250,130,49,0.35)" },
  { label: "Red",    value: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)", shadow: "rgba(231,76,60,0.35)" },
  { label: "Dark",   value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", shadow: "rgba(26,26,46,0.45)" },
  { label: "Teal",   value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", shadow: "rgba(17,153,142,0.35)" },
]

const ICONS = ["FileText", "Wallet", "TrendingUp", "CreditCard", "IdCard", "Landmark", "Phone", "Shield", "Star", "Globe"]

const FIELD_TYPE_LABELS: Record<TInputFieldType, string> = {
  normal: "Normal Input (নাম, নম্বর ইত্যাদি)",
  dob:    "Date of Birth Input (জন্ম তারিখ)",
  bigbox: "Big Box Input (বড় টেক্সট বক্স)",
}

const INPUT_STYLE = "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-300 focus:outline-none transition-colors"

// ── Component ─────────────────────────────────────────────────────────────────

export default function ServiceManager() {
  const [services, setServices]       = useState<ICustomService[]>([])
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState("")
  const [success, setSuccess]         = useState("")
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [showForm, setShowForm]       = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  type FormState = Omit<ICustomService, "_id" | "createdAt" | "updatedAt">
  const [form, setForm] = useState<FormState>(emptyService())

  const load = async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const result = await getAllServicesAdmin(token)
      if (result.success) setServices(result.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyService())
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const openEdit = (svc: ICustomService) => {
    setEditingId(svc._id)
    setForm({
      slug:     svc.slug,
      isActive: svc.isActive,
      header:   svc.header  ?? { title: "", subtitle: "" },
      notice:   svc.notice  ?? { text: "", active: true },
      form:     svc.form,
      card:     svc.card,
    })
    setShowForm(true)
    setError("")
    setSuccess("")
  }

  const handleSave = async () => {
    if (!form.slug.trim())         return setError("Slug আবশ্যক")
    if (!form.form.name.trim())    return setError("Form নাম আবশ্যক")
    if (!form.card.title.trim())   return setError("Card শিরোনাম আবশ্যক")

    setSaving(true)
    setError("")
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return

      let result
      if (editingId) {
        result = await updateCustomService(token, editingId, form)
      } else {
        result = await createCustomService(token, form)
      }

      if (!result.success) {
        setError(result.message || "There is a problem")
        return
      }

      setSuccess(editingId ? "Service has been updated!" : "New service created!")
      setShowForm(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const token = await auth.currentUser?.getIdToken()
    if (!token) return
    const result = await deleteCustomService(token, id)
    if (result.success) {
      setConfirmDelete(null)
      setSuccess("Service has been deleted!")
      load()
    } else {
      setError(result.message || "There is a problem while deleting the service")
    }
  }

  const addField = () => {
    setForm((f) => ({
      ...f,
      form: { ...f.form, fields: [...f.form.fields, emptyField(f.form.fields.length)] },
    }))
  }

  const updateField = (idx: number, patch: Partial<IInputField>) => {
    setForm((f) => {
      const fields = f.form.fields.map((field, i) => i === idx ? { ...field, ...patch } : field)
      return { ...f, form: { ...f.form, fields } }
    })
  }

  const removeField = (idx: number) => {
    setForm((f) => ({
      ...f,
      form: { ...f.form, fields: f.form.fields.filter((_, i) => i !== idx) },
    }))
  }

  if (loading) return <div className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading...</div>

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Workplace Services Manage</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Create new services, update or delete existing services</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + Create Service
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mx-6 mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          ✅ {success}
        </div>
      )}
      {error && !showForm && (
        <div className="mx-6 mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Service List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 px-6 py-4">
        {services.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">No services created yet.</p>
        )}
        {services.map((svc) => (
          <div key={svc._id} className="flex items-center gap-4 py-4">
            <div className="h-10 w-10 flex-shrink-0 rounded-xl" style={{ background: svc.card.gradient }} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{svc.card.title}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">/{svc.slug} · {svc.card.price} · {svc.isActive ? "active" : "inactive"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(svc)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Edit
              </button>
              <button onClick={() => setConfirmDelete(svc._id)} className="rounded-lg border border-red-200 dark:border-red-900/50 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="mb-2 text-base font-bold text-slate-800 dark:text-white">Delete the service?</h3>
            <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">This service and all related requests will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700">
                Yes, delete
              </button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4">
          <div className="mx-auto my-6 w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {editingId ? "Edit Service" : "Create Service"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl">×</button>
            </div>

            <div className="space-y-6 p-6">
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                  ⚠️ {error}
                </div>
              )}

              <Section title="🔧 Basic Info">
                <Field label="Slug (URL key)">
                  <input
                    className={INPUT_STYLE}
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s/g, "-") }))}
                    placeholder="passport-copy"
                    disabled={!!editingId}
                  />
                </Field>
                <Field label="Active Status">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    Keep service active
                  </label>
                </Field>
              </Section>

              <Section title="📌 Header">
                <Field label="Title">
                  <input className={INPUT_STYLE} value={form.header?.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, header: { ...f.header!, title: e.target.value } }))} placeholder="Service Title" />
                </Field>
                <Field label="Subtitle">
                  <input className={INPUT_STYLE} value={form.header?.subtitle ?? ""} onChange={(e) => setForm((f) => ({ ...f, header: { ...f.header!, subtitle: e.target.value } }))} placeholder="Optional subtitle" />
                </Field>
              </Section>

              <Section title="📢 Notice Header">
                <Field label="Notice Text">
                  <input className={INPUT_STYLE} value={form.notice?.text ?? ""} onChange={(e) => setForm((f) => ({ ...f, notice: { ...f.notice!, text: e.target.value } }))} placeholder="Alert text for users" />
                </Field>
                <Field label="Show Notice?">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <input type="checkbox" checked={form.notice?.active ?? true} onChange={(e) => setForm((f) => ({ ...f, notice: { ...f.notice!, active: e.target.checked } }))} className="h-4 w-4 rounded dark:bg-slate-800" />
                    Active
                  </label>
                </Field>
              </Section>

              <Section title="📝 Form Fields">
                <Field label="Form Name">
                  <input className={INPUT_STYLE} value={form.form.name} onChange={(e) => setForm((f) => ({ ...f, form: { ...f.form, name: e.target.value } }))} placeholder="Application" />
                </Field>
                <div className="space-y-3">
                  {form.form.fields.map((field, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Field #{idx + 1}</span>
                        <button onClick={() => removeField(idx)} className="text-xs text-red-500 hover:text-red-700 font-bold">✕ Remove</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field label="Type">
                          <select className={INPUT_STYLE} value={field.type} onChange={(e) => updateField(idx, { type: e.target.value as TInputFieldType })}>
                            {(Object.keys(FIELD_TYPE_LABELS) as TInputFieldType[]).map((t) => (
                              <option key={t} value={t} className="dark:bg-slate-900">{FIELD_TYPE_LABELS[t]}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Label">
                          <input className={INPUT_STYLE} value={field.label} onChange={(e) => updateField(idx, { label: e.target.value })} placeholder="Full Name" />
                        </Field>
                        <Field label="Placeholder">
                          <input className={INPUT_STYLE} value={field.placeholder ?? ""} onChange={(e) => updateField(idx, { placeholder: e.target.value })} placeholder="Type here..." />
                        </Field>
                        <Field label="Validation">
                          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-2">
                            <input type="checkbox" checked={field.required} onChange={(e) => updateField(idx, { required: e.target.checked })} className="h-4 w-4 rounded dark:bg-slate-800" />
                            Required Field
                          </label>
                        </Field>
                      </div>
                    </div>
                  ))}
                  <button onClick={addField} className="w-full rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    + Add Input Field
                  </button>
                </div>
              </Section>

              <Section title="🎴 Dashboard Card Design">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Card Title"><input className={INPUT_STYLE} value={form.card.title} onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card, title: e.target.value } }))} /></Field>
                  <Field label="Icon">
                    <select className={INPUT_STYLE} value={form.card.icon} onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card, icon: e.target.value } }))}>
                      {ICONS.map((ic) => <option key={ic} value={ic} className="dark:bg-slate-900">{ic}</option>)}
                    </select>
                  </Field>
                  <Field label="Price"><input className={INPUT_STYLE} value={form.card.price} onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card, price: e.target.value } }))} /></Field>
                  <Field label="Price Label"><input className={INPUT_STYLE} value={form.card.priceLabel} onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card, priceLabel: e.target.value } }))} /></Field>
                </div>
                <Field label="Choose Theme">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {GRADIENTS.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setForm((f) => ({ ...f, card: { ...f.card, gradient: g.value, shadowColor: g.shadow } }))}
                        className={`h-8 w-8 rounded-lg transition-all ${form.card.gradient === g.value ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900 scale-110" : ""}`}
                        style={{ background: g.value }}
                      />
                    ))}
                  </div>
                </Field>
              </Section>
            </div>

            <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "সংরক্ষণ হচ্ছে..." : editingId ? "আপডেট করুন" : "সার্ভিস তৈরি করুন"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{label}</label>
      {children}
    </div>
  )
}