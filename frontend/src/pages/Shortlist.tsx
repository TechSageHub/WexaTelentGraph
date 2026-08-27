import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star } from 'lucide-react';
import { Header } from '../components/Header';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { SkillBadge } from '../components/SkillBadge';
import { useShortlist } from '../hooks/useShortlist';
import { fetchCandidates } from '../services/api';
import type { CandidateSummary } from '../types';

export function Shortlist() {
  const { ids, clear } = useShortlist();
  const [candidates, setCandidates] = useState<CandidateSummary[]>([]);
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');

  const loadCandidates = useCallback(async () => {
    setState('loading');
    try {
      const data = await fetchCandidates();
      setCandidates(data);
      setState('success');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const shortlisted = useMemo(
    () => candidates.filter((c) => ids.includes(c.id)),
    [candidates, ids]
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Header active="shortlist" shortlistCount={ids.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Shortlist</h1>
            <p className="text-slate-400 text-sm mt-1">
              Candidates you&apos;ve marked as interesting.
            </p>
          </div>
          {shortlisted.length > 0 && (
            <button onClick={clear} className="btn-secondary text-sm" aria-label="Clear shortlist">
              Clear shortlist
            </button>
          )}
        </div>

        {state === 'loading' && <LoadingState message="Loading shortlist..." />}

        {state === 'error' && (
          <ErrorState
            title="Could not load candidates"
            message="We couldn't retrieve the candidate list right now."
            onRetry={loadCandidates}
          />
        )}

        {state === 'success' &&
          (shortlisted.length === 0 ? (
            <EmptyState
              title="Your shortlist is empty"
              message="Browse candidates and star the ones that stand out."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shortlisted.map((candidate) => (
                <div key={candidate.id} className="card" id={`shortlist-card-${candidate.id}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-slate-100 leading-tight truncate">
                        {candidate.name}
                      </h2>
                      <p className="text-slate-400 text-sm truncate">{candidate.headline}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          {candidate.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {candidate.yearsExperience} yrs
                        </span>
                      </div>
                    </div>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                  </div>

                  {candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {candidate.skills.slice(0, 4).map((skill) => (
                        <SkillBadge key={skill} name={skill} variant="slate" />
                      ))}
                      {candidate.skills.length > 4 && (
                        <span className="badge badge-slate">+{candidate.skills.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <Link
                      to={`/candidates/${candidate.id}`}
                      className="btn-primary w-full flex items-center justify-center text-sm"
                      aria-label={`View profile of ${candidate.name}`}
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </main>
    </div>
  );
}
