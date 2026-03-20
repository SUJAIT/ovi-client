"use client"

import { useState, useEffect, useMemo } from "react"
import { auth } from "@/lib/firebase"
import { getAllTransactions } from "@/lib/api"
import {
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

type Transaction = {
  _id: string
  userId: { name?: string; email: string } | string
  type: "credit" | "debit"
  service: "server-copy" | "recharge"
  amount: number
  nid?: string
  nameEn?: string
  status: "success" | "failed"
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

const ENTRIES = [10, 25, 50, 100]

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all")
  const [entries, setEntries] = useState(10)
  const [page, setPage] = useState(1)

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const data = await getAllTransactions(token)
      if (data.success) setTransactions(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Filter + Search
  const filtered = useMemo(() => {
    let list = transactions
    if (filter !== "all") list = list.filter((t) => t.type === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((t) => {
        const user = typeof t.userId === "object" ? t.userId : null
        return (
          t.nid?.includes(q) ||
          t.nameEn?.toLowerCase().includes(q) ||
          user?.email?.toLowerCase().includes(q) ||
          user?.name?.toLowerCase().includes(q)
        )
      })
    }
    return list
  }, [transactions, filter, search])

  // Pagination
  const totalPages = Math.ceil(filtered.length / entries)
  const paginated = filtered.slice((page - 1) * entries, page * entries)
  useEffect(() => setPage(1), [search, filter, entries])

  // Summary
  const totalCredit = transactions.filter((t) => t.type === "credit" && t.status === "success").reduce((s, t) => s + t.amount, 0)
  const totalDebit = transactions.filter((t) => t.type === "debit" && t.status === "success").reduce((s, t) => s + t.amount, 0)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })

  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push("...")
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
      if (page < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <>
      <style>{`
        .tx-wrap { max-width: 1100px; margin: 0 auto; }
        .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .summary-card { padding: 16px; border-radius: 12px; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); }
        .summary-label { font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 4px; }
        .summary-value { font-size: 20px; font-weight: 700; }
        .controls { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
        .left-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .entries-sel { border: 1px solid hsl(var(--border)); border-radius: 6px; padding: 5px 8px; font-size: 13px; background: hsl(var(--background)); color: hsl(var(--foreground)); cursor: pointer; outline: none; }
        .filter-btn { padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); cursor: pointer; transition: all 0.15s; }
        .filter-btn.active { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-color: hsl(var(--primary)); }
        .search-wrap { display: flex; align-items: center; gap: 6px; }
        .search-input { border: 1px solid hsl(var(--border)); border-radius: 6px; padding: 6px 10px; font-size: 13px; outline: none; width: 200px; background: hsl(var(--background)); color: hsl(var(--foreground)); }
        .search-input:focus { border-color: hsl(var(--primary)); }
        .table-wrap { overflow-x: auto; border: 1px solid hsl(var(--border)); border-radius: 12px; }
        table { width: 100%; border-collapse: collapse; min-width: 650px; }
        thead tr { background: hsl(var(--muted)/0.5); }
        th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: hsl(var(--muted-foreground)); letter-spacing: 0.5px; white-space: nowrap; }
        tbody tr { border-top: 1px solid hsl(var(--border)); transition: background 0.15s; }
        tbody tr:hover { background: hsl(var(--muted)/0.3); }
        td { padding: 10px 12px; font-size: 13px; vertical-align: middle; }
        .badge { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .badge-credit { background: rgba(34,197,94,0.1); color: #16a34a; }
        .badge-debit { background: rgba(239,68,68,0.1); color: #dc2626; }
        .badge-success { background: rgba(34,197,94,0.1); color: #16a34a; }
        .badge-failed { background: rgba(239,68,68,0.1); color: #dc2626; }
        .footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
        .showing { font-size: 12px; color: hsl(var(--muted-foreground)); }
        .pagination { display: flex; gap: 4px; }
        .page-btn { min-width: 32px; height: 32px; padding: 0 8px; border: 1px solid hsl(var(--border)); border-radius: 6px; background: hsl(var(--background)); color: hsl(var(--foreground)); font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .page-btn:hover:not(:disabled) { border-color: hsl(var(--primary)); color: hsl(var(--primary)); }
        .page-btn.active { background: hsl(var(--primary)); border-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); font-weight: 700; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 640px) {
          .summary-cards { grid-template-columns: 1fr 1fr; }
          .controls { flex-direction: column; align-items: flex-start; }
          .footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="tx-wrap">

        {/* Title */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 size={22} /> সব Transactions
          </h1>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border rounded-lg px-3 py-2 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">মোট Transactions</div>
            <div className="summary-value">{transactions.length}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">মোট Recharge</div>
            <div className="summary-value" style={{ color: "#16a34a" }}>৳{totalCredit}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">মোট Revenue</div>
            <div className="summary-value" style={{ color: "#dc2626" }}>৳{totalDebit}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="left-controls">
            <span className="text-sm text-muted-foreground">Show</span>
            <select className="entries-sel" value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
              {ENTRIES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-sm text-muted-foreground">entries</span>
            <div className="flex gap-1">
              {(["all", "credit", "debit"] as const).map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f === "credit" ? "Recharge" : "Server Copy"}
                </button>
              ))}
            </div>
          </div>
          <div className="search-wrap">
            <Search size={13} className="text-muted-foreground" />
            <input
              className="search-input"
              placeholder="NID, নাম, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>USER</th>
                <th>TYPE</th>
                <th>SERVICE</th>
                <th>NID</th>
                <th>AMOUNT</th>
                <th>BALANCE AFTER</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "hsl(var(--muted-foreground))" }}>
                  <RefreshCw size={20} style={{ margin: "0 auto 8px", display: "block", animation: "spin 1s linear infinite", opacity: 0.5 }} />
                  লোড হচ্ছে...
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "48px", color: "hsl(var(--muted-foreground))" }}>
                  কোনো transaction নেই
                </td></tr>
              ) : (
                paginated.map((t, i) => {
                  const user = typeof t.userId === "object" ? t.userId : null
                  return (
                    <tr key={t._id}>
                      <td style={{ color: "hsl(var(--muted-foreground))", fontSize: "12px" }}>
                        {(page - 1) * entries + i + 1}
                      </td>
                      <td>
                        <div>
                          <p style={{ fontWeight: 500, fontSize: "13px" }}>{user?.name || "—"}</p>
                          <p style={{ fontSize: "11px", color: "hsl(var(--muted-foreground))" }}>{user?.email || "—"}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${t.type === "credit" ? "badge-credit" : "badge-debit"}`}>
                          {t.type === "credit"
                            ? <ArrowUpRight size={11} />
                            : <ArrowDownRight size={11} />
                          }
                          {t.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        {t.service === "server-copy" ? "Server Copy" : "Recharge"}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600 }}>
                        {t.nid || "—"}
                      </td>
                      <td style={{ fontWeight: 700, color: t.type === "credit" ? "#16a34a" : "#dc2626" }}>
                        {t.type === "credit" ? "+" : "-"}৳{t.amount}
                      </td>
                      <td style={{ fontSize: "12px" }}>৳{t.balanceAfter}</td>
                      <td>
                        <span className={`badge ${t.status === "success" ? "badge-success" : "badge-failed"}`}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))", whiteSpace: "nowrap" }}>
                        {formatDate(t.createdAt)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="showing">
            {filtered.length === 0 ? "কোনো রেকর্ড নেই" :
              `Showing ${(page - 1) * entries + 1} to ${Math.min(page * entries, filtered.length)} of ${filtered.length} entries`}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <ChevronLeft size={14} />
              </button>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`d${i}`} style={{ padding: "0 4px", alignSelf: "center", color: "hsl(var(--muted-foreground))" }}>...</span>
                ) : (
                  <button key={p} className={`page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p as number)}>
                    {p}
                  </button>
                )
              )}
              <button className="page-btn" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  )
}