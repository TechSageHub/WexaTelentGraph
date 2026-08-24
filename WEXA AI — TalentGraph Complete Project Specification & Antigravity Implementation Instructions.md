# WEXA AI — TalentGraph

## Complete Project Specification & Antigravity Implementation Instructions

---

# 1. Project Overview

## Project Name

**TalentGraph**

## Assignment

WEXA AI — Take-Home Assignment: Build a Graph Database Application using CognoDB.

## Product Summary

TalentGraph is a recruiter-focused candidate discovery application backed by a graph database.

The application allows a recruiter to select a job and discover candidates based on interconnected information such as:

- Skills
- Previous projects
- Technologies used
- Companies worked with
- Job requirements

The application should not behave like a simple keyword search. Its main purpose is to demonstrate how graph relationships can uncover useful connections between candidates and jobs.

The application should also explain **why a candidate is considered a match**, making the graph traversal understandable to a non-technical user.

---

# 2. Assignment Objectives

The implementation must demonstrate that the developer can:

1. Design a meaningful graph data model.
2. Use CognoDB as the actual database layer.
3. Connect to CognoDB through the official Neo4j driver.
4. Write openCypher queries.
5. Perform multi-hop graph traversals.
6. Demonstrate a query that would be awkward to express in a relational database.
7. Use parameterized queries.
8. Build a complete functional web application.
9. Create a clean and intentional user interface.
10. Handle loading, empty and error states.
11. Structure the application cleanly.
12. Protect database credentials.
13. Provide realistic seed data.
14. Document the system clearly.
15. Deploy a working hosted application.

---

# 3. Why TalentGraph?

Traditional recruitment systems often focus on direct filtering:

> Candidate has Node.js → candidate matches Node.js job.

TalentGraph goes beyond direct matching.

A candidate might have:

```text
Candidate
    ↓
Worked on Project
    ↓
Project used Technology
    ↓
Technology is relevant to Job
```

or:

```text
Candidate
    ↓
Worked with Company
    ↓
Company worked with Technology
    ↓
Technology is required by Job
```

The graph allows these relationships to be traversed naturally.

The goal is not to claim that graph databases are always better than relational databases. Instead, TalentGraph deliberately chooses a problem where **relationships and paths are central to the question being answered**.

---

# 4. Target User

The primary user is a **recruiter or hiring manager**.

The user should not need to understand:

- Cypher
- Neo4j
- CognoDB
- Graph theory
- Database architecture

The interface must translate graph relationships into understandable recruitment information.

---

# 5. Core User Journey

The main user journey is:

```text
Open TalentGraph
       ↓
View available jobs
       ↓
Select a job
       ↓
View job requirements
       ↓
Click "Find Candidates"
       ↓
Backend executes graph queries
       ↓
Candidates are ranked/explained
       ↓
Recruiter views candidate matches
       ↓
Recruiter opens a candidate
       ↓
Recruiter sees why the candidate matches
       ↓
Recruiter explores relevant relationships
```

The main flow must be simple enough to demonstrate during the screen recording.

---

# 6. Core Features

## 6.1 Job Selection

The recruiter can:

- View available jobs.
- Select a job.
- See the job title.
- See company.
- See required skills.
- See relevant technologies.

## 6.2 Candidate Discovery

The recruiter can click:

**Find Candidates**

The system returns suitable candidates based on graph relationships.

Each candidate result should display:

- Candidate name
- Current/primary role
- Match percentage
- Matching skills
- Relevant technologies
- Relevant projects
- Short match explanation

## 6.3 Candidate Details

Clicking a candidate opens a detailed view containing:

- Candidate profile
- Skills
- Projects
- Technologies
- Companies
- Matching job
- Match explanation

## 6.4 Explainable Matching

The application must show understandable reasons for a match.

Example:

> **Why this candidate matches**

> Sarah has TypeScript and Node.js skills required by this role. She also worked on a payment platform that used PostgreSQL, which is one of the technologies associated with this position.

