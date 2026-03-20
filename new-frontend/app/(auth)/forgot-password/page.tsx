"use client"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleReset = async () => {
    setError("")
    if (!email) { setError("Email দিন"); return }

    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      if (err.code === "auth/user-not-found") setError("এই email এ কোনো account নেই")
      else if (err.code === "auth/invalid-email") setError("সঠিক email দিন")
      else setError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>পাসওয়ার্ড রিসেট</CardTitle>
          <CardDescription>
            আপনার email দিন — reset link পাঠানো হবে
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {sent ? (
            // ── Success state ──
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail size={24} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-700">Email পাঠানো হয়েছে!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{email}</span> এ reset link গেছে।
                  Spam folder চেক করুন।
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft size={16} />
                Login এ ফিরে যান
              </Button>
            </div>
          ) : (
            // ── Form state ──
            <>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                  {error}
                </p>
              )}

              <Button
                className="w-full"
                onClick={handleReset}
                disabled={loading}
              >
                {loading ? "পাঠানো হচ্ছে..." : "Reset Link পাঠান"}
              </Button>

              <Button
                variant="ghost"
                className="w-full gap-2 text-muted-foreground"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft size={16} />
                Login এ ফিরে যান
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  )
}