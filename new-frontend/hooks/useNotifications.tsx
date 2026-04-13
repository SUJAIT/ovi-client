// "use client"

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react"
// import { auth } from "@/lib/firebase"
// import {
//   getMyNotifications,
//   getNotificationUnreadCount,
//   markAllNotificationsRead,
//   markNotificationRead,
// } from "@/lib/api"

// export type AppNotification = {
//   _id: string
//   type: string
//   title: string
//   message: string
//   priority: "low" | "medium" | "high" | "critical"
//   isRead: boolean
//   createdAt: string
//   data?: Record<string, unknown>
// }

// type NotificationContextValue = {
//   notifications: AppNotification[]
//   unreadCount: number
//   connected: boolean
//   loading: boolean
//   markOneAsRead: (id: string) => Promise<void>
//   markEverythingAsRead: () => Promise<void>
//   refreshNotifications: () => Promise<void>
// }

// const NotificationContext = createContext<NotificationContextValue | null>(null)

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// const parseSseChunk = (
//   chunk: string,
//   onNotification: (payload: AppNotification) => void,
//   onConnected: () => void
// ) => {
//   const events = chunk.split("\n\n")

//   for (const eventBlock of events) {
//     if (!eventBlock.trim()) continue

//     const lines = eventBlock.split("\n")
//     const eventName = lines
//       .find((line) => line.startsWith("event:"))
//       ?.replace("event:", "")
//       .trim()

//     const dataLine = lines
//       .filter((line) => line.startsWith("data:"))
//       .map((line) => line.replace("data:", "").trim())
//       .join("\n")

//     if (!dataLine) continue

//     try {
//       const payload = JSON.parse(dataLine)

//       if (eventName === "connected") {
//         onConnected()
//       }

//       if (eventName === "notification") {
//         onNotification(payload)
//       }
//     } catch (error) {
//       console.error("Failed to parse notification stream payload", error)
//     }
//   }
// }

// export function NotificationProvider({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [notifications, setNotifications] = useState<AppNotification[]>([])
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [connected, setConnected] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const abortRef = useRef<AbortController | null>(null)
//   const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

//   const refreshNotifications = useCallback(async () => {
//     const currentUser = auth.currentUser
//     if (!currentUser) {
//       setNotifications([])
//       setUnreadCount(0)
//       setLoading(false)
//       return
//     }

//     const token = await currentUser.getIdToken()
//     const [listRes, unreadRes] = await Promise.all([
//       getMyNotifications(token),
//       getNotificationUnreadCount(token),
//     ])

//     setNotifications(listRes?.data ?? [])
//     setUnreadCount(unreadRes?.unreadCount ?? 0)
//     setLoading(false)
//   }, [])

//   const connectToStream = useCallback(async () => {
//     const currentUser = auth.currentUser
//     if (!currentUser || !BASE_URL) return

//     const token = await currentUser.getIdToken()
//     const controller = new AbortController()
//     abortRef.current = controller

//     try {
//       const response = await fetch(`${BASE_URL}/notifications/stream`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         signal: controller.signal,
//         cache: "no-store",
//       })

//       if (!response.ok || !response.body) {
//         setConnected(false)
//         return
//       }

//       const reader = response.body.getReader()
//       const decoder = new TextDecoder()
//       let buffer = ""

//       while (true) {
//         const { done, value } = await reader.read()
//         if (done) break

//         buffer += decoder.decode(value, { stream: true })

//         const parts = buffer.split("\n\n")
//         buffer = parts.pop() ?? ""

//         for (const part of parts) {
//           parseSseChunk(
//             `${part}\n\n`,
//             (payload) => {
//               setConnected(true)
//               setNotifications((prev) => [payload, ...prev].slice(0, 50))
//               setUnreadCount((prev) => prev + (payload.isRead ? 0 : 1))
//             },
//             () => setConnected(true)
//           )
//         }
//       }
//     } catch (error) {
//       if ((error as Error).name !== "AbortError") {
//         console.error("Notification stream connection failed", error)
//       }
//     } finally {
//       setConnected(false)
//       if (!controller.signal.aborted) {
//         reconnectTimerRef.current = setTimeout(() => {
//           void connectToStream()
//         }, 3000)
//       }
//     }
//   }, [])

