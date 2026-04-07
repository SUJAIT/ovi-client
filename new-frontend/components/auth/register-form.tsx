"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"

import { auth } from "@/lib/firebase"
import Swal from "sweetalert2"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function Register() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const swalTheme = {
    background: "hsl(var(--card))",
    color: "hsl(var(--foreground))",
    confirmButtonColor: "#0f172a",
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      return Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill name, email and password",
        ...swalTheme,
      })
    }

    try {
      setLoading(true)

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      await updateProfile(user, {
        displayName: name,
      })

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "You can now login with your account",
        confirmButtonText: "OK",
        ...swalTheme,
      }).then(() => {
        router.push("/login")
      })
    } catch (error: any) {
      let message = "Registration failed"

      if (error.code === "auth/email-already-in-use") {
        message = "Email already registered"
      }

      if (error.code === "auth/invalid-email") {
        message = "Invalid email"
      }

      if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters"
      }

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
        ...swalTheme,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true)

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      Swal.fire({
        icon: "success",
        title: "ICT-Seba Sign-in সফল",
        text: `Welcome ${user.displayName || ""}`,
        timer: 1500,
        showConfirmButton: false,
        ...swalTheme,
      }).then(() => {
        router.push("/dashboard")
      })
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-in Failed",
        text: error.message,
        ...swalTheme,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-border bg-card shadow-xl">
    <div className="flex justify-center pt-6">
  <Image
    src="/images/logo.png"
    alt="logo"
    width={120}
    height={40}
    className="object-contain"
  />
</div>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          Create an account
        </CardTitle>

        <CardDescription className="text-muted-foreground">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Name</Label>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Email</Label>
            <Input
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="flex w-full items-center gap-2 border-border bg-background text-foreground hover:bg-muted"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="h-5 w-5"
          />
          Sign up with Google
        </Button>

        <div className="pt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="cursor-pointer font-medium text-primary hover:underline"
          >
            Log in
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
