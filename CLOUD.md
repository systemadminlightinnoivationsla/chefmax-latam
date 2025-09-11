# ☁️ ChefMax LATAM - Infraestructura Cloud y Deployment

**Versión**: 1.0.0  
**Última actualización**: 2025-09-08  
**Proveedor**: DigitalOcean App Platform

## 🏗️ Arquitectura Cloud Actual

### 📊 Servicios Desplegados en DigitalOcean

| Servicio | App ID | Región | Estado | URL Producción | Rama |
|----------|--------|--------|--------|----------------|------|
| **Frontend** | `b23ecd24-20f7-4e08-ad48-186d8c4c69ed` | nyc1 | ✅ ACTIVE | https://chefmax-frontend-new-tkenl.ondigitalocean.app | design-improvements-safe |
| **Backend** | `befe156a-6af6-44ca-9eaf-29fc8cadfa59` | nyc1 | ✅ ACTIVE | https://chefmax-backend-zcmdg.ondigitalocean.app | clean-master |
| **Database** | `app-21ebb1ce-d67d-4536-89d4-e80873d931ea` | nyc3 | ✅ ONLINE | PostgreSQL v17 (10GB) | N/A |

### 🔧 Configuración de Repositorios GitHub

| Repositorio | URL | Rama Deploy | Auto-Deploy |
|------------|-----|-------------|-------------|
| **Frontend** | `systemadminlightinnoivationsla/chefmax-front` | main | ✅ Habilitado |
| **Backend** | `systemadminlightinnoivationsla/chefmax-backend` | main | ✅ Habilitado |
| **Principal** | Local development repository | main | Manual |

---

## 🚀 NUEVO PROCESO DE DEPLOYMENT CONTROLADO

### 📋 Protocolo Obligatorio

A partir de **2025-09-08**, **TODOS** los deployments a producción deben seguir este proceso:

#### 1️⃣ Script Master de Deployment
```bash
# ÚNICO COMANDO AUTORIZADO PARA PRODUCCIÓN
./scripts/deploy-controlled.sh
```

Este script ejecuta automáticamente:
- ✅ Validación y merge de ramas de desarrollo
- ✅ Validación de builds y dependencias  
- ✅ Deployment secuencial (Backend → Frontend)
- ✅ Validación post-deployment completa
- ✅ Documentación automática
- ✅ Rollback automático en caso de fallo

#### 2️⃣ Scripts de Validación Individual
```bash
# Validar ramas antes del merge (opcional)
./scripts/validate-branches.sh

# Validar estado de producción (opcional)  
./scripts/validate-production.sh
```

### 🛡️ Control de Ramas

#### Estado de Ramas de Desarrollo (Pre-Merge)
| Repositorio | Rama Desarrollo | Estado | Cambios Pendientes |
|-------------|----------------|--------|--------------------|
| **chefmax** (principal) | HEAD detached | 🔄 Requiere checkout a main | Sí |
| **Frontend** | design-improvements-safe | 🔍 Pendiente validación | Sí |
| **Backend** | clean-master | 🔍 Pendiente validación | Sí |

#### Criterios de Aprobación para Merge
- ✅ **APROBADO**: Mejoras sustanciales, código limpio, sin conflictos críticos
- ❌ **RECHAZADO**: Código temporal, conflictos irresolubles, vulnerabilidades

### 🔄 Secuencia de Deployment

1. **Validación de Ramas** (2-3 min)
   - Análisis de commits pendientes
   - Detección de conflictos
   - Merge controlado a `main`

2. **Pre-Deploy Validation** (3-5 min)  
   - Build validation (frontend + backend)
   - Dependencies check
   - Configuration validation

3. **Backend Deployment** (30-40s)
   - Deploy to DigitalOcean App Platform
   - Health check validation
   - Auto-rollback on failure

4. **Frontend Deployment** (30-40s)
   - Deploy to DigitalOcean App Platform  
   - Accessibility validation
   - Integration testing

5. **Post-Deploy Validation** (1-2 min)
   - API endpoint testing
   - Database connectivity
   - Performance validation
   - Documentation auto-update

**⏱️ Tiempo Total Estimado**: 7-10 minutos

---

## 📊 Historial de Deployments

### Template de Registro Automático
Cada deployment se registra automáticamente en `DEPLOYMENT_CONTROL.md`:

```markdown
### Deployment DEP20250908_HHMMSS
- **Fecha**: YYYY-MM-DD HH:MM → HH:MM  
- **Rama Frontend**: [branch] → main
- **Rama Backend**: [branch] → main
- **Features**: Auto-detected + manual review required
- **Resultado**: ✅ EXITOSO / ❌ FALLIDO
- **URLs**: Frontend ✅ | Backend ✅ | API ✅
- **Tiempo**: XX segundos
```

### Deployments Ejecutados

#### ✅ Último Deployment Ejecutado
- **ID**: `DEP20250908_040019` 
- **Fecha**: 2025-09-08 04:00:19 UTC
- **Ramas**: `design-improvements-safe` + `clean-master` → **PRODUCCIÓN**
- **Features**: Sistema deployment controlado + Landing improvements + Backend estabilización
- **Estado**: **✅ EXITOSO EN PRODUCCIÓN**
- **Apps Deployadas**: 
  - Frontend: `84a66a28-df24-46d6-ad34-484488b9b810`
  - Backend: `2024c8f5-c95f-405d-8ab5-8dd77fa1244a`