The explanation should be generated from actual graph query results rather than hardcoded for individual candidates.

---

# 7. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Node.js
- TypeScript
- Express

## Database

- CognoDB Cloud

## Database Driver

- Official Neo4j JavaScript driver

## Query Language

- openCypher

## Communication

```text
Frontend → REST API → Neo4j Driver → CognoDB
```

## Hosting

Use free hosting tiers where practical.

Recommended:

- Frontend: Vercel
- Backend: Render or another suitable free/low-cost hosting provider

The exact hosting provider may be changed if deployment constraints require it.

---

# 8. System Architecture

```text
┌───────────────────────────────┐
│        React Frontend         │
│                               │
│ Jobs / Candidates / Details   │
└───────────────┬───────────────┘
                │ HTTP
                ▼
┌───────────────────────────────┐
│      Node.js + Express        │
│                               │
│ Routes → Controllers →        │
│ Services → Graph Queries      │
└───────────────┬───────────────┘
                │
                │ Neo4j Driver
                ▼
┌───────────────────────────────┐
│          CognoDB Cloud        │
│                               │
│       Graph Database          │
└───────────────────────────────┘
```

The frontend must never connect directly to CognoDB.

All database operations must go through the backend.

---

# 9. Graph Data Model

The graph should contain the following primary node types.

## 9.1 Candidate

Properties:

```text
id
name
headline
location
yearsExperience
bio
```

Example:

```text
(:Candidate {
    id: "candidate-001",
    name: "Sarah Adeyemi",
    headline: "Backend Engineer",
    location: "Lagos, Nigeria",
    yearsExperience: 5
})
```

---

## 9.2 Skill

Properties:

```text
id
name
category
```

Examples:

- Node.js
- TypeScript
- Python
- React
- PostgreSQL
- Docker
- AWS

---

## 9.3 Job

Properties:

```text
id
title
description
location
employmentType
```

---

## 9.4 Project

Properties:

```text
id
name
description
domain
```

Examples:

- Payment Gateway
- E-commerce Platform
- Healthcare API
- Logistics Platform

---

## 9.5 Technology

Properties:

```text
id
name
category
```

Examples:

- Node.js
- PostgreSQL
- Redis
- Docker
- AWS

---

## 9.6 Company

Properties:

```text
id
name
industry
location
```

---

# 10. Graph Relationships

The primary relationships are:

```text
(Candidate)-[:HAS_SKILL]->(Skill)

(Candidate)-[:WORKED_ON]->(Project)

(Project)-[:USES_TECHNOLOGY]->(Technology)

(Project)-[:FOR_COMPANY]->(Company)

(Job)-[:REQUIRES_SKILL]->(Skill)

(Job)-[:USES_TECHNOLOGY]->(Technology)

(Job)-[:BELONGS_TO]->(Company)
```

Additional relationships may be introduced only if they improve the graph use case and can be clearly explained.

Do not add relationships simply to make the graph appear more complicated.

---

# 11. Graph Diagram

The README must contain a simple visual representation of the graph.

The final diagram should communicate something similar to:

```text
                    ┌───────────┐
                    │    Job    │
                    └─────┬─────┘
                          │
                    REQUIRES_SKILL
                          │
                          ▼
                    ┌───────────┐
                    │   Skill   │
                    └─────▲─────┘
                          │
                      HAS_SKILL
                          │
                    ┌─────┴─────┐
                    │ Candidate │
                    └─────┬─────┘
                          │
                      WORKED_ON
                          │
                          ▼
                    ┌───────────┐
                    │  Project  │
                    └─────┬─────┘
                          │
                  USES_TECHNOLOGY
                          │
                          ▼
                    ┌────────────┐
                    │Technology  │
                    └────────────┘
```

The actual README diagram can be implemented using Mermaid.

---

# 12. Seed Data

A seed script must be included in the repository.

The seed data should be realistic and intentionally connected.

Minimum recommended dataset:

