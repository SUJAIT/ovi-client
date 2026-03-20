// 


"use client"

import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { auth } from "@/lib/firebase"
import { useUser } from "@/hooks/useUser"
import { NavHeader } from "./nav-header"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

export function AppSidebar() {
  const { user, loading } = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    await auth.signOut()
    router.push("/login")
  }

  return (
    <Sidebar collapsible="icon">

      {/* ── Org Switcher ── */}
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>

      {/* ── Nav Items (role-based) ── */}
      <SidebarContent>
        <NavMain role={user?.role} />
      </SidebarContent>

      {/* ── User Dropdown ── */}
      <SidebarFooter>
        <NavUser
          name={user?.name ?? "User"}
          email={user?.email ?? ""}
          avatarUrl={user?.photoURL}
          loading={loading}
          balance={user?.wallet?.balance ?? 0} 
          
          onLogout={handleLogout}
        />
      </SidebarFooter>

    </Sidebar>
  )
}



