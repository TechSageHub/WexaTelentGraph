/**
 * match.util.ts
 *
 * Pure, side-effect-free helpers for match scoring and explanation.
 * Kept separate from the Neo4j-touching service so they are trivially unit-testable.
 */

export interface MatchPath {
  project: string;
  domain: string;
  technology: string;
}

/**
 * Compute a deterministic match score (0-100).
 *
 * Scoring strategy (documented in README):
 *   - Each matched required skill          = 15 points (max 60)
 *   - Each matched technology via project   = 8 points (max 40)
 *   Capped at 100.
 */
export function computeMatchScore(skillMatchCount: number, techMatchCount: number): number {
  const skillPoints = Math.min(skillMatchCount * 15, 60);
  const techPoints = Math.min(techMatchCount * 8, 40);
  return Math.min(skillPoints + techPoints, 100);
}

/**
 * Generate a human-readable explanation from actual graph match data.
 * This is derived from real Cypher results, not hardcoded.
 */
export function buildExplanation(
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
      `They also worked on ${uniqueProjects.join(' and ')}, gaining experience with ${uniqueTechs.join(', ')} - technologies relevant to this role.`
    );
  } else if (matchingTechs.length > 0) {
    parts.push(
      `Their project experience includes ${matchingTechs.slice(0, 3).join(', ')}, which are technologies used in this role.`
    );
  }

  return parts.join(' ') || 'This candidate has relevant experience for this role.';
}
