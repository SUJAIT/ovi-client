"use client"

import { useState } from "react"
import { auth } from "@/lib/firebase"
import { useUser } from "@/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Zap } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ovi-workstation-backend.onrender.com"

// Quick amount options
const QUICK_AMOUNTS = [100, 200, 500, 1000]

export default function RechargePage() {
  const { user } = useUser()
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const balance = user?.wallet?.balance ?? 0

  const handleRecharge = async () => {
    setError("")
    const amt = parseInt(amount)

    if (!amt || amt < 10) {
      setError("সর্বনিম্ন ১০ টাকা recharge করুন")
      return
    }

    setLoading(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error("Login করুন")

      const res = await fetch(`${BASE_URL}/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amt }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || "Payment শুরু করা যায়নি")
        return
      }

      // bKash URL এ redirect করো
      window.location.href = data.bkashURL

    } catch (err: any) {
      setError(err.message || "সার্ভার এরর")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ওয়ালেট রিচার্জ</h1>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm">
          <Wallet className="size-4" />
          ব্যালেন্স: ৳{balance}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">bKash দিয়ে রিচার্জ করুন</CardTitle>
          <CardDescription>আপনার ওয়ালেটে টাকা যোগ করুন</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>দ্রুত পরিমাণ বেছে নিন</Label>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((amt) => (
                <Button
                  key={amt}
                  variant={amount === String(amt) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(String(amt))}
                >
                  ৳{amt}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-1.5">
            <Label>অথবা পরিমাণ লিখুন</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">৳</span>
              <Input
                className="pl-7"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                type="number"
                min="10"
              />
            </div>
            <p className="text-xs text-muted-foreground">সর্বনিম্ন ৳১০</p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-md border border-red-200">
              {error}
            </p>
          )}

          {/* bKash Pay Button */}
          <Button
            className="w-full gap-2 bg-[#E2136E] hover:bg-[#c41060] text-white"
            onClick={handleRecharge}
            disabled={loading || !amount}
          >
            <Zap className="size-4" />
            {loading
              ? "bKash এ যাচ্ছে..."
              : amount
              ? `৳${amount} bKash দিয়ে পরিশোধ করুন`
              : "পরিমাণ দিন"}
          </Button>

          {/* Info */}
          <p className="text-xs text-center text-muted-foreground">
            bKash payment সম্পন্ন হলে ব্যালেন্স স্বয়ংক্রিয়ভাবে যোগ হবে
          </p>

        </CardContent>
      </Card>

    </div>
  )
}