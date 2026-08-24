import { Building2, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { SkillBadge } from './SkillBadge';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onClick?: () => void;
}

export function JobCard({ job, isSelected = false, onClick }: JobCardProps) {
  return (
    <button
      id={`job-card-${job.id}`}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Select job: ${job.title} at ${job.company}`}
      className={`w-full text-left rounded-xl border p-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
        isSelected
          ? 'border-brand-600 bg-brand-950/40 shadow-lg shadow-brand-900/30'
          : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate">{job.title}</h3>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-slate-400">
              <Building2 className="w-3.5 h-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Briefcase className="w-3.5 h-3.5" />
              {job.employmentType}
            </span>
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 flex-shrink-0 mt-1 transition-colors ${
            isSelected ? 'text-brand-400' : 'text-slate-600'
          }`}
        />
      </div>

      {job.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.requiredSkills.slice(0, 4).map((skill) => (
            <SkillBadge key={skill} name={skill} variant={isSelected ? 'brand' : 'slate'} />
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="badge badge-slate">+{job.requiredSkills.length - 4}</span>
          )}
        </div>
      )}
    </button>
  );
}
