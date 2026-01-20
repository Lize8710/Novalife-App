import { Briefcase } from 'lucide-react';

export default function ProjectIcon({ className = '', ...props }) {
  return (
    <span title="Projets" {...props} className={className}>
      <Briefcase className="w-6 h-6 text-cyan-300" />
    </span>
  );
}
