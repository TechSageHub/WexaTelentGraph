// ─── Shared Entity Types ───────────────────────────────────────────────────────

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Technology {
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

export interface Company {
  id: string;
  name: string;
  industry: string;
}

// ─── Job Types ─────────────────────────────────────────────────────────────────

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
  requiredSkills: Skill[];
  technologies: Technology[];
}

// ─── Candidate Types ───────────────────────────────────────────────────────────

export interface CandidateSummary {
  id: string;
  name: string;
  headline: string;
  location: string;
  yearsExperience: number;
  skills: string[];
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

// ─── Matching Types ────────────────────────────────────────────────────────────

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
  matchScore: number;
  directSkillMatches: Skill[];
  projectPaths: MatchPath[];
  allRequiredSkills: string[];
  allJobTechnologies: string[];
  explanation: string;
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiError {
  error: {
    message: string;
  };
}
