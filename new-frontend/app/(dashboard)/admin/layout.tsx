"use client"
import { AdminGuard } from "@/components/guards/Guards"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
