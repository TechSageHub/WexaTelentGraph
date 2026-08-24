import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MatchScore } from './MatchScore';
import { SkillBadge } from './SkillBadge';
import { MatchExplanation } from './MatchExplanation';
import type { CandidateMatch } from '../types';

interface CandidateCardProps {
  match: CandidateMatch;
  jobId: string;
  rank: number;
}

export function CandidateCard({ match, jobId, rank }: CandidateCardProps) {
  return (
    <article
      id={`candidate-card-${match.id}`}
      className="card-hover"
      aria-label={`Candidate: ${match.name}, ${match.matchScore}% match`}
    >
      <div className="flex items-start gap-4">
        {/* Rank + Avatar */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-bold text-sm">
            {match.name.charAt(0)}
          </div>
          <span className="text-xs text-slate-600 font-medium">#{rank}</span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-100 text-lg leading-tight">{match.name}</h3>
              <p className="text-slate-400 text-sm mt-0.5">{match.headline}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  {match.location}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {match.yearsExperience} yrs experience
                </span>
              </div>
            </div>
            <MatchScore score={match.matchScore} />
          </div>

          {/* Matching skills */}
          {match.matchingSkills.length > 0 && (
            <div className="mt-3">
              <p className="section-label mb-1.5">Matching Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {match.matchingSkills.map((skill) => (
                  <SkillBadge key={skill} name={skill} variant="green" />
                ))}
              </div>
            </div>
          )}

          {/* Relevant tech */}
          {match.matchingTechnologies.length > 0 && (
            <div className="mt-2">
              <p className="section-label mb-1.5">Relevant Technologies</p>
              <div className="flex flex-wrap gap-1.5">
                {match.matchingTechnologies.slice(0, 4).map((tech) => (
                  <SkillBadge key={tech} name={tech} variant="amber" />
                ))}
              </div>
            </div>
          )}

          {/* Relevant projects */}
          {match.matchPaths.length > 0 && (
            <div className="mt-2">
              <p className="section-label mb-1.5">Relevant Experience</p>
              <div className="flex flex-wrap gap-1.5">
                {[...new Set(match.matchPaths.map((p) => p.project))].slice(0, 3).map((proj) => (
                  <span key={proj} className="badge badge-slate">
                    {proj}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Match explanation */}
          <MatchExplanation
            explanation={match.explanation}
            matchingSkills={match.matchingSkills}
            matchingTechnologies={match.matchingTechnologies}
            matchPaths={match.matchPaths}
          />

          {/* View profile link */}
          <div className="mt-4 flex justify-end">
            <Link
              to={`/candidates/${match.id}?jobId=${jobId}`}
              id={`view-candidate-${match.id}`}
              className="btn-primary flex items-center gap-2 text-sm"
              aria-label={`View full profile of ${match.name}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Candidate
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
