"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Characters from "@/components/Characters";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
      // Suppression de la redirection vers la page de login
  }, [router]);
  return <Characters />;
}
