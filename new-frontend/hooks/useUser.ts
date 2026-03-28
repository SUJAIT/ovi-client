"use client"

import { useEffect, useState, useCallback } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL //|| "https://ovi-workstation-backend.onrender.com"

type Wallet = {
  balance: number
  totalSpent: number
  totalRecharge: number
}

type User = {
  _id: string
  firebaseUid: string
  email: string
  name?: string
  role: "user" | "admin" | "super_admin"
  wallet: Wallet
   photoURL?: string
  createdAt?: string
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) { setUser(null); setLoading(false); return }

      const token = await currentUser.getIdToken()
      const res = await fetch(`${BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (data.success && data.data) {
        setUser(data.data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null)
        setLoading(false)
        return
      }
      await fetchProfile()
    })
    return () => unsubscribe()
  }, [fetchProfile])

  // wallet real-time refresh
  const refreshWallet = useCallback(async () => {
    await fetchProfile()
  }, [fetchProfile])

  return { user, loading, refreshWallet }
}