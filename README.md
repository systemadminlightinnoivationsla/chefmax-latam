# ChefMax - Repositorio de Documentación y Operaciones (Docs/Ops)

Este repositorio contiene documentación operativa, guías y scripts de despliegue para el ecosistema ChefMax. El **código fuente** del frontend y backend vive en repositorios separados.

## 🔗 Repositorios de Código

- Frontend (React + Vite + TypeScript): `https://github.com/systemadminlightinnoivationsla/chefmax-front`
- Backend (Node.js + Express + TypeScript): `https://github.com/systemadminlightinnoivationsla/chefmax-backend`

## 📁 Qué contiene este repositorio

- `scripts/`: scripts de despliegue y validación (DigitalOcean App Platform)
- `docker-compose.dev.yml`: servicio opcional de Redis para pruebas locales
- `docs/`: documentación operacional (por ejemplo, despliegue)
- `formats/`, `cotizaciones/`, `marketing/`, `products/`: activos auxiliares
- `PUERTO_FRONTEND.md`: nota crítica sobre puertos en desarrollo local

## 🧭 Cómo usar este repositorio

1. Revisa la guía de despliegue en `docs/DEPLOYMENT.md`.
2. Usa los scripts en `scripts/` para validar prerequisitos o disparar redeploys.
3. Para desarrollo local, clona y trabaja desde los repos de código enlazados arriba.

## 🏗️ Arquitectura (alto nivel)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React + Vite  │◄──►│  Express + TS   │◄──►│  PostgreSQL     │
│                  │    │  + Redis/Spaces │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

Detalles técnicos, endpoints, pruebas y configuración viven en cada repositorio de código.

## 📚 Documentación

- Guía de despliegue: `docs/DEPLOYMENT.md`
- Diagramas de flujo detallados: `docs/DIAGRAMAS_FLUJO.md`

## 🚀 Despliegue (DigitalOcean)

- Consulta `docs/DEPLOYMENT.md` para:
  - Requisitos (doctl, autenticación)
  - Redeploy por App ID (`FRONTEND_APP_ID`, `BACKEND_APP_ID`)
  - Despliegue por archivo de especificación (por ejemplo, `backend-update.yaml`)
  - Comandos de validación y verificación de estado

## 🔌 Puertos en Desarrollo Local

- Frontend: `http://localhost:3000` (SIEMPRE 3000)
- Backend: `http://localhost:3001`
- Base de Datos: DigitalOcean PostgreSQL (no se levanta local)

Para detalles y checklist, ver `PUERTO_FRONTEND.md`.

## 🔐 Seguridad y Configuración

- No se deben versionar secretos. Usa variables de entorno en la plataforma (DigitalOcean) o almacenes seguros.
- Los ejemplos de tokens/IDs en la documentación son placeholders o valores públicos de referencia.

## 🤝 Contribuir

- Propón mejoras de documentación vía Pull Request.
- Cambios de código se gestionan en los repos de frontend/backend.

## 📄 Licencia

- La licencia del software se publica en los repos de código (`chefmax-front`, `chefmax-backend`).

## 🆘 Soporte

- Email: dev@chefmaxlatam.com
- Issues: abrir en el repositorio correspondiente (frontend/backend) o aquí para temas de operaciones.

---

**ChefMax Team** — Documentación y operaciones del sistema ChefMax. 🍽️⚡