//   useEffect(() => {
//     let mounted = true

//     const start = async () => {
//       if (!mounted) return
//       await refreshNotifications()
//       if (!mounted) return
//       await connectToStream()
//     }

//     start()

//     return () => {
//       mounted = false
//       abortRef.current?.abort()
//       if (reconnectTimerRef.current) {
//         clearTimeout(reconnectTimerRef.current)
//       }
//     }
//   }, [connectToStream, refreshNotifications])

//   const markOneAsRead = useCallback(async (id: string) => {
//     const currentUser = auth.currentUser
//     if (!currentUser) return

//     const token = await currentUser.getIdToken()
//     const response = await markNotificationRead(token, id)

//     if (!response?.success) return

//     setNotifications((prev) => {
//       const target = prev.find((item) => item._id === id)
//       if (!target || target.isRead) return prev
//       setUnreadCount((count) => Math.max(0, count - 1))
//       return prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
//     })
//   }, [])

//   const markEverythingAsRead = useCallback(async () => {
//     const currentUser = auth.currentUser
//     if (!currentUser) return

//     const token = await currentUser.getIdToken()
//     const response = await markAllNotificationsRead(token)

//     if (!response?.success) return

//     setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
//     setUnreadCount(0)
//   }, [])

//   const value = useMemo(
//     () => ({
//       notifications,
//       unreadCount,
//       connected,
//       loading,
//       markOneAsRead,
//       markEverythingAsRead,
//       refreshNotifications,
//     }),
//     [
//       notifications,
//       unreadCount,
//       connected,
//       loading,
//       markOneAsRead,
//       markEverythingAsRead,
//       refreshNotifications,
//     ]
//   )

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   )
// }

// export const useNotifications = () => {
//   const context = useContext(NotificationContext)

//   if (!context) {
//     throw new Error("useNotifications must be used inside NotificationProvider")
//   }

//   return context
// }



// "use client"

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react"
// import { useUser } from "@/hooks/useUser"
// import { auth } from "@/lib/firebase"
// import {
//   clearAllNotifications,
//   deleteNotification,
//   getMyNotifications,
//   getNotificationUnreadCount,
//   getPendingRechargeCount,
//   markAllNotificationsRead,
//   markNotificationRead,
// } from "@/lib/api"

// export type AppNotification = {
//   _id: string
//   type: string
//   title: string
//   message: string
//   priority: "low" | "medium" | "high" | "critical"
//   isRead: boolean
//   createdAt: string
//   data?: Record<string, unknown>
// }

// type NotificationContextValue = {
//   notifications: AppNotification[]
//   unreadCount: number
//   connected: boolean
//   loading: boolean
//   markOneAsRead: (id: string) => Promise<void>
//   markEverythingAsRead: () => Promise<void>
//   removeNotification: (id: string) => Promise<void>
//   clearNotifications: () => Promise<void>
//   refreshNotifications: () => Promise<void>
// }

// const NotificationContext = createContext<NotificationContextValue | null>(null)
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// const parseSseChunk = (
//   chunk: string,
//   onNotification: (payload: AppNotification) => void,
//   onConnected: () => void
// ) => {
//   const events = chunk.split("\n\n")

//   for (const eventBlock of events) {
//     if (!eventBlock.trim()) continue

//     const lines = eventBlock.split("\n")
//     const eventName = lines
//       .find((line) => line.startsWith("event:"))
//       ?.replace("event:", "")
//       .trim()

//     const dataLine = lines
//       .filter((line) => line.startsWith("data:"))
//       .map((line) => line.replace("data:", "").trim())
//       .join("\n")

//     if (!dataLine) continue

//     try {
//       const payload = JSON.parse(dataLine)

//       if (eventName === "connected") onConnected()
//       if (eventName === "notification") onNotification(payload)
//     } catch (error) {
//       console.error("Failed to parse notification stream payload", error)
//     }
//   }
// }

// export function NotificationProvider({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { user } = useUser()
//   const [notifications, setNotifications] = useState<AppNotification[]>([])
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [connected, setConnected] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const abortRef = useRef<AbortController | null>(null)
//   const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
//   const pendingPollRef = useRef<ReturnType<typeof setInterval> | null>(null)
//   const voiceLoopRef = useRef<ReturnType<typeof setInterval> | null>(null)
//   const currentVoiceMessageRef = useRef("")

