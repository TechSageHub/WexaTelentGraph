/**
 * seed.ts — TalentGraph CognoDB Seed Script
 *
 * Run: npm run seed
 *
 * - Connects to CognoDB using the official Neo4j driver
 * - Uses MERGE for idempotency (safe to re-run)
 * - Uses parameterized queries — no string concatenation
 * - Creates 12 candidates, 10 skills, 6 jobs, 12 projects, 10 technologies, 6 companies
 * - Logs progress and reports failures clearly
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import neo4j from 'neo4j-driver';

// Try multiple .env locations — works for both ts-node from scripts/ and compiled contexts
const envCandidates = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), '.env'),
];
const envPath = envCandidates.find((p) => fs.existsSync(p));
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  Could not locate .env file. Falling back to process.env.');
}

const uri = process.env['COGNODB_URI']!;
const username = process.env['COGNODB_USERNAME']!;
const password = process.env['COGNODB_PASSWORD']!;

if (!uri || !username || !password) {
  console.error('❌ Missing required environment variables: COGNODB_URI, COGNODB_USERNAME, COGNODB_PASSWORD');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

// ─── Seed Data ────────────────────────────────────────────────────────────────

const skills = [
  { id: 'skill-nodejs', name: 'Node.js', category: 'Backend' },
  { id: 'skill-typescript', name: 'TypeScript', category: 'Language' },
  { id: 'skill-python', name: 'Python', category: 'Language' },
  { id: 'skill-react', name: 'React', category: 'Frontend' },
  { id: 'skill-postgresql', name: 'PostgreSQL', category: 'Database' },
  { id: 'skill-docker', name: 'Docker', category: 'DevOps' },
  { id: 'skill-aws', name: 'AWS', category: 'Cloud' },
  { id: 'skill-graphql', name: 'GraphQL', category: 'API' },
  { id: 'skill-kubernetes', name: 'Kubernetes', category: 'DevOps' },
  { id: 'skill-go', name: 'Go', category: 'Language' },
];

const technologies = [
  { id: 'tech-nodejs', name: 'Node.js', category: 'Runtime' },
  { id: 'tech-postgresql', name: 'PostgreSQL', category: 'Database' },
  { id: 'tech-redis', name: 'Redis', category: 'Cache' },
  { id: 'tech-docker', name: 'Docker', category: 'Container' },
  { id: 'tech-aws', name: 'AWS', category: 'Cloud' },
  { id: 'tech-kafka', name: 'Kafka', category: 'Messaging' },
  { id: 'tech-elasticsearch', name: 'Elasticsearch', category: 'Search' },
  { id: 'tech-react', name: 'React', category: 'Frontend' },
  { id: 'tech-kubernetes', name: 'Kubernetes', category: 'Orchestration' },
  { id: 'tech-graphql', name: 'GraphQL', category: 'API' },
];

const companies = [
  { id: 'company-fintech', name: 'FinTech Solutions', industry: 'Financial Technology', location: 'Lagos, Nigeria' },
  { id: 'company-healthtech', name: 'HealthBridge', industry: 'Health Technology', location: 'Nairobi, Kenya' },
  { id: 'company-ecommerce', name: 'ShopStream', industry: 'E-commerce', location: 'Cape Town, South Africa' },
  { id: 'company-logistics', name: 'LogiCore', industry: 'Logistics & Supply Chain', location: 'Accra, Ghana' },
  { id: 'company-edtech', name: 'LearnSphere', industry: 'Education Technology', location: 'London, UK' },
  { id: 'company-saas', name: 'CloudBase', industry: 'SaaS', location: 'Remote' },
];

const projects = [
  { id: 'proj-payment-gateway', name: 'Payment Gateway', description: 'High-throughput payment processing API handling millions of transactions daily.', domain: 'Fintech' },
  { id: 'proj-ecommerce-platform', name: 'E-commerce Platform', description: 'Full-stack marketplace connecting buyers and sellers across Africa.', domain: 'E-commerce' },
  { id: 'proj-healthcare-api', name: 'Healthcare Records API', description: 'Secure RESTful API for managing patient health records with HIPAA compliance.', domain: 'Healthcare' },
  { id: 'proj-logistics-platform', name: 'Logistics Platform', description: 'Real-time shipment tracking and fleet management system.', domain: 'Logistics' },
  { id: 'proj-learning-management', name: 'Learning Management System', description: 'Interactive platform for course delivery and student progress tracking.', domain: 'EdTech' },
  { id: 'proj-analytics-dashboard', name: 'Analytics Dashboard', description: 'Real-time business intelligence dashboard with streaming data visualisations.', domain: 'Data Analytics' },
  { id: 'proj-auth-service', name: 'Auth Microservice', description: 'OAuth2/JWT-based authentication service supporting multi-tenant SaaS.', domain: 'Security' },
  { id: 'proj-notification-service', name: 'Notification Service', description: 'Multi-channel notification system supporting email, SMS, and push.', domain: 'Infrastructure' },
  { id: 'proj-search-engine', name: 'Product Search Engine', description: 'Full-text search and recommendation engine for 10M+ product catalogue.', domain: 'Search' },
  { id: 'proj-data-pipeline', name: 'Data Ingestion Pipeline', description: 'ETL pipeline processing millions of events per hour using Kafka and Spark.', domain: 'Data Engineering' },
  { id: 'proj-mobile-api', name: 'Mobile Banking API', description: 'RESTful backend powering mobile banking app for 500k+ users.', domain: 'Fintech' },
  { id: 'proj-devops-platform', name: 'CI/CD Platform', description: 'Internal developer platform automating deployment workflows across cloud environments.', domain: 'DevOps' },
];

const jobs = [
  {
    id: 'job-senior-backend', title: 'Senior Backend Engineer', description: 'Build scalable backend services for our fintech platform handling millions of daily transactions.',
    location: 'Lagos, Nigeria', employmentType: 'Full-time', companyId: 'company-fintech',
    skills: ['skill-nodejs', 'skill-typescript', 'skill-postgresql'],
    technologies: ['tech-nodejs', 'tech-postgresql', 'tech-redis'],
  },
  {
    id: 'job-fullstack', title: 'Full-Stack Engineer', description: 'Design and build end-to-end features for our e-commerce marketplace platform.',
    location: 'Cape Town, South Africa', employmentType: 'Full-time', companyId: 'company-ecommerce',
    skills: ['skill-react', 'skill-nodejs', 'skill-typescript'],
    technologies: ['tech-react', 'tech-nodejs', 'tech-postgresql'],
  },
  {
    id: 'job-devops', title: 'DevOps Engineer', description: 'Own our CI/CD pipelines, container orchestration, and cloud infrastructure.',
    location: 'Remote', employmentType: 'Full-time', companyId: 'company-saas',
    skills: ['skill-docker', 'skill-kubernetes', 'skill-aws'],
    technologies: ['tech-docker', 'tech-kubernetes', 'tech-aws'],
  },
  {
    id: 'job-python-data', title: 'Python Data Engineer', description: 'Build and maintain scalable data pipelines for real-time analytics workloads.',
    location: 'London, UK', employmentType: 'Full-time', companyId: 'company-edtech',
    skills: ['skill-python', 'skill-aws', 'skill-postgresql'],
    technologies: ['tech-kafka', 'tech-elasticsearch', 'tech-aws'],
  },
  {
    id: 'job-api-architect', title: 'API Architect', description: 'Lead design of our GraphQL API platform used by 200+ internal and external clients.',
    location: 'Nairobi, Kenya', employmentType: 'Full-time', companyId: 'company-healthtech',
    skills: ['skill-graphql', 'skill-nodejs', 'skill-typescript'],
    technologies: ['tech-graphql', 'tech-nodejs', 'tech-redis'],
  },
  {
    id: 'job-platform-engineer', title: 'Platform Engineer', description: 'Build internal developer tools and infrastructure to support rapid product delivery.',
    location: 'Accra, Ghana', employmentType: 'Full-time', companyId: 'company-logistics',
    skills: ['skill-go', 'skill-docker', 'skill-kubernetes'],
    technologies: ['tech-kubernetes', 'tech-docker', 'tech-kafka'],
  },
];

const candidates = [
  {
    id: 'candidate-001', name: 'Sarah Adeyemi', headline: 'Senior Backend Engineer', location: 'Lagos, Nigeria', yearsExperience: 6,
    bio: 'Experienced backend engineer specialising in high-throughput financial systems. Passionate about clean APIs and performance.',
    skills: ['skill-nodejs', 'skill-typescript', 'skill-postgresql', 'skill-docker'],
    projects: ['proj-payment-gateway', 'proj-auth-service'],
    projectTechs: {
      'proj-payment-gateway': ['tech-nodejs', 'tech-postgresql', 'tech-redis'],
      'proj-auth-service': ['tech-nodejs', 'tech-redis'],
    },
    projectCompanies: { 'proj-payment-gateway': 'company-fintech', 'proj-auth-service': 'company-fintech' },
  },
  {
    id: 'candidate-002', name: 'Kwame Asante', headline: 'Full-Stack Engineer', location: 'Accra, Ghana', yearsExperience: 4,
    bio: 'Full-stack developer with a strong focus on React frontends and Node.js backends. Loves shipping products.',
    skills: ['skill-react', 'skill-nodejs', 'skill-typescript', 'skill-postgresql'],
    projects: ['proj-ecommerce-platform', 'proj-notification-service'],
    projectTechs: {
      'proj-ecommerce-platform': ['tech-react', 'tech-nodejs', 'tech-postgresql'],
      'proj-notification-service': ['tech-nodejs', 'tech-redis'],
    },
    projectCompanies: { 'proj-ecommerce-platform': 'company-ecommerce', 'proj-notification-service': 'company-ecommerce' },
  },
  {
    id: 'candidate-003', name: 'Amina Hassan', headline: 'Python Data Engineer', location: 'Nairobi, Kenya', yearsExperience: 5,
    bio: 'Data engineer focused on building robust pipelines. Strong in Python ecosystem and cloud-native tooling.',
    skills: ['skill-python', 'skill-aws', 'skill-postgresql', 'skill-docker'],
    projects: ['proj-data-pipeline', 'proj-analytics-dashboard'],
    projectTechs: {
      'proj-data-pipeline': ['tech-kafka', 'tech-aws', 'tech-elasticsearch'],
      'proj-analytics-dashboard': ['tech-postgresql', 'tech-elasticsearch'],
    },
    projectCompanies: { 'proj-data-pipeline': 'company-edtech', 'proj-analytics-dashboard': 'company-edtech' },
  },
  {
    id: 'candidate-004', name: 'Chidi Okoye', headline: 'DevOps Engineer', location: 'Abuja, Nigeria', yearsExperience: 7,
    bio: 'DevOps professional with deep expertise in container orchestration, CI/CD pipelines, and cloud infrastructure.',
    skills: ['skill-docker', 'skill-kubernetes', 'skill-aws', 'skill-python'],
    projects: ['proj-devops-platform', 'proj-auth-service'],
    projectTechs: {
      'proj-devops-platform': ['tech-kubernetes', 'tech-docker', 'tech-aws'],
      'proj-auth-service': ['tech-docker', 'tech-aws'],
    },
    projectCompanies: { 'proj-devops-platform': 'company-saas', 'proj-auth-service': 'company-saas' },
  },
  {
    id: 'candidate-005', name: 'Fatima Al-Rashid', headline: 'API Architect', location: 'Dubai, UAE', yearsExperience: 8,
    bio: 'Architect specialising in GraphQL federation and API platform design for enterprise clients.',
    skills: ['skill-graphql', 'skill-nodejs', 'skill-typescript', 'skill-postgresql'],
    projects: ['proj-healthcare-api', 'proj-mobile-api'],
    projectTechs: {
      'proj-healthcare-api': ['tech-graphql', 'tech-nodejs', 'tech-postgresql'],
      'proj-mobile-api': ['tech-graphql', 'tech-redis', 'tech-nodejs'],
    },
    projectCompanies: { 'proj-healthcare-api': 'company-healthtech', 'proj-mobile-api': 'company-healthtech' },
  },
  {
    id: 'candidate-006', name: 'Temi Olawale', headline: 'Backend Engineer', location: 'London, UK', yearsExperience: 3,
    bio: 'Junior-to-mid backend engineer with solid Node.js and TypeScript skills. Eager to work on impactful products.',
    skills: ['skill-nodejs', 'skill-typescript', 'skill-react'],
    projects: ['proj-ecommerce-platform', 'proj-notification-service'],
    projectTechs: {
      'proj-ecommerce-platform': ['tech-nodejs', 'tech-postgresql'],
      'proj-notification-service': ['tech-redis', 'tech-nodejs'],
    },
    projectCompanies: { 'proj-ecommerce-platform': 'company-ecommerce', 'proj-notification-service': 'company-ecommerce' },
  },
  {
    id: 'candidate-007', name: 'Nia Mensah', headline: 'Platform Engineer', location: 'Cape Town, South Africa', yearsExperience: 6,
    bio: 'Platform engineer with experience in Go, Kubernetes, and building internal developer tooling for large engineering teams.',
    skills: ['skill-go', 'skill-kubernetes', 'skill-docker', 'skill-aws'],
    projects: ['proj-devops-platform', 'proj-logistics-platform'],
    projectTechs: {
      'proj-devops-platform': ['tech-kubernetes', 'tech-docker', 'tech-kafka'],
      'proj-logistics-platform': ['tech-kafka', 'tech-aws'],
    },
    projectCompanies: { 'proj-devops-platform': 'company-saas', 'proj-logistics-platform': 'company-logistics' },
  },
  {
    id: 'candidate-008', name: 'Emeka Nwosu', headline: 'Senior Full-Stack Engineer', location: 'Lagos, Nigeria', yearsExperience: 7,
    bio: 'Senior engineer with a decade spanning fintech and e-commerce. Strong in TypeScript, React, and distributed systems.',
    skills: ['skill-react', 'skill-typescript', 'skill-nodejs', 'skill-postgresql', 'skill-docker'],
    projects: ['proj-payment-gateway', 'proj-ecommerce-platform'],
    projectTechs: {
      'proj-payment-gateway': ['tech-nodejs', 'tech-redis', 'tech-postgresql'],
      'proj-ecommerce-platform': ['tech-react', 'tech-nodejs'],
    },
    projectCompanies: { 'proj-payment-gateway': 'company-fintech', 'proj-ecommerce-platform': 'company-ecommerce' },
  },
  {
    id: 'candidate-009', name: 'Yetunde Afolabi', headline: 'Data & Search Engineer', location: 'Ibadan, Nigeria', yearsExperience: 5,
    bio: 'Specialist in search infrastructure and data ingestion at scale. Passionate about Elasticsearch and event-driven systems.',
    skills: ['skill-python', 'skill-postgresql', 'skill-aws'],
    projects: ['proj-search-engine', 'proj-data-pipeline'],
    projectTechs: {
      'proj-search-engine': ['tech-elasticsearch', 'tech-kafka'],
      'proj-data-pipeline': ['tech-kafka', 'tech-aws', 'tech-elasticsearch'],
    },
    projectCompanies: { 'proj-search-engine': 'company-ecommerce', 'proj-data-pipeline': 'company-edtech' },
  },
  {
    id: 'candidate-010', name: 'Akin Bello', headline: 'Backend & Microservices Engineer', location: 'Remote', yearsExperience: 6,
    bio: 'Microservices advocate with strong experience in Node.js services, GraphQL APIs, and real-time systems.',
    skills: ['skill-nodejs', 'skill-graphql', 'skill-typescript', 'skill-postgresql'],
    projects: ['proj-auth-service', 'proj-notification-service'],
    projectTechs: {
      'proj-auth-service': ['tech-redis', 'tech-nodejs', 'tech-graphql'],
      'proj-notification-service': ['tech-kafka', 'tech-redis'],
    },
    projectCompanies: { 'proj-auth-service': 'company-saas', 'proj-notification-service': 'company-saas' },
  },
  {
    id: 'candidate-011', name: 'Priya Nair', headline: 'Cloud & Infrastructure Engineer', location: 'Nairobi, Kenya', yearsExperience: 8,
    bio: 'Infrastructure specialist with deep AWS expertise. Has deployed and maintained Kubernetes clusters handling 500k+ req/min.',
    skills: ['skill-aws', 'skill-kubernetes', 'skill-docker', 'skill-python'],
    projects: ['proj-devops-platform', 'proj-data-pipeline'],
    projectTechs: {
      'proj-devops-platform': ['tech-aws', 'tech-kubernetes', 'tech-docker'],
      'proj-data-pipeline': ['tech-aws', 'tech-kafka'],
    },
    projectCompanies: { 'proj-devops-platform': 'company-saas', 'proj-data-pipeline': 'company-edtech' },
  },
  {
    id: 'candidate-012', name: 'James Osei', headline: 'Software Engineer', location: 'Accra, Ghana', yearsExperience: 2,
    bio: 'Early-career engineer with solid React and Node.js fundamentals. Looking to join a team where I can grow fast.',
    skills: ['skill-react', 'skill-nodejs', 'skill-typescript'],
    projects: ['proj-learning-management'],
    projectTechs: {
      'proj-learning-management': ['tech-react', 'tech-nodejs', 'tech-postgresql'],
    },
    projectCompanies: { 'proj-learning-management': 'company-edtech' },
  },
];

// ─── Seed Functions ────────────────────────────────────────────────────────────

async function clearAll(session: ReturnType<typeof driver.session>) {
  console.log('🧹 Clearing existing data...');
  await session.run('MATCH (n) DETACH DELETE n');
}

async function seedSkills(session: ReturnType<typeof driver.session>) {
  console.log(`📚 Seeding ${skills.length} skills...`);
  for (const skill of skills) {
    await session.run(
      'MERGE (s:Skill {id: $id}) SET s.name = $name, s.category = $category',
      skill
    );
  }
}

async function seedTechnologies(session: ReturnType<typeof driver.session>) {
  console.log(`⚙️  Seeding ${technologies.length} technologies...`);
  for (const tech of technologies) {
    await session.run(
      'MERGE (t:Technology {id: $id}) SET t.name = $name, t.category = $category',
      tech
    );
  }
}

async function seedCompanies(session: ReturnType<typeof driver.session>) {
  console.log(`🏢 Seeding ${companies.length} companies...`);
  for (const company of companies) {
    await session.run(
      'MERGE (c:Company {id: $id}) SET c.name = $name, c.industry = $industry, c.location = $location',
      company
    );
  }
}

async function seedProjects(session: ReturnType<typeof driver.session>) {
  console.log(`🛠️  Seeding ${projects.length} projects...`);
  for (const project of projects) {
    await session.run(
      'MERGE (p:Project {id: $id}) SET p.name = $name, p.description = $description, p.domain = $domain',
      project
    );
  }
}

async function seedJobs(session: ReturnType<typeof driver.session>) {
  console.log(`💼 Seeding ${jobs.length} jobs...`);
  for (const job of jobs) {
    // Create job node
    await session.run(
      `MERGE (j:Job {id: $id})
       SET j.title = $title, j.description = $description,
           j.location = $location, j.employmentType = $employmentType`,
      { id: job.id, title: job.title, description: job.description, location: job.location, employmentType: job.employmentType }
    );

    // Link to company
    await session.run(
      `MATCH (j:Job {id: $jobId})
       MATCH (c:Company {id: $companyId})
       MERGE (j)-[:BELONGS_TO]->(c)`,
      { jobId: job.id, companyId: job.companyId }
    );

    // Link required skills
    for (const skillId of job.skills) {
      await session.run(
        `MATCH (j:Job {id: $jobId})
         MATCH (s:Skill {id: $skillId})
         MERGE (j)-[:REQUIRES_SKILL]->(s)`,
        { jobId: job.id, skillId }
      );
    }

    // Link technologies
    for (const techId of job.technologies) {
      await session.run(
        `MATCH (j:Job {id: $jobId})
         MATCH (t:Technology {id: $techId})
         MERGE (j)-[:USES_TECHNOLOGY]->(t)`,
        { jobId: job.id, techId }
      );
    }
  }
}

async function seedCandidates(session: ReturnType<typeof driver.session>) {
  console.log(`👤 Seeding ${candidates.length} candidates...`);
  for (const candidate of candidates) {
    // Create candidate node
    await session.run(
      `MERGE (c:Candidate {id: $id})
       SET c.name = $name, c.headline = $headline,
           c.location = $location, c.yearsExperience = $yearsExperience,
           c.bio = $bio`,
      {
        id: candidate.id,
        name: candidate.name,
        headline: candidate.headline,
        location: candidate.location,
        yearsExperience: candidate.yearsExperience,
        bio: candidate.bio,
      }
    );

    // Link skills
    for (const skillId of candidate.skills) {
      await session.run(
        `MATCH (c:Candidate {id: $candidateId})
         MATCH (s:Skill {id: $skillId})
         MERGE (c)-[:HAS_SKILL]->(s)`,
        { candidateId: candidate.id, skillId }
      );
    }

    // Link projects
    for (const projectId of candidate.projects) {
      await session.run(
        `MATCH (c:Candidate {id: $candidateId})
         MATCH (p:Project {id: $projectId})
         MERGE (c)-[:WORKED_ON]->(p)`,
        { candidateId: candidate.id, projectId }
      );

      // Link project to technologies
      const techs = candidate.projectTechs[projectId as keyof typeof candidate.projectTechs] ?? [];
      for (const techId of techs) {
        await session.run(
          `MATCH (p:Project {id: $projectId})
           MATCH (t:Technology {id: $techId})
           MERGE (p)-[:USES_TECHNOLOGY]->(t)`,
          { projectId, techId }
        );
      }

      // Link project to company
      const companyId = candidate.projectCompanies[projectId as keyof typeof candidate.projectCompanies];
      if (companyId) {
        await session.run(
          `MATCH (p:Project {id: $projectId})
           MATCH (co:Company {id: $companyId})
           MERGE (p)-[:FOR_COMPANY]->(co)`,
          { projectId, companyId }
        );
      }
    }

    console.log(`   ✓ ${candidate.name}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 TalentGraph Seed Script\n');
  console.log(`📡 Connecting to CognoDB at ${uri}...`);

  try {
    await driver.verifyConnectivity();
    console.log('✅ Connected to CognoDB\n');
  } catch (err) {
    console.error('❌ Failed to connect to CognoDB:', err);
    process.exit(1);
  }

  const session = driver.session({ database: 'neo4j' });

  try {
    await clearAll(session);
    await seedSkills(session);
    await seedTechnologies(session);
    await seedCompanies(session);
    await seedProjects(session);
    await seedJobs(session);
    await seedCandidates(session);

    console.log('\n✅ Seed complete!');
    console.log(`   ${skills.length} skills`);
    console.log(`   ${technologies.length} technologies`);
    console.log(`   ${companies.length} companies`);
    console.log(`   ${projects.length} projects`);
    console.log(`   ${jobs.length} jobs`);
    console.log(`   ${candidates.length} candidates\n`);
  } catch (err) {
    console.error('\n❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
