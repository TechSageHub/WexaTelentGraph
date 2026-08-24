import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { MatchPath } from '../types';

interface MatchExplanationProps {
  explanation: string;
  matchingSkills: string[];
  matchingTechnologies: string[];
  matchPaths: MatchPath[];
}

export function MatchExplanation({
  explanation,
  matchingSkills,
  matchingTechnologies,
  matchPaths,
}: MatchExplanationProps) {
  const [expanded, setExpanded] = useState(false);

  const uniquePaths = matchPaths.filter(
    (p, i, arr) =>
      arr.findIndex((x) => x.project === p.project && x.technology === p.technology) === i
  );

  return (
    <div className="mt-3 rounded-lg bg-brand-950/50 border border-brand-900/60 overflow-hidden">
      <button
        id="match-explanation-toggle"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-brand-900/20 transition-colors"
        aria-expanded={expanded}
        aria-label="Toggle match explanation"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-brand-400 flex-shrink-0" />
          <span className="text-sm text-brand-300 font-medium">Why this candidate?</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-brand-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-brand-500" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>

          {uniquePaths.length > 0 && (
            <div>
              <p className="section-label mb-2">Graph Path</p>
              <div className="space-y-1.5">
                {uniquePaths.slice(0, 3).map((path, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-slate-400 flex-wrap"
                  >
                    <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-300">
                      {path.project}
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="bg-brand-950 px-2 py-1 rounded border border-brand-800 text-brand-300">
                      {path.technology}
                    </span>
                    <span className="text-slate-600">→ Job</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingSkills.length > 0 && (
            <div>
              <p className="section-label mb-1.5">Matching Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {matchingSkills.map((s) => (
                  <span key={s} className="badge badge-green text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {matchingTechnologies.length > 0 && (
            <div>
              <p className="section-label mb-1.5">Relevant Technologies</p>
              <div className="flex flex-wrap gap-1.5">
                {matchingTechnologies.map((t) => (
                  <span key={t} className="badge badge-amber text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