- 10+ candidates
- 8+ skills
- 5+ jobs
- 10+ projects
- 8+ technologies
- 5+ companies

The exact quantity can be increased if useful, but the free CognoDB tier must be respected.

The data should create meaningful overlaps and paths.

For example:

```text
Sarah
 ├── HAS_SKILL → TypeScript
 ├── HAS_SKILL → Node.js
 └── WORKED_ON → Payment Gateway
                      ├── USES → PostgreSQL
                      └── USES → Redis
```

A job might require:

```text
Backend Engineer
 ├── REQUIRES → TypeScript
 ├── REQUIRES → Node.js
 └── USES → PostgreSQL
```

This creates meaningful graph relationships for matching.

---

# 13. Required Cypher Queries

The application must include actual Cypher queries in the repository.

Queries should be kept in a dedicated backend query/service layer.

---

## 13.1 List Jobs

Purpose:

Retrieve available jobs.

Concept:

```cypher
MATCH (j:Job)-[:BELONGS_TO]->(c:Company)
RETURN j, c
ORDER BY j.title
```

The implementation may return explicit properties rather than entire nodes where appropriate.

---

# 14. Direct Candidate Matching

Find candidates who possess skills required by a selected job.

Concept:

```cypher
MATCH (j:Job {id: $jobId})-[:REQUIRES_SKILL]->(s:Skill)
MATCH (c:Candidate)-[:HAS_SKILL]->(s)
RETURN c, collect(s.name) AS matchingSkills
```

The query must use a parameter:

```text
$jobId
```

Never construct Cypher by concatenating the job ID into the query string.

---

# 15. Multi-Hop Candidate Matching

The application must demonstrate a real multi-hop traversal.

The query should traverse multiple relationships.

Example conceptual path:

```text
Candidate
    ↓
WORKED_ON
    ↓
Project
    ↓
USES_TECHNOLOGY
    ↓
Technology
    ↓
Job
```

The exact relationship between Technology and Job should be based on the final schema.

The query should identify candidates whose project experience connects them to technologies relevant to a selected job.

The result should include enough information to explain the path.

Example result concept:

```text
Candidate:
Sarah Adeyemi

Path:
Sarah
→ Payment Gateway
→ PostgreSQL
→ Backend Engineer

Reason:
Candidate worked on a project using PostgreSQL,
which is required by the selected job.
```

---

# 16. Relationally Awkward Query

At least one query must demonstrate a graph problem that is awkward in a conventional relational model.

The chosen query should involve relationship traversal rather than simply matching a single attribute.

The preferred use case:

> Find candidates whose previous project experience connects them to technologies required by a selected job, and return the relationship path that explains the connection.

This requires traversing:

```text
Candidate
→ Project
→ Technology
→ Job
```

and potentially additional relevant relationships.

The purpose is to show that the graph is not being used merely as a replacement for a relational table.

---

# 17. Query Parameterization

All dynamic values must be passed as Cypher parameters.

Correct:

```javascript
session.run(query, {
  jobId
});
```

Incorrect:

```javascript
session.run(`
  MATCH (j:Job {id: "${jobId}"})
  RETURN j
`);
```

No user-controlled or dynamic value may be concatenated directly into Cypher.

---

# 18. Database Configuration

Connection details must come exclusively from environment variables.

Example:

```env
COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password
PORT=3000
```

The actual credentials must never be committed.

Include:

```text
.env.example
```

with placeholder values.

The real `.env` file must be included in `.gitignore`.

---

# 19. Database Connection

Use the official Neo4j JavaScript driver.

The backend should:

1. Read environment variables.
2. Create a Neo4j driver.
3. Verify connectivity.
4. Reuse the driver rather than creating a new driver for every request.
5. Close the driver gracefully when the application shuts down.

The application must not create a custom CognoDB SDK.

---

# 20. Backend Structure

Use a clean and understandable structure.

Recommended:

