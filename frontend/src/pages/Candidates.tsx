import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { SkillBadge } from '../components/SkillBadge';
import { fetchCandidates } from '../services/api';
import type { CandidateSummary } from '../types';

export function Candidates() {
  const [candidates, setCandidates] = useState<CandidateSummary[]>([]);
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

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

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return [...set].sort();
  }, [candidates]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return candidates.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);
      const matchesSkill = !skillFilter || c.skills.includes(skillFilter);
      return matchesQuery && matchesSkill;
    });
  }, [candidates, searchQuery, skillFilter]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header active="candidates" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">All Candidates</h1>
            <p className="text-slate-400 text-sm mt-1">
              Browse every candidate in the talent graph.
            </p>
          </div>
          {state === 'success' && (
            <p className="text-sm text-slate-500">
              {filtered.length} of {candidates.length} candidates
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="candidate-search"
              type="search"
              placeholder="Search by name, role, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9"
              aria-label="Search candidates"
            />
          </div>

          {allSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Filter by skill:</span>
              <button
                onClick={() => setSkillFilter('')}
                className={`badge ${skillFilter === '' ? 'badge-brand' : 'badge-slate'} cursor-pointer`}
              >
                All
              </button>
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSkillFilter(skillFilter === skill ? '' : skill)}
                  className={`badge cursor-pointer ${
                    skillFilter === skill ? 'badge-brand' : 'badge-slate'
                  }`}
                  aria-pressed={skillFilter === skill}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {state === 'loading' && <LoadingState message="Loading candidates..." />}

        {state === 'error' && (
          <ErrorState
            title="Could not load candidates"
            message="We couldn't retrieve the candidate list right now."
            onRetry={loadCandidates}
          />
        )}

        {state === 'success' &&
          (filtered.length === 0 ? (
            <EmptyState
              title="No candidates found"
              message="Try a different search term or clear the skill filter."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((candidate) => (
                <Link
                  key={candidate.id}
                  to={`/candidates/${candidate.id}`}
                  id={`candidate-link-${candidate.id}`}
                  className="card card-hover block"
                  aria-label={`View profile of ${candidate.name}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
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
                </Link>
              ))}
            </div>
          ))}
      </main>
    </div>
  );
}
