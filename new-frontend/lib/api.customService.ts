// lib/api.customService.ts
// Mirrors api.nidWithdraw.ts pattern exactly.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const authHeader = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
})

// ── Types ─────────────────────────────────────────────────────────────────────

export type TInputFieldType = "normal" | "dob" | "bigbox"

export interface IInputField {
  _id?:         string
  type:         TInputFieldType
  label:        string
  placeholder?: string
  required:     boolean
  order:        number
}

export interface IServiceCard {
  title:       string
  gradient:    string
  shadowColor: string
  icon:        string
  price:       string
  priceLabel:  string
}

export interface ICustomService {
  _id:       string
  slug:      string
  isActive:  boolean
  header?:   { title: string; subtitle?: string }
  notice?:   { text: string; active: boolean }
  form:      { name: string; fields: IInputField[] }
  card:      IServiceCard
  createdAt?: string
  updatedAt?: string
}

export interface IServiceFileMetadata {
  fileKey:         string
  fileName:        string
  fileType:        string
  storageProvider: "local"
  uploadedAt:      string
}

export type TServiceRequestStatus =
  | "pending"
  | "admin_seen"
  | "accepted"
  | "cancelled"
  | "completed"

export interface IServiceRequest {
  _id:         string
  serviceId:   string
  serviceSlug: string
  userId:
    | { _id: string; name: string; email: string; wallet?: { balance: number } }
    | string
  fields:     { label: string; value: string; type: TInputFieldType }[]
  status:     TServiceRequestStatus
  file?:      IServiceFileMetadata
  cancelNote?: string
  adminDeleted?: boolean
  createdAt?:  string
  updatedAt?:  string
}

// ── Service Definition APIs ───────────────────────────────────────────────────

export const getAllServices = async () => {
  const res = await fetch(`${BASE_URL}/custom-services/all`)
  return res.json()
}

export const getAllServicesAdmin = async (token: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/admin/all`, { headers: authHeader(token) })
  return res.json()
}

export const getServiceBySlug = async (slug: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/${slug}`)
  return res.json()
}

export const createCustomService = async (
  token: string,
  payload: Omit<ICustomService, "_id" | "createdAt" | "updatedAt">
) => {
  const res = await fetch(`${BASE_URL}/custom-services/admin/create`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify(payload),
  })
  return res.json()
}

export const updateCustomService = async (
  token: string,
  id: string,
  payload: Partial<ICustomService>
) => {
  const res = await fetch(`${BASE_URL}/custom-services/admin/${id}`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify(payload),
  })
  return res.json()
}

export const deleteCustomService = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/admin/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  })
  return res.json()
}

// ── Request APIs ──────────────────────────────────────────────────────────────

export const submitServiceRequest = async (
  token: string,
  slug: string,
  fields: { label: string; value: string; type: TInputFieldType }[]
) => {
  const res = await fetch(`${BASE_URL}/custom-services/${slug}/requests/submit`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify({ fields }),
  })
  return res.json()
}

export const getMyServiceRequests = async (token: string, slug: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/${slug}/requests/my`, {
    headers: authHeader(token),
  })
  return res.json()
}

export const getAllServiceRequests = async (
  token: string,
  slug: string,
  status?: string
) => {
  const q   = status ? `?status=${encodeURIComponent(status)}` : ""
  const res = await fetch(`${BASE_URL}/custom-services/${slug}/requests/all${q}`, {
    headers: authHeader(token),
  })
  return res.json()
}

export const markServiceRequestSeen = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/requests/${id}/seen`, {
    method: "PATCH", headers: authHeader(token),
  })
  return res.json()
}

export const acceptServiceRequest = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/requests/${id}/accept`, {
    method: "PATCH", headers: authHeader(token),
  })
  return res.json()
}

export const completeServiceRequest = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/requests/${id}/complete`, {
    method: "PATCH", headers: authHeader(token),
  })
  return res.json()
}

export const cancelServiceRequest = async (
  token: string,
  id: string,
  cancelNote: string
) => {
  const res = await fetch(`${BASE_URL}/custom-services/requests/${id}/cancel`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify({ cancelNote }),
  })
  return res.json()
}

export const adminDeleteServiceRequest = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/requests/${id}/admin-delete`, {
    method: "PATCH", headers: authHeader(token),
  })
  return res.json()
}

export const getServiceRequestsPendingCount = async (token: string) => {
  const res = await fetch(`${BASE_URL}/custom-services/requests/pending-count`, {
    headers: authHeader(token),
  })
  return res.json()
}

// ── File Upload (mirrors nidWithdrawUploadFile exactly) ───────────────────────

export const serviceRequestUploadFile = async (
  token: string,
  slug: string,
  id: string,
  file: File
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(
    `${BASE_URL}/custom-services/${slug}/requests/${id}/upload-file`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  )
  return res.json()
}

// ── File Download (mirrors nidWithdrawDownloadFile exactly) ───────────────────

export const serviceRequestDownloadFile = async (
  token: string,
  slug: string,
  id: string
): Promise<void> => {
  const res = await fetch(
    `${BASE_URL}/custom-services/${slug}/requests/${id}/download`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData?.message || "ডাউনলোড ব্যর্থ হয়েছে")
  }

  const disposition   = res.headers.get("Content-Disposition") ?? ""
  const fileNameMatch = disposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]*)\\1/i)
  const fileName      = fileNameMatch?.[2]
    ? decodeURIComponent(fileNameMatch[2])
    : "document.pdf"

  const blob    = await res.blob()
  const blobUrl = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href        = blobUrl
  link.target      = "_blank"
  link.rel         = "noopener noreferrer"
  link.download    = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000)
}
