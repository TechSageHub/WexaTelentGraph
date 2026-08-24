import { getSession } from '../database/neo4j';
import {
  GET_CANDIDATE_BY_ID_QUERY,
  LIST_CANDIDATES_QUERY,
} from '../queries/candidates.queries';

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  domain: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  headline: string;
  location: string;
  yearsExperience: number;
  bio: string;
  skills: Skill[];
  projects: Project[];
  technologies: Technology[];
  companies: Company[];
}

export interface CandidateSummary {
  id: string;
  name: string;
  headline: string;
  location: string;
  yearsExperience: number;
  skills: string[];
}

export async function getCandidateById(candidateId: string): Promise<CandidateProfile | null> {
  const session = getSession();
  try {
    const result = await session.run(GET_CANDIDATE_BY_ID_QUERY, { candidateId });
    if (result.records.length === 0) return null;

    const record = result.records[0];
    return {
      id: record.get('id'),
      name: record.get('name'),
      headline: record.get('headline'),
      location: record.get('location'),
      yearsExperience: record.get('yearsExperience')?.toNumber?.() ?? record.get('yearsExperience'),
      bio: record.get('bio'),
      skills: record.get('skills').filter((s: Skill) => s.id),
      projects: record.get('projects').filter((p: Project) => p.id),
      technologies: record.get('technologies').filter((t: Technology) => t.id),
      companies: record.get('companies').filter((c: Company) => c.id),
    };
  } finally {
    await session.close();
  }
}

export async function listCandidates(): Promise<CandidateSummary[]> {
  const session = getSession();
  try {
    const result = await session.run(LIST_CANDIDATES_QUERY);
    return result.records.map((record) => ({
      id: record.get('id'),
      name: record.get('name'),
      headline: record.get('headline'),
      location: record.get('location'),
      yearsExperience: record.get('yearsExperience')?.toNumber?.() ?? record.get('yearsExperience'),
      skills: record.get('skills').filter(Boolean),
    }));
  } finally {
    await session.close();
  }
}
