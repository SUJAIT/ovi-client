"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  // sendEmailVerification,
  updateProfile,
  GoogleAuthProvider, signInWithPopup
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

//   const handleRegister = async (e: any) => {

//     e.preventDefault()

//     try {

//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       )

//       const user = userCredential.user


//       await updateProfile(user, {
//         displayName: name
//       })
//       // send verification email
//       await sendEmailVerification(user)

//    Swal.fire({
//   icon: "success",
//   title: "Check your email 📩",
//   text: "Verification link sent! If you don’t see it, check Spam or Promotions folder.",
//   confirmButtonText: "OK"
// }).then(() => {
//   router.push("/login")
// })

//     } catch (error: any) {

//       let message = "Registration failed"

//       if (error.code === "auth/email-already-in-use") {
//         message = "Email already registered"
//       }

//       if (error.code === "auth/invalid-email") {
//         message = "Invalid email"
//       }

//       if (error.code === "auth/weak-password") {
//         message = "Password must be at least 6 characters"
//       }

//       Swal.fire({
//         icon: "error",
//         title: "Registration Failed",
//         text: message
//       })

//     }

//   }
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

    // ❌ remove this
    // await sendEmailVerification(user)

    Swal.fire({
      icon: "success",
      title: "Account Created 🎉",
      text: "You can now login with your account",
      confirmButtonText: "OK"
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


const handleGoogleSignUp = async () => {
  try {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(auth, provider)

    const user = result.user

    Swal.fire({
      icon: "success",
      title: "ICT-Seba Sign-in সফল 🎉",
      text: `Welcome ${user.displayName}`,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      router.push("/dashboard")
    })

  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Google Sign-in Failed",
      text: error.message,
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

<div className="flex items-center gap-2">
  <div className="flex-1 h-px bg-gray-300"></div>
  <span className="text-xs text-muted-foreground">OR</span>
  <div className="flex-1 h-px bg-gray-300"></div>
</div>

<Button
  type="button"
  variant="outline"
  className="w-full flex items-center gap-2"
  onClick={handleGoogleSignUp}
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="google"
    className="w-5 h-5"
  />
  Sign up with Google
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