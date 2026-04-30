// hooks/useCustomServiceBadge.ts
// Mirrors useNidBadgeCount.ts exactly — counts unread custom_service_request notifications.

import { useNotifications } from "./useNotifications"

export function useCustomServiceBadge() {
  const { notifications } = useNotifications()
  return notifications.filter(
    (n) => n.type === "custom_service_request" && !n.isRead
  ).length
}
