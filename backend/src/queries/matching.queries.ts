/**
 * matching.queries.ts
 *
 * Core graph matching queries for TalentGraph.
 *
 * This file contains the key queries that demonstrate graph database value:
 *   1. Direct skill-based candidate matching
 *   2. Multi-hop traversal via project technologies (the "graph advantage" query)
 *   3. Full match explanation query combining both paths
 *
 * All dynamic values are ALWAYS parameterized — never concatenated into Cypher.
 */

/**
 * QUERY 1: Direct Candidate Matching
 *
 * Finds candidates who directly possess skills required by the selected job.
 * Returns candidates with the specific skills they share with the job requirement.
 *
 * Parameters: { jobId: string }
 */
export const DIRECT_SKILL_MATCH_QUERY = `
  MATCH (j:Job {id: $jobId})-[:REQUIRES_SKILL]->(s:Skill)<-[:HAS_SKILL]-(c:Candidate)
  WITH c, collect(DISTINCT s.name) AS matchingSkills, count(DISTINCT s) AS matchCount
  RETURN
    c.id              AS id,
    c.name            AS name,
    c.headline        AS headline,
    c.location        AS location,
    c.yearsExperience AS yearsExperience,
    c.bio             AS bio,
    matchingSkills,
    matchCount
  ORDER BY matchCount DESC
`;

/**
 * QUERY 2: Multi-Hop Candidate Matching via Project Technologies
 *
 * This is the "relationally awkward query" — the graph database advantage.
 *
 * It traverses: Candidate → WORKED_ON → Project → USES_TECHNOLOGY → Technology
 * and matches where the job requires or uses those same technologies.
 *
 * In a relational database, this would require multiple JOINs across:
 *   candidates → candidate_projects → projects → project_technologies → technologies
 * and then a JOIN back to job_technologies — making it complex and slow.
 *
 * In the graph, it's a natural multi-hop traversal.
 *
 * Parameters: { jobId: string }
 */
export const MULTI_HOP_TECH_MATCH_QUERY = `
  MATCH (j:Job {id: $jobId})-[:USES_TECHNOLOGY]->(t:Technology)
  MATCH (c:Candidate)-[:WORKED_ON]->(p:Project)-[:USES_TECHNOLOGY]->(t)
  WITH c, p, collect(DISTINCT t.name) AS matchingTechs, count(DISTINCT t) AS techMatchCount
  RETURN
    c.id              AS id,
    c.name            AS name,
    c.headline        AS headline,
    c.location        AS location,
    c.yearsExperience AS yearsExperience,
    c.bio             AS bio,
    collect(DISTINCT {
      projectName: p.name,
      projectDomain: p.domain,
      technologies: matchingTechs
    }) AS matchingProjects,
    sum(techMatchCount) AS techMatchCount
  ORDER BY techMatchCount DESC
`;

/**
 * QUERY 3: Full Combined Match Query
 *
 * Returns a comprehensive match result for all candidates against a job,
 * combining direct skill matches and multi-hop technology matches.
 * Also returns the project path for match explanation.
 *
 * Parameters: { jobId: string }
 */
export const FULL_CANDIDATE_MATCH_QUERY = `
  MATCH (j:Job {id: $jobId})
  OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(requiredSkill:Skill)
  WITH j, collect(DISTINCT requiredSkill.name) AS requiredSkills,
          count(DISTINCT requiredSkill) AS totalRequiredSkills

  MATCH (c:Candidate)
  OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(j)
  WITH j, requiredSkills, totalRequiredSkills, c,
          collect(DISTINCT s.name) AS matchingSkills,
          count(DISTINCT s) AS skillMatchCount

  OPTIONAL MATCH (j)-[:USES_TECHNOLOGY]->(jt:Technology)
  WITH j, requiredSkills, totalRequiredSkills, c,
          matchingSkills, skillMatchCount,
          collect(DISTINCT jt.name) AS jobTechs,
          count(DISTINCT jt) AS totalJobTechs

  OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)-[:USES_TECHNOLOGY]->(t:Technology)<-[:USES_TECHNOLOGY]-(j)
  WITH j, requiredSkills, totalRequiredSkills, c,
          matchingSkills, skillMatchCount,
          jobTechs, totalJobTechs,
          collect(DISTINCT t.name) AS matchingTechs,
          collect(DISTINCT {name: p.name, domain: p.domain, technology: t.name}) AS matchPaths,
          count(DISTINCT t) AS techMatchCount

  WHERE skillMatchCount > 0 OR techMatchCount > 0

  RETURN
    c.id              AS id,
    c.name            AS name,
    c.headline        AS headline,
    c.location        AS location,
    c.yearsExperience AS yearsExperience,
    c.bio             AS bio,
    matchingSkills,
    skillMatchCount,
    totalRequiredSkills,
    matchingTechs,
    techMatchCount,
    totalJobTechs,
    matchPaths,
    requiredSkills,
    jobTechs
  ORDER BY (skillMatchCount * 2 + techMatchCount) DESC
`;

/**
 * QUERY 4: Candidate-to-Job Match Explanation
 *
 * Retrieves the specific relationship path between a single candidate and a job.
 * Used for the detailed "Why this candidate?" explanation on the candidate detail page.
 *
 * Parameters: { candidateId: string, jobId: string }
 */
export const CANDIDATE_JOB_MATCH_EXPLANATION_QUERY = `
  MATCH (c:Candidate {id: $candidateId})
  MATCH (j:Job {id: $jobId})

  OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(s:Skill)<-[:HAS_SKILL]-(c)
  WITH c, j, collect(DISTINCT {id: s.id, name: s.name, category: s.category}) AS directSkillMatches

  OPTIONAL MATCH (j)-[:USES_TECHNOLOGY]->(t:Technology)<-[:USES_TECHNOLOGY]-(p:Project)<-[:WORKED_ON]-(c)
  WITH c, j, directSkillMatches,
    collect(DISTINCT {
      project: p.name,
      domain: p.domain,
      technology: t.name
    }) AS projectPaths

  OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(rs:Skill)
  WITH c, j, directSkillMatches, projectPaths,
    collect(DISTINCT rs.name) AS allRequiredSkills

  OPTIONAL MATCH (j)-[:USES_TECHNOLOGY]->(jt:Technology)
  RETURN
    c.id            AS candidateId,
    c.name          AS candidateName,
    j.id            AS jobId,
    j.title         AS jobTitle,
    directSkillMatches,
    projectPaths,
    allRequiredSkills,
    collect(DISTINCT jt.name) AS allJobTechnologies
`;
