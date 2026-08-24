/**
 * candidates.queries.ts
 *
 * All Cypher queries related to Candidate nodes.
 * Dynamic values are ALWAYS passed as parameters — never concatenated.
 */

/**
 * Get full candidate profile including skills, projects, technologies, and companies.
 * Parameters: { candidateId: string }
 */
export const GET_CANDIDATE_BY_ID_QUERY = `
  MATCH (c:Candidate {id: $candidateId})
  OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
  OPTIONAL MATCH (p)-[:USES_TECHNOLOGY]->(t:Technology)
  OPTIONAL MATCH (p)-[:FOR_COMPANY]->(co:Company)
  RETURN
    c.id                AS id,
    c.name              AS name,
    c.headline          AS headline,
    c.location          AS location,
    c.yearsExperience   AS yearsExperience,
    c.bio               AS bio,
    collect(DISTINCT {id: s.id, name: s.name, category: s.category}) AS skills,
    collect(DISTINCT {
      id: p.id,
      name: p.name,
      description: p.description,
      domain: p.domain
    }) AS projects,
    collect(DISTINCT {id: t.id, name: t.name, category: t.category}) AS technologies,
    collect(DISTINCT {id: co.id, name: co.name, industry: co.industry}) AS companies
`;

/**
 * List all candidates (lightweight for list views).
 */
export const LIST_CANDIDATES_QUERY = `
  MATCH (c:Candidate)
  OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
  RETURN
    c.id              AS id,
    c.name            AS name,
    c.headline        AS headline,
    c.location        AS location,
    c.yearsExperience AS yearsExperience,
    collect(DISTINCT s.name) AS skills
  ORDER BY c.name
`;
