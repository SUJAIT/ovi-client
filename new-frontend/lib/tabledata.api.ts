const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const authHeader = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
})

export type TPricingTableRow = {
  _id?: string
  service: string
  description: string
  userProvides: string
  deliverable: string
  price: number
  unit: string
  available: boolean
  order: number
}

export type TPricingTableSettings = {
  pricingTableEnabled: boolean
  pricingTableTitle: string
  pricingTableRows: TPricingTableRow[]
}

type TApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

export const getPricingTableSettings = async (
  token: string
): Promise<TApiResponse<TPricingTableSettings>> => {
  const res = await fetch(`${BASE_URL}/settings/admin`, {
    headers: authHeader(token),
  })

  return res.json()
}

export const updatePricingTableSettings = async (
  token: string,
  payload: TPricingTableSettings
): Promise<TApiResponse<TPricingTableSettings>> => {
  const res = await fetch(`${BASE_URL}/settings/admin`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify(payload),
  })

  return res.json()
}