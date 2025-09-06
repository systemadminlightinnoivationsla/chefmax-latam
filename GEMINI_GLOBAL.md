# GEMINI_GLOBAL.md — Global Engineering Assistant Guide (Docs/Ops)

This repository serves as the ChefMax documentation and operations hub. Use this guide when assisting with ops tasks and coordination across the separate code repositories.

## Repositories

- Frontend (React + Vite + TypeScript): `https://github.com/systemadminlightinnoivationsla/chefmax-front`
- Backend (Node.js + Express + TypeScript): `https://github.com/systemadminlightinnoivationsla/chefmax-backend`

## Local Development Ports (standard)

- Frontend: `http://localhost:3000` (always 3000)
- Backend: `http://localhost:3001`
- Database: DigitalOcean PostgreSQL (cloud)

## Scope of this repository

- Documentation under `docs/` (e.g., `docs/DEPLOYMENT.md`)
- Deployment and validation scripts in `scripts/`
- Cloud app specs (e.g., `backend-update.yaml`)
- Reference/auxiliary assets (formats, marketing, products)

No application code is present here; all builds/tests run in the code repos.

## DigitalOcean App Platform — Operations

Redeploy existing apps by App ID:

```bash
doctl apps create-deployment <FRONTEND_APP_ID> --wait
doctl apps create-deployment <BACKEND_APP_ID> --wait
```

Create/update from spec:

```bash
doctl apps create --spec backend-update.yaml --wait
doctl apps get <APP_ID> | cat
doctl apps logs <APP_ID> --type build,deploy,run | cat
```

Verify:

```bash
curl -f https://<backend-domain>/health
curl -f https://<frontend-domain>/
```

## Secrets & Env Vars

- Configure secrets in DO; never commit them.
- Backend essentials: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT=3001`, `FRONTEND_URL`, `CORS_ORIGINS`.
- Frontend: `VITE_API_URL` pointing to backend `/api/v1`.

## SOP for Ops Changes

1) Documentation
- Put detailed procedures in `docs/` and keep `README.md` concise with links.

2) Spec-driven deployments
- Adjust spec files and run `doctl` locally; document the exact commands in PRs.

3) Script behavior
- Ensure scripts don’t assume `back/` or `front/` in this repo.
- Allow overriding URLs and spec paths via env vars.

4) Ports & Networking
- Ensure local ports remain `3000` (front) and `3001` (back); align CORS.

## PR & Review Checklist

- Purpose of change is clearly stated
- Impacted files listed
- Secrets handled via platform env vars
- Commands/IDs used are included for reproducibility
- Follow-ups noted (DNS, SSL, migrations)

## Handy Commands

```bash
doctl auth init && doctl apps list | cat
doctl apps create --spec backend-update.yaml --wait
doctl apps logs <APP_ID> --type build,deploy,run | cat
curl -f "$BACKEND_URL/health" || true
curl -f "$FRONTEND_URL" || true
```

---

ChefMax LATAM — Global Docs/Ops Guidance for Google Gemini

