

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
