# DigitalOcean App Platform Setup Guide

Esta guía te ayudará a desplegar ChefMax en DigitalOcean App Platform desde cero.

## 📋 Prerequisitos

1. **Cuenta de DigitalOcean**: [Crear cuenta](https://cloud.digitalocean.com/registrations/new)
2. **doctl CLI**: [Instalar doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/)
3. **Repositorio sincronizado**: ✅ Ya completado

## 🚀 Despliegue Automático (Recomendado)

### Paso 1: Configurar doctl
```bash
# Instalar doctl (si no está instalado)
# macOS: brew install doctl
# Windows: scoop install doctl
# Linux: ver documentación de DO

# Autenticarse
doctl auth init
```

### Paso 2: Desplegar ChefMax
```bash
# Ejecutar script de deployment
./scripts/deploy-do.sh
```

Este script:
- ✅ Verifica prerequisitos
- 🏗️ Crea la aplicación en DigitalOcean
- 🔧 Configura servicios backend y frontend
- 📊 Muestra información de deployment

### Paso 3: Configurar Secrets
```bash
# Ver guía de secrets
./scripts/setup-secrets.sh <APP_ID>
```

## 🔧 Configuración Manual (Alternativa)

### 1. Crear App en DigitalOcean Dashboard

1. Ve a [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Selecciona **"GitHub"** como fuente
4. Conecta tu repositorio: `systemadminlightinnoivationsla/chefmax-latam`
5. Branch: `main`
6. **Importante**: En lugar de configurar manualmente, sube el app spec:
   - Click **"Edit Your App Spec"**
   - Reemplaza el contenido con `.do/app.yaml`
   - Click **"Save"**

### 2. Configurar Variables de Entorno

En el dashboard de tu app, ve a **Settings > Environment Variables**:

#### Backend Service (api):
| Variable | Valor | Tipo |
|----------|-------|------|
| `DATABASE_URL` | `postgresql://user:pass@host:port/db?sslmode=require` | SECRET |
| `JWT_SECRET` | Genera: `openssl rand -hex 32` | SECRET |
| `JWT_REFRESH_SECRET` | Genera: `openssl rand -hex 32` | SECRET |
| `REDIS_URL` | `redis://host:port` | SECRET |
| `SPACES_ACCESS_KEY` | Tu access key de DO Spaces | SECRET |
| `SPACES_SECRET_KEY` | Tu secret key de DO Spaces | SECRET |

#### Frontend Service (web):
- ✅ Auto-configurado por el app spec

## 🗄️ Base de Datos

### Opción 1: Crear nueva database (Incluida en app spec)
El app spec incluye una database PostgreSQL que se creará automáticamente.

### Opción 2: Usar database existente
Si ya tienes una database de DigitalOcean:
1. Quita la sección `databases` del app spec
2. Configura `DATABASE_URL` con tu connection string existente

## 📦 DigitalOcean Spaces (Storage)

Para almacenamiento de archivos:
1. Ve a [DigitalOcean Spaces](https://cloud.digitalocean.com/spaces)
2. Crea un Space llamado `chefmax-media` en `nyc3`
3. Genera API Keys en **API > Spaces Keys**
4. Configura las variables `SPACES_ACCESS_KEY` y `SPACES_SECRET_KEY`

## 🔄 Updates y Re-deployments

### Deployment Automático
- ✅ Ya configurado: cada push a `main` despliega automáticamente

### Deployment Manual
```bash
# Listar apps para obtener APP_ID
doctl apps list

# Crear nuevo deployment
./scripts/update-deployment.sh <APP_ID>
```

## 📊 Monitoreo

### Ver estado de la app
```bash
doctl apps get <APP_ID>
```

### Ver logs en tiempo real
```bash
doctl apps logs <APP_ID> --follow
```

### Dashboard web
- [DigitalOcean Apps Dashboard](https://cloud.digitalocean.com/apps)

## 🐛 Troubleshooting

### Build Failures
1. Verifica que el repositorio tiene los archivos necesarios:
   - ✅ `back/package.json`
   - ✅ `back/Dockerfile`
   - ✅ `front/package.json`
   - ✅ `front/Dockerfile`

2. Check logs: `doctl apps logs <APP_ID> --type build`

### Runtime Errors
1. Verifica environment variables están configuradas
2. Check health endpoint: `https://your-api-url/health`
3. Ver logs: `doctl apps logs <APP_ID> --type run`

### Database Connection Issues
- Verifica `DATABASE_URL` tiene formato correcto
- Asegúrate que SSL está habilitado (`?sslmode=require`)

## 💰 Costos Estimados

- **Backend**: basic-xxs (~$5/mes)
- **Frontend**: basic-xxs (~$5/mes)  
- **Database**: db-s-1vcpu-1gb (~$15/mes)
- **Total**: ~$25/mes

## 🆘 Support

- [DigitalOcean Docs](https://docs.digitalocean.com/products/app-platform/)
- [doctl Reference](https://docs.digitalocean.com/reference/doctl/)
- [Community Support](https://www.digitalocean.com/community/)