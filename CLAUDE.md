# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

ChefMax is a full-stack inventory management system built as a monorepo with:
- **Backend**: Node.js + TypeScript + Express + PostgreSQL (port 3001)
- **Frontend**: React + TypeScript + Vite (port 3000 in development)
- **Database**: DigitalOcean PostgreSQL (cloud-only, no local DB)
- **Deployment**: DigitalOcean App Platform with GitHub Actions CI/CD

Key architectural components:
- **Excel Processing**: Multi-format Excel file processing with automatic format detection
- **Media Management**: Integration with DigitalOcean Spaces for file storage
- **Authentication**: JWT-based auth with refresh tokens and role-based access
- **Real-time Features**: Socket.IO for live updates
- **Multi-tenant**: Supports multiple supplier formats and admin roles

## Deployment Process (Automated CI/CD)

**Deployment is 100% automated** - do not use manual scripts, local docker commands, or doctl.

1. **Push to `main` or `develop`** triggers GitHub Actions CI (.github/workflows/ci.yml)
2. **CI verifies**: lint, typecheck, tests for both backend and frontend in parallel
3. **If CI passes**: DigitalOcean App Platform auto-deploys using .do/app.yaml configuration
4. **Zero downtime**: Docker images built and deployed automatically

**Your only task is to push quality code that passes tests. Everything else is automatic.**

## Critical Development Notes

**Frontend Development**: Always runs on port 3000 (configured in vite.config.ts)
**Database**: Always use DigitalOcean PostgreSQL - no local database setup required
**CI/CD Troubleshooting**: If GitHub Actions fail with `npm ci` errors, ensure directories aren't configured as git submodules

## Development Commands

### Backend (Node.js + TypeScript)
```bash
cd back/
npm run dev           # Development server with hot reload
npm run build         # Compile TypeScript to dist/
npm run lint          # ESLint check  
npm run typecheck     # TypeScript type checking
npm test              # Run Jest tests
npm run db:migrate    # Run database migrations (connects to DigitalOcean)
npm run db:seed       # Populate database with sample data
```

### Frontend (React + Vite + TypeScript)
```bash
cd front/
npm run dev           # Vite development server (always port 3000)
npm run build         # Production build
npm run lint          # ESLint check
npm run typecheck     # TypeScript type checking  
npm test              # Vitest tests
```

## Key File Locations

- **Backend Source**: `back/src/` (server.ts, controllers/, services/, models/)
- **Frontend Source**: `front/src/` (App.tsx, components/, pages/, services/)
- **Database Config**: `back/knexfile.js` (configured for DigitalOcean PostgreSQL)
- **CI Configuration**: `.github/workflows/ci.yml`
- **Deployment Config**: `.do/app.yaml`
- **Excel Processors**: `back/src/processors/` (handles multi-format Excel files)
- **Media Services**: `back/src/services/` (DigitalOcean Spaces integration)

## Authentication Architecture

The system uses JWT-based authentication with refresh tokens:
- **Login/Register**: `back/src/controllers/authController.ts`
- **Middleware**: `back/src/middleware/` (auth, role-based access)
- **User Models**: `back/src/models/User.ts`
- **Frontend Auth**: `front/src/contexts/AuthContext.tsx`

## Excel Processing System

ChefMax's core feature is intelligent Excel processing:
- **Format Detection**: `back/src/services/formatDetector.ts`
- **Processors**: `back/src/processors/` (different supplier formats)
- **Upload Interface**: `front/src/components/` (drag-drop Excel upload)