```text
backend/
├── src/
│   ├── config/
│   │   └── env.ts
│   │
│   ├── database/
│   │   └── neo4j.ts
│   │
│   ├── queries/
│   │   ├── jobs.queries.ts
│   │   ├── candidates.queries.ts
│   │   └── matching.queries.ts
│   │
│   ├── services/
│   │   ├── job.service.ts
│   │   ├── candidate.service.ts
│   │   └── matching.service.ts
│   │
│   ├── controllers/
│   │   ├── job.controller.ts
│   │   └── candidate.controller.ts
│   │
│   ├── routes/
│   │   ├── job.routes.ts
│   │   └── candidate.routes.ts
│   │
│   ├── middleware/
│   │   └── error.middleware.ts
│   │
│   └── server.ts
│
├── scripts/
│   └── seed.ts
│
└── package.json
```

Keep the architecture understandable.

Do not introduce unnecessary abstractions.

---

# 21. API

The backend should expose a small, clear REST API.

## GET /api/health

Purpose:

Verify API/database availability.

Response:

```json
{
  "status": "ok"
}
```

If CognoDB is unavailable, return an appropriate failure status.

---

## GET /api/jobs

Return available jobs.

---

## GET /api/jobs/:jobId

Return one job and its requirements.

---

## GET /api/jobs/:jobId/candidates

Return candidates matched to the selected job.

The response should contain:

```text
candidate
matchScore
matchingSkills
matchingTechnologies
projects
explanation
```

---

## GET /api/candidates/:candidateId

Return candidate details.

---

## GET /api/candidates/:candidateId/matches/:jobId

Return the candidate's relationship-based match explanation for a particular job.

---

# 22. API Error Handling

Use consistent error responses.

Example:

```json
{
  "error": {
    "message": "Unable to retrieve candidates"
  }
}
```

Do not expose:

- Database passwords
- Connection strings
- Internal stack traces
- Sensitive infrastructure details

---

# 23. Database Failure Handling

If CognoDB is unavailable:

The API must:

- Catch the database error.
- Return a useful HTTP status.
- Return a user-safe error message.
- Log enough information for debugging.
- Avoid crashing the entire server.

The frontend should display something such as:

> **Unable to connect to the talent database.**

> Please try again in a moment.

The UI must not display raw database exceptions.

---

# 24. Frontend Architecture

Recommended structure:

```text
frontend/
└── src/
    ├── components/
    │   ├── JobCard.tsx
    │   ├── JobSelector.tsx
    │   ├── CandidateCard.tsx
    │   ├── MatchScore.tsx
    │   ├── MatchExplanation.tsx
    │   ├── SkillBadge.tsx
    │   ├── LoadingState.tsx
    │   ├── EmptyState.tsx
    │   └── ErrorState.tsx
    │
    ├── pages/
    │   ├── Dashboard.tsx
    │   └── CandidateDetails.tsx
    │
    ├── services/
    │   └── api.ts
    │
    ├── types/
    │   └── index.ts
    │
    ├── App.tsx
    └── main.tsx
```

The exact structure can be adjusted if a simpler organization is more appropriate.

---

# 25. UI Design

The application should look like a real modern recruitment product.

Avoid:

- Generic unstyled forms.
- Excessive gradients.
- Unnecessary animations.
- Huge dashboard widgets.
- AI-looking filler text.
- Overly complicated navigation.

Prioritize:

- Clean spacing.
- Strong typography.
- Clear hierarchy.
- Consistent cards.
- Meaningful badges.
- Good empty states.
- Good loading states.
- Good error states.
- Responsive layout.
- Accessible contrast.
- Clear primary actions.

---

# 26. Main Dashboard

The dashboard should contain:

### Header

TalentGraph branding and concise product description.

### Job Selection

A recruiter can select a job.

### Selected Job

Show:

- Job title
- Company
- Location
- Required skills
- Relevant technologies

### Candidate Results

Show:

- Number of candidates
- Candidate cards
- Match score
- Matching skills
- Short explanation

---

# 27. Candidate Card

Each candidate card should contain:

