import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = 'لا توجد بيانات' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
      <PackageOpen size={48} className="mb-2 opacity-50" />
      <p className="text-small">{message}</p>
    </div>
  );
}
