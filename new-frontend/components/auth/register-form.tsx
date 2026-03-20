"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
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

export default function Register() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async (e: any) => {

    e.preventDefault()

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user


      await updateProfile(user, {
        displayName: name
      })
      // send verification email
      await sendEmailVerification(user)

      Swal.fire({
        icon: "success",
        title: "Verify your email",
        text: "Verification link sent to your email"
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
        text: message
      })

    }

  }

  return (
    <form
      onSubmit={handleRegister}
      className="flex justify-center items-center min-h-screen"
    >

      <Card className="w-[350px]">

        <CardHeader>

          <CardTitle>Create an account</CardTitle>

          <CardDescription>
            Enter your information to create your account
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Register
          </Button>

{/* login link add  */}
  <div className="text-center text-sm text-muted-foreground pt-2">
   Already have an account? {" "}
    <span
      onClick={() => router.push("/login")}
      className="text-primary font-medium cursor-pointer hover:underline"
    >
      Loin in
    </span>
  </div>


        </CardContent>

      </Card>

    </form>
  )
}