```text
Candidate Name
Role
Location

92% Match

Matching Skills:
[Node.js] [TypeScript] [PostgreSQL]

Relevant Experience:
Payment Gateway

Why this candidate?
Short generated explanation.

[View Candidate]
```

The match percentage should be calculated from actual matching data.

Do not randomly assign scores.

---

# 28. Candidate Details

Candidate details should show:

- Name
- Role
- Experience
- Location
- Bio
- Skills
- Projects
- Technologies
- Companies
- Job match information

Include a visual relationship section if practical.

Example:

```text
Sarah Adeyemi
      │
      ▼
Payment Gateway
      │
      ▼
PostgreSQL
      │
      ▼
Backend Engineer
```

This visually communicates the graph concept to a non-technical recruiter.

---

# 29. Loading States

Every asynchronous operation that may take noticeable time must have a loading state.

Examples:

```text
Loading jobs...
Finding candidates...
Loading candidate profile...
```

Avoid leaving the screen blank.

---

# 30. Empty States

If a job has no matching candidates:

Display:

> **No matching candidates found**

> Try selecting another position or reviewing the job requirements.

Do not display an empty screen.

---

# 31. Error States

If an API or database operation fails:

Display a clear message and provide a retry action where appropriate.

Example:

> **Something went wrong**

> We couldn't retrieve candidate matches right now.

> [Try Again]

---

# 32. Match Score

The match score should be deterministic.

A simple scoring strategy is acceptable.

For example:

```text
Direct required skill match
+
Relevant technology match
+
Relevant project experience
```

The exact weighting should be documented in the README.

Do not build an unnecessarily complicated machine-learning model.

This assignment is about graph data modeling and engineering, not ML.

---

# 33. Explainability

The application should preserve the graph paths used to produce a match.

Instead of returning only:

```text
Sarah — 92%
```

return enough information to explain:

```text
Sarah matches 3 required skills.

She also worked on the Payment Gateway project,
which used PostgreSQL, a technology relevant to this job.
```

This is one of the application's main differentiators.

---

# 34. Seed Script

Create a script that:

1. Connects to CognoDB.
2. Creates the required graph data.
3. Can be run repeatedly without creating uncontrolled duplicates.
4. Uses parameterized queries.
5. Reports progress.
6. Reports failures clearly.

Recommended command:

```bash
npm run seed
```

The README must explain how to use it.

---

# 35. Idempotent Seed Data

The seed process should preferably use stable IDs and `MERGE` where appropriate.

Example concept:

```cypher
MERGE (c:Candidate {id: $id})
SET c.name = $name
```

Do not create duplicate data every time the seed script runs.

---

# 36. Testing

Testing should focus on important application behavior.

At minimum test:

### Backend

- Health endpoint.
- Jobs endpoint.
- Candidate matching.
- Parameterized query behavior.
- Error handling.

### Frontend

Test critical behavior such as:

- Jobs load.
- Job selection works.
- Candidate results render.
- Empty state renders.
- Error state renders.

Do not spend the majority of the 48-hour assignment building an enormous test suite.

---

# 37. README Requirements

The repository README must contain:

## Project Overview

Explain TalentGraph.

## Why a Graph Database?

Explicitly explain why CognoDB is appropriate.

## Features

List the application's major functionality.

## Architecture

Show:

```text
React → Express → Neo4j Driver → CognoDB
```

## Data Model

Include the graph diagram.

## Setup

Explain:

1. Create CognoDB account.
2. Create free instance.
3. Copy connection URI.
4. Save generated password.
5. Configure `.env`.
6. Install dependencies.
7. Run seed script.
8. Start backend.
9. Start frontend.

## Main Queries

Explain the important Cypher queries.

Especially:

- Direct matching.
- Multi-hop traversal.
- Relationally awkward query.

## Screenshots

Include screenshots of:

- Main dashboard.
- Candidate results.
- Candidate details.
- Graph/match explanation.

## Demo

Include the hosted application link.

