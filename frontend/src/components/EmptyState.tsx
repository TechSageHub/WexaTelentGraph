import { Users } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'No matching candidates found',
  message = 'Try selecting another position or reviewing the job requirements.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
        <Users className="w-8 h-8 text-slate-600" />
      </div>
      <div>
        <h3 className="text-slate-300 font-semibold text-lg">{title}</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">{message}</p>
      </div>
    </div>
  );
}
