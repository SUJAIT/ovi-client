"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword,GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter email and password",
      });
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // if (!user.emailVerified) {
      //   setLoading(false);
      //   return Swal.fire({
      //     icon: "warning",
      //     title: "Email not verified",
      //     text: "Please verify your email first",
      //   });
      // }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/dashboard");
      });
    } catch (error: any) {
      let message = "Login failed";

      if (error.code === "auth/user-not-found") message = "User not found";
      if (error.code === "auth/wrong-password") message = "Incorrect password";
      if (error.code === "auth/invalid-email") message = "Invalid email";
      if (error.code === "auth/invalid-credential")
        message = "Invalid email or password";

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(auth, provider)

    const user = result.user

    Swal.fire({
      icon: "success",
      title: "Login Successful 🎉",
      text: `Welcome ${user.displayName}`,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      router.push("/dashboard")
    })

  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Google Login Failed",
      text: error.message,
    })
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your email below to login
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <span
              onClick={() => router.push("/forgot-password")}
              className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
            >
              Forgot your password?
            </span>
          </div>

          {/* Login Button */}
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Divider */}
<div className="flex items-center gap-2">
  <div className="flex-1 h-px bg-gray-300"></div>
  <span className="text-xs text-muted-foreground">OR</span>
  <div className="flex-1 h-px bg-gray-300"></div>
</div>

{/* Google Login Button */}
<Button
  type="button"
  variant="outline"
  className="w-full flex items-center gap-2"
  onClick={handleGoogleLogin}
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="google"
    className="w-5 h-5"
  />
  Continue with Google
</Button>

          {/* Register Link */}
          <div className="text-center text-sm text-muted-foreground pt-2">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}