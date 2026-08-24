import type { MatchPath } from '../types';

interface GraphPathProps {
  candidateName: string;
  paths: MatchPath[];
  jobTitle: string;
}

/**
 * GraphPath — Visual representation of the graph traversal.
 *
 * Shows: Candidate → Project → Technology → Job
 *
 * This communicates the multi-hop graph concept to a non-technical recruiter.
 */
export function GraphPath({ candidateName, paths, jobTitle }: GraphPathProps) {
  if (paths.length === 0) return null;

  const uniquePaths = paths.filter(
    (p, i, arr) =>
      arr.findIndex((x) => x.project === p.project && x.technology === p.technology) === i
  );

  return (
    <div className="card mt-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Graph Relationship Path</h3>
      <div className="space-y-4">
        {uniquePaths.slice(0, 4).map((path, i) => (
          <div key={i} className="flex items-center gap-0 flex-wrap">
            {/* Candidate */}
            <div className="flex flex-col items-center">
              <div className="bg-brand-900 border border-brand-700 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-brand-400 font-medium">Candidate</div>
                <div className="text-sm text-brand-200 font-semibold">{candidateName}</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center px-2">
              <div className="text-slate-600 text-xs">WORKED_ON</div>
              <div className="text-slate-500">→</div>
            </div>

            {/* Project */}
            <div className="flex flex-col items-center">
              <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-slate-500 font-medium">Project</div>
                <div className="text-sm text-slate-200 font-semibold">{path.project}</div>
                {path.domain && (
                  <div className="text-xs text-slate-500 mt-0.5">{path.domain}</div>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center px-2">
              <div className="text-slate-600 text-xs">USES_TECH</div>
              <div className="text-slate-500">→</div>
            </div>

            {/* Technology */}
            <div className="flex flex-col items-center">
              <div className="bg-amber-950 border border-amber-800 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-amber-500 font-medium">Technology</div>
                <div className="text-sm text-amber-200 font-semibold">{path.technology}</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center px-2">
              <div className="text-slate-600 text-xs">USED_BY</div>
              <div className="text-slate-500">→</div>
            </div>

            {/* Job */}
            <div className="flex flex-col items-center">
              <div className="bg-emerald-950 border border-emerald-800 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-emerald-500 font-medium">Job</div>
                <div className="text-sm text-emerald-200 font-semibold">{jobTitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
