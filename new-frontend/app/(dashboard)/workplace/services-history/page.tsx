"use client"

import { useState, useEffect, useMemo } from "react"
import { auth } from "@/lib/firebase"
import { useUser } from "@/hooks/useUser"
import { Download, Search, ChevronLeft, ChevronRight, RefreshCw, FileText } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ovi-workstation-backend.onrender.com"

type Transaction = {
  _id: string
  type: "credit" | "debit"
  service: "server-copy" | "recharge"
  amount: number
  nid?: string
  dob?: string
  nameEn?: string
  name?: string
  status: "success" | "failed"
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

const ENTRIES_OPTIONS = [5, 10, 25, 50]

export default function ServicesHistoryPage() {
  const { user, loading: userLoading } = useUser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [pdfLoading, setPdfLoading] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  // ── Fetch — user ready হলে ────────────────────────────────────
  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return

      const res = await fetch(`${BASE_URL}/transaction/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (data.success) {
        // শুধু server-copy দেখাবে
        const serverCopyOnly = data.data.filter(
          (t: Transaction) => t.service === "server-copy"
        )
        setTransactions(serverCopyOnly)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // userLoading শেষ হলে এবং user থাকলে fetch করো
  useEffect(() => {
    if (!userLoading && user) {
      fetchTransactions()
    }
  }, [userLoading, user])

  // ── Search filter ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return transactions
    const q = search.toLowerCase()
    return transactions.filter(
      (t) =>
        t.nid?.includes(q) ||
        t.nameEn?.toLowerCase().includes(q) ||
        t.name?.toLowerCase().includes(q) ||
        t.dob?.includes(q)
    )
  }, [transactions, search])

  // ── Pagination ─────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / entriesPerPage)
  const paginated = filtered.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  useEffect(() => setCurrentPage(1), [search, entriesPerPage])

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p)
  }

  // ── PDF Download ───────────────────────────────────────────────
  const handleDownloadPdf = async (t: Transaction) => {
    if (!t.nid || !t.dob) {
      alert("এই রেকর্ডের NID বা DOB তথ্য নেই।")
      return
    }
    setPdfLoading(t._id)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return

      const res = await fetch(
        `${BASE_URL}/server-copy/pdf?nid=${t.nid}&dob=${t.dob}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.ok) throw new Error("PDF তৈরি হয়নি")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `NID_${t.nid}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert("PDF download করা যায়নি।")
    } finally {
      setPdfLoading(null)
    }
  }

  // ── Date format ────────────────────────────────────────────────
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    })

  const formatDob = (dob?: string) => {
    if (!dob) return "—"
    return new Date(dob).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    })
  }

  // ── Page numbers ───────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <>
      <style>{`
        .history-wrap {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .history-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          color: hsl(var(--foreground));
        }
        .history-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }
        .entries-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: hsl(var(--muted-foreground));
        }
        .entries-select {
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 13px;
          cursor: pointer;
          outline: none;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .refresh-btn {
          background: none;
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          padding: 4px 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: hsl(var(--muted-foreground));
          transition: all 0.2s;
        }
        .refresh-btn:hover {
          border-color: #20b2aa;
          color: #20b2aa;
        }
        .search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-label {
          font-size: 13px;
          color: hsl(var(--muted-foreground));
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .search-input {
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 13px;
          outline: none;
          width: 180px;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          transition: border 0.2s;
        }
        .search-input:focus { border-color: #20b2aa; }

        /* Table */
        .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        thead tr { background: #20b2aa; }
        th {
          padding: 10px 12px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        tbody tr {
          border-bottom: 1px solid hsl(var(--border));
          transition: background 0.15s;
        }
        tbody tr:nth-child(even) { background: hsl(var(--muted)/0.3); }
        tbody tr:hover { background: rgba(32,178,170,0.08); }
        td {
          padding: 10px 12px;
          text-align: center;
          font-size: 13px;
          color: hsl(var(--foreground));
          vertical-align: middle;
        }
        .type-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(32,178,170,0.1);
          color: #20b2aa;
          border: 1px solid rgba(32,178,170,0.3);
          white-space: nowrap;
        }
        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          white-space: nowrap;
        }
        .action-btn:active { transform: scale(0.96); }
        .btn-download { background: #20b2aa; color: #fff; }
        .btn-download:hover { opacity: 0.85; }
        .btn-disabled {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          cursor: not-allowed;
          opacity: 0.6;
        }
        .empty-cell {
          padding: 48px 20px;
          text-align: center;
          color: hsl(var(--muted-foreground));
        }
        .table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
        }
        .showing-text {
          font-size: 12px;
          color: hsl(var(--muted-foreground));
        }
        .pagination { display: flex; gap: 4px; flex-wrap: wrap; }
        .page-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 8px;
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          background: hsl(var(--background));
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: hsl(var(--foreground));
        }
        .page-btn:hover:not(:disabled) {
          background: rgba(32,178,170,0.1);
          border-color: #20b2aa;
          color: #20b2aa;
        }
        .page-btn.active {
          background: #20b2aa;
          border-color: #20b2aa;
          color: #fff;
          font-weight: 700;
        }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .copyright {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: hsl(var(--muted-foreground));
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .history-wrap { padding: 14px 10px; }
          .history-title { font-size: 17px; }
          .search-input { width: 120px; }
          .history-controls { flex-direction: column; align-items: flex-start; }
          .table-footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="history-wrap">
        <div className="history-title">📋 সার্ভিস হিস্টোরি</div>

        {/* Controls */}
        <div className="history-controls">
          <div className="entries-wrap">
            <span>Show</span>
            <select
              className="entries-select"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              {ENTRIES_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span>entries</span>
            <button className="refresh-btn" onClick={fetchTransactions}>
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
          <div className="search-wrap">
            <span className="search-label">
              <Search size={13} />
              Search:
            </span>
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="NID, নাম, তারিখ..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>TYPE</th>
                <th>NAME</th>
                <th>NID NO</th>
                <th>DOB</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading || userLoading ? (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    <RefreshCw size={20} style={{ margin: "0 auto 8px", display: "block", animation: "spin 1s linear infinite", opacity: 0.5 }} />
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    <FileText size={32} style={{ margin: "0 auto 8px", display: "block", opacity: 0.25 }} />
                    কোনো রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                paginated.map((t, idx) => (
                  <tr key={t._id}>
                    <td>{(currentPage - 1) * entriesPerPage + idx + 1}</td>
                    <td>
                      <span className="type-badge">NEW NID</span>
                    </td>
                    <td style={{ textAlign: "left", fontWeight: 500 }}>
                      {t.nameEn || t.name || "—"}
                    </td>
                    <td style={{ fontFamily: "monospace", letterSpacing: "0.3px", fontWeight: 600 }}>
                      {t.nid || "—"}
                    </td>
                    <td>{formatDob(t.dob)}</td>
                    <td style={{ fontSize: "12px", color: "hsl(var(--muted-foreground))" }}>
                      {formatDate(t.createdAt)}
                    </td>
                    <td>
                      {t.nid && t.dob ? (
                        <button
                          className="action-btn btn-download"
                          onClick={() => handleDownloadPdf(t)}
                          disabled={pdfLoading === t._id}
                          title="PDF ডাউনলোড"
                        >
                          {pdfLoading === t._id ? (
                            <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} />
                          ) : (
                            <Download size={12} />
                          )}
                          {pdfLoading === t._id ? "..." : "PDF"}
                        </button>
                      ) : (
                        <button className="action-btn btn-disabled" disabled>N/A</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="table-footer">
          <div className="showing-text">
            {filtered.length === 0
              ? "কোনো রেকর্ড নেই"
              : `Showing ${(currentPage - 1) * entriesPerPage + 1} to ${Math.min(currentPage * entriesPerPage, filtered.length)} of ${filtered.length} entries`
            }
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft size={14} />
              </button>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`d${i}`} style={{ padding: "0 4px", alignSelf: "center", color: "hsl(var(--muted-foreground))" }}>...</span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${currentPage === p ? "active" : ""}`}
                    onClick={() => goToPage(p as number)}
                  >
                    {p}
                  </button>
                )
              )}
              <button className="page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="copyright">© 2026 Workstation. All Rights Reserved.</div>
      </div>
    </>
  )
}