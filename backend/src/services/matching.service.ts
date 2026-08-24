import neo4j, { Integer as Neo4jInteger } from 'neo4j-driver';
import { getSession } from '../database/neo4j';
import {
  FULL_CANDIDATE_MATCH_QUERY,
  CANDIDATE_JOB_MATCH_EXPLANATION_QUERY,
} from '../queries/matching.queries';

export interface MatchPath {
  project: string;
  domain: string;
  technology: string;
}

export interface CandidateMatch {
  id: string;
  name: string;
  headline: string;
  location: string;
  yearsExperience: number;
  bio: string;
  matchScore: number;
  matchingSkills: string[];
  matchingTechnologies: string[];
  matchPaths: MatchPath[];
  explanation: string;
}

export interface MatchExplanation {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  directSkillMatches: Array<{ id: string; name: string; category: string }>;
  projectPaths: MatchPath[];
  allRequiredSkills: string[];
  allJobTechnologies: string[];
  explanation: string;
}

/**
 * Compute a deterministic match score (0–100).
 *
 * Scoring strategy (documented in README):
 *   - Each matched required skill   = 15 points (max 60)
 *   - Each matched technology via project = 8 points (max 40)
 *   Capped at 100.
 */
function computeMatchScore(skillMatchCount: number, techMatchCount: number): number {
  const skillPoints = Math.min(skillMatchCount * 15, 60);
  const techPoints = Math.min(techMatchCount * 8, 40);
  return Math.min(skillPoints + techPoints, 100);
}

/**
 * Generate a human-readable explanation from actual graph match data.
 * This is derived from real Cypher results, not hardcoded.
 */
function buildExplanation(
  candidateName: string,
  matchingSkills: string[],
  matchingTechs: string[],
  matchPaths: MatchPath[]
): string {
  const parts: string[] = [];

  if (matchingSkills.length > 0) {
    const skillList = matchingSkills.slice(0, 3).join(', ');
    const extra = matchingSkills.length > 3 ? ` and ${matchingSkills.length - 3} more` : '';
    parts.push(
      `${candidateName} has ${matchingSkills.length} required skill${matchingSkills.length > 1 ? 's' : ''}: ${skillList}${extra}.`
    );
  }

  if (matchPaths.length > 0) {
    const uniqueProjects = [...new Set(matchPaths.map((p) => p.project))].slice(0, 2);
    const uniqueTechs = [...new Set(matchPaths.map((p) => p.technology))].slice(0, 3);
    parts.push(
      `They also worked on ${uniqueProjects.join(' and ')}, gaining experience with ${uniqueTechs.join(', ')} — technologies relevant to this role.`
    );
  } else if (matchingTechs.length > 0) {
    parts.push(
      `Their project experience includes ${matchingTechs.slice(0, 3).join(', ')}, which are technologies used in this role.`
    );
  }

  return parts.join(' ') || 'This candidate has relevant experience for this role.';
}

function toNumber(value: unknown): number {
  if (neo4j.isInt(value as Neo4jInteger)) {
    return (value as Neo4jInteger).toNumber();
  }
  return Number(value) || 0;
}

export async function findCandidatesForJob(jobId: string): Promise<CandidateMatch[]> {
  const session = getSession();
  try {
    const result = await session.run(FULL_CANDIDATE_MATCH_QUERY, { jobId });

    return result.records.map((record) => {
      const matchingSkills: string[] = record.get('matchingSkills') ?? [];
      const matchingTechs: string[] = record.get('matchingTechs') ?? [];
      const rawPaths = record.get('matchPaths') ?? [];
      const matchPaths: MatchPath[] = rawPaths
        .filter((p: MatchPath) => p.project)
        .map((p: { project?: string; name?: string; domain: string; technology: string }) => ({
          project: p.project || p.name || '',
          domain: p.domain || '',
          technology: p.technology || '',
        }));

      const skillMatchCount = toNumber(record.get('skillMatchCount'));
      const techMatchCount = toNumber(record.get('techMatchCount'));
      const matchScore = computeMatchScore(skillMatchCount, techMatchCount);

      const name: string = record.get('name');
      const explanation = buildExplanation(name, matchingSkills, matchingTechs, matchPaths);

      return {
        id: record.get('id'),
        name,
        headline: record.get('headline'),
        location: record.get('location'),
        yearsExperience: toNumber(record.get('yearsExperience')),
        bio: record.get('bio'),
        matchScore,
        matchingSkills: matchingSkills.filter(Boolean),
        matchingTechnologies: matchingTechs.filter(Boolean),
        matchPaths,
        explanation,
      };
    });
  } finally {
    await session.close();
  }
}

export async function getCandidateJobMatchExplanation(
  candidateId: string,
  jobId: string
): Promise<MatchExplanation | null> {
  const session = getSession();
  try {
    const result = await session.run(CANDIDATE_JOB_MATCH_EXPLANATION_QUERY, {
      candidateId,
      jobId,
    });
    if (result.records.length === 0) return null;

    const record = result.records[0];
    const directSkillMatches = (record.get('directSkillMatches') ?? []).filter(
      (s: { id: string }) => s.id
    );
    const projectPaths: MatchPath[] = (record.get('projectPaths') ?? [])
      .filter((p: MatchPath) => p.project)
      .map((p: { project: string; domain: string; technology: string }) => ({
        project: p.project,
        domain: p.domain,
        technology: p.technology,
      }));
    const allRequiredSkills: string[] = record.get('allRequiredSkills') ?? [];
    const allJobTechnologies: string[] = record.get('allJobTechnologies') ?? [];
    const candidateName: string = record.get('candidateName');

    const explanation = buildExplanation(
      candidateName,
      directSkillMatches.map((s: { name: string }) => s.name),
      [...new Set(projectPaths.map((p) => p.technology))],
      projectPaths
    );

    return {
      candidateId: record.get('candidateId'),
      candidateName,
      jobId: record.get('jobId'),
      jobTitle: record.get('jobTitle'),
      directSkillMatches,
      projectPaths,
      allRequiredSkills: allRequiredSkills.filter(Boolean),
      allJobTechnologies: allJobTechnologies.filter(Boolean),
      explanation,
    };
  } finally {
    await session.close();
  }
}
