// "use client"

// import { useState, useEffect } from "react"
// import { auth } from "@/lib/firebase"
// import { getAllUsers, rechargeWallet } from "@/lib/api"
// import {
//   RefreshCw,
//   Wallet,
//   Users,
//   ShieldCheck,
//   ShieldX,
//   Search,
//   Trash2,
//   Ban,
//   CheckCircle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import Swal from "sweetalert2"

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// // ── Types ──────────────────────────────────────────────────────
// type User = {
//   _id: string
//   name?: string
//   email: string
//   role: "user" | "admin" | "super_admin"
//   isBlocked?: boolean                          // ✅ Fix: missing field added
//   wallet?: { balance: number; totalSpent: number; totalRecharge: number }
//   createdAt?: string
// }

// export default function AdminUsersPage() {
//   const [users, setUsers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState("")
//   const [rechargeData, setRechargeData] = useState<{
//     userId: string
//     amount: string
//     note: string
//     name: string
//   } | null>(null)
//   const [rechargeLoading, setRechargeLoading] = useState(false)
//   const [roleLoading, setRoleLoading] = useState<string | null>(null)
//   const [actionLoading, setActionLoading] = useState<string | null>(null)

//   // ✅ Fix: unified showMessage using SweetAlert2 toast
//   const showMessage = (text: string, type: "success" | "error") => {
//     Swal.fire({
//       toast: true,
//       position: "top-end",
//       icon: type,
//       title: text,
//       showConfirmButton: false,
//       timer: 3000,
//       timerProgressBar: true,
//     })
//   }

//   // ── Fetch Users ───────────────────────────────────────────────
//   const fetchUsers = async () => {
//     setLoading(true)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const data = await getAllUsers(token)
//       if (data.success) setUsers(data.data)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   // ── Role Change ───────────────────────────────────────────────
//   const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
//     const confirm = await Swal.fire({
//       title: "Role পরিবর্তন করবেন?",
//       text: `Role "${newRole}" করা হবে।`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, পরিবর্তন করুন",
//       cancelButtonText: "বাতিল",
//       confirmButtonColor: newRole === "admin" ? "#2563eb" : "#dc2626",
//     })
//     if (!confirm.isConfirmed) return

//     setRoleLoading(userId)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const res = await fetch(`${BASE_URL}/user/role`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId, role: newRole }),
//       })
//       const data = await res.json()

//       if (data.success) {
//         showMessage(`✅ Role সফলভাবে "${newRole}" করা হয়েছে`, "success")
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Error occurred", "error")
//     } finally {
//       setRoleLoading(null)
//     }
//   }

//   // ── Wallet Recharge ───────────────────────────────────────────
//   const handleRecharge = async () => {
//     if (!rechargeData) return
//     const amt = parseInt(rechargeData.amount)
//     if (!amt || amt <= 0) {
//       showMessage("সঠিক পরিমাণ দিন", "error")
//       return
//     }

//     setRechargeLoading(true)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const data = await rechargeWallet(token, rechargeData.userId, amt, rechargeData.note)
//       if (data.success) {
//         showMessage(`✅ ৳${amt} সফলভাবে ${rechargeData.name}-এ যোগ হয়েছে`, "success")
//         setRechargeData(null)
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Error occurred", "error")
//     } finally {
//       setRechargeLoading(false)
//     }
//   }

//   // ── Delete User ───────────────────────────────────────────────
//   // ✅ Fix: showMessage was called but not defined — now fixed
//   const handleDelete = async (userId: string, name: string) => {
//     const confirm = await Swal.fire({
//       title: "User Delete করবেন?",
//       html: `<b>${name}</b> কে permanently delete করা হবে।<br/>এই কাজ undo করা যাবে না।`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, Delete করুন",
//       cancelButtonText: "বাতিল",
//       confirmButtonColor: "#dc2626",
//     })
//     if (!confirm.isConfirmed) return

//     setActionLoading(`delete-${userId}`)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await fetch(`${BASE_URL}/user/user-delete`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId }),
//       })
//       const data = await res.json()
//       if (data.success) {
//         showMessage("✅ User সফলভাবে delete হয়েছে", "success")
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Delete failed", "error")
//     } finally {
//       setActionLoading(null)
//     }
//   }

//   // ── Block / Unblock ───────────────────────────────────────────
//   const handleToggleBlock = async (userId: string, currentlyBlocked: boolean) => {
//     const confirm = await Swal.fire({
//       title: currentlyBlocked ? "Unblock করবেন?" : "Block করবেন?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: currentlyBlocked ? "হ্যাঁ, Unblock করুন" : "হ্যাঁ, Block করুন",
//       cancelButtonText: "বাতিল",
//       confirmButtonColor: currentlyBlocked ? "#16a34a" : "#d97706",
//     })
//     if (!confirm.isConfirmed) return

//     setActionLoading(`block-${userId}`)
//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return
//       const res = await fetch(`${BASE_URL}/user/user-block`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId, isBlocked: !currentlyBlocked }), 
//       })
//       const data = await res.json()
//       if (data.success) {
//         showMessage(`✅ User ${currentlyBlocked ? "unblocked" : "blocked"} হয়েছে`, "success")
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Action failed", "error")
//     } finally {
//       setActionLoading(null)
//     }
//   }

