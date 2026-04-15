const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const authHeader = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
})

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

export const searchNid = async (token: string, nid: string, dob: string) => {
  const res = await fetch(`${BASE_URL}/server-copy/search?nid=${nid}&dob=${dob}`, {
    headers: authHeader(token),
  })
  return res.json()
}

export const downloadNidPdf = async (
  token: string,
  nid: string,
  dob: string
): Promise<Response> => {
  return await fetch(`${BASE_URL}/server-copy/pdf?nid=${nid}&dob=${dob}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

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

export const createNidWithdrawRequest = async (
  token: string,
  payload: { nidOrBirthCert: string; name: string; dob: string }
) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/create`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify(payload),
  })
  return res.json()
}

export const getMyNidWithdrawRequests = async (token: string) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/my`, {
    headers: authHeader(token),
  })
  return res.json()
}

export const getAllNidWithdrawRequests = async (token: string, status?: string) => {
  const q = status && status !== "all" ? `?status=${status}` : ""
  const res = await fetch(`${BASE_URL}/nid-withdraw/all${q}`, {
    headers: authHeader(token),
  })
  return res.json()
}

export const nidWithdrawMarkSeen = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/${id}/seen`, {
    method: "PATCH",
    headers: authHeader(token),
  })
  return res.json()
}

export const nidWithdrawAccept = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/${id}/accept`, {
    method: "PATCH",
    headers: authHeader(token),
  })
  return res.json()
}

export const nidWithdrawCancel = async (token: string, id: string, cancelNote: string) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/${id}/cancel`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify({ cancelNote }),
  })
  return res.json()
}

export const nidWithdrawSendPdf = async (token: string, id: string, pdfUrl: string) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/${id}/send-pdf`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify({ pdfUrl }),
  })
  return res.json()
}

// export const deleteNidWithdrawRequest = async (token: string, id: string) => {
//   const res = await fetch(`${BASE_URL}/nid-withdraw/${id}`, {
//     method: "DELETE",
//     headers: authHeader(token),
//   })
//   return res.json()
// }


// Admin soft-delete: hides from admin list only (completed statuses only)
export const nidWithdrawAdminDelete = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/${id}/admin-delete`, {
    method: "PATCH",
    headers: authHeader(token),
  })
  return res.json()
}
 
// Admin bulk soft-delete all completed
export const nidWithdrawAdminBulkDeleteCompleted = async (token: string) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/bulk/admin-delete-completed`, {
    method: "PATCH",
    headers: authHeader(token),
  })
  return res.json()
}
 
// User hard-delete own record from history
export const deleteNidWithdrawRequest = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/nid-withdraw/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  })
  return res.json()
}