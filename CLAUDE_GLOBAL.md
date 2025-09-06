# CLAUDE_GLOBAL.md — Global Engineering Assistant Guide (Docs/Ops)

This repository is the ChefMax documentation and operations hub. The application code lives in separate repositories. Use this guide when assisting in this repo or when coordinating changes across repos.

## Repositories

- Frontend (React + Vite + TypeScript): `https://github.com/systemadminlightinnoivationsla/chefmax-front`
- Backend (Node.js + Express + TypeScript): `https://github.com/systemadminlightinnoivationsla/chefmax-backend`

## Local Development Ports (standard)

- Frontend: `http://localhost:3000` (always 3000)
- Backend: `http://localhost:3001`
- Database: DigitalOcean PostgreSQL (do not run locally by default)

## Scope of this repository (Docs/Ops)

- Operational docs under `docs/` (e.g., `docs/DEPLOYMENT.md`)
- Deployment helpers in `scripts/`
  - Examples: `deploy-backend.sh`, `deploy-frontend.sh`, `deploy-full.sh`, `pre-deploy-check.sh`
- Optional infrastructure specs like `backend-update.yaml`
- Reference materials: `PUERTO_FRONTEND.md`, marketing/assets folders

This repo does not contain application code or `package.json` for back/front. Run builds and tests in the code repositories.

## DigitalOcean App Platform — Operations

Quick redeploy using App IDs (when apps already exist):

```bash
doctl apps create-deployment <FRONTEND_APP_ID> --wait
doctl apps create-deployment <BACKEND_APP_ID> --wait
```

Create/update from spec (backend example present in this repo):

```bash
doctl apps create --spec backend-update.yaml --wait
doctl apps list | cat
doctl apps get <APP_ID> | cat
doctl apps logs <APP_ID> --type build,deploy,run | cat
```

Health checks:

```bash
curl -f https://<backend-domain>/health
curl -f https://<frontend-domain>/
```

## Secrets & Configuration

- Never commit secrets. Configure env vars in DO App Platform.
- Backend minimal vars: `DATABASE_URL` (SSL), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT=3001`, `FRONTEND_URL`, `CORS_ORIGINS`.
- Frontend: `VITE_API_URL=https://<backend-domain>/api/v1`.

## Standard Operating Procedures (SOP)

1) Documentation updates
- Edit or add files under `docs/`. Keep README focused on repo purpose and links.
- If deployment details grow, move them from README to `docs/DEPLOYMENT.md` and link.

2) Deployment changes
- Prefer updating spec files (e.g., `backend-update.yaml`) or use DO dashboard.
- Use `doctl` to validate and apply. Capture the exact command in PR description.

3) Script maintenance
- Scripts in `scripts/` must not assume local `back/` or `front/` exist here.
- Parameterize URLs and spec paths via env vars (e.g., `BACKEND_URL`, `BACKEND_APP_SPEC`).

4) Ports and CORS
- Keep frontend at `3000` locally and backend at `3001`.
- Reflect origins in CORS lists and env vars.

## Commit & PR Guidelines (Docs/Ops)

- Concise, imperative commit messages, e.g., `docs: add doctl redeploy steps`, `ops: align backend spec`.
- PRs should: describe intent, list impacted files, include commands run (if any), and note follow-up steps.

## Quick Commands (reference)

```bash
# Auth and inventory
doctl auth init && doctl auth list | cat && doctl apps list | cat

# Backend: create/update via YAML
doctl apps create --spec backend-update.yaml --wait

# Logs
doctl apps logs <APP_ID> --type build,deploy,run | cat

# Health checks
curl -f "$BACKEND_URL/health" || true
curl -f "$FRONTEND_URL" || true
```

---

ChefMax LATAM — Global Docs/Ops Guidance for Claude Code