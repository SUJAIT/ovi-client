// "use client"

// import { Bell, CheckCheck, Dot, Trash2, X } from "lucide-react"
 
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useNotifications } from "@/hooks/useNotifications"

// const formatTime = (value: string) => {
//   try {
//     return new Date(value).toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   } catch {
//     return value
//   }
// }

// const priorityTone: Record<string, string> = {
//   low: "border-border",
//   medium: "border-sky-200 dark:border-sky-500/30",
//   high: "border-amber-200 dark:border-amber-500/30",
//   critical: "border-rose-200 dark:border-rose-500/30",
// }

// export function NotificationBell() {
//   const {
//     notifications,
//     unreadCount,
//     connected,
//     loading,
//     markOneAsRead,
//     markEverythingAsRead,
//     removeNotification,
//     clearNotifications,
//   } = useNotifications()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon-sm"
//           className="relative rounded-full"
//           aria-label="Notifications"
//         >
//           <Bell />
//           {unreadCount > 0 && (
//             <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
//               {unreadCount > 9 ? "9+" : unreadCount}
//             </span>
//           )}
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="w-96 min-w-96">
//         <div className="flex items-center justify-between px-2 py-1.5">
//           <DropdownMenuLabel className="p-0 text-sm text-foreground">
//             Notifications
//           </DropdownMenuLabel>
//           <div className="flex items-center gap-2">
//             <span
//               className={`text-[11px] ${
//                 connected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
//               }`}
//             >
//               {connected ? "Live" : "Offline"}
//             </span>
//             <Button
//               variant="ghost"
//               size="xs"
//               onClick={(event) => {
//                 event.preventDefault()
//                 void markEverythingAsRead()
//               }}
//             >
//               <CheckCheck />
//               Read all
//             </Button>
//             <Button
//               variant="ghost"
//               size="xs"
//               onClick={(event) => {
//                 event.preventDefault()
//                 void clearNotifications()
//               }}
//             >
//               <Trash2 />
//               Clear
//             </Button>
//           </div>
//         </div>

//         <DropdownMenuSeparator />

//         {loading ? (
//           <div className="px-3 py-6 text-center text-sm text-muted-foreground">
//             Loading notifications...
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="px-3 py-6 text-center text-sm text-muted-foreground">
//             No notifications yet.
//           </div>
//         ) : (
//           notifications.slice(0, 10).map((item) => (
//             <DropdownMenuItem
//               key={item._id}
//               className={`flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-3 ${
//                 priorityTone[item.priority] ?? "border-border"
//               } ${item.isRead ? "opacity-80" : ""}`}
//               onClick={() => void markOneAsRead(item._id)}
//             >
//               <div className="flex w-full items-start justify-between gap-2">
//                 <div className="flex items-center gap-2">
//                   {!item.isRead && <Dot className="text-rose-500" />}
//                   <span className="font-semibold text-foreground">{item.title}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant="outline" className="capitalize">
//                     {item.priority}
//                   </Badge>
//                   <button
//                     type="button"
//                     className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
//                     onClick={(event) => {
//                       event.preventDefault()
//                       event.stopPropagation()
//                       void removeNotification(item._id)
//                     }}
//                     aria-label="Delete notification"
//                   >
//                     <X className="size-3.5" />
//                   </button>
//                 </div>
//               </div>
//               <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
//                 {item.message}
//               </p>
//               <span className="text-[11px] text-muted-foreground">
//                 {formatTime(item.createdAt)}
//               </span>
//             </DropdownMenuItem>
//           ))
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }


"use client"

import { Bell, CheckCheck, Dot, Trash2, X } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/useNotifications"

const formatTime = (value: string) => {
  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return value
  }
}

const priorityTone: Record<string, string> = {
  low: "border-border",
  medium: "border-sky-200 dark:border-sky-500/30",
  high: "border-amber-200 dark:border-amber-500/30",
  critical: "border-rose-200 dark:border-rose-500/30",
}

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    connected,
    loading,
    markOneAsRead,
    markEverythingAsRead,
    removeNotification,
    clearNotifications,
  } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="relative rounded-full"
          aria-label="Notifications"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(24rem,calc(100vw-1rem))] p-0"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm text-foreground">
            Notifications
          </DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] ${
                connected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
              }`}
            >
              {connected ? "Live" : "Offline"}
            </span>
            <Button
              variant="ghost"
              size="xs"
              disabled={loading || unreadCount === 0}
              onClick={(event) => {
                event.preventDefault()
                void markEverythingAsRead()
              }}
            >
              <CheckCheck />
              Read all
            </Button>
            <Button
              variant="ghost"
              size="xs"
              disabled={loading || notifications.length === 0}
              onClick={(event) => {
                event.preventDefault()
                void clearNotifications()
              }}
            >
              <Trash2 />
              Clear
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.slice(0, 10).map((item) => (
              <DropdownMenuItem
                key={item._id}
                className={`mb-2 flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-3 last:mb-0 ${
                  priorityTone[item.priority] ?? "border-border"
                } ${item.isRead ? "opacity-80" : ""}`}
                onSelect={(event) => {
                  event.preventDefault()
                  void markOneAsRead(item._id)
                }}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!item.isRead && <Dot className="text-rose-500" />}
                    <span className="font-semibold text-foreground">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {item.priority}
                    </Badge>
                    <button
                      type="button"
                      className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        void removeNotification(item._id)
                      }}
                      aria-label="Delete notification"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.message}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  {formatTime(item.createdAt)}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}