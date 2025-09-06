# Repository Guidelines

## Project Structure & Module Organization
- Backend: `back/` (TypeScript, Express, Knex). Source under `back/src/{routes,controllers,services,utils,database}`; tests in `back/src/tests/`.
- Frontend: `front/` (React, Vite, Tailwind). Source under `front/src/{components,pages,services,types,utils,styles}`; assets in `front/public/`.
- Ops: optional Redis in `docker-compose.dev.yml`; helper scripts in `scripts/`.

## Build, Test, and Development Commands
- Backend dev: `cd back && npm run dev` — starts API at `http://localhost:3001/api/v1`.
- Backend build/run: `npm run build` → `npm start`.
- Backend tests: `npm test`; watch: `npm run test:watch`.
- DB tasks (from `back/`): `npm run db:migrate | db:rollback | db:seed | db:reset`.
- Frontend dev: `cd front && npm run dev` — Vite at `http://localhost:3000`.
- Frontend build/preview: `npm run build` → `npm run preview`.
- Frontend tests: `npm test`; UI: `npm run test:ui`; coverage: `npm run test:coverage`.
- Optional services: `docker-compose -f docker-compose.dev.yml up -d redis`.

## Coding Style & Naming Conventions
- Language: TypeScript in both apps. Indentation: 2 spaces; semicolons required.
- Filenames: backend `kebab-case.ts` (e.g., `products.ts`); frontend components `PascalCase.tsx`.
- Naming: variables/functions `camelCase`; classes/types `PascalCase`; constants `SCREAMING_SNAKE_CASE`.
- Lint/format: Backend `npm run lint` / `npm run lint:fix`; Frontend `npm run lint` and `npm run format`. Type-check with `npm run typecheck` in both apps.

## Testing Guidelines
- Frameworks: Backend Jest; Frontend Vitest (use `jsdom` when needed).
- File patterns: backend `**/*.test.ts`; frontend `**/*.{test,spec}.ts(x)`.
- Coverage: aim ≥80% where practical (`front: npm run test:coverage`). Keep tests fast/deterministic; seed DB via Knex.

## Commit & Pull Request Guidelines
- Commits: concise, imperative (e.g., `back: add product routes`, `front: fix upload UI`). Group related changes.
- PRs: include scope (`back`/`front`), clear description, linked issues, and screenshots for UI. Note reproduction steps and test coverage.
- Keep diffs focused; update docs when changing env, scripts, or endpoints.

## Security & Configuration Tips
- Never commit secrets. Copy `back/.env.example` to `back/.env`; set `DATABASE_URL`. Frontend API origin in `front/.env` with `VITE_API_URL=http://localhost:3001/api/v1`.
- Local ports: frontend `3000`, backend `3001`. Use Redis locally if needed; avoid local Postgres unless testing.
- Validate inputs; prefer prepared queries via Knex. Review CORS and rate limits before exposure.

## Production (DigitalOcean)
- Backend/Frontend as separate apps. Set env vars: backend `DATABASE_URL`, `REDIS_URL` (if used), `JWT_SECRET`, `NODE_ENV=production`, `CORS_ORIGIN`; frontend `VITE_API_URL`.
- Verify via DO Console or `doctl` (e.g., `doctl apps get <APP_ID>`). Health-check: `GET /api/v1/health` on backend and load frontend.