//   const playNotificationSound = useCallback(() => {
//     if (typeof window === "undefined") return

//     try {
//       const AudioContextClass =
//         window.AudioContext ||
//         (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
//           .webkitAudioContext

//       if (!AudioContextClass) return

//       const ctx = new AudioContextClass()
//       const osc = ctx.createOscillator()
//       const gain = ctx.createGain()

//       osc.connect(gain)
//       gain.connect(ctx.destination)
//       osc.type = "triangle"
//       osc.frequency.setValueAtTime(880, ctx.currentTime)
//       osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.16)
//       gain.gain.setValueAtTime(0.0001, ctx.currentTime)
//       gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.02)
//       gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22)
//       osc.start()
//       osc.stop(ctx.currentTime + 0.24)
//     } catch (error) {
//       console.error("Notification sound failed", error)
//     }
//   }, [])

//   const stopVoiceAlert = useCallback(() => {
//     if (voiceLoopRef.current) {
//       clearInterval(voiceLoopRef.current)
//       voiceLoopRef.current = null
//     }

//     if (typeof window !== "undefined" && "speechSynthesis" in window) {
//       window.speechSynthesis.cancel()
//     }

//     currentVoiceMessageRef.current = ""
//   }, [])

//   const speakRechargeAlert = useCallback((message: string) => {
//     if (typeof window === "undefined" || !("speechSynthesis" in window) || !message) return

//     window.speechSynthesis.cancel()
//     const utterance = new SpeechSynthesisUtterance(message)
//     utterance.rate = 0.94
//     utterance.pitch = 1
//     utterance.volume = 1
//     window.speechSynthesis.speak(utterance)
//   }, [])

//   const startVoiceAlert = useCallback(
//     (message: string) => {
//       if (!message) return

//       currentVoiceMessageRef.current = message
//       speakRechargeAlert(message)

//       if (voiceLoopRef.current) clearInterval(voiceLoopRef.current)

//       voiceLoopRef.current = setInterval(() => {
//         speakRechargeAlert(currentVoiceMessageRef.current)
//       }, 12000)
//     },
//     [speakRechargeAlert]
//   )

//   const refreshNotifications = useCallback(async () => {
//     const currentUser = auth.currentUser
//     if (!currentUser) {
//       setNotifications([])
//       setUnreadCount(0)
//       setLoading(false)
//       return
//     }

//     const token = await currentUser.getIdToken()
//     const [listRes, unreadRes] = await Promise.all([
//       getMyNotifications(token),
//       getNotificationUnreadCount(token),
//     ])

//     setNotifications(listRes?.data ?? [])
//     setUnreadCount(unreadRes?.unreadCount ?? 0)
//     setLoading(false)
//   }, [])

//   const connectToStream = useCallback(async () => {
//     const currentUser = auth.currentUser
//     if (!currentUser || !BASE_URL) return

//     const token = await currentUser.getIdToken()
//     const controller = new AbortController()
//     abortRef.current = controller

//     try {
//       const response = await fetch(`${BASE_URL}/notifications/stream`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         signal: controller.signal,
//         cache: "no-store",
//       })

//       if (!response.ok || !response.body) {
//         setConnected(false)
//         return
//       }

//       const reader = response.body.getReader()
//       const decoder = new TextDecoder()
//       let buffer = ""

//       while (true) {
//         const { done, value } = await reader.read()
//         if (done) break

//         buffer += decoder.decode(value, { stream: true })
//         const parts = buffer.split("\n\n")
//         buffer = parts.pop() ?? ""

//         for (const part of parts) {
//           parseSseChunk(
//             `${part}\n\n`,
//             (payload) => {
//               setConnected(true)
//               setNotifications((prev) => [payload, ...prev].slice(0, 50))
//               setUnreadCount((prev) => prev + (payload.isRead ? 0 : 1))
//               playNotificationSound()

