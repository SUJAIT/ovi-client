"use client"

import * as React from "react"
import { Building2, ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { TEAMS, type Team } from "./sidebar.config"
import Image from "next/image"

export function NavHeader() {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState<Team>(TEAMS[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-13 items-center justify-center rounded-lg ">
                {activeTeam.logoUrl ? (
                  <Image
                    src={activeTeam.logoUrl}
                    alt="logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <Building2 className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {TEAMS.map((team) => (
              <DropdownMenuItem
                key={team.name}
                className="gap-2 p-2 cursor-pointer"
                onClick={() => setActiveTeam(team)}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                       <div>
  {activeTeam.logoUrl ? (
    <Image
      src={activeTeam.logoUrl}
      alt="logo"
      width={40}
      height={40}
      className="object-contain"
    />
  ) : (
    <Building2 className="size-4" />
  )}
</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{team.name}</span>
                  <span className="text-xs text-muted-foreground">{team.plan}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
