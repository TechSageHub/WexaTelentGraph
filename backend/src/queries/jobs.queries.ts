/**
 * jobs.queries.ts
 *
 * All Cypher queries related to Job nodes.
 * Dynamic values are ALWAYS passed as parameters — never concatenated.
 */

/**
 * List all jobs with their associated company, required skills, and technologies.
 */
export const LIST_JOBS_QUERY = `
  MATCH (j:Job)-[:BELONGS_TO]->(c:Company)
  OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(s:Skill)
  OPTIONAL MATCH (j)-[:USES_TECHNOLOGY]->(t:Technology)
  RETURN
    j.id          AS id,
    j.title       AS title,
    j.description AS description,
    j.location    AS location,
    j.employmentType AS employmentType,
    c.name        AS company,
    c.id          AS companyId,
    c.industry    AS industry,
    collect(DISTINCT s.name) AS requiredSkills,
    collect(DISTINCT t.name) AS technologies
  ORDER BY j.title
`;

/**
 * Get a single job by ID including full requirements.
 * Parameters: { jobId: string }
 */
export const GET_JOB_BY_ID_QUERY = `
  MATCH (j:Job {id: $jobId})-[:BELONGS_TO]->(c:Company)
  OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(s:Skill)
  OPTIONAL MATCH (j)-[:USES_TECHNOLOGY]->(t:Technology)
  RETURN
    j.id          AS id,
    j.title       AS title,
    j.description AS description,
    j.location    AS location,
    j.employmentType AS employmentType,
    c.name        AS company,
    c.id          AS companyId,
    c.industry    AS industry,
    collect(DISTINCT {id: s.id, name: s.name, category: s.category}) AS requiredSkills,
    collect(DISTINCT {id: t.id, name: t.name, category: t.category}) AS technologies
`;
