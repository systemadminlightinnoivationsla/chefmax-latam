# CLAUDE.md

This file provides guidance to Claude when working with code in this repository.

## Proceso de Despliegue (CI/CD Automatizado)

**El despliegue en este proyecto está 100% automatizado usando un flujo de CI/CD moderno.** No se deben usar scripts manuales, comandos `docker` locales o `doctl` para desplegar.

El proceso es el siguiente:

1.  **Desarrollo y Push:** El desarrollador hace `git push` a las ramas `main` o `develop`.
2.  **Integración Continua (CI):** GitHub Actions ejecuta automáticamente el workflow definido en `.github/workflows/ci.yml`.
    *   Este workflow tiene dos trabajos paralelos: `verify-backend` y `verify-frontend`.
    *   Cada trabajo instala dependencias, ejecuta el linter, el chequeo de tipos y las pruebas.
    *   **Si alguna de estas verificaciones falla, el proceso se detiene y el código no se despliega.**
3.  **Despliegue Continuo (CD):** Si la CI es exitosa, DigitalOcean App Platform detecta el cambio en la rama.
    *   DigitalOcean lee la configuración en `.do/app.yaml`.
    *   Automáticamente construye las imágenes Docker para el `api` (backend) y `web` (frontend) a partir de sus respectivos `Dockerfile`.
    *   Despliega las nuevas versiones de los servicios sin tiempo de inactividad.

**Tu única tarea es subir código de calidad que pase las pruebas. El resto es automático.**

---

## Development Commands

### Backend (Node.js + TypeScript)
```bash
cd back/
npm run dev           # Development server with hot reload
npm run build         # Compile TypeScript to dist/
npm start             # Run production server
npm test              # Run Jest tests
npm run lint          # ESLint check
npm run typecheck     # TypeScript type checking
```

### Frontend (React + Vite + TypeScript) 
```bash
cd front/
npm run dev             # Vite development server
npm run build           # Production build
npm run preview         # Preview production build
npm test                # Vitest tests
npm run lint            # ESLint check
npm run typecheck       # TypeScript type checking
```

### Database Operations (Backend)
```bash
cd back/
npm run db:migrate   # Run latest migrations
npm run db:rollback  # Rollback migrations  
npm run db:seed      # Run database seeds
# La base de datos de producción está en DigitalOcean y se conecta automáticamente.
```

## Project Structure

- `back/`: Backend API (Express + TypeScript + PostgreSQL)
- `front/`: Frontend SPA (React + TypeScript + Vite)
- `.github/workflows/ci.yml`: Workflow de Integración Continua.
- `.do/app.yaml`: Especificación de la aplicación para DigitalOcean App Platform.
- `GEMINI.md` / `CLAUDE.md`: Guías para los asistentes de IA.

## Environment Setup

### Required Environment Variables
Las variables de entorno **secretas** (como `DATABASE_URL`, `JWT_SECRET`, etc.) se configuran directamente en el panel de la App de DigitalOcean, en la sección de "Environment Variables" de cada servicio.

El archivo `.do/app.yaml` gestiona las variables no secretas, como la URL del backend para el frontend (`VITE_API_URL`).