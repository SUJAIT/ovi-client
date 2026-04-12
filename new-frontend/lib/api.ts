

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const authHeader = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
})

// ── User ──────────────────────────────────────────────────────────
export const getUserProfile = async (token: string) => {
  const res = await fetch(`${BASE_URL}/user/profile`, { headers: authHeader(token) })
  return res.json()
}

export const getAllUsers = async (token: string) => {
  const res = await fetch(`${BASE_URL}/user/all`, { headers: authHeader(token) })
  return res.json()
}

export const updateUserRole = async (token: string, userId: string, role: string) => {
  const res = await fetch(`${BASE_URL}/user/${userId}/role`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify({ role }),
  })
  return res.json()
}

// ── Wallet & Transactions ─────────────────────────────────────────
export const getWalletInfo = async (token: string) => {
  const res = await fetch(`${BASE_URL}/transaction/wallet`, { headers: authHeader(token) })
  return res.json()
}

export const getMyTransactions = async (token: string) => {
  const res = await fetch(`${BASE_URL}/transaction/my`, { headers: authHeader(token) })
  return res.json()
}

export const getAllTransactions = async (token: string) => {
  const res = await fetch(`${BASE_URL}/transaction/all`, { headers: authHeader(token) })
  return res.json()
}

export const rechargeWallet = async (
  token: string,
  userId: string,
  amount: number,
  note?: string
) => {
  const res = await fetch(`${BASE_URL}/transaction/recharge`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ userId, amount, note }),
  })
  return res.json()
}

// ── NID / Server Copy ─────────────────────────────────────────────
export const searchNid = async (token: string, nid: string, dob: string) => {
  const res = await fetch(
    `${BASE_URL}/server-copy/search?nid=${nid}&dob=${dob}`,
    { headers: authHeader(token) }
  )
  return res.json()
}

export const downloadNidPdf = async (token: string, nid: string, dob: string): Promise<Response> => {
  return await fetch(
    `${BASE_URL}/server-copy/pdf?nid=${nid}&dob=${dob}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
}


// ── Admin Settings ───────────────────────────────────────────────
export const getAdminSettings = async (token: string) => {
  const res = await fetch(`${BASE_URL}/settings/admin`, {
    headers: authHeader(token),
  })
  return res.json()
}

export const updateAdminSettings = async (
  token: string,
  payload: {
    marqueeEnabled: boolean
    marqueeSpeed: number
    marqueeItems: { text: string; active: boolean; order: number }[]
  }
) => {
  const res = await fetch(`${BASE_URL}/settings/admin`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify(payload),
  })
  return res.json()
}

export const getPublicSettings = async () => {
  const res = await fetch(`${BASE_URL}/settings/public`)
  return res.json()
}


// Notifications
export const getMyNotifications = async (token: string) => {
  const res = await fetch(`${BASE_URL}/notifications/my`, {
    headers: authHeader(token),
  })
  return res.json()
}

export const getNotificationUnreadCount = async (token: string) => {
  const res = await fetch(`${BASE_URL}/notifications/unread-count`, {
    headers: authHeader(token),
  })
  return res.json()
}

export const markNotificationRead = async (token: string, notificationId: string) => {
  const res = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: authHeader(token),
  })
  return res.json()
}

export const markAllNotificationsRead = async (token: string) => {
  const res = await fetch(`${BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: authHeader(token),
  })
  return res.json()
}

export const deleteNotification = async (token: string, notificationId: string) => {
  const res = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
    method: "DELETE",
    headers: authHeader(token),
  })
  return res.json()
}

export const clearAllNotifications = async (token: string) => {
  const res = await fetch(`${BASE_URL}/notifications`, {
    method: "DELETE",
    headers: authHeader(token),
  })
  return res.json()
}

export const getPendingRechargeCount = async (token: string) => {
  const res = await fetch(`${BASE_URL}/recharge-request/pending-count`, {
    headers: authHeader(token),
  })
  return res.json()
}


export const registerNotificationDevice = async (
  token: string,
  deviceToken: string,
  deviceType: "web" | "android" | "ios" = "web"
) => {
  const res = await fetch(`${BASE_URL}/notifications/devices/register`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({
      token: deviceToken,
      deviceType,
    }),
  })
  return res.json()
}