// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { ChevronRight } from "lucide-react"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar"
// import { NAV_GROUPS, type TUserRole } from "./sidebar.config"

// type NavMainProps = {
//   role?: TUserRole
// }

// export function NavMain({ role }: NavMainProps) {
//   const pathname = usePathname()

//   // role check helper
//   const canSee = (roles?: TUserRole[]) => {
//     if (!roles) return true                      // roles নেই = সবাই দেখবে
//     if (!role) return false                      // user role নেই = দেখবে না
//     return roles.includes(role)
//   }

//   return (
//     <>
//       {NAV_GROUPS.map((group) => {
//         // group-level role check
//         if (!canSee(group.roles)) return null

//         // group-এর visible items filter
//         const visibleItems = group.items.filter((item) => canSee(item.roles))
//         if (visibleItems.length === 0) return null

//         return (
//           <SidebarGroup key={group.label}>
//             <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
//             <SidebarMenu>
//               {visibleItems.map((item) => {
//                 // ── Collapsible item (children আছে) ──
//                 if (item.children) {
//                   const isAnyChildActive = item.children.some(
//                     (child) => pathname === child.href
//                   )

//                   return (
//                     <Collapsible
//                       key={item.title}
//                       asChild
//                       defaultOpen={isAnyChildActive}
//                       className="group/collapsible"
//                     >
//                       <SidebarMenuItem>
//                         <CollapsibleTrigger asChild>
//                           <SidebarMenuButton
//                             tooltip={item.title}
//                             isActive={isAnyChildActive}
//                           >
//                             <item.icon />
//                             <span>{item.title}</span>
//                             <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                           </SidebarMenuButton>
//                         </CollapsibleTrigger>
//                         <CollapsibleContent>
//                           <SidebarMenuSub>
//                             {item.children.map((child) => (
//                               <SidebarMenuSubItem key={child.title}>
//                                 <SidebarMenuSubButton
//                                   asChild
//                                   isActive={pathname === child.href}
//                                 >
//                                   <Link href={child.href}>
//                                     <span>{child.title}</span>
//                                   </Link>
//                                 </SidebarMenuSubButton>
//                               </SidebarMenuSubItem>
//                             ))}
//                           </SidebarMenuSub>
//                         </CollapsibleContent>
//                       </SidebarMenuItem>
//                     </Collapsible>
//                   )
//                 }

//                 // ── Simple item (children নেই) ──
//                 return (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton
//                       asChild
//                       tooltip={item.title}
//                       isActive={pathname === item.href}
//                     >
//                       <Link href={item.href!}>
//                         <item.icon />
//                         <span>{item.title}</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 )
//               })}
//             </SidebarMenu>
//           </SidebarGroup>
//         )
//       })}
//     </>
//   )
// }




"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { NAV_GROUPS, type TUserRole } from "./sidebar.config"
import { useNidBadgeCount } from "@/hooks/useNidBadgeCount"

type NavMainProps = {
  role?: TUserRole
}

export function NavMain({ role }: NavMainProps) {
  const pathname = usePathname()
  const nidBadgeCount = useNidBadgeCount()

  const canSee = (roles?: TUserRole[]) => {
    if (!roles) return true
    if (!role) return false
    return roles.includes(role)
  }

  return (
    <>
      {NAV_GROUPS.map((group) => {
        if (!canSee(group.roles)) return null

        const visibleItems = group.items.filter((item) => canSee(item.roles))
        if (visibleItems.length === 0) return null

        return (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

            <SidebarMenu>
              {visibleItems.map((item) => {
                // children menu
                if (item.children) {
                  const isAnyChildActive = item.children.some(
                    (child) => pathname === child.href
                  )

                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isAnyChildActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isAnyChildActive}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === child.href}
                                >
                                  <Link href={child.href}>
                                    <span className="relative inline-flex items-center">
                                      {child.title}

                                      {child.badgeKey ===
                                        "nid_withdraw_request" &&
                                        nidBadgeCount > 0 && (
                                          <span className="absolute -right-6 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                            {nidBadgeCount > 99
                                              ? "99+"
                                              : nidBadgeCount}
                                          </span>
                                        )}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                // simple menu
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href!}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        )
      })}
    </>
  )
}