- **URLs Validadas**: ✅ Ambos servicios funcionando correctamente

---

## 🚨 Procedimientos de Emergencia

### Rollback Automático
El sistema incluye rollback automático en caso de:
- ❌ Fallo en health checks
- ❌ Timeout en deployment  
- ❌ Validación post-deploy fallida

### Rollback Manual
```bash
# Identificar último deployment estable
doctl apps list-deployments [APP_ID]

# Rollback específico
doctl apps create-deployment [APP_ID] --deployment-id [STABLE_ID] --wait

# Validar rollback
./scripts/validate-production.sh
```

### Escalation Matrix
1. **Nivel 1**: Script automático (auto-rollback)
2. **Nivel 2**: Desarrollador ejecutante  
3. **Nivel 3**: Technical Lead
4. **Nivel 4**: DevOps/Infrastructure

---

## 🔐 Configuración de Seguridad

### Variables de Entorno Secretas (DO Dashboard)
```bash
# Backend
DATABASE_URL=postgresql://[HIDDEN]
JWT_SECRET=[HIDDEN]
REDIS_URL=[HIDDEN]
SPACES_ACCESS_KEY=[HIDDEN]
SPACES_SECRET_KEY=[HIDDEN]

# Frontend  
VITE_API_URL=https://chefmax-backend.ondigitalocean.app/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=[HIDDEN]
```

### Headers de Seguridad Configurados
- ✅ HTTPS enforced
- ✅ CORS configurado para dominios específicos
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet security headers
- ✅ Express validator

---

## 📈 Monitoreo y Observabilidad

### URLs de Monitoreo
- **DigitalOcean Dashboard**: https://cloud.digitalocean.com/apps
- **Frontend Status**: https://chefmax-frontend-new-tkenl.ondigitalocean.app
- **Backend Health**: https://chefmax-backend-zcmdg.ondigitalocean.app/health
- **API Documentation**: https://chefmax-backend-zcmdg.ondigitalocean.app/api-docs

### Comandos de Monitoreo
```bash
# Estado general
doctl apps list

# Logs en tiempo real
doctl apps logs [APP_ID] --follow

# Deployments recientes  
doctl apps list-deployments [APP_ID]

# Métricas básicas
curl -f https://chefmax-backend.ondigitalocean.app/health
```

### Alertas Configuradas
- 🚨 App status changes (ACTIVE → ERROR)
- 🚨 Deployment failures
- 📊 Response time > 5 segundos
- 📊 Error rate > 5%

---

## 💰 Costos y Optimización

### Recursos Actuales
| Servicio | Tamaño | Costo Estimado/mes |
|----------|--------|--------------------|
| Frontend Static Site | N/A | $0 (dentro del plan) |
| Backend App | basic-xxs (512MB RAM) | ~$5 |
| Database | db-s-1vcpu-1gb (10GB) | ~$15 |
| **Total Estimado** | | **~$20/mes** |

### Optimizaciones Implementadas
- ✅ Static site hosting para frontend (sin costo server)
- ✅ Smallest backend instance size (auto-scaling)
- ✅ Shared database instance  
- ✅ CDN integrado de DigitalOcean

---

## 🔧 Comandos Útiles de Administración

### Gestión de Apps
```bash
# Listar todas las aplicaciones
doctl apps list

# Detalles de una app específica
doctl apps get [APP_ID]

# Crear nuevo deployment  
doctl apps create-deployment [APP_ID] --wait

# Ver spec de configuración
doctl apps spec get [APP_ID] > current-spec.yaml
```

### Gestión de Base de Datos
```bash
# Estado de la base de datos
doctl databases list

# Conexión directa
doctl databases connection [DB_ID]

# Backup manual
doctl databases backups list [DB_ID]
```

### Logs y Debugging
```bash
# Logs completos
doctl apps logs [APP_ID] --type build,deploy,run

# Logs de deployment específico
doctl apps logs [APP_ID] --deployment [DEPLOYMENT_ID]

# Filtrar logs por timestamp
doctl apps logs [APP_ID] --since 2025-09-08T00:00:00Z
```

---

## 📚 Documentación Relacionada

### Documentos del Proyecto
- 📋 `DEPLOYMENT_CONTROL.md` - Control maestro de deployments
- 📖 `README.md` - Documentación general del proyecto  
- 🛠️ `CLAUDE.md` - Guía técnica para desarrollo
- 🔄 `ROLLBACK_POINTS.md` - Puntos de restauración

### Recursos Externos
- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [doctl CLI Reference](https://docs.digitalocean.com/reference/doctl/)
- [PostgreSQL en DigitalOcean](https://docs.digitalocean.com/products/databases/postgresql/)

---

## 📞 Contactos y Soporte

### Equipo Técnico
- **Technical Lead**: [DEFINIR]
- **DevOps Lead**: [DEFINIR]  
- **Database Admin**: [DEFINIR]

### Soporte DigitalOcean
- **Plan**: Basic/Standard
- **Soporte**: Ticket-based  
- **SLA**: 99.5% uptime

---

## 🔄 Actualizaciones del Documento

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-09-08 | 1.0.0 | Creación inicial del documento cloud |
| | | Implementación del sistema de deployment controlado |
| | | Configuración de procedimientos de rollback |

---

**⚠️ IMPORTANTE**: Este documento debe actualizarse después de cada deployment o cambio en la infraestructura cloud.

**🔒 ACCESO**: Solo personal autorizado debe ejecutar deployments de producción usando los scripts establecidos.