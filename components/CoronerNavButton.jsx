
import Link from "next/link";
import { FaFileMedical } from "react-icons/fa";

export default function CoronerNavButton({ className = "" }) {

  return (
    <Link href="/coroner" title="Coroner" className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-800/40 transition-colors border border-cyan-700/30 ${className}`}>
      <FaFileMedical className="text-cyan-300" />
      <span className="text-cyan-200 font-semibold">Coroner</span>
    </Link>
  );
}
