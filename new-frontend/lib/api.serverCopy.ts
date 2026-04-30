
const BASE_URL_REF = process.env.NEXT_PUBLIC_API_URL

// Public — returns current server copy charge, title and notice.
// No auth needed. Called by the server-copy page on mount.
export const getServerCopyConfig = async (): Promise<{
  success:          boolean
  charge?:          number
  serverCopyCharge?: number
  serverCopyTitle?:  string
  serverCopyNotice?: string
}> => {
  // getPublicSettings already returns these fields — reuse it
  const res = await fetch(`${BASE_URL_REF}/settings/public`)
  return res.json()
}

// Typed payload for updating the server-copy section of admin settings.
// Pass this as part of the existing updateAdminSettings call.
export type TServerCopySettingsPayload = {
  serverCopyCharge:  number
  serverCopyTitle:   string
  serverCopyNotice:  string
}