import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Code2,
  FolderOpen,
  Building2,
  Network,
  Briefcase,
} from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { SkillBadge } from '../components/SkillBadge';
import { MatchScore } from '../components/MatchScore';
import { GraphPath } from '../components/GraphPath';
import { fetchCandidate, fetchCandidateMatch } from '../services/api';
import type { CandidateProfile, MatchExplanation } from '../types';

export function CandidateDetails() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [candidateState, setCandidateState] = useState<'loading' | 'success' | 'error'>('loading');

  const [matchData, setMatchData] = useState<MatchExplanation | null>(null);

  const loadCandidate = useCallback(async () => {
    if (!candidateId) return;
    setCandidateState('loading');
    try {
      const data = await fetchCandidate(candidateId);
      setCandidate(data);
      setCandidateState('success');
    } catch {
      setCandidateState('error');
    }
  }, [candidateId]);

  useEffect(() => {
    loadCandidate();
  }, [loadCandidate]);

  // Load match explanation if jobId is available
  useEffect(() => {
    if (!candidateId || !jobId) return;
    fetchCandidateMatch(candidateId, jobId)
      .then(setMatchData)
      .catch(() => setMatchData(null));
  }, [candidateId, jobId]);

  if (candidateState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingState message="Loading candidate profile..." />
      </div>
    );
  }

  if (candidateState === 'error' || !candidate) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <ErrorState
          title="Could not load candidate"
          message="We couldn't retrieve this candidate's profile."
          onRetry={loadCandidate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link
            to={jobId ? `/?job=${jobId}` : '/'}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-brand-500" />
            <span className="font-semibold text-slate-300 text-sm">TalentGraph</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ─── Candidate Hero ──────────────────────────────── */}
        <div className="card">
          <div className="flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {candidate.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-slate-100">{candidate.name}</h1>
                  <p className="text-brand-400 font-medium mt-0.5">{candidate.headline}</p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {candidate.yearsExperience} years experience
                    </span>
                  </div>
                </div>

                {matchData && (
                  <div className="flex flex-col items-end gap-1">
                    <MatchScore
                      score={
                        matchData.directSkillMatches.length * 15 +
                        matchData.projectPaths.length * 8
                      }
                    />
                    <span className="text-xs text-slate-500">vs. {matchData.jobTitle}</span>
                  </div>
                )}
              </div>

              {candidate.bio && (
                <p className="text-slate-400 text-sm mt-4 leading-relaxed">{candidate.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Match Explanation ───────────────────────────── */}
        {matchData && matchData.projectPaths.length > 0 && (
          <div className="card space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-400" />
              <h2 className="font-semibold text-slate-200">
                Why this candidate matches: <span className="text-brand-400">{matchData.jobTitle}</span>
              </h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{matchData.explanation}</p>

            {matchData.directSkillMatches.length > 0 && (
              <div>
                <p className="section-label mb-2">Direct Skill Matches</p>
                <div className="flex flex-wrap gap-1.5">
                  {matchData.directSkillMatches.map((s) => (
                    <SkillBadge key={s.id} name={s.name} variant="green" />
                  ))}
                </div>
              </div>
            )}

            {/* Graph path visualization */}
            <GraphPath
              candidateName={candidate.name}
              paths={matchData.projectPaths}
              jobTitle={matchData.jobTitle}
            />
          </div>
        )}

        {/* ─── Two-column grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-brand-400" />
              <h2 className="font-semibold text-slate-200">Skills</h2>
            </div>
            {candidate.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <SkillBadge key={skill.id} name={skill.name} variant="brand" />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No skills listed.</p>
            )}
          </div>

          {/* Technologies */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-amber-400" />
              <h2 className="font-semibold text-slate-200">Technologies Used</h2>
            </div>
            {candidate.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {candidate.technologies.map((tech) => (
                  <SkillBadge key={tech.id} name={tech.name} variant="amber" />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No technologies listed.</p>
            )}
          </div>
        </div>

        {/* Projects */}
        {candidate.projects.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="w-4 h-4 text-brand-400" />
              <h2 className="font-semibold text-slate-200">Project Experience</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidate.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                >
                  <h3 className="font-semibold text-slate-200 text-sm">{project.name}</h3>
                  {project.domain && (
                    <span className="badge badge-slate text-xs mt-1">{project.domain}</span>
                  )}
                  {project.description && (
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Companies */}
        {candidate.companies.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-brand-400" />
              <h2 className="font-semibold text-slate-200">Companies Worked With</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {candidate.companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-3 bg-slate-800 rounded-lg p-3 border border-slate-700"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-200 text-sm font-medium truncate">{company.name}</p>
                    {company.industry && (
                      <p className="text-slate-500 text-xs truncate">{company.industry}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