## Screen Recording

Include the recording link if hosted externally.

---

# 38. CognoDB Setup Documentation

The README should explain that CognoDB:

- Uses openCypher.
- Uses Bolt.
- Can be accessed using the official Neo4j JavaScript driver.

The README should include the general setup process from the assignment without exposing any actual credentials.

---

# 39. Environment Variables

Use:

```env
COGNODB_URI=
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=
PORT=
```

Frontend configuration should contain only non-sensitive public values if required.

Never expose the CognoDB password to the frontend.

---

# 40. Git Requirements

The repository must not contain:

```text
.env
node_modules/
dist/
build/
```

Include:

```text
.env.example
.gitignore
```

The Git history must not contain database passwords or credentials.

---

# 41. Performance

The application is targeting the CognoDB free tier.

Therefore:

- Keep the dataset reasonable.
- Avoid unnecessary queries.
- Avoid fetching huge graphs.
- Return only required properties.
- Reuse database connections.
- Close sessions correctly.
- Avoid N+1 query patterns where possible.

---

# 42. Accessibility

The interface should include:

- Semantic HTML.
- Keyboard-accessible controls.
- Proper button labels.
- Meaningful form labels.
- Sufficient contrast.
- Visible focus states.

---

# 43. Responsive Design

The application should work reasonably on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

The primary demonstration will likely be desktop, but the UI should not break on smaller screens.

---

# 44. Security

Do not:

- Commit credentials.
- Expose database credentials.
- Concatenate Cypher queries.
- Trust arbitrary user input.
- Return raw database exceptions.

Do:

- Validate route parameters.
- Use parameterized Cypher.
- Keep database access on the backend.
- Use environment variables.
- Handle errors centrally.

---

# 45. Deployment

The application must have a hosted demo.

The final deployment should contain:

```text
Frontend
   ↓
Hosted Backend
   ↓
CognoDB Cloud
```

The hosted frontend must be able to communicate with the deployed backend.

CORS must be configured appropriately.

Do not expose CognoDB directly to the browser.

---

# 46. Demo Requirements

The assignment requires a short screen recording.

The recording should demonstrate the actual application.

Recommended length:

**2–5 minutes.**

Suggested flow:

### 00:00–00:20

Introduce TalentGraph and the problem.

### 00:20–00:50

Show available jobs.

### 00:50–01:20

Select a job and run candidate matching.

### 01:20–02:00

Show candidate results and match scores.

### 02:00–02:40

Open a candidate and show the explanation.

### 02:40–03:20

Demonstrate the graph relationship/multi-hop match.

### 03:20–03:50

Briefly explain why graph data modeling is useful here.

### 03:50–04:00

Conclude.

The demo should focus on the working product rather than a long code walkthrough.

---

# 47. What Must Be Demonstrable

Before submission, the application must demonstrate:

```text
Job
 ↓
Required Skills
 ↓
Candidate Matching
 ↓
Candidate Experience
 ↓
Projects
 ↓
Technologies
 ↓
Explainable Relationship
```

The user should be able to understand the value without seeing the source code.

---

# 48. Project Structure

Recommended final repository:

```text
wexa-talentgraph/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── scripts/
│   ├── queries/
│   ├── package.json
│   └── ...
│
├── screenshots/
│
├── .env.example
├── .gitignore
├── README.md
└── WEXA_PROJECT_SPEC.md
```

The implementation may differ slightly if there is a strong reason, but it must remain easy to understand.

---

# 49. Implementation Principles

Follow:

## KISS

Keep the implementation simple.

## DRY

Do not duplicate database or API logic.

## SRP

Services, controllers, database configuration and UI components should have clear responsibilities.

## YAGNI

Do not implement features that are not required.

## Maintainability

The code should be easy to explain during the WEXA interview.

---

# 50. Things We Must NOT Do

Do not:

