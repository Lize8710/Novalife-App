import Link from "next/link";
import BillingIcon from "./BillingIcon";

export default function BillingNavButton({ className = "" }) {
  return (
    <Link href="/billing" title="Facturation" className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-800/40 transition-colors border border-cyan-700/30 ${className}`}>
      <BillingIcon />
      <span className="text-cyan-200 font-semibold">Facturation</span>
    </Link>
  );
}
