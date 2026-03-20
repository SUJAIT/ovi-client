// app/(dashboard)/payment/success/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const amount = params.get("amount")
  const trxID = params.get("trxID")

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
          <CheckCircle className="size-16 text-green-500" />
          <h2 className="text-xl font-bold">পেমেন্ট সফল হয়েছে!</h2>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>আপনার ওয়ালেটে <span className="text-green-600 font-semibold">৳{amount}</span> যোগ হয়েছে</p>
            {trxID && <p>TrxID: <span className="font-mono">{trxID}</span></p>}
          </div>
          <Button className="w-full mt-2" onClick={() => router.push("/workplace/server-copy")}>
            সার্ভার কপি করুন
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
            ড্যাশবোর্ড
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}