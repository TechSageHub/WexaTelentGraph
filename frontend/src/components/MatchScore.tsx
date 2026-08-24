interface MatchScoreProps {
  score: number;
}

export function MatchScore({ score }: MatchScoreProps) {
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));

  const colorClass =
    clampedScore >= 75
      ? 'text-emerald-400 border-emerald-700 bg-emerald-950'
      : clampedScore >= 50
      ? 'text-amber-400 border-amber-700 bg-amber-950'
      : 'text-slate-400 border-slate-700 bg-slate-800';

  const label =
    clampedScore >= 75 ? 'Strong Match' : clampedScore >= 50 ? 'Good Match' : 'Partial Match';

  return (
    <div
      className={`inline-flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${colorClass}`}
      aria-label={`Match score: ${clampedScore}%`}
    >
      <span className="text-2xl font-bold leading-none">{clampedScore}%</span>
      <span className="text-xs font-medium opacity-80 mt-0.5">{label}</span>
    </div>
  );
}
