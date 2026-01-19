"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Characters from "@/components/Characters";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("novalife_auth") === "true";
      if (!isAuth) {
        router.replace("/login");
      }
    }
  }, [router]);
  return <Characters />;
}
