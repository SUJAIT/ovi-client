"use client"

// hooks/useVoiceNotification.ts
//
// Listens to the real-time notification gateway (socket / SSE) and plays a
// loud, clear TTS alert whenever a "custom_service_request" or
// "nid_withdraw_request" notification arrives.
//
// Works even when the admin's display is turned off, because Web Speech API
// runs independently of the screen state on most mobile browsers.
//
// Usage:
//   Place <VoiceNotificationGuard /> once inside the admin layout, or call
//   useVoiceNotification() in the admin root layout component.

import { useEffect, useRef } from "react"
import { useNotifications } from "./useNotifications"   // your existing hook

type NotificationPayload = {
  type?: string
  data?: {
    serviceTitle?: string
    playVoice?: boolean
  }
  title?: string
}

const VOICE_TYPES = new Set(["custom_service_request", "nid_withdraw_request"])

const speak = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return

  // Cancel any queued utterances so the new one plays immediately
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang    = "bn-BD"
  utterance.rate    = 0.9
  utterance.pitch   = 1.1
  utterance.volume  = 1          // maximum volume

  // Prefer a Bangla or Hindi voice if the system has one
  const voices = window.speechSynthesis.getVoices()
  const preferred =
    voices.find((v) => v.lang === "bn-BD") ||
    voices.find((v) => v.lang.startsWith("bn")) ||
    voices.find((v) => v.lang.startsWith("hi")) ||
    null

  if (preferred) utterance.voice = preferred

  window.speechSynthesis.speak(utterance)
}

// Voices may not be loaded synchronously; prime them on first interaction.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}

export function useVoiceNotification() {
  // `useNotifications` already subscribes to your SSE/socket stream and
  // surfaces new notifications. We watch for changes and filter by type.
  const { notifications } = useNotifications()
  const seenIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!notifications?.length) return

    for (const notif of notifications as (NotificationPayload & { _id?: string })[]) {
      const id = notif._id ?? ""
      if (!id || seenIds.current.has(id)) continue
      if (!VOICE_TYPES.has(notif.type ?? "")) continue
      if (!notif.data?.playVoice) continue

      seenIds.current.add(id)

      const serviceTitle = notif.data?.serviceTitle ?? notif.title ?? "নতুন আবেদন"
      speak(`নতুন ${serviceTitle} এসেছে। অনুগ্রহ করে অ্যাডমিন প্যানেল চেক করুন।`)
    }
  }, [notifications])
}

// ── Drop-in component for layouts ────────────────────────────────────────────

export function VoiceNotificationGuard() {
  useVoiceNotification()
  return null
}