- Replace CognoDB with PostgreSQL, MongoDB or another database.
- Fake graph functionality.
- Hardcode candidate results.
- Hardcode match scores.
- Use mock data in the production/demo path.
- Concatenate Cypher queries.
- Put CognoDB credentials in frontend code.
- Commit `.env`.
- Build unnecessary authentication.
- Build unnecessary AI features.
- Build an unnecessarily complex microservice architecture.
- Add features simply for visual complexity.
- Use excessive animations.
- Create a UI that looks like a generic AI-generated dashboard.
- Ignore database errors.
- Ignore loading states.
- Ignore empty states.
- Skip the required multi-hop query.
- Skip the relationally awkward query.
- Claim graph functionality that the code does not actually perform.

---

# 51. Antigravity Implementation Instructions

## IMPORTANT

You are implementing the **WEXA AI CognoDB Take-Home Assignment**.

This document is the **single source of truth** for the project.

Read the entire specification before beginning implementation.

Do not begin by immediately generating code.

First inspect the repository and understand the current state.

Then implement the application systematically.

---

# 52. Antigravity — Phase 1: Repository Inspection

Before changing anything:

1. Inspect all existing files.
2. Determine whether a project already exists.
3. Identify existing package managers.
4. Identify existing frontend/backend code.
5. Identify existing configuration.
6. Identify existing environment files.
7. Identify existing documentation.
8. Do not delete existing work without understanding it.

If the repository is empty, initialize the project according to this specification.

---

# 53. Antigravity — Phase 2: Architecture

Implement:

```text
React + TypeScript + Vite
            ↓
       REST API
            ↓
Node.js + Express + TypeScript
            ↓
    Official Neo4j Driver
            ↓
         CognoDB
```

Keep frontend and backend clearly separated.

Do not connect the frontend directly to CognoDB.

---

# 54. Antigravity — Phase 3: Database

Implement the CognoDB connection using the official Neo4j JavaScript driver.

Use:

```env
COGNODB_URI
COGNODB_USERNAME
COGNODB_PASSWORD
```

Create a reusable database connection.

Add a health check.

Ensure the application handles unavailable database connections gracefully.

---

# 55. Antigravity — Phase 4: Graph Model

Implement the graph model defined in this document.

Use stable IDs.

Create realistic relationships.

Ensure the graph contains enough interconnected data to demonstrate:

- Direct matching.
- Multi-hop traversal.
- Relationship-based explanations.

Do not create isolated nodes that do not contribute to the use case.

---

# 56. Antigravity — Phase 5: Seed Data

Create the seed script.

The script must:

- Connect to CognoDB.
- Create nodes.
- Create relationships.
- Use parameters.
- Avoid uncontrolled duplication.
- Log useful progress information.
- Fail clearly if the database connection is unavailable.

Add:

```bash
npm run seed
```

---

# 57. Antigravity — Phase 6: Cypher Queries

Create clearly named queries for:

1. List jobs.
2. Get job details.
3. Find direct candidate matches.
4. Perform multi-hop candidate discovery.
5. Generate match explanations.
6. Retrieve candidate details.
7. Retrieve graph relationships.

All dynamic values must be parameterized.

Do not concatenate values into Cypher.

---

# 58. Antigravity — Phase 7: Backend

Implement the REST API.

Create:

```text
GET /api/health
GET /api/jobs
GET /api/jobs/:jobId
GET /api/jobs/:jobId/candidates
GET /api/candidates/:candidateId
GET /api/candidates/:candidateId/matches/:jobId
```

Use clean service/controller separation.

Implement centralized error handling.

Return consistent JSON responses.

---

# 59. Antigravity — Phase 8: Frontend

Build the recruiter-facing application.

The main page must allow:

1. Selecting a job.
2. Viewing job requirements.
3. Finding candidates.
4. Viewing candidate results.
5. Opening candidate details.
6. Understanding why candidates matched.

The UI must feel complete and intentional.

---

# 60. Antigravity — Phase 9: UX Polish

Implement:

