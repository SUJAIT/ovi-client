"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Swal from "sweetalert2";

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const mode = params.get("mode");
    const oobCode = params.get("oobCode");

    // Only handle email verification mode
    if (mode !== "verifyEmail") {
      // Could be resetPassword or other modes — handle or ignore
      return;
    }

    if (!oobCode) {
      Swal.fire("Error", "Invalid verification link", "error").then(() => {
        router.push("/login");
      });
      return;
    }

    applyActionCode(auth, oobCode)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Email Verified! 🎉",
          text: "Your email has been verified. You can now log in.",
          confirmButtonText: "Go to Login",
        }).then(() => {
          router.push("/login");
        });
      })
      .catch((error) => {
        console.error("Verification error:", error);
        let message = "Verification link expired or invalid.";
        if (error.code === "auth/expired-action-code") {
          message = "Link has expired. Please request a new verification email.";
        } else if (error.code === "auth/invalid-action-code") {
          message = "Link is invalid or already used.";
        }
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: message,
        }).then(() => {
          router.push("/login");
        });
      });
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-lg font-medium">Verifying your email...</div>
        <div className="text-sm text-muted-foreground mt-2">Please wait a moment</div>
      </div>
    </div>
  );
}

// Suspense needed because useSearchParams() requires it in Next.js 13+
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}