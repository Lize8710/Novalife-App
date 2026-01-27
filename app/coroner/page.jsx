


"use client";
import CoronerReportsPage from "./reports";
import { useRouter } from "next/navigation";

export default function CoronerPage() {
  const router = useRouter();
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 m-8 z-10">
        <button
          className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold tracking-widest shadow-lg transition-all border-2 border-cyan-400"
          onClick={() => router.push("/coroner/new")}
        >
          + Nouveau rapport
        </button>
      </div>
      <CoronerReportsPage />
    </div>
  );
}
