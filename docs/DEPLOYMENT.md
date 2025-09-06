# Despliegue en DigitalOcean (App Platform)

Esta guía explica cómo desplegar y volver a desplegar el frontend y backend de ChefMax usando DigitalOcean App Platform. Este repositorio solo contiene documentación y scripts; el código vive en repos apartes.

## Prerrequisitos

- doctl instalado y autenticado
- Acceso a las Apps existentes en DigitalOcean

```bash
# Instalar doctl (Ubuntu/Debian)
snap install doctl

# macOS
brew install doctl

# Autenticación
doctl auth init
doctl auth list
doctl apps list
```

## Repositorios de Código

- Frontend: `https://github.com/systemadminlightinnoivationsla/chefmax-front`
- Backend: `https://github.com/systemadminlightinnoivationsla/chefmax-backend`

Los pipelines de despliegue (build/run) se definen en esos repos y en las Apps de DO.

## Redeploy rápido por App ID

Si la App ya existe en DO:

```bash
# Frontend (recomendada cuando solo hay cambios en el código del repo conectado)
doctl apps create-deployment <FRONTEND_APP_ID> --wait

# Backend
doctl apps create-deployment <BACKEND_APP_ID> --wait
```

Obtén IDs con:

```bash
doctl apps list | cat
doctl apps get <APP_ID> | cat
```

## Despliegue usando especificación YAML

Puedes crear/actualizar la App del backend con una especificación YAML. En este repo hay un ejemplo base en la raíz: `backend-update.yaml`.

```bash
# Crear/actualizar app del backend desde YAML
doctl apps create --spec backend-update.yaml --wait

# Ver estado y logs
doctl apps list | cat
doctl apps get <APP_ID> | cat
doctl apps logs <APP_ID> --type build,deploy,run | cat
```

Notas:
- Ajusta variables de entorno y orígenes CORS en el YAML antes de ejecutar.
- Si gestionas las Apps desde el dashboard, valida que los cambios del YAML se reflejen.

## Scripts útiles

En `scripts/` hay scripts de ayuda. Dado que este repo no contiene `back/` ni `front/`, los scripts que hacen `cd back`/`cd front` fallarán localmente. Úsalos como referencia o adáptalos:

- `pre-deploy-check.sh`: valida entorno (doctl, node, npm) y presencia de archivos. Útil como checklist.
- `deploy-backend.sh`: ejemplo de flujo para crear app backend desde `.do/backend-app.yaml`. En este repo, ajusta a `backend-update.yaml` o ejecuta directamente los comandos de esta guía.
- `deploy-frontend.sh`: ejemplo de flujo para frontend.
- `deploy-full.sh`: orquesta backend y frontend y ejecuta pruebas simples de salud.

Recomendación: copia estos scripts al repositorio de código correspondiente y ajústalos allí.

## Variables de entorno (referencia)

Configúralas en el dashboard de la App en DO:

Backend (mínimas):
- `DATABASE_URL` (PostgreSQL con SSL requerido)
- `REDIS_URL` (si aplica)
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `PORT=3001`, `FRONTEND_URL` y `CORS_ORIGINS` (URLs del frontend)

Frontend:
- `VITE_API_URL` apuntando a `https://<backend-domain>/api/v1`

## Verificación post-despliegue

```bash
# Backend
curl -f https://<backend-domain>/health

# Frontend
curl -f https://<frontend-domain>/
```

Si algo falla, revisa logs:

```bash
doctl apps logs <APP_ID> --type build,deploy,run | cat
```

---

ChefMax LATAM — Guía operativa de despliegue

