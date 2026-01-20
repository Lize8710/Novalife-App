import { FileText } from 'lucide-react';

export default function BillingIcon({ className = '', ...props }) {
  return (
    <span title="Facturation" {...props} className={className}>
      <FileText className="w-6 h-6 text-cyan-300" />
    </span>
  );
}
