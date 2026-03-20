// app/(dashboard)/payment/failed/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"

export default function PaymentFailedPage() {
  const params = useSearchParams()
  const router = useRouter()
  const reason = params.get("reason")

  const getMessage = () => {
    if (reason === "cancel") return "আপনি পেমেন্ট বাতিল করেছেন"
    if (reason === "failure") return "পেমেন্ট ব্যর্থ হয়েছে"
    return "পেমেন্ট সম্পন্ন হয়নি"
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
          <XCircle className="size-16 text-red-500" />
          <h2 className="text-xl font-bold">পেমেন্ট ব্যর্থ!</h2>
          <p className="text-sm text-muted-foreground">{getMessage()}</p>
          <Button className="w-full mt-2" onClick={() => router.push("/recharge")}>
            আবার চেষ্টা করুন
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
            ড্যাশবোর্ড
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}