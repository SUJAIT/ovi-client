"use client"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// ── User Guard — login না থাকলে /login এ পাঠায় ──────────────────
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!user) return null
  return <>{children}</>
}

// ── Admin Guard — admin/super_admin না হলে /dashboard এ পাঠায় ────
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "super_admin"))) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) return null
  return <>{children}</>
}
