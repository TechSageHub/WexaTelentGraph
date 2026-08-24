import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't retrieve the data right now.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-950 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <div>
        <h3 className="text-slate-200 font-semibold text-lg">{title}</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          id="retry-button"
          onClick={onRetry}
          className="btn-secondary flex items-center gap-2 mt-2"
          aria-label="Retry loading"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
