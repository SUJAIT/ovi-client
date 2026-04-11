// "use client"

// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/sidebar/app-sidebar"
// import { TooltipProvider } from "@/components/ui/tooltip"
// import { AuthGuard } from "@/components/guards/Guards"

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <AuthGuard>
//       <TooltipProvider>
//         <SidebarProvider>
//           <AppSidebar />
//           <main className="flex-1 min-w-0">
//             <div className="border-b p-3 sticky top-0 bg-background z-10">
//               <SidebarTrigger />
//             </div>
//             <div className="p-4 md:p-6">
//               {children}
//             </div>
//           </main>
//         </SidebarProvider>
//       </TooltipProvider>
//     </AuthGuard>
//   )
// }



"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthGuard } from "@/components/guards/Guards"
import { NotificationProvider } from "@/hooks/useNotifications"
import { NotificationBell } from "@/components/notifications/notification-bell"
 
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <TooltipProvider>
        <NotificationProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 min-w-0">
              <div className="border-b p-3 sticky top-0 bg-background z-10 flex items-center justify-between gap-3">
                <SidebarTrigger />
                <NotificationBell />
              </div>
              <div className="p-4 md:p-6">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </NotificationProvider>
      </TooltipProvider>
    </AuthGuard>
  )
}
