# AGENTS.md

TalentGraph: recruiter app that matches candidates to jobs via graph traversal in CognoDB (openCypher over Bolt, queried with the official `neo4j-driver`).

## Structure (3 deployable pieces)

- `frontend/` — React + Vite + Tailwind. Talks only to the REST API; never connects to CognoDB directly.
- `backend/` — Express + TS. `src/app.ts` builds the Express app (routes, middleware); `src/server.ts` owns the standalone server lifecycle (calls `initDriver()`); queries are in `src/queries/*.queries.ts`, logic in `src/services/*.service.ts`.
- `api/index.ts` — Vercel serverless entry. Its entire body is `export default app` importing from `../backend/src/app`. Keep `app.ts` serverless-compatible: it must not call `initDriver()` (uses lazy `getDriver()` in `src/database/neo4j.ts`).

README's project tree omits `api/index.ts`.

## Commands

Run in each package's own dir (no workspace tooling; root `package.json` wires `build`, `seed`, `type-check`, and `test` via `--prefix`).

- Backend dev: `npm run dev` → ts-node-dev on `http://localhost:3001`. Throws at startup if `COGNODB_URI`/`USERNAME`/`PASSWORD` are missing (`src/config/env.ts` uses `requireEnv`).
- Database seed: `npm run seed` (in `backend/`, or root). Idempotent — all nodes/relations use `MERGE`. Requires the same env vars.
- Frontend dev: `npm run dev` → Vite on `5173`. Vite proxies `/api` → `http://localhost:3001` (see `frontend/vite.config.ts`), so frontend `api.ts` defaults `VITE_API_URL` to `/api`.
- Type-check: `npm run type-check` (root, or in `backend/`/`frontend/`) = `tsc --noEmit` in both packages.
- Test: `npm run test` (root, or in `backend/`) → `vitest run`. Vitest is configured in `backend/` only; there are **no frontend tests** yet. Unit tests cover the pure helpers in `backend/src/services/match.util.ts`.
- Build: `npm run build` at root = frontend (`tsc && vite build`) then backend (`tsc` → `backend/dist/src/*`). NOTE: the backend output nests under `dist/src` (because `scripts/` shares the `./` rootDir), so `package.json` `main`/`start` point at `dist/src/server.js`.
- **No linter is configured.**

## Env & credentials

- Single `.env` at repo root (gitignored). Both `backend/src/config/env.ts` and `scripts/seed.ts` load it via the shared `src/config/loadEnv.ts`, which probes several relative paths up from `__dirname`/cwd.
- Node IDs are slug strings hardcoded in `backend/scripts/seed.ts` (e.g. `candidate-001`, `job-senior-backend`, `tech-graphql`) and used as path params in the API routes — do not invent new ID formats.
- Do not commit credentials. LIVE creds were removed from the README's Deployment section; keep it that way (placeholders only). CORS origins, if needed, come from `CORS_ORIGIN` env (comma-separated).

## Backend conventions

- All Cypher uses parameterized values — never string-concatenate input into queries.
- Hold meaningful Cypher offline: `src/queries/*.queries.ts` (exported query modules); services transform driver results to the response shapes.
- Match score is deterministic: `min(skillMatches × 15, 60) + min(techMatches × 8, 40)` (capped at 100). The pure functions `computeMatchScore`/`buildExplanation` live in `backend/src/services/match.util.ts` (unit-tested) and are re-exported by `matching.service.ts`. The frontend `CandidateDetails` displays the backend-computed `matchScore` — do not re-derive it client-side.
- Sessions: `getSession()` uses database `'neo4j'`; must be closed after use.
- Param validation: `src/middleware/validateParams.ts` rejects empty/missing `:id` params; `GET /api/jobs/:jobId/candidates` returns 404 when the job does not exist.

## Deployment

- `vercel.json` builds only the frontend (`cd frontend && npm install && npm run build`), sets `outputDirectory` to `frontend/dist`, and rewrites `/api/(.*)` → `api/index.ts`. Backend changes deploy through that single import, so the full Express app runs as a serverless function on Vercel.