//   // ── Filter ────────────────────────────────────────────────────
//   const filtered = users.filter((u) => {
//     if (!search.trim()) return true
//     const q = search.toLowerCase()
//     return u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
//   })

//   const getRoleBadge = (role: string) => {
//     if (role === "super_admin")
//       return { label: "Super Admin", bg: "rgba(139,92,246,0.1)", color: "#7c3aed", border: "rgba(139,92,246,0.3)" }
//     if (role === "admin")
//       return { label: "Admin", bg: "rgba(59,130,246,0.1)", color: "#2563eb", border: "rgba(59,130,246,0.3)" }
//     return { label: "User", bg: "rgba(34,197,94,0.1)", color: "#16a34a", border: "rgba(34,197,94,0.3)" }
//   }

//   return (
//     <div className="space-y-5 max-w-5xl mx-auto">
//       {/* ── Header ── */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <h1 className="text-2xl font-bold flex items-center gap-2">
//           <Users size={22} /> সব Users
//         </h1>
//         <div className="flex items-center gap-2">
//           <div className="relative">
//             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               className="pl-8 w-48 h-9 text-sm"
//               placeholder="নাম বা email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-1.5 h-9">
//             <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
//           </Button>
//         </div>
//       </div>

//       {/* ── Recharge Modal ── */}
//       {rechargeData && (
//         <Card className="border-2 border-primary/20">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base flex items-center gap-2">
//               <Wallet size={16} />
//               Wallet Recharge — {rechargeData.name}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div>
//                 <label className="text-xs text-muted-foreground mb-1 block">Amount (৳) *</label>
//                 <Input
//                   type="number"
//                   placeholder="পরিমাণ লিখুন"
//                   value={rechargeData.amount}
//                   onChange={(e) => setRechargeData({ ...rechargeData, amount: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
//                 <Input
//                   placeholder="Note"
//                   value={rechargeData.note}
//                   onChange={(e) => setRechargeData({ ...rechargeData, note: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button onClick={handleRecharge} disabled={rechargeLoading} className="flex-1">
//                 {rechargeLoading ? "Processing..." : "Recharge করুন"}
//               </Button>
//               <Button variant="outline" onClick={() => setRechargeData(null)}>
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* ── Stats ── */}
//       <div className="grid grid-cols-4 gap-3">
//         {[
//           { label: "মোট Users", value: users.filter((u) => u.role === "user").length, color: "#16a34a" },
//           { label: "মোট Admins", value: users.filter((u) => u.role === "admin").length, color: "#2563eb" },
//           { label: "Super Admins", value: users.filter((u) => u.role === "super_admin").length, color: "#7c3aed" },
//           { label: "Blocked", value: users.filter((u) => u.isBlocked).length, color: "#dc2626" },
//         ].map((s) => (
//           <div key={s.label} className="border rounded-xl p-4 text-center bg-background">
//             <div className="text-2xl font-bold" style={{ color: s.color }}>
//               {s.value}
//             </div>
//             <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* ── Table ── */}
//       <div className="border rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[850px]">
//             <thead>
//               <tr className="bg-muted/50 border-b">
//                 {["SL", "Name", "Email", "Role", "Balance", "Status", "Action"].map((h) => (
//                   <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-12 text-muted-foreground">
//                     <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
//                     লোড হচ্ছে...
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-12 text-muted-foreground">
//                     কোনো user নেই
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((user, i) => {
//                   const badge = getRoleBadge(user.role)
//                   const isSuper = user.role === "super_admin"
//                   const isBlocked = user.isBlocked ?? false

//                   return (
//                     <tr
//                       key={user._id}
//                       className={`border-t transition-colors ${
//                         isBlocked ? "bg-red-50/40 dark:bg-red-950/10" : "hover:bg-muted/30"
//                       }`}
//                     >
//                       {/* SL */}
//                       <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>

//                       {/* Name */}
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2.5">
//                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
//                             {(user.name || user.email)[0].toUpperCase()}
//                           </div>
//                           <span className="text-sm font-medium">{user.name || "—"}</span>
//                         </div>
//                       </td>

//                       {/* Email */}
//                       <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>

//                       {/* Role Badge */}
//                       <td className="px-4 py-3">
//                         <span
//                           style={{
//                             display: "inline-block",
//                             padding: "3px 10px",
//                             borderRadius: "20px",
//                             fontSize: "11px",
//                             fontWeight: 600,
//                             background: badge.bg,
//                             color: badge.color,
//                             border: `1px solid ${badge.border}`,
//                           }}
//                         >
//                           {badge.label}
//                         </span>
//                       </td>

//                       {/* Balance */}
//                       <td className="px-4 py-3 text-sm font-semibold">
//                         {user.role === "user" ? (
//                           <span className="text-green-600">৳{user.wallet?.balance ?? 0}</span>
//                         ) : (
//                           "—"
//                         )}
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-3">
//                         {isBlocked ? (
//                           <span
//                             style={{
//                               display: "inline-block",
//                               padding: "3px 10px",
//                               borderRadius: "20px",
//                               fontSize: "11px",
//                               fontWeight: 600,
//                               background: "rgba(239,68,68,0.1)",
//                               color: "#dc2626",
//                               border: "1px solid rgba(239,68,68,0.3)",
//                             }}
//                           >
//                             Blocked
//                           </span>
//                         ) : (
//                           <span
//                             style={{
//                               display: "inline-block",
//                               padding: "3px 10px",
//                               borderRadius: "20px",
//                               fontSize: "11px",
//                               fontWeight: 600,
//                               background: "rgba(34,197,94,0.1)",
//                               color: "#16a34a",
//                               border: "1px solid rgba(34,197,94,0.3)",
//                             }}
//                           >
//                             Active
//                           </span>
//                         )}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-4 py-3">
//                         {isSuper ? (
//                           <span className="text-xs text-muted-foreground">Protected</span>
//                         ) : (
//                           <div className="flex items-center gap-1.5 flex-wrap">
//                             {/* Make Admin / Remove Admin */}
//                             {user.role === "user" ? (
//                               <button
//                                 onClick={() => handleRoleChange(user._id, "admin")}
//                                 disabled={roleLoading === user._id}
//                                 style={{
//                                   display: "flex", alignItems: "center", gap: "4px",
//                                   padding: "5px 10px", borderRadius: "6px",
//                                   fontSize: "12px", fontWeight: 600, cursor: "pointer",
//                                   background: "rgba(59,130,246,0.1)", color: "#2563eb",
//                                   border: "1px solid rgba(59,130,246,0.3)",
//                                   opacity: roleLoading === user._id ? 0.6 : 1,
//                                 }}
//                               >
//                                 <ShieldCheck size={12} />
//                                 {roleLoading === user._id ? "..." : "Make Admin"}
//                               </button>
//                             ) : (
//                               <button
//                                 onClick={() => handleRoleChange(user._id, "user")}
//                                 disabled={roleLoading === user._id}
//                                 style={{
//                                   display: "flex", alignItems: "center", gap: "4px",
//                                   padding: "5px 10px", borderRadius: "6px",
//                                   fontSize: "12px", fontWeight: 600, cursor: "pointer",
//                                   background: "rgba(239,68,68,0.1)", color: "#dc2626",
//                                   border: "1px solid rgba(239,68,68,0.3)",
//                                   opacity: roleLoading === user._id ? 0.6 : 1,
//                                 }}
//                               >
//                                 <ShieldX size={12} />
//                                 {roleLoading === user._id ? "..." : "Remove Admin"}
//                               </button>
//                             )}

//                             {/* Recharge (only for regular users) */}
//                             {user.role === "user" && (
//                               <button
//                                 onClick={() =>
//                                   setRechargeData({ userId: user._id, amount: "", note: "", name: user.name || user.email })
//                                 }
//                                 style={{
//                                   display: "flex", alignItems: "center", gap: "4px",
//                                   padding: "5px 10px", borderRadius: "6px",
//                                   fontSize: "12px", fontWeight: 600, cursor: "pointer",
//                                   background: "rgba(34,197,94,0.1)", color: "#16a34a",
//                                   border: "1px solid rgba(34,197,94,0.3)",
//                                 }}
//                               >
//                                 <Wallet size={12} />Recharge
//                               </button>
//                             )}

//                             {/* Block / Unblock */}
//                             <button
//                               onClick={() => handleToggleBlock(user._id, isBlocked)}
//                               disabled={actionLoading === `block-${user._id}`}
//                               style={{
//                                 display: "flex", alignItems: "center", gap: "4px",
//                                 padding: "5px 10px", borderRadius: "6px",
//                                 fontSize: "12px", fontWeight: 600, cursor: "pointer",
//                                 background: isBlocked ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
//                                 color: isBlocked ? "#16a34a" : "#d97706",
//                                 border: `1px solid ${isBlocked ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
//                                 opacity: actionLoading === `block-${user._id}` ? 0.6 : 1,
//                               }}
//                             >
//                               {isBlocked ? <CheckCircle size={12} /> : <Ban size={12} />}
//                               {actionLoading === `block-${user._id}` ? "..." : isBlocked ? "Unblock" : "Block"}
//                             </button>

//                             {/* Delete */}
//                             <button
//                               onClick={() => handleDelete(user._id, user.name || user.email)}
//                               disabled={actionLoading === `delete-${user._id}`}
//                               style={{
//                                 display: "flex", alignItems: "center", gap: "4px",
//                                 padding: "5px 10px", borderRadius: "6px",
//                                 fontSize: "12px", fontWeight: 600, cursor: "pointer",
//                                 background: "rgba(239,68,68,0.08)", color: "#dc2626",
//                                 border: "1px solid rgba(239,68,68,0.25)",
//                                 opacity: actionLoading === `delete-${user._id}` ? 0.6 : 1,
//                               }}
//                             >
//                               <Trash2 size={12} />
//                               {actionLoading === `delete-${user._id}` ? "..." : "Delete"}
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   )
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { auth } from "@/lib/firebase"
// import { getAllUsers, rechargeWallet } from "@/lib/api"
// import {
//   RefreshCw,
//   Wallet,
//   Users,
//   ShieldCheck,
//   ShieldX,
//   Search,
//   Trash2,
//   Ban,
//   CheckCircle,
//   MinusCircle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import Swal from "sweetalert2"

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// type User = {
//   _id: string
//   name?: string
//   email: string
//   role: "user" | "admin" | "super_admin"
//   isBlocked?: boolean
//   wallet?: {
//     balance: number
//     totalSpent: number
//     totalRecharge: number
//   }
//   createdAt?: string
// }

// export default function AdminUsersPage() {
//   const [users, setUsers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState("")

//   const [rechargeData, setRechargeData] = useState<{
//     userId: string
//     amount: string
//     note: string
//     name: string
//   } | null>(null)

//   const [deductData, setDeductData] = useState<{
//     userId: string
//     amount: string
//     reason: string
//     name: string
//   } | null>(null)

//   const [rechargeLoading, setRechargeLoading] = useState(false)
//   const [deductLoading, setDeductLoading] = useState(false)
//   const [roleLoading, setRoleLoading] = useState<string | null>(null)
//   const [actionLoading, setActionLoading] = useState<string | null>(null)

//   const showMessage = (text: string, type: "success" | "error") => {
//     Swal.fire({
//       toast: true,
//       position: "top-end",
//       icon: type,
//       title: text,
//       showConfirmButton: false,
//       timer: 3000,
//       timerProgressBar: true,
//     })
//   }

//   const fetchUsers = async () => {
//     setLoading(true)

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const data = await getAllUsers(token)

//       if (data.success) {
//         setUsers(data.data)
//       }
//     } catch (error) {
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const handleRoleChange = async (
//     userId: string,
//     newRole: "user" | "admin"
//   ) => {
//     const confirm = await Swal.fire({
//       title: "Role পরিবর্তন করবেন?",
//       text: `Role "${newRole}" করা হবে।`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "হ্যাঁ, পরিবর্তন করুন",
//       cancelButtonText: "বাতিল",
//       confirmButtonColor: newRole === "admin" ? "#2563eb" : "#dc2626",
//     })

//     if (!confirm.isConfirmed) return

//     setRoleLoading(userId)

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const res = await fetch(`${BASE_URL}/user/role`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId,
//           role: newRole,
//         }),
//       })

//       const data = await res.json()

//       if (data.success) {
//         showMessage(`✅ Role "${newRole}" করা হয়েছে`, "success")
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Error occurred", "error")
//     } finally {
//       setRoleLoading(null)
//     }
//   }

//   const handleRecharge = async () => {
//     if (!rechargeData) return

//     const amt = parseInt(rechargeData.amount)

//     if (!amt || amt <= 0) {
//       showMessage("সঠিক পরিমাণ দিন", "error")
//       return
//     }

//     setRechargeLoading(true)

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const data = await rechargeWallet(
//         token,
//         rechargeData.userId,
//         amt,
//         rechargeData.note
//       )

//       if (data.success) {
//         showMessage(
//           `✅ ৳${amt} সফলভাবে ${rechargeData.name}-এ যোগ হয়েছে`,
//           "success"
//         )
//         setRechargeData(null)
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Error occurred", "error")
//     } finally {
//       setRechargeLoading(false)
//     }
//   }

//   const handleDeduct = async () => {
//     if (!deductData) return

//     const amt = parseInt(deductData.amount)

//     if (!amt || amt <= 0) {
//       showMessage("সঠিক পরিমাণ দিন", "error")
//       return
//     }

//     if (!deductData.reason.trim()) {
//       showMessage("কারণ লিখুন", "error")
//       return
//     }

//     setDeductLoading(true)

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const res = await fetch(
//         `${BASE_URL}/transaction/admin/wallet-correction`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             userId: deductData.userId,
//             amount: amt,
//             reason: deductData.reason.trim(),
//           }),
//         }
//       )

//       const data = await res.json()

//       if (data.success) {
//         showMessage(
//           `✅ ৳${amt} সফলভাবে ${deductData.name} থেকে কাটা হয়েছে`,
//           "success"
//         )
//         setDeductData(null)
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Error occurred", "error")
//     } finally {
//       setDeductLoading(false)
//     }
//   }

//   const handleDelete = async (userId: string, name: string) => {
//     const confirm = await Swal.fire({
//       title: "User Delete করবেন?",
//       html: `<b>${name}</b> কে permanently delete করা হবে।`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Delete করুন",
//       cancelButtonText: "বাতিল",
//       confirmButtonColor: "#dc2626",
//     })

//     if (!confirm.isConfirmed) return

//     setActionLoading(`delete-${userId}`)

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const res = await fetch(`${BASE_URL}/user/user-delete`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId }),
//       })

//       const data = await res.json()

//       if (data.success) {
//         showMessage("✅ User delete হয়েছে", "success")
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Delete failed", "error")
//     } finally {
//       setActionLoading(null)
//     }
//   }

//   const handleToggleBlock = async (
//     userId: string,
//     currentlyBlocked: boolean
//   ) => {
//     setActionLoading(`block-${userId}`)

//     try {
//       const token = await auth.currentUser?.getIdToken()
//       if (!token) return

//       const res = await fetch(`${BASE_URL}/user/user-block`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId,
//           isBlocked: !currentlyBlocked,
//         }),
//       })

//       const data = await res.json()

//       if (data.success) {
//         showMessage(
//           `✅ User ${currentlyBlocked ? "unblocked" : "blocked"} হয়েছে`,
//           "success"
//         )
//         fetchUsers()
//       } else {
//         showMessage(`❌ ${data.message}`, "error")
//       }
//     } catch {
//       showMessage("❌ Action failed", "error")
//     } finally {
//       setActionLoading(null)
//     }
//   }

//   const filtered = users.filter((u) => {
//     if (!search.trim()) return true

//     const q = search.toLowerCase()

//     return (
//       u.name?.toLowerCase().includes(q) ||
//       u.email.toLowerCase().includes(q)
//     )
//   })

//   const getRoleBadge = (role: string) => {
//     if (role === "super_admin") {
//       return {
//         label: "Super Admin",
//         bg: "rgba(139,92,246,0.1)",
//         color: "#7c3aed",
//         border: "rgba(139,92,246,0.3)",
//       }
//     }

//     if (role === "admin") {
//       return {
//         label: "Admin",
//         bg: "rgba(59,130,246,0.1)",
//         color: "#2563eb",
//         border: "rgba(59,130,246,0.3)",
//       }
//     }

//     return {
//       label: "User",
//       bg: "rgba(34,197,94,0.1)",
//       color: "#16a34a",
//       border: "rgba(34,197,94,0.3)",
//     }
//   }

//   return (
//     <div className="space-y-5 max-w-5xl mx-auto">
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <h1 className="text-2xl font-bold flex items-center gap-2">
//           <Users size={22} />
//           সব Users
//         </h1>

//         <div className="flex items-center gap-2">
//           <div className="relative">
//             <Search
//               size={14}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//             />
//             <Input
//               className="pl-8 w-48 h-9 text-sm"
//               placeholder="নাম বা email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={fetchUsers}
//             className="gap-1.5 h-9"
//           >
//             <RefreshCw
//               size={13}
//               className={loading ? "animate-spin" : ""}
//             />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {rechargeData && (
//         <Card className="border-2 border-primary/20">
//           <CardHeader>
//             <CardTitle>
//               Wallet Recharge — {rechargeData.name}
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-3">
//             <Input
//               type="number"
//               placeholder="পরিমাণ"
//               value={rechargeData.amount}
//               onChange={(e) =>
//                 setRechargeData({
//                   ...rechargeData,
//                   amount: e.target.value,
//                 })
//               }
//             />

//             <Input
//               placeholder="Note"
//               value={rechargeData.note}
//               onChange={(e) =>
//                 setRechargeData({
//                   ...rechargeData,
//                   note: e.target.value,
//                 })
//               }
//             />

//             <div className="flex gap-2">
//               <Button
//                 onClick={handleRecharge}
//                 disabled={rechargeLoading}
//                 className="flex-1"
//               >
//                 {rechargeLoading ? "Processing..." : "Recharge করুন"}
//               </Button>

//               <Button
//                 variant="outline"
//                 onClick={() => setRechargeData(null)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {deductData && (
//         <Card className="border-2 border-red-500/20">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-red-600">
//               <MinusCircle size={16} />
//               Wallet Deduct — {deductData.name}
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-3">
//             <Input
//               type="number"
//               placeholder="পরিমাণ"
//               value={deductData.amount}
//               onChange={(e) =>
//                 setDeductData({
//                   ...deductData,
//                   amount: e.target.value,
//                 })
//               }
//             />

//             <Input
//               placeholder="কারণ লিখুন"
//               value={deductData.reason}
//               onChange={(e) =>
//                 setDeductData({
//                   ...deductData,
//                   reason: e.target.value,
//                 })
//               }
//             />

//             <div className="flex gap-2">
//               <Button
//                 variant="destructive"
//                 onClick={handleDeduct}
//                 disabled={deductLoading}
//                 className="flex-1"
//               >
//                 {deductLoading ? "Processing..." : "Deduct করুন"}
//               </Button>

//               <Button
//                 variant="outline"
//                 onClick={() => setDeductData(null)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <div className="border rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[850px]">
//             <thead>
//               <tr className="bg-muted/50 border-b">
//                 {[
//                   "SL",
//                   "Name",
//                   "Email",
//                   "Role",
//                   "Balance",
//                   "Status",
//                   "Action",
//                 ].map((h) => (
//                   <th
//                     key={h}
//                     className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground"
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.map((user, i) => {
//                 const badge = getRoleBadge(user.role)
//                 const isSuper = user.role === "super_admin"
//                 const isBlocked = user.isBlocked ?? false

//                 return (
//                   <tr key={user._id} className="border-t">
//                     <td className="px-4 py-3">{i + 1}</td>

//                     <td className="px-4 py-3">
//                       {user.name || "—"}
//                     </td>

//                     <td className="px-4 py-3">
//                       {user.email}
//                     </td>

//                     <td className="px-4 py-3">
//                       <span
//                         style={{
//                           padding: "3px 10px",
//                           borderRadius: "20px",
//                           fontSize: "11px",
//                           background: badge.bg,
//                           color: badge.color,
//                           border: `1px solid ${badge.border}`,
//                         }}
//                       >
//                         {badge.label}
//                       </span>
//                     </td>

//                     <td className="px-4 py-3">
//                       {user.role === "user"
//                         ? `৳${user.wallet?.balance ?? 0}`
//                         : "—"}
//                     </td>

//                     <td className="px-4 py-3">
//                       {isBlocked ? "Blocked" : "Active"}
//                     </td>

//                     <td className="px-4 py-3">
//                       {isSuper ? (
//                         "Protected"
//                       ) : (
//                         <div className="flex flex-wrap gap-1.5">
//                           {user.role === "user" && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   setRechargeData({
//                                     userId: user._id,
//                                     amount: "",
//                                     note: "",
//                                     name:
//                                       user.name || user.email,
//                                   })
//                                 }
//                                 className="px-2 py-1 text-xs border rounded"
//                               >
//                                 Recharge
//                               </button>

//                               <button
//                                 onClick={() =>
//                                   setDeductData({
//                                     userId: user._id,
//                                     amount: "",
//                                     reason: "",
//                                     name:
//                                       user.name || user.email,
//                                   })
//                                 }
//                                 className="px-2 py-1 text-xs border rounded text-red-600"
//                               >
//                                 Deduct
//                               </button>
//                             </>
//                           )}

//                           <button
//                             onClick={() =>
//                               handleToggleBlock(
//                                 user._id,
//                                 isBlocked
//                               )
//                             }
//                             className="px-2 py-1 text-xs border rounded"
//                           >
//                             {isBlocked
//                               ? "Unblock"
//                               : "Block"}
//                           </button>

//                           <button
//                             onClick={() =>
//                               handleDelete(
//                                 user._id,
//                                 user.name || user.email
//                               )
//                             }
//                             className="px-2 py-1 text-xs border rounded text-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { getAllUsers, rechargeWallet } from "@/lib/api"
import {
  RefreshCw,
  Wallet,
  Users,
  ShieldCheck,
  ShieldX,
  Search,
  Trash2,
  Ban,
  CheckCircle,
  MinusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from "sweetalert2"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ── Types ──────────────────────────────────────────────────────
type User = {
  _id: string
  name?: string
  email: string
  role: "user" | "admin" | "super_admin"
  isBlocked?: boolean
  wallet?: {
    balance: number
    totalSpent: number
    totalRecharge: number
  }
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [rechargeData, setRechargeData] = useState<{
    userId: string
    amount: string
    note: string
    name: string
  } | null>(null)
  const [deductData, setDeductData] = useState<{
    userId: string
    amount: string
    reason: string
    name: string
  } | null>(null)
  const [rechargeLoading, setRechargeLoading] = useState(false)
  const [deductLoading, setDeductLoading] = useState(false)
  const [roleLoading, setRoleLoading] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const showMessage = (text: string, type: "success" | "error") => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: text,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
  }

  // ── Fetch Users ───────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const data = await getAllUsers(token)
      if (data.success) setUsers(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ── Role Change ───────────────────────────────────────────────
  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    const confirm = await Swal.fire({
      title: "Role পরিবর্তন করবেন?",
      text: `Role "${newRole}" করা হবে।`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, পরিবর্তন করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: newRole === "admin" ? "#2563eb" : "#dc2626",
    })
    if (!confirm.isConfirmed) return

    setRoleLoading(userId)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(`${BASE_URL}/user/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role: newRole }),
      })
      const data = await res.json()
      if (data.success) {
        showMessage(`✅ Role সফলভাবে "${newRole}" করা হয়েছে`, "success")
        fetchUsers()
      } else {
        showMessage(`❌ ${data.message}`, "error")
      }
    } catch {
      showMessage("❌ Error occurred", "error")
    } finally {
      setRoleLoading(null)
    }
  }

  // ── Wallet Recharge ───────────────────────────────────────────
  const handleRecharge = async () => {
    if (!rechargeData) return
    const amt = parseInt(rechargeData.amount)
    if (!amt || amt <= 0) {
      showMessage("সঠিক পরিমাণ দিন", "error")
      return
    }
    setRechargeLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const data = await rechargeWallet(token, rechargeData.userId, amt, rechargeData.note)
      if (data.success) {
        showMessage(`✅ ৳${amt} সফলভাবে ${rechargeData.name}-এ যোগ হয়েছে`, "success")
        setRechargeData(null)
        fetchUsers()
      } else {
        showMessage(`❌ ${data.message}`, "error")
      }
    } catch {
      showMessage("❌ Error occurred", "error")
    } finally {
      setRechargeLoading(false)
    }
  }

  // ── Wallet Deduct ─────────────────────────────────────────────
  const handleDeduct = async () => {
    if (!deductData) return
    const amt = parseInt(deductData.amount)
    if (!amt || amt <= 0) {
      showMessage("সঠিক পরিমাণ দিন", "error")
      return
    }
    if (!deductData.reason.trim()) {
      showMessage("কারণ লিখুন", "error")
      return
    }
    setDeductLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(
        `${BASE_URL}/transaction/admin/wallet-correction`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: deductData.userId,
            amount: amt,
            reason: deductData.reason.trim(),
          }),
        }
      )
      const data = await res.json()
      if (data.success) {
        showMessage(
          `✅ ৳${amt} সফলভাবে ${deductData.name} থেকে কাটা হয়েছে`,
          "success"
        )
        setDeductData(null)
        fetchUsers()
      } else {
        showMessage(`❌ ${data.message}`, "error")
      }
    } catch {
      showMessage("❌ Error occurred", "error")
    } finally {
      setDeductLoading(false)
    }
  }

  // ── Delete User ───────────────────────────────────────────────
  const handleDelete = async (userId: string, name: string) => {
    const confirm = await Swal.fire({
      title: "User Delete করবেন?",
      html: `<b>${name}</b> কে permanently delete করা হবে।<br/>এই কাজ undo করা যাবে না।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, Delete করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#dc2626",
    })
    if (!confirm.isConfirmed) return

    setActionLoading(`delete-${userId}`)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(`${BASE_URL}/user/user-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        showMessage("✅ User সফলভাবে delete হয়েছে", "success")
        fetchUsers()
      } else {
        showMessage(`❌ ${data.message}`, "error")
      }
    } catch {
      showMessage("❌ Delete failed", "error")
    } finally {
      setActionLoading(null)
    }
  }

  // ── Block / Unblock ───────────────────────────────────────────
  const handleToggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    const confirm = await Swal.fire({
      title: currentlyBlocked ? "Unblock করবেন?" : "Block করবেন?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: currentlyBlocked ? "হ্যাঁ, Unblock করুন" : "হ্যাঁ, Block করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: currentlyBlocked ? "#16a34a" : "#d97706",
    })
    if (!confirm.isConfirmed) return

    setActionLoading(`block-${userId}`)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(`${BASE_URL}/user/user-block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, isBlocked: !currentlyBlocked }),
      })
      const data = await res.json()
      if (data.success) {
        showMessage(`✅ User ${currentlyBlocked ? "unblocked" : "blocked"} হয়েছে`, "success")
        fetchUsers()
      } else {
        showMessage(`❌ ${data.message}`, "error")
      }
    } catch {
      showMessage("❌ Action failed", "error")
    } finally {
      setActionLoading(null)
    }
  }

  // ── Filter ────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  const getRoleBadge = (role: string) => {
    if (role === "super_admin")
      return {
        label: "Super Admin",
        bg: "rgba(139,92,246,0.1)",
        color: "#7c3aed",
        border: "rgba(139,92,246,0.3)",
      }
    if (role === "admin")
      return {
        label: "Admin",
        bg: "rgba(59,130,246,0.1)",
        color: "#2563eb",
        border: "rgba(59,130,246,0.3)",
      }
    return {
      label: "User",
      bg: "rgba(34,197,94,0.1)",
      color: "#16a34a",
      border: "rgba(34,197,94,0.3)",
    }
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users size={22} />
          সব Users
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-8 w-48 h-9 text-sm"
              placeholder="নাম বা email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            className="gap-1.5 h-9"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Recharge Modal ── */}
      {rechargeData && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet size={16} />
              Wallet Recharge — {rechargeData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Amount (৳) *
                </label>
                <Input
                  type="number"
                  placeholder="পরিমাণ লিখুন"
                  value={rechargeData.amount}
                  onChange={(e) =>
                    setRechargeData({ ...rechargeData, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Note (optional)
                </label>
                <Input
                  placeholder="Note"
                  value={rechargeData.note}
                  onChange={(e) =>
                    setRechargeData({ ...rechargeData, note: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRecharge}
                disabled={rechargeLoading}
                className="flex-1"
              >
                {rechargeLoading ? "Processing..." : "Recharge করুন"}
              </Button>
              <Button variant="outline" onClick={() => setRechargeData(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Deduct Modal ── */}
      {deductData && (
        <Card className="border-2 border-red-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
              <MinusCircle size={16} />
              Wallet Deduct — {deductData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Amount (৳) *
                </label>
                <Input
                  type="number"
                  placeholder="পরিমাণ লিখুন"
                  value={deductData.amount}
                  onChange={(e) =>
                    setDeductData({ ...deductData, amount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Reason *
                </label>
                <Input
                  placeholder="কারণ লিখুন"
                  value={deductData.reason}
                  onChange={(e) =>
                    setDeductData({ ...deductData, reason: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeduct}
                disabled={deductLoading}
                className="flex-1"
              >
                {deductLoading ? "Processing..." : "Deduct করুন"}
              </Button>
              <Button variant="outline" onClick={() => setDeductData(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "মোট Users",
            value: users.filter((u) => u.role === "user").length,
            color: "#16a34a",
          },
          {
            label: "মোট Admins",
            value: users.filter((u) => u.role === "admin").length,
            color: "#2563eb",
          },
          {
            label: "Super Admins",
            value: users.filter((u) => u.role === "super_admin").length,
            color: "#7c3aed",
          },
          {
            label: "Blocked",
            value: users.filter((u) => u.isBlocked).length,
            color: "#dc2626",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="border rounded-xl p-4 text-center bg-background"
          >
            <div className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="bg-muted/50 border-b">
                {["SL", "Name", "Email", "Role", "Balance", "Status", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    কোনো user নেই
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => {
                  const badge = getRoleBadge(user.role)
                  const isSuper = user.role === "super_admin"
                  const isBlocked = user.isBlocked ?? false

                  return (
                    <tr
                      key={user._id}
                      className={`border-t transition-colors ${
                        isBlocked
                          ? "bg-red-50/40 dark:bg-red-950/10"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      {/* SL */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {i + 1}
                      </td>
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                            {(user.name || user.email)[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">
                            {user.name || "—"}
                          </span>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {user.email}
                      </td>
                      {/* Role Badge */}
                      <td className="px-4 py-3">
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      {/* Balance */}
                      <td className="px-4 py-3 text-sm font-semibold">
                        {user.role === "user" ? (
                          <span className="text-green-600 dark:text-green-400">
                            ৳{user.wallet?.balance ?? 0}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        {isBlocked ? (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background: "rgba(239,68,68,0.1)",
                              color: "#dc2626",
                              border: "1px solid rgba(239,68,68,0.3)",
                            }}
                          >
                            Blocked
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "20px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background: "rgba(34,197,94,0.1)",
                              color: "#16a34a",
                              border: "1px solid rgba(34,197,94,0.3)",
                            }}
                          >
                            Active
                          </span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        {isSuper ? (
                          <span className="text-xs text-muted-foreground">
                            Protected
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Make Admin / Remove Admin */}
                            {user.role === "user" ? (
                              <button
                                onClick={() =>
                                  handleRoleChange(user._id, "admin")
                                }
                                disabled={roleLoading === user._id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  background: "rgba(59,130,246,0.1)",
                                  color: "#2563eb",
                                  border: "1px solid rgba(59,130,246,0.3)",
                                  opacity: roleLoading === user._id ? 0.6 : 1,
                                }}
                              >
                                <ShieldCheck size={12} />
                                {roleLoading === user._id
                                  ? "..."
                                  : "Make Admin"}
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleRoleChange(user._id, "user")
                                }
                                disabled={roleLoading === user._id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  background: "rgba(239,68,68,0.1)",
                                  color: "#dc2626",
                                  border: "1px solid rgba(239,68,68,0.3)",
                                  opacity: roleLoading === user._id ? 0.6 : 1,
                                }}
                              >
                                <ShieldX size={12} />
                                {roleLoading === user._id
                                  ? "..."
                                  : "Remove Admin"}
                              </button>
                            )}

                            {/* Recharge (only for regular users) */}
                            {user.role === "user" && (
                              <button
                                onClick={() =>
                                  setRechargeData({
                                    userId: user._id,
                                    amount: "",
                                    note: "",
                                    name: user.name || user.email,
                                  })
                                }
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  background: "rgba(34,197,94,0.1)",
                                  color: "#16a34a",
                                  border: "1px solid rgba(34,197,94,0.3)",
                                }}
                              >
                                <Wallet size={12} />
                                Recharge
                              </button>
                            )}

                            {/* Deduct (only for regular users) */}
                            {user.role === "user" && (
                              <button
                                onClick={() =>
                                  setDeductData({
                                    userId: user._id,
                                    amount: "",
                                    reason: "",
                                    name: user.name || user.email,
                                  })
                                }
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  background: "rgba(239,68,68,0.1)",
                                  color: "#dc2626",
                                  border: "1px solid rgba(239,68,68,0.3)",
                                }}
                              >
                                <MinusCircle size={12} />
                                Deduct
                              </button>
                            )}

                            {/* Block / Unblock */}
                            <button
                              onClick={() =>
                                handleToggleBlock(user._id, isBlocked)
                              }
                              disabled={
                                actionLoading === `block-${user._id}`
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "5px 10px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                background: isBlocked
                                  ? "rgba(34,197,94,0.1)"
                                  : "rgba(245,158,11,0.1)",
                                color: isBlocked ? "#16a34a" : "#d97706",
                                border: `1px solid ${
                                  isBlocked
                                    ? "rgba(34,197,94,0.3)"
                                    : "rgba(245,158,11,0.3)"
                                }`,
                                opacity:
                                  actionLoading === `block-${user._id}`
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {isBlocked ? (
                                <CheckCircle size={12} />
                              ) : (
                                <Ban size={12} />
                              )}
                              {actionLoading === `block-${user._id}`
                                ? "..."
                                : isBlocked
                                ? "Unblock"
                                : "Block"}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() =>
                                handleDelete(
                                  user._id,
                                  user.name || user.email
                                )
                              }
                              disabled={
                                actionLoading === `delete-${user._id}`
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "5px 10px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                background: "rgba(239,68,68,0.08)",
                                color: "#dc2626",
                                border: "1px solid rgba(239,68,68,0.25)",
                                opacity:
                                  actionLoading === `delete-${user._id}`
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              <Trash2 size={12} />
                              {actionLoading === `delete-${user._id}`
                                ? "..."
                                : "Delete"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}