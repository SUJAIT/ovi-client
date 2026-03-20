"use client"

import { useState } from "react"
import { auth } from "@/lib/firebase"
import { searchNid } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Search, Wallet, Download } from "lucide-react"
import { useUser } from "@/hooks/useUser"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ovi-workstation-backend.onrender.com"

type NidData = {
  name: string
  nameEn: string
  nid: string
  pin: string
  dob: string
  father: string
  mother: string
  spouse: string
  bloodGroup: string
  gender: string
  birthPlace: string
  religion: string
  voterNo: string
  slNo: number
  voterArea: string
  voterAreaCode: number
  preAddressLine: string
  perAddressLine: string
  photo: string
}

export default function ServerCopyPage() {
  const { user } = useUser()
  const [nid, setNid] = useState("")
  const [dob, setDob] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [nidData, setNidData] = useState<NidData | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const isAdmin = user?.role === "admin" || user?.role === "super_admin"
  const balance = user?.wallet?.balance ?? 0

  // ── Search ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    setError("")
    setNidData(null)

    if (!nid || !dob) { setError("NID নম্বর এবং জন্ম তারিখ দিন"); return }
    if (nid.length !== 10 && nid.length !== 17) { setError("NID অবশ্যই ১০ বা ১৭ সংখ্যার হতে হবে"); return }
    if (!isAdmin && balance < 40) { setError("পর্যাপ্ত ব্যালেন্স নেই। অনুগ্রহ করে রিচার্জ করুন।"); return }

    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Token not found")
      const result = await searchNid(token, nid, dob)
      if (!result.success) { setError(result.message || "তথ্য পাওয়া যায়নি"); return }
      setNidData(result.data)
    } catch {
      setError("সার্ভার এরর। আবার চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  // ── PDF Download — backend থেকে ───────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!nidData) return
    setPdfLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("No token")

      // Backend থেকে PDF blob নিয়ে download করো
      const res = await fetch(
        `${BASE_URL}/server-copy/pdf?nid=${nidData.nid}&dob=${nidData.dob}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.ok) throw new Error("PDF generation failed")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `NID_${nidData.nid}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

    } catch {
      setError("PDF তৈরিতে সমস্যা হয়েছে।")
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">সার্ভার কপি</h1>
        {!isAdmin && (
          <Badge variant="outline" className="gap-1.5 text-sm px-3 py-1.5">
            <Wallet className="size-4" />
            ব্যালেন্স: ৳{balance}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">তথ্য অনুসন্ধান</CardTitle></CardHeader>
        <CardContent className="space-y-4">

          <div className="space-y-1.5">
            <Label>
              এনআইডি নম্বর (English) <span className="text-red-500">*</span>
              <span className="text-xs text-muted-foreground ml-2">১০ বা ১৭ সংখ্যা</span>
            </Label>
            <Input
              placeholder="১০/১৭ সংখ্যার আইডি নাম্বার"
              value={nid}
              onChange={(e) => setNid(e.target.value.replace(/\D/g, ""))}
              maxLength={17}
            />
          </div>

          <div className="space-y-1.5">
            <Label>জন্ম তারিখ (English) <span className="text-red-500">*</span></Label>
            <Input placeholder="yyyy-mm-dd" value={dob} onChange={(e) => setDob(e.target.value)} />
            <p className="text-xs text-muted-foreground">উদাহরণ: 2003-08-01</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-md border border-red-200">
              <AlertCircle className="size-4 shrink-0" />{error}
            </div>
          )}

          {!isAdmin && (
            <p className="text-center text-sm text-muted-foreground border rounded-md py-2.5">
              এই সার্ভার কপি তৈরি করতে <span className="text-primary font-semibold">৳৪০</span> চার্জ কাটবে
            </p>
          )}

          <Button className="w-full gap-2" onClick={handleSearch} disabled={loading}>
            <Search className="size-4" />
            {loading ? "অনুসন্ধান করা হচ্ছে..." : "সার্ভার কপি তৈরি করুন"}
          </Button>

        </CardContent>
      </Card>

      {nidData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-green-600">✓ তথ্য পাওয়া গেছে</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
              >
                <Download className="size-4" />
                {pdfLoading ? "PDF তৈরি হচ্ছে..." : "PDF ডাউনলোড"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {nidData.photo && (
                <img src={nidData.photo} alt={nidData.nameEn}
                  className="w-24 h-28 object-cover rounded border flex-shrink-0" />
              )}
              <div className="space-y-1.5 text-sm">
                <p><span className="text-muted-foreground w-32 inline-block">নাম (বাংলা):</span> <strong>{nidData.name}</strong></p>
                <p><span className="text-muted-foreground w-32 inline-block">নাম (ইংরেজি):</span> {nidData.nameEn}</p>
                <p><span className="text-muted-foreground w-32 inline-block">NID নম্বর:</span> {nidData.nid}</p>
                <p><span className="text-muted-foreground w-32 inline-block">জন্ম তারিখ:</span> {nidData.dob}</p>
                <p><span className="text-muted-foreground w-32 inline-block">পিতার নাম:</span> {nidData.father}</p>
                <p><span className="text-muted-foreground w-32 inline-block">মাতার নাম:</span> {nidData.mother}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>বর্তমান ঠিকানা:</strong> {nidData.preAddressLine}
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  )
}