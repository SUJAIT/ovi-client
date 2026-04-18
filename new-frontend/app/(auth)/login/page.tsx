/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import Swal from "sweetalert2";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function Login() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const swalTheme = {
//     background: "hsl(var(--card))",
//     color: "hsl(var(--foreground))",
//     confirmButtonColor: "#0f172a",
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       return Swal.fire({
//         icon: "warning",
//         title: "Missing fields",
//         text: "Please enter email and password",
//         ...swalTheme,
//       });
//     }

//     try {
//       setLoading(true);

//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       Swal.fire({
//         icon: "success",
//         title: "Login Successful",
//         text: `Welcome back${user.displayName ? `, ${user.displayName}` : "!"}`,
//         timer: 1500,
//         showConfirmButton: false,
//         ...swalTheme,
//       }).then(() => {
//         router.push("/dashboard");
//       });
//     } catch (error: any) {
//       let message = "Login failed";

//       if (error.code === "auth/user-not-found") message = "User not found";
//       if (error.code === "auth/wrong-password") message = "Incorrect password";
//       if (error.code === "auth/invalid-email") message = "Invalid email";
//       if (error.code === "auth/invalid-credential") {
//         message = "Invalid email or password";
//       }

//       Swal.fire({
//         icon: "error",
//         title: "Login Failed",
//         text: message,
//         ...swalTheme,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       setLoading(true);

//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       Swal.fire({
//         icon: "success",
//         title: "Login Successful",
//         text: `Welcome ${user.displayName || ""}`,
//         timer: 1500,
//         showConfirmButton: false,
//         ...swalTheme,
//       }).then(() => {
//         router.push("/dashboard");
//       });
//     } catch (error: any) {
//       Swal.fire({
//         icon: "error",
//         title: "Google Login Failed",
//         text: error.message,
//         ...swalTheme,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_35%),linear-gradient(to_bottom_right,hsl(var(--background)),hsl(var(--muted)/0.6))]" />

//       <Card className="w-full max-w-md rounded-2xl border-border bg-card shadow-xl">
//         <CardHeader className="space-y-2 text-center">
//           <CardTitle className="text-2xl font-bold text-foreground">
//             Login to your account
//           </CardTitle>
//           <CardDescription className="text-muted-foreground">
//             Enter your email below to login
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label className="text-foreground">Email</Label>
//             <Input
//               placeholder="m@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label className="text-foreground">Password</Label>
//             <Input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="border-border bg-background text-foreground placeholder:text-muted-foreground"
//             />
//           </div>

//           <div className="flex justify-end">
//             <span
//               onClick={() => router.push("/forgot-password")}
//               className="cursor-pointer text-xs text-muted-foreground hover:text-primary"
//             >
//               Forgot your password?
//             </span>
//           </div>

//           <Button className="w-full" onClick={handleLogin} disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </Button>

//           <div className="flex items-center gap-2">
//             <div className="h-px flex-1 bg-border"></div>
//             <span className="text-xs text-muted-foreground">OR</span>
//             <div className="h-px flex-1 bg-border"></div>
//           </div>

//           <Button
//             type="button"
//             variant="outline"
//             className="flex w-full items-center gap-2 border-border bg-background text-foreground hover:bg-muted"
//             onClick={handleGoogleLogin}
//             disabled={loading}
//           >
//             <img
//               src="https://www.svgrepo.com/show/475656/google-color.svg"
//               alt="google"
//               className="h-5 w-5"
//             />
//             Continue with Google
//           </Button>

//           <div className="pt-2 text-center text-sm text-muted-foreground">
//             Don’t have an account?{" "}
//             <span
//               onClick={() => router.push("/register")}
//               className="cursor-pointer font-medium text-primary hover:underline"
//             >
//               Sign up
//             </span>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Swal from "sweetalert2";
import Image from "next/image";

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

  const swalTheme = {
    background: "hsl(var(--card))",
    color: "hsl(var(--foreground))",
    confirmButtonColor: "#0f172a",
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter email and password",
        ...swalTheme,
      });
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
        ...swalTheme,
      }).then(() => {
        router.push("/dashboard");
      });
    } catch (error: any) {
      let message = "Login failed";

      if (error.code === "auth/user-not-found") message = "User not found";
      if (error.code === "auth/wrong-password") message = "Incorrect password";

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
        ...swalTheme,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        timer: 1500,
        showConfirmButton: false,
        ...swalTheme,
      }).then(() => {
        router.push("/dashboard");
        console.log(process.env.NEXT_PUBLIC_API_URL)
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
        ...swalTheme,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_35%),linear-gradient(to_bottom_right,hsl(var(--background)),hsl(var(--muted)/0.6))]" />

      <Card className="w-full max-w-md rounded-2xl border-border bg-card shadow-xl">

        {/* 🔥 LOGO SECTION */}
        <div className="flex flex-col items-center pt-6">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={140}
            height={50}
            className="object-contain"
          />
        </div>

        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your email below to login
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <span
              onClick={() => router.push("/forgot-password")}
              className="cursor-pointer text-xs text-muted-foreground hover:text-primary"
            >
              Forgot your password?
            </span>
          </div>

          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border"></div>
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="flex w-full items-center gap-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-5 w-5"
            />
            Continue with Google
          </Button>

          <div className="pt-2 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="cursor-pointer font-medium text-primary hover:underline"
            >
              Sign up
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}