- Loading states.
- Empty states.
- Error states.
- Retry actions.
- Responsive design.
- Accessible controls.
- Clear navigation.
- Consistent spacing.
- Professional typography.
- Clear match indicators.

Do not add unnecessary visual effects.

---

# 61. Antigravity — Phase 10: Testing

Test the critical paths.

Verify:

- Backend starts.
- Frontend starts.
- Database connection works.
- Seed script works.
- Jobs load.
- Candidate matching works.
- Multi-hop query works.
- Candidate details work.
- Errors are handled.
- Empty results are handled.

Fix all obvious runtime errors before considering the implementation complete.

---

# 62. Antigravity — Phase 11: README

Create/update the README to satisfy every requirement in the WEXA assignment.

The README must include:

- Project description.
- Features.
- Why a graph database?
- Architecture.
- Graph diagram.
- Setup.
- CognoDB setup.
- Environment variables.
- Seed instructions.
- Run instructions.
- Important queries.
- Screenshots.
- Hosted demo link placeholder.
- Screen recording link placeholder.

Do not claim a hosted link exists until deployment has actually been completed.

---

# 63. Antigravity — Phase 12: Final Verification

Before finishing, verify every item below:

```text
[ ] CognoDB is actually used
[ ] Official Neo4j driver is used
[ ] Bolt connection works
[ ] Credentials come from environment variables
[ ] .env is ignored
[ ] .env.example exists
[ ] Seed script exists
[ ] Seed data is realistic
[ ] Graph model is documented
[ ] Graph diagram exists
[ ] Direct matching query works
[ ] Multi-hop query works
[ ] Relationally awkward query works
[ ] Queries are parameterized
[ ] Frontend works
[ ] Backend works
[ ] API works
[ ] Loading states exist
[ ] Empty states exist
[ ] Error states exist
[ ] Database failure is handled
[ ] Candidate explanations use actual graph data
[ ] Match scores are deterministic
[ ] README is complete
[ ] Screenshots are prepared
[ ] Application is ready for deployment
```

---

# 64. Final Antigravity Rules

You must prioritize:

1. Correctness.
2. Assignment compliance.
3. Real graph usage.
4. Maintainability.
5. UX quality.
6. Simplicity.

Do not over-engineer.

Do not add unnecessary technologies.

Do not introduce authentication unless required.

Do not introduce AI/LLM features unless they directly improve the core application and can be implemented without compromising the assignment.

The main evaluation is the graph data modeling, engineering quality, application functionality and UX.

---

# 65. Definition of Done

The project is complete only when:

A non-technical recruiter can open the application, select a job, discover candidates, inspect their matches and understand the relationship-based reason for each match.

At the same time, a technical reviewer must be able to inspect the repository and clearly identify:

- The graph model.
- The CognoDB connection.
- The seed script.
- The Cypher queries.
- The multi-hop traversal.
- The relationally awkward query.
- The parameterized queries.
- The backend architecture.
- The frontend architecture.
- The error handling.
- The deployment configuration.

The implementation must be something the developer can confidently explain line by line during the WEXA follow-up interview.

---

# 66. Final Deliverables

The final submission must contain:

1. GitHub repository.
2. Complete source code.
3. CognoDB seed script.
4. Cypher queries.
5. README.
6. Graph data model diagram.
7. Screenshots.
8. Hosted application.
9. Short screen recording.
10. Working CognoDB instance.

The submission email should use:

**Subject:**

`CognoDB Assignment 2 – <Your Name>`

Recipient:

`hr@wexa.ai`

The CognoDB instance should remain running after submission so WEXA can test the application against live data.

---

# 67. Final Development Philosophy

Build a **small but polished application** rather than a large unfinished system.

The strongest submission should make the reviewer immediately understand:

> **What problem does this solve?**

> **Why is this a graph problem?**

> **How does the graph model represent the problem?**

> **Where is CognoDB actually being used?**

> **What useful questions can the graph answer?**

> **Can the developer explain and defend the implementation?**

Every implementation decision should support those questions.

# END OF SPECIFICATION