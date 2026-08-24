/**
 * api.ts — Typed API client for TalentGraph backend
 *
 * The frontend NEVER connects directly to CognoDB.
 * All database operations go through the Express backend.
 */

import type {
  Job,
  JobDetail,
  CandidateProfile,
  CandidateMatch,
  MatchExplanation,
} from '../types';

const API_BASE = import.meta.env['VITE_API_URL'] ?? '/api';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      message = data?.error?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Health ────────────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<{ status: string; database: string }> {
  return apiFetch('/health');
}

// ─── Jobs ──────────────────────────────────────────────────────────────────────

export async function fetchJobs(): Promise<Job[]> {
  const data = await apiFetch<{ jobs: Job[] }>('/jobs');
  return data.jobs;
}

export async function fetchJob(jobId: string): Promise<JobDetail> {
  const data = await apiFetch<{ job: JobDetail }>(`/jobs/${jobId}`);
  return data.job;
}

export async function fetchJobCandidates(jobId: string): Promise<CandidateMatch[]> {
  const data = await apiFetch<{ candidates: CandidateMatch[]; total: number }>(
    `/jobs/${jobId}/candidates`
  );
  return data.candidates;
}

// ─── Candidates ────────────────────────────────────────────────────────────────

export async function fetchCandidate(candidateId: string): Promise<CandidateProfile> {
  const data = await apiFetch<{ candidate: CandidateProfile }>(`/candidates/${candidateId}`);
  return data.candidate;
}

export async function fetchCandidateMatch(
  candidateId: string,
  jobId: string
): Promise<MatchExplanation> {
  const data = await apiFetch<{ match: MatchExplanation }>(
    `/candidates/${candidateId}/matches/${jobId}`
  );
  return data.match;
}
