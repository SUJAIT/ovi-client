"use client"

import { useState, useEffect } from "react"
import { Wallet, CheckCircle, Clock, XCircle, Send, AlertCircle, Banknote } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { auth } from "@/lib/firebase"

const BKASH_NUMBER = "01836346401"
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

type MyRequest = {
  _id: string
  amount: number
  bkashTrxID: string
  senderNumber?: string
  status: "pending" | "approved" | "rejected"
  adminNote?: string
  createdAt: string
}

export default function RechargePage() {
  const { user, refreshWallet } = useUser()
  const balance = user?.wallet?.balance ?? 0

  const [trxID, setTrxID] = useState("")
  const [amount, setAmount] = useState("")
  const [senderNumber, setSenderNumber] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [copied, setCopied] = useState(false)
  const [myRequests, setMyRequests] = useState<MyRequest[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const copyNumber = () => {
    navigator.clipboard.writeText(BKASH_NUMBER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fetchMyRequests = async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      const res = await fetch(`${BASE_URL}/recharge-request/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setMyRequests(data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingHistory(false)
    }
  }

  // useEffect(() => {
  //   fetchMyRequests()
  // }, [])

  //15s update
  useEffect(() => {
    // প্রথমবার লোড করার জন্য
    fetchMyRequests();

    // প্রতি ১৫ সেকেন্ড পর পর অটোমেটিক আপডেট হবে
    const interval = setInterval(() => {
      fetchMyRequests();
      if (refreshWallet) refreshWallet();
    }, 15000); // ১৫০০০ মিলি-সেকেন্ড = ১৫ সেকেন্ড

    // পেজ থেকে চলে গেলে ইন্টারভাল বন্ধ করে দিবে
    return () => clearInterval(interval);
  }, [refreshWallet]);

  const handleSubmit = async () => {
    setMsg(null)
    const cleanTrx = trxID.trim().toUpperCase()
    const cleanNumber = senderNumber.trim()
    const parsedAmount = Number(amount)

    // ভ্যালিডেশন চেক
    if (!cleanTrx || cleanTrx.length < 3) {
      setMsg({ text: "বৈধ bKash Transaction ID দিন", ok: false }); return
    }
    
    // এখানে পরিবর্তন করা হয়েছে: ৩ ডিজিট অথবা ১১ ডিজিট গ্রহণ করবে
    if (cleanNumber.length < 3) {
      setMsg({ text: "বিকাশ নম্বরের শেষ ৩ ডিজিট বা পুরো নম্বর দিন", ok: false }); return
    }

    if (!amount || isNaN(parsedAmount) || parsedAmount < 10) {
      setMsg({ text: "সর্বনিম্ন ৳১০ টাকা দিন", ok: false }); return
    }

    setSubmitting(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) { 
        setMsg({ text: "লগইন করুন", ok: false })
        setSubmitting(false)
        return 
      }

      const res = await fetch(`${BASE_URL}/recharge-request/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          bkashTrxID: cleanTrx, 
          amount: parsedAmount,
          senderNumber: cleanNumber 
        }),
      })

      const data = await res.json()
      setMsg({ text: data.message, ok: data.success })
      
      if (data.success) {
        setTrxID(""); setAmount(""); setSenderNumber("");
        fetchMyRequests()
        if (refreshWallet) await refreshWallet()
      }
    } catch (err) {
      setMsg({ text: "নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন", ok: false })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    })

  const statusInfo = (s: string) => {
    if (s === "approved") return { color: "#10b981", bg: "#ecfdf5", label: "Approved", icon: <CheckCircle size={12} /> }
    if (s === "rejected") return { color: "#ef4444", bg: "#fef2f2", label: "Rejected", icon: <XCircle size={12} /> }
    return { color: "#f59e0b", bg: "#fffbeb", label: "Pending", icon: <Clock size={12} /> }
  }

  return (
    <div className="rc-container" style={{maxWidth: '480px', margin: '0 auto', padding: '20px 15px'}}>
        {/* ব্যালেন্স কার্ড */}
        <div style={{
          background: 'linear-gradient(135deg, #E2136E 0%, #9e0d4d 100%)',
          borderRadius: '20px', padding: '24px', color: 'white', marginBottom: '25px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Current Balance</div>
            <div style={{fontSize: '28px', fontWeight: 800}}>৳ {balance.toFixed(2)}</div>
          </div>
          <Wallet size={32} style={{opacity: 0.5}} />
        </div>

        {/* বিকাশ পেমেন্ট বক্স */}
        <div style={{background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '20px', padding: '20px', marginBottom: '20px'}}>
          <div style={{fontWeight: 700, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Banknote size={18} color="#E2136E" /> bKash পেমেন্ট করুন
          </div>
          <div style={{background: '#fdf2f8', border: '1px dashed #E2136E', borderRadius: '15px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{width: '40px', height: '40px', background: '#E2136E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>৳</div>
              <div>
                <div style={{fontSize: '11px', color: '#E2136E', fontWeight: 600}}>Merchant Number</div>
                <div style={{fontSize: '18px', fontWeight: 700, color: '#E2136E'}}>{BKASH_NUMBER}</div>
              </div>
            </div>
            <button onClick={copyNumber} style={{ background: copied ? '#10b981' : '#E2136E', padding: '8px 12px', color: 'white', borderRadius: '10px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* ফর্ম বক্স */}
        <div style={{background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '20px', padding: '20px', marginBottom: '20px'}}>
          <div style={{fontWeight: 700, marginBottom: '15px'}}><Send size={18} style={{display:'inline', marginRight:'8px'}}/> রিকোয়েস্ট জমা দিন</div>
          
          {msg && (
            <div style={{ 
              padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', 
              background: msg.ok ? '#ecfdf5' : '#fef2f2', color: msg.ok ? '#10b981' : '#ef4444',
              display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid'
            }}>
              {msg.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {msg.text}
            </div>
          )}

          <div style={{marginBottom: '16px'}}>
            <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px'}}>Transaction ID</label>
            <input 
               style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid hsl(var(--border))', background: 'hsl(var(--background))'}}
               placeholder="Ex: 8G6A1B2C3D" value={trxID} onChange={(e) => setTrxID(e.target.value.toUpperCase())} 
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px'}}>বিকাশ নম্বর (শেষ ৩টি বা পূর্ণ সংখ্যা)</label>
            <input 
               style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid hsl(var(--border))', background: 'hsl(var(--background))'}}
               type="tel" placeholder="017... অথবা ৩৪৮" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} 
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{display:'block', fontSize:'13px', fontWeight:600, marginBottom:'5px'}}>পরিমাণ</label>
            <input 
               style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid hsl(var(--border))', background: 'hsl(var(--background))'}}
               type="number" placeholder="Min 10 BDT" value={amount} onChange={(e) => setAmount(e.target.value)} 
            />
          </div>

          <button 
            disabled={submitting}
            onClick={handleSubmit}
            style={{width: '100%', background: '#E2136E', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer'}}
          >
            {submitting ? "Processing..." : "Submit Request"}
          </button>
        </div>

        {/* হিস্টোরি টেবিল */}
        <div style={{background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '20px', padding: '20px 0'}}>
          <div style={{fontWeight: 700, padding: '0 20px', marginBottom: '10px'}}>রিচার্জ হিস্টোরি</div>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
              <thead>
                <tr style={{borderBottom: '1px solid hsl(var(--border))'}}>
                  <th style={{textAlign: 'left', padding: '12px 20px'}}>TrxID / Date</th>
                  <th style={{textAlign: 'left', padding: '12px 10px'}}>Amount</th>
                  <th style={{textAlign: 'left', padding: '12px 20px'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingHistory ? (
                   <tr><td colSpan={3} style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
                ) : (
                  myRequests.map((r) => {
                    const si = statusInfo(r.status)
                    return (
                      <tr key={r._id} style={{borderBottom: '1px solid hsl(var(--border))'}}>
                        <td style={{padding: '12px 20px'}}>
                          <div style={{fontWeight: 700}}>{r.bkashTrxID}</div>
                          <div style={{fontSize: '10px', color: '#999'}}>{formatDate(r.createdAt)}</div>
                        </td>
                        <td style={{fontWeight: 700, padding: '12px 10px'}}>৳{r.amount}</td>
                        <td style={{padding: '12px 20px'}}>
                          <span style={{ background: si.bg, color: si.color, padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {si.icon} {si.label}
                          </span>
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