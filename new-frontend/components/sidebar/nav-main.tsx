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
// import { useNidBadgeCount } from "@/hooks/useNidBadgeCount"

// type NavMainProps = {
//   role?: TUserRole
// }

// export function NavMain({ role }: NavMainProps) {
//   const pathname = usePathname()
//   const nidBadgeCount = useNidBadgeCount()

//   const canSee = (roles?: TUserRole[]) => {
//     if (!roles) return true
//     if (!role) return false
//     return roles.includes(role)
//   }

//   return (
//     <>
//       {NAV_GROUPS.map((group) => {
//         if (!canSee(group.roles)) return null

//         const visibleItems = group.items.filter((item) => canSee(item.roles))
//         if (visibleItems.length === 0) return null

//         return (
//           <SidebarGroup key={group.label}>
//             <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

//             <SidebarMenu>
//               {visibleItems.map((item) => {
//                 // children menu
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
//                                     <span className="relative inline-flex items-center">
//                                       {child.title}

//                                       {child.badgeKey ===
//                                         "nid_withdraw_request" &&
//                                         nidBadgeCount > 0 && (
//                                           <span className="absolute -right-6 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
//                                             {nidBadgeCount > 99
//                                               ? "99+"
//                                               : nidBadgeCount}
//                                           </span>
//                                         )}
//                                     </span>
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

//                 // simple menu
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

import { useEffect, useState } from "react"
import Link      from "next/link"
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

import { NAV_GROUPS, type TUserRole, type NavChild } from "./sidebar.config"
import { useNidBadgeCount }       from "@/hooks/useNidBadgeCount"
 
import { useNotifications }       from "@/hooks/useNotifications"
import { getAllServices, ICustomService } from "@/lib/api.customService"
import { useCustomServiceBadge } from "@/hooks/useCustomServiceBadge"

type NavMainProps = { role?: TUserRole }

export function NavMain({ role }: NavMainProps) {
  const pathname         = usePathname()
  const nidBadgeCount    = useNidBadgeCount()
  const customBadgeCount = useCustomServiceBadge()
  const { notifications } = useNotifications()

  const [dynamicServices, setDynamicServices] = useState<ICustomService[]>([])

  // Load dynamic services from API (cached in state per mount)
  useEffect(() => {
    getAllServices()
      .then((res) => { if (res.success) setDynamicServices(res.data) })
      .catch(() => {})
  }, [])

  // Re-fetch when a new custom_service_request notification arrives
  useEffect(() => {
    const hasNew = notifications.some((n) => n.type === "custom_service_request")
    if (hasNew) {
      getAllServices()
        .then((res) => { if (res.success) setDynamicServices(res.data) })
        .catch(() => {})
    }
  }, [notifications])

  const canSee = (roles?: TUserRole[]) => {
    if (!roles) return true
    if (!role)  return false
    return roles.includes(role)
  }

  // Build injected children for "সকল-সেবা" (user) or "All Requests" (admin)
  const userServiceChildren: NavChild[] = dynamicServices.map((svc) => ({
    title: svc.card.title,
    href:  `/workplace/services/${svc.slug}`,
    dynamic: true,
  }))

  const adminRequestChildren: NavChild[] = dynamicServices.map((svc) => ({
    title:    `${svc.card.title} Requests`,
    href:     `/admin/services/${svc.slug}`,
    badgeKey: `custom_service_${svc.slug}`,
    dynamic:  true,
  }))

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
                if (item.children) {
                  // Inject dynamic children into the right menu slot
                  let injected: NavChild[] = []

                  const isUserServices = item.title === "সকল-সেবা" &&
                    (role === "user")
                  const isAdminRequests = item.title === "All Requests" &&
                    (role === "admin" || role === "super_admin")

                  if (isUserServices)   injected = userServiceChildren
                  if (isAdminRequests)  injected = adminRequestChildren

                  const allChildren = [...item.children, ...injected]
                  const isAnyActive = allChildren.some((c) => pathname === c.href)

                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isAnyActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} isActive={isAnyActive}>
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {allChildren.map((child) => {
                              // Resolve badge count for this child
                              let badgeCount = 0
                              if (child.badgeKey === "nid_withdraw_request") {
                                badgeCount = nidBadgeCount
                              } else if (child.badgeKey?.startsWith("custom_service_")) {
                                // For custom service badges use the aggregate count
                                // (individual per-service badge would need separate hooks)
                                badgeCount = customBadgeCount > 0 && pathname !== child.href ? 1 : 0
                              }

                              return (
                                <SidebarMenuSubItem key={child.href}>
                                  <SidebarMenuSubButton asChild isActive={pathname === child.href}>
                                    <Link href={child.href}>
                                      <span className="relative inline-flex items-center">
                                        {child.title}
                                        {badgeCount > 0 && (
                                          <span className="absolute -right-6 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                            {badgeCount > 99 ? "99+" : badgeCount}
                                          </span>
                                        )}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                // Simple item
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.href}>
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
