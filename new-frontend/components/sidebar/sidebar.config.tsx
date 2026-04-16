import {
  LayoutDashboard,
  Folder,
  BookOpen,
  Users,
  BarChart2,
  Wallet,
  History,
  Settings,
  Bell,
  BarChart3,

  type LucideIcon,
} from "lucide-react"

export type TUserRole = "user" | "admin" | "super_admin"
export type NavChild = { 
  title: string
  href: string
  badgeKey?: string // used to look up dynamic counts
}
export type NavItem = {
  title: string
  icon: LucideIcon
  href?: string
  roles?: TUserRole[]
  children?: NavChild[]
}
export type NavGroup = {
  label: string
  roles?: TUserRole[]
  items: NavItem[]
}
export type Team = { name: string; plan: string; logoUrl?: string }

export const TEAMS: Team[] = [
  {
    name: "ICT Seba",
    plan: "Workstation",
    logoUrl: "/images/logo.png"
  }
]

export const NAV_GROUPS: NavGroup[] = [
  // ── সবার জন্য
  {
    label: "Application",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },

  // ── শুধু User
  {
    label: "Platform",
    roles: ["user"],
    items: [
      {
        title: "সকল-সেবা",
        icon: Folder,
        children: [
          { title: "সার্ভার-কপি",       href: "/workplace/server-copy" },
          { title: "NID কার্ড উত্তোলন", href: "/workplace/nid-withdraw" }, // ← new
        ],
      },
      { title: "Services-History", icon: BookOpen, href: "/workplace/services-history" },
      { title: "রিচার্জ",           icon: Wallet,  href: "/recharge" },
      { title: "রিচার্জ-History",   icon: History, href: "/recharge-history" },
    ],
  },

  // ── Admin Platform
  {
    label: "Platform",
    roles: ["admin", "super_admin"],
    items: [
      {
        title: "Workplace",
        icon: Folder,
        children: [
          { title: "Server-Copy",        href: "/workplace/server-copy" },
         
        ],
      },
    ],
  },

  // service request 

    {
    label: "Service Requests",
    roles: ["admin", "super_admin"],
    items: [
      {
        title: "All Requests",
        icon: Folder,
        children: [
      { title: "NID উত্তোলন Requests", href: "/admin/nid-withdraw", badgeKey: "nid_withdraw_request" },
        
        ],
      },
    ],
  },

  // ── Admin Panel
  {
    label: "Admin Panel",
    roles: ["admin", "super_admin"],
    items: [
      { title: "Services-History",   icon: BookOpen,  href: "/workplace/services-history" },
      { title: "Users",              icon: Users,     href: "/admin/users",              roles: ["admin", "super_admin"] },
      { title: "Recharge Requests",  icon: Bell,      href: "/admin/recharge-requests",  roles: ["admin", "super_admin"] },
      
      { title: "Transactions",       icon: BarChart2, href: "/admin/transactions",       roles: ["admin", "super_admin"] },
      { title: "Settings",           icon: Settings,  href: "/admin/settings",           roles: ["super_admin"] },
      {
        title: "Analytic-Server-Copy",
        icon: BarChart2,
        href: "/admin/analytics",
        roles: ["admin", "super_admin"]
      },
      {
        title: "Server API Limit",
        icon: BarChart3,
        href: "https://api-system.xyz/balance.php?key=2Q7jEdFY"
      }
    ],
  },
]
