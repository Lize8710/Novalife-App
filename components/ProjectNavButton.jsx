import Link from "next/link";
import ProjectIcon from "./ProjectIcon";

export default function ProjectNavButton({ className = "" }) {
  return (
    <Link href="/projects" title="Projets" className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cyan-800/40 transition-colors border border-cyan-700/30 ${className}`}>
      <ProjectIcon />
      <span className="text-cyan-200 font-semibold">Projets</span>
    </Link>
  );
}