//               if (payload.type === "recharge.request.created") {
//                 startVoiceAlert(`${payload.title}. ${payload.message}`)
//               }
//             },
//             () => setConnected(true)
//           )
//         }
//       }
//     } catch (error) {
//       if ((error as Error).name !== "AbortError") {
//         console.error("Notification stream connection failed", error)
//       }
//     } finally {
//       setConnected(false)
//       if (!controller.signal.aborted) {
//         reconnectTimerRef.current = setTimeout(() => {
//           void connectToStream()
//         }, 3000)
//       }
//     }
//   }, [playNotificationSound, startVoiceAlert])

//   useEffect(() => {
//     let mounted = true

//     const start = async () => {
//       if (!mounted) return
//       await refreshNotifications()
//       if (!mounted) return
//       await connectToStream()
//     }

//     void start()

//     return () => {
//       mounted = false
//       abortRef.current?.abort()
//       if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
//       if (pendingPollRef.current) clearInterval(pendingPollRef.current)
//       stopVoiceAlert()
//     }
//   }, [connectToStream, refreshNotifications, stopVoiceAlert])

//   useEffect(() => {
//     if (user?.role !== "admin" && user?.role !== "super_admin") {
//       if (pendingPollRef.current) {
//         clearInterval(pendingPollRef.current)
//         pendingPollRef.current = null
//       }
//       stopVoiceAlert()
//       return
//     }

//     const checkPendingRechargeRequests = async () => {
//       const currentUser = auth.currentUser
//       if (!currentUser) return

//       const token = await currentUser.getIdToken()
//       const response = await getPendingRechargeCount(token)
//       const pendingCount = response?.pendingCount ?? 0

//       if (pendingCount <= 0) {
//         stopVoiceAlert()
//         return
//       }

//       const latestRechargeRequest = notifications.find(
//         (item) => item.type === "recharge.request.created"
//       )

//       if (latestRechargeRequest) {
//         startVoiceAlert(
//           `${latestRechargeRequest.title}. ${latestRechargeRequest.message}`
//         )
//       }
//     }

//     void checkPendingRechargeRequests()
//     pendingPollRef.current = setInterval(() => {
//       void checkPendingRechargeRequests()
//     }, 15000)

//     return () => {
//       if (pendingPollRef.current) {
//         clearInterval(pendingPollRef.current)
//         pendingPollRef.current = null
//       }
//     }
//   }, [notifications, startVoiceAlert, stopVoiceAlert, user?.role])

//   const markOneAsRead = useCallback(async (id: string) => {
//     const currentUser = auth.currentUser
//     if (!currentUser) return

//     const token = await currentUser.getIdToken()
//     const response = await markNotificationRead(token, id)
//     if (!response?.success) return

//     setNotifications((prev) => {
//       const target = prev.find((item) => item._id === id)
//       if (!target || target.isRead) return prev
//       setUnreadCount((count) => Math.max(0, count - 1))
//       return prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
//     })
//   }, [])

//   const markEverythingAsRead = useCallback(async () => {
//     const currentUser = auth.currentUser
//     if (!currentUser) return

//     const token = await currentUser.getIdToken()
//     const response = await markAllNotificationsRead(token)
//     if (!response?.success) return

//     setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
//     setUnreadCount(0)
//   }, [])

//   const removeNotification = useCallback(async (id: string) => {
//     const currentUser = auth.currentUser
//     if (!currentUser) return

//     const token = await currentUser.getIdToken()
//     const response = await deleteNotification(token, id)
//     if (!response?.success) return

//     setNotifications((prev) => {
//       const target = prev.find((item) => item._id === id)
//       if (target && !target.isRead) {
//         setUnreadCount((count) => Math.max(0, count - 1))
//       }
//       return prev.filter((item) => item._id !== id)
//     })
//   }, [])

//   const clearNotifications = useCallback(async () => {
//     const currentUser = auth.currentUser
//     if (!currentUser) return

//     const token = await currentUser.getIdToken()
//     const response = await clearAllNotifications(token)
//     if (!response?.success) return

//     setNotifications([])
//     setUnreadCount(0)
//     stopVoiceAlert()
//   }, [stopVoiceAlert])

//   const value = useMemo(
//     () => ({
//       notifications,
//       unreadCount,
//       connected,
//       loading,
//       markOneAsRead,
//       markEverythingAsRead,
//       removeNotification,
//       clearNotifications,
//       refreshNotifications,
//     }),
//     [
//       notifications,
//       unreadCount,
//       connected,
//       loading,
//       markOneAsRead,
//       markEverythingAsRead,
//       removeNotification,
//       clearNotifications,
//       refreshNotifications,
//     ]
//   )

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   )
// }

// export const useNotifications = () => {
//   const context = useContext(NotificationContext)

//   if (!context) {
//     throw new Error("useNotifications must be used inside NotificationProvider")
//   }

//   return context
// }


// version 3   


"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { io } from "socket.io-client"

const socketRef = useRef<ReturnType<typeof io> | null>(null)


import { getToken, isSupported } from "firebase/messaging"
import { useUser } from "@/hooks/useUser"
import { auth, messaging } from "@/lib/firebase"
import {
  clearAllNotifications,
  deleteNotification,
  getMyNotifications,
  getNotificationUnreadCount,
  getPendingRechargeCount,
  markAllNotificationsRead,
  markNotificationRead,
  registerNotificationDevice,
} from "@/lib/api"

export type AppNotification = {
  _id: string
  type: string
  title: string
  message: string
  priority: "low" | "medium" | "high" | "critical"
  isRead: boolean
  createdAt: string
  data?: Record<string, unknown>
}

