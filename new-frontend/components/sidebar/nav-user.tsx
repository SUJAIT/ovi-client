"use client"

import { Moon } from "lucide-react"


import { FaMoneyCheckDollar } from "react-icons/fa6";
// import { MdManageHistory } from "react-icons/md";
import {
  Bell,
  
  CreditCard,
  ChevronsUpDown,
  LogOut,
   
  History,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/dist/client/components/navigation";
import ThemeToggle from "../themeProvider/theme-toggle";



// ── Types ──────────────────────────────────────────────────────────
type NavUserProps = {
  name: string
  email: string
  avatarUrl?: string
  loading?: boolean
  balance: number
  onLogout: () => void
}

// ── Helper ─────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// ── Component ──────────────────────────────────────────────────────
export function NavUser({ name, email, avatarUrl, balance, loading, onLogout }: NavUserProps) {
  const { isMobile } = useSidebar()
  const router = useRouter()


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl ?? ""} alt={name} />
                <AvatarFallback className="rounded-lg">
                  {loading ? "..." : getInitials(name)}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                {loading ? (
                  <span className="truncate text-xs text-muted-foreground">Loading...</span>
                ) : (
                  <>
                    <span className="truncate font-semibold">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">{email}</span>
                  </>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            {/* User info header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl ?? ""} alt={name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                {/* <Sparkles className="mr-2 size-4" /> */}
                <FaMoneyCheckDollar />
                Balance : {balance} ৳
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <BadgeCheck className="mr-2 size-4" />
                Account
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => router.push("/recharge")}>
                <CreditCard className="mr-2 size-4" />
                Balance Recharge
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/recharge-history")}>
                <History className="mr-2 size-4" />
                Recharge History
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Bell className="mr-2 size-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>


  <DropdownMenuItem
    onSelect={(e) => e.preventDefault()}
    className="flex items-center justify-between"
  >
    <div className="flex items-center">
      <Moon className="mr-2 size-4" />
      Theme
    </div>
    <ThemeToggle />
  </DropdownMenuItem>
            

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={onLogout}
            >
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
