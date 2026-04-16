// hooks/useNidBadgeCount.ts

import { useNotifications } from "./useNotifications"

export function useNidBadgeCount() {
  const { notifications } = useNotifications()
  return notifications.filter(
    (n) => n.type === "nid_withdraw_request" && !n.isRead
  ).length
}