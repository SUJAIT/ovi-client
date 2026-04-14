/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js")

const params = new URL(self.location.href).searchParams

const firebaseConfig = {
  apiKey: params.get("apiKey") || "",
  authDomain: params.get("authDomain") || "",
  projectId: params.get("projectId") || "",
  storageBucket: params.get("storageBucket") || "",
  messagingSenderId: params.get("messagingSenderId") || "",
  appId: params.get("appId") || "",
}

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean)

if (hasFirebaseConfig && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

if (hasFirebaseConfig) {
  const messaging = firebase.messaging()

  messaging.onBackgroundMessage((payload) => {
    const data = payload.data || {}
    const title = payload.notification?.title || data.title || "New notification"
    const body = payload.notification?.body || data.message || "You have a new update."
    const targetUrl = data.url || "/dashboard"
    const notificationId = data.notificationId || `${Date.now()}`

    self.registration.showNotification(title, {
      body,
      icon: "/images/logo.png",
      badge: "/images/favicon.ico",
      tag: notificationId,
      data: {
        url: targetUrl,
        notificationId,
      },
    })
  })
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const targetUrl = new URL(
    event.notification?.data?.url || "/dashboard",
    self.location.origin
  ).href

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          if (client.url === targetUrl) {
            return client.focus()
          }
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }

      return undefined
    })
  )
})