type NotificationContextValue = {
  notifications: AppNotification[]
  unreadCount: number
  connected: boolean
  loading: boolean
  markOneAsRead: (id: string) => Promise<void>
  markEverythingAsRead: () => Promise<void>
  removeNotification: (id: string) => Promise<void>
  clearNotifications: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || BASE_URL
const FIREBASE_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const pendingPollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const voiceLoopRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentVoiceMessageRef = useRef("")


  const playNotificationSound = useCallback(() => {
    if (typeof window === "undefined") return

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext

      if (!AudioContextClass) return

      const ctx = new AudioContextClass()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "triangle"
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.16)
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22)
      osc.start()
      osc.stop(ctx.currentTime + 0.24)
    } catch (error) {
      console.error("Notification sound failed", error)
    }
  }, [])

  const stopVoiceAlert = useCallback(() => {
    if (voiceLoopRef.current) {
      clearInterval(voiceLoopRef.current)
      voiceLoopRef.current = null
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    currentVoiceMessageRef.current = ""
  }, [])

  const speakRechargeAlert = useCallback((message: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !message) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.rate = 0.94
    utterance.pitch = 1
    utterance.volume = 1
    window.speechSynthesis.speak(utterance)
  }, [])

  const startVoiceAlert = useCallback(
    (message: string) => {
      if (!message) return

      currentVoiceMessageRef.current = message
      speakRechargeAlert(message)

      if (voiceLoopRef.current) clearInterval(voiceLoopRef.current)
      voiceLoopRef.current = setInterval(() => {
        speakRechargeAlert(currentVoiceMessageRef.current)
      }, 12000)
    },
    [speakRechargeAlert]
  )

  const refreshNotifications = useCallback(async () => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    const token = await currentUser.getIdToken()
    const [listRes, unreadRes] = await Promise.all([
      getMyNotifications(token),
      getNotificationUnreadCount(token),
    ])

    setNotifications(listRes?.data ?? [])
    setUnreadCount(unreadRes?.unreadCount ?? 0)
    setLoading(false)
  }, [])

  const handleIncomingNotification = useCallback(
    (payload: AppNotification) => {
      setConnected(true)
      setNotifications((prev) => [payload, ...prev].slice(0, 50))
      setUnreadCount((prev) => prev + (payload.isRead ? 0 : 1))
      playNotificationSound()

      if (payload.type === "recharge.request.created") {
        startVoiceAlert(`${payload.title}. ${payload.message}`)
      }
    },
    [playNotificationSound, startVoiceAlert]
  )

  useEffect(() => {
    let active = true

    const connectSocket = async () => {
      const currentUser = auth.currentUser
      if (!currentUser || !SOCKET_URL) return

      const token = await currentUser.getIdToken()
      const socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        auth: {
          token,
        },
      })

      socketRef.current = socket

      socket.on("connect", () => {
        if (!active) return
        setConnected(true)
      })

      socket.on("disconnect", () => {
        if (!active) return
        setConnected(false)
      })

      socket.on("notification:new", (payload: AppNotification) => {
        if (!active) return
        handleIncomingNotification(payload)
      })
    }

    const start = async () => {
      await refreshNotifications()
      if (!active) return
      await connectSocket()
    }

    void start()

    return () => {
      active = false
      socketRef.current?.disconnect()
      socketRef.current = null

      if (pendingPollRef.current) clearInterval(pendingPollRef.current)
      stopVoiceAlert()
    }
  }, [handleIncomingNotification, refreshNotifications, stopVoiceAlert])

  useEffect(() => {
    const registerPushToken = async () => {
      const currentUser = auth.currentUser
      if (!currentUser || !messaging || !FIREBASE_VAPID_KEY) return

      const supported = await isSupported().catch(() => false)
      if (!supported) return

      const permission = await Notification.requestPermission()
      if (permission !== "granted") return

      const fcmToken = await getToken(messaging, {
        vapidKey: FIREBASE_VAPID_KEY,
      }).catch(() => null)

      if (!fcmToken) return

      const token = await currentUser.getIdToken()
      await registerNotificationDevice(token, fcmToken, "web")
    }

    void registerPushToken()
  }, [])

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "super_admin") {
      if (pendingPollRef.current) {
        clearInterval(pendingPollRef.current)
        pendingPollRef.current = null
      }
      stopVoiceAlert()
      return
    }

    const checkPendingRechargeRequests = async () => {
      const currentUser = auth.currentUser
      if (!currentUser) return

      const token = await currentUser.getIdToken()
      const response = await getPendingRechargeCount(token)
      const pendingCount = response?.pendingCount ?? 0

      if (pendingCount <= 0) {
        stopVoiceAlert()
        return
      }

      const latestRechargeRequest = notifications.find(
        (item) => item.type === "recharge.request.created"
      )

      if (latestRechargeRequest) {
        startVoiceAlert(
          `${latestRechargeRequest.title}. ${latestRechargeRequest.message}`
        )
      }
    }

    void checkPendingRechargeRequests()
    pendingPollRef.current = setInterval(() => {
      void checkPendingRechargeRequests()
    }, 15000)

    return () => {
      if (pendingPollRef.current) {
        clearInterval(pendingPollRef.current)
        pendingPollRef.current = null
      }
    }
  }, [notifications, startVoiceAlert, stopVoiceAlert, user?.role])

  const markOneAsRead = useCallback(async (id: string) => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const token = await currentUser.getIdToken()
    const response = await markNotificationRead(token, id)
    if (!response?.success) return

    setNotifications((prev) => {
      const target = prev.find((item) => item._id === id)
      if (!target || target.isRead) return prev
      setUnreadCount((count) => Math.max(0, count - 1))
      return prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
    })
  }, [])

  const markEverythingAsRead = useCallback(async () => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const token = await currentUser.getIdToken()
    const response = await markAllNotificationsRead(token)
    if (!response?.success) return

    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
    setUnreadCount(0)
  }, [])

  const removeNotification = useCallback(async (id: string) => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const token = await currentUser.getIdToken()
    const response = await deleteNotification(token, id)
    if (!response?.success) return

    setNotifications((prev) => {
      const target = prev.find((item) => item._id === id)
      if (target && !target.isRead) {
        setUnreadCount((count) => Math.max(0, count - 1))
      }
      return prev.filter((item) => item._id !== id)
    })
  }, [])

  const clearNotifications = useCallback(async () => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const token = await currentUser.getIdToken()
    const response = await clearAllNotifications(token)
    if (!response?.success) return

    setNotifications([])
    setUnreadCount(0)
    stopVoiceAlert()
  }, [stopVoiceAlert])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      connected,
      loading,
      markOneAsRead,
      markEverythingAsRead,
      removeNotification,
      clearNotifications,
      refreshNotifications,
    }),
    [
      notifications,
      unreadCount,
      connected,
      loading,
      markOneAsRead,
      markEverythingAsRead,
      removeNotification,
      clearNotifications,
      refreshNotifications,
    ]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider")
  }

  return context
}