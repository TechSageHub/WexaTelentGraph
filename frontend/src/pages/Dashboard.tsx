import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Building2,
  MapPin,
  Briefcase,
  Network,
  ChevronDown,
} from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { CandidateCard } from '../components/CandidateCard';
import { Header } from '../components/Header';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { SkillBadge } from '../components/SkillBadge';
import { useShortlist } from '../hooks/useShortlist';
import { fetchJobs, fetchJob, fetchJobCandidates } from '../services/api';
import type { Job, JobDetail, CandidateMatch } from '../types';

type UIState = 'idle' | 'loading' | 'success' | 'error';

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const jobParam = searchParams.get('job');

  const { ids: shortlistIds } = useShortlist();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsState, setJobsState] = useState<UIState>('loading');

  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobParam);
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);
  const [jobDetailState, setJobDetailState] = useState<UIState>('idle');

  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [candidatesState, setCandidatesState] = useState<UIState>('idle');
  const [candidatesError, setCandidatesError] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [jobSelectorOpen, setJobSelectorOpen] = useState(false);

  // Guards against out-of-order responses when the user changes job quickly.
  const activeJobRef = useRef<string | null>(null);

  // Load jobs on mount
  const loadJobs = useCallback(async () => {
    setJobsState('loading');
    try {
      const data = await fetchJobs();
      setJobs(data);
      setJobsState('success');
    } catch {
      setJobsState('error');
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // If a job was preselected from the URL (?job=...), validate it exists
  // once jobs finish loading (e.g. after navigating back from a detail page).
  useEffect(() => {
    if (jobsState !== 'success') return;
    if (selectedJobId && !jobs.some((j) => j.id === selectedJobId)) {
      setSelectedJobId(null);
    }
  }, [jobsState, jobs, selectedJobId]);

  // Load job detail when selection changes
  useEffect(() => {
    activeJobRef.current = selectedJobId;
    if (!selectedJobId) {
      setSelectedJob(null);
      setCandidates([]);
      setCandidatesState('idle');
      return;
    }

    setJobDetailState('loading');
    fetchJob(selectedJobId)
      .then((job) => {
        if (activeJobRef.current !== selectedJobId) return;
        setSelectedJob(job);
        setJobDetailState('success');
      })
      .catch(() => {
        if (activeJobRef.current !== selectedJobId) return;
        setJobDetailState('error');
      });
  }, [selectedJobId]);

  const handleFindCandidates = useCallback(async () => {
    if (!selectedJobId) return;
    const requestedJobId = selectedJobId;
    setCandidatesState('loading');
    setCandidatesError('');
    try {
      const data = await fetchJobCandidates(requestedJobId);
      if (activeJobRef.current !== requestedJobId) return;
      setCandidates(data);
      setCandidatesState('success');
    } catch (err) {
      if (activeJobRef.current !== requestedJobId) return;
      setCandidatesError(err instanceof Error ? err.message : 'Failed to find candidates');
      setCandidatesState('error');
    }
  }, [selectedJobId]);

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setCandidates([]);
    setCandidatesState('idle');
    setJobSelectorOpen(false);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedJobSummary = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header active="dashboard" shortlistCount={shortlistIds.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          {/* ─── Left Panel: Job Selection ───────────────────── */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Find Candidates</h1>
              <p className="text-slate-400 text-sm mt-1">
                Select a job to discover candidates using graph-based relationship matching.
              </p>
            </div>

            {/* Job Selector Dropdown */}
            <div className="relative">
              <button
                id="job-selector-toggle"
                onClick={() => setJobSelectorOpen((o) => !o)}
                className="w-full card flex items-center justify-between hover:border-slate-700 transition-colors"
                aria-expanded={jobSelectorOpen}
                aria-label="Select a job position"
              >
                <div className="text-left">
                  <p className="section-label">Selected Position</p>
                  <p className={`text-sm mt-1 font-medium ${selectedJobSummary ? 'text-slate-200' : 'text-slate-500'}`}>
                    {selectedJobSummary ? selectedJobSummary.title : 'Choose a job role...'}
                  </p>
                  {selectedJobSummary && (
                    <p className="text-xs text-slate-500 mt-0.5">{selectedJobSummary.company}</p>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${jobSelectorOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {jobSelectorOpen && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 card shadow-2xl shadow-slate-950/80 max-h-96 overflow-y-auto">
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="job-search"
                      type="search"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-9"
                      aria-label="Search job positions"
                      autoFocus
                    />
                  </div>

                  {/* Jobs list */}
                  {jobsState === 'loading' && <LoadingState message="Loading jobs..." />}
                  {jobsState === 'error' && (
                    <ErrorState
                      message="Unable to connect to the talent database."
                      onRetry={loadJobs}
                    />
                  )}
                  {jobsState === 'success' && (
                    <div className="space-y-2">
                      {filteredJobs.length === 0 ? (
                        <EmptyState title="No jobs found" message="Try a different search term." />
                      ) : (
                        filteredJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            isSelected={job.id === selectedJobId}
                            onClick={() => handleSelectJob(job.id)}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Job Detail */}
            {jobDetailState === 'loading' && <LoadingState message="Loading job details..." />}
            {jobDetailState === 'success' && selectedJob && (
              <div className="card space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-100">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="flex items-center gap-1 text-sm text-slate-400">
                      <Building2 className="w-3.5 h-3.5" />
                      {selectedJob.company}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-400">
                      <Briefcase className="w-3.5 h-3.5" />
                      {selectedJob.employmentType}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {selectedJob.requiredSkills.length > 0 && (
                  <div>
                    <p className="section-label mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.requiredSkills.map((s) => (
                        <SkillBadge key={s.id} name={s.name} variant="brand" />
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob.technologies.length > 0 && (
                  <div>
                    <p className="section-label mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.technologies.map((t) => (
                        <SkillBadge key={t.id} name={t.name} variant="amber" />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  id="find-candidates-btn"
                  onClick={handleFindCandidates}
                  disabled={candidatesState === 'loading'}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  aria-label="Find matching candidates for this job"
                >
                  {candidatesState === 'loading' ? (
                    <>Finding candidates...</>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Find Candidates
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ─── Right Panel: Candidate Results ─────────────── */}
          <div>
            {candidatesState === 'idle' && !selectedJobId && (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <Network className="w-12 h-12 text-slate-700" />
                <p className="text-slate-500 text-sm max-w-xs">
                  Select a position to start discovering candidates through graph relationships.
                </p>
              </div>
            )}

            {candidatesState === 'idle' && selectedJobId && (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <Search className="w-10 h-10 text-slate-700" />
                <p className="text-slate-500 text-sm max-w-xs">
                  Click <strong className="text-slate-400">Find Candidates</strong> to run the graph match.
                </p>
              </div>
            )}

            {candidatesState === 'loading' && <LoadingState message="Finding candidates via graph traversal..." />}

            {candidatesState === 'error' && (
              <ErrorState
                title="Could not retrieve candidates"
                message={candidatesError || "We couldn't retrieve candidate matches right now."}
                onRetry={handleFindCandidates}
              />
            )}

            {candidatesState === 'success' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-100">
                    {candidates.length > 0
                      ? `${candidates.length} Candidate${candidates.length !== 1 ? 's' : ''} Found`
                      : 'No Candidates Found'}
                  </h2>
                  {candidates.length > 0 && (
                    <span className="text-xs text-slate-500">Ranked by match score</span>
                  )}
                </div>

                {candidates.length === 0 ? (
                  <EmptyState
                    title="No matching candidates found"
                    message="Try selecting another position or reviewing the job requirements."
                  />
                ) : (
                  <div className="space-y-4">
                    {candidates.map((match, i) => (
                      <CandidateCard
                        key={match.id}
                        match={match}
                        jobId={selectedJobId!}
                        rank={i + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
