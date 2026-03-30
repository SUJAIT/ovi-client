"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Swal from "sweetalert2";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const oobCode = params.get("oobCode");

    if (!oobCode) {
      Swal.fire("Error", "Invalid verification link", "error");
      return;
    }

    applyActionCode(auth, oobCode)
      .then(() => {
        Swal.fire("Success", "Email verified সফল 🎉", "success").then(() => {
          router.push("/login");
        });
      })
      .catch(() => {
        Swal.fire("Error", "Link expired বা invalid ❌", "error");
      });
  }, []);

  return <div className="text-center mt-20">Verifying your email...</div>;
}