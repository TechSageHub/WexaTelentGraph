import { getSession } from '../database/neo4j';
import { LIST_JOBS_QUERY, GET_JOB_BY_ID_QUERY } from '../queries/jobs.queries';

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  company: string;
  companyId: string;
  industry: string;
  requiredSkills: string[];
  technologies: string[];
}

export interface JobDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  company: string;
  companyId: string;
  industry: string;
  requiredSkills: Array<{ id: string; name: string; category: string }>;
  technologies: Array<{ id: string; name: string; category: string }>;
}

export async function listJobs(): Promise<Job[]> {
  const session = getSession();
  try {
    const result = await session.run(LIST_JOBS_QUERY);
    return result.records.map((record) => ({
      id: record.get('id'),
      title: record.get('title'),
      description: record.get('description'),
      location: record.get('location'),
      employmentType: record.get('employmentType'),
      company: record.get('company'),
      companyId: record.get('companyId'),
      industry: record.get('industry'),
      requiredSkills: record.get('requiredSkills').filter(Boolean),
      technologies: record.get('technologies').filter(Boolean),
    }));
  } finally {
    await session.close();
  }
}

export async function getJobById(jobId: string): Promise<JobDetail | null> {
  const session = getSession();
  try {
    const result = await session.run(GET_JOB_BY_ID_QUERY, { jobId });
    if (result.records.length === 0) return null;

    const record = result.records[0];
    return {
      id: record.get('id'),
      title: record.get('title'),
      description: record.get('description'),
      location: record.get('location'),
      employmentType: record.get('employmentType'),
      company: record.get('company'),
      companyId: record.get('companyId'),
      industry: record.get('industry'),
      requiredSkills: record.get('requiredSkills').filter((s: { id: string }) => s.id),
      technologies: record.get('technologies').filter((t: { id: string }) => t.id),
    };
  } finally {
    await session.close();
  }
}
