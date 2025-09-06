# ChefMax - Sistema de Gestión de Inventarios Multi-Formato

ChefMax es un sistema completo de gestión de inventarios diseñado específicamente para proveedores de equipos de restaurante. El sistema permite procesar archivos Excel de múltiples proveedores con diferentes formatos y unificarlos en un inventario centralizado con gestión de medios y funcionalidades administrativas avanzadas.

## 🚀 Características Principales

### Sistema de Procesamiento Excel Multi-Formato
- **Detección automática** de formatos de diferentes proveedores
- **Procesamiento inteligente** de archivos Excel con validación de datos
- **Soporte multi-pestaña** para archivos complejos
- **Limpieza automática** de precios y formatos de datos
- **Reportes detallados** de procesamiento con errores y advertencias

### Gestión de Inventario Moderna
- **Interfaz administrativa** con pestañas para carga y gestión
- **CRUD completo** de productos con validación en tiempo real
- **Sistema de búsqueda** y filtros avanzados
- **Paginación eficiente** para grandes inventarios
- **Gestión de disponibilidad** y estados de productos

### Sistema de Medios Integrado
- **Subida de imágenes y videos** por producto
- **Integración con DigitalOcean Spaces** (S3-compatible)
- **Optimización automática** de imágenes con Sharp
- **Gestión de archivos multimedia** con preview y eliminación
- **CDN integrado** para entrega rápida de contenido

### Autenticación y Autorización
- **JWT con refresh tokens** para seguridad robusta
- **Sistema de roles** (superadmin, admin, cliente, viewer)
- **Middleware de autorización** basado en roles
- **Sesiones seguras** con Redis para caché

### Arquitectura Escalable
- **Backend en Node.js + TypeScript** con Express
- **Frontend en React + TypeScript** con Vite
- **Base de datos PostgreSQL** con migraciones Knex
- **Redis para caché** y gestión de sesiones
- **Real-time updates** con Socket.IO

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React + Vite  │◄──►│  Express + TS   │◄──►│  PostgreSQL     │
│   - Admin UI    │    │  - Auth System  │    │  - Products     │
│   - File Upload │    │  - Excel Proc.  │    │  - Users        │
│   - Inventory   │    │  - Media Mgmt   │    │  - Media Files  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │     Redis       │              │
         └──────────────►│   Caching &     │◄─────────────┘
                        │   Sessions      │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │ DigitalOcean    │
                        │ Spaces (S3)     │
                        │ Media Storage   │
                        └─────────────────┘
```

## 📦 Instalación y Configuración

### Prerequisitos
- Node.js 18+ y npm 8+
- Redis 6+
- Cuenta de DigitalOcean (Spaces y Database PostgreSQL)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/your-org/chefmax.git
cd chefmax
```

2. **Configurar el Backend**
```bash
cd back
npm install
cp .env.example .env
# Editar .env con tus credenciales
```

3. **Configurar la Base de Datos (DigitalOcean)**
```bash
# No crear BD local. Usa DigitalOcean Database.
# Asegura que back/.env tenga credenciales de DO:
#   - DATABASE_URL=postgresql://...ondigitalocean.com:25060/...?
#   - o DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD de DO

# Ejecutar migraciones contra DO
npm run db:migrate

# Opcional: poblar con datos de ejemplo
npm run db:seed
```

4. **Configurar el Frontend**
```bash
cd ../front
npm install
# El .env se configura automáticamente para desarrollo
```

5. **Iniciar los Servicios**
```bash
# Terminal 1 - Backend
cd back && npm run dev

# Terminal 2 - Frontend (SIEMPRE EN PUERTO 3000)
cd front && npm run dev

# Terminal 3 - Redis (si no está como servicio)
redis-server

# Nota: No inicies Postgres local. La app usa DigitalOcean Database.
# Si necesitas Redis vía Docker: docker compose -f docker-compose.dev.yml up -d redis
```

**⚠️ IMPORTANTE: El frontend SIEMPRE corre en puerto 3000 en desarrollo local**

### Variables de Entorno Principales

#### Backend (.env)
```bash
# Servidor
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Base de datos (SIEMPRE DigitalOcean Cloud)
DATABASE_URL=postgresql://usuario:password@host:puerto/db?sslmode=require

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# DigitalOcean Spaces
SPACES_ACCESS_KEY=your-spaces-access-key
SPACES_SECRET_KEY=your-spaces-secret-key
SPACES_BUCKET_NAME=chefmax-media
SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001/api/v1
```

**⚠️ NOTA CRÍTICA: El frontend está configurado para correr SIEMPRE en puerto 3000 (ver vite.config.ts)**

## 🎯 Uso del Sistema

### 1. Configuración Inicial
```bash
# Crear usuario administrador
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chefmax.com",
    "password": "admin123",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin"
  }'
```

### 2. Cargar Archivos Excel
1. Acceder a la interfaz administrativa
2. Ir a la pestaña "Cargar Archivos"
3. Arrastrar archivo Excel o hacer clic para seleccionar
4. El sistema detecta automáticamente el formato del proveedor
5. Revisar resultados de procesamiento
6. Cambiar a pestaña "Inventario" para gestionar productos

### 3. Gestión de Productos
- **Ver productos**: Lista paginada con búsqueda y filtros
- **Editar producto**: Click en ícono de lápiz
- **Eliminar producto**: Click en ícono de basura
- **Gestionar medios**: Click en ícono de foto para subir imágenes/videos

### 4. API REST
El sistema expone una API RESTful completa:

```bash
# Autenticación
POST /api/v1/auth/login
POST /api/v1/auth/register
GET  /api/v1/auth/profile

# Productos
GET    /api/v1/products           # Listar con filtros
GET    /api/v1/products/:id       # Obtener por ID
POST   /api/v1/products           # Crear nuevo
PUT    /api/v1/products/:id       # Actualizar
DELETE /api/v1/products/:id       # Eliminar

# Medios
POST   /api/v1/products/:id/media # Subir archivo
GET    /api/v1/products/:id/media # Listar medios
DELETE /api/v1/products/:productId/media/:mediaId
```

## 🚀 Despliegue en DigitalOcean - Estado Actual

### 📊 Infraestructura Desplegada (PRODUCCIÓN)

**Frontend - FUNCIONANDO ✅**
- **App ID**: `49c91c76-9255-48c1-ab1d-415a7cb21b66`
- **Nombre**: `chefmax-front` 
- **URL**: `https://chefmax-latam-final-9veng.ondigitalocean.app`
- **Estado**: ACTIVE - Deployment exitoso
- **Repositorio**: `systemadminlightinnoivationsla/chefmax-front`
- **Branch**: `main`
- **Último Deploy**: 2025-09-04 18:51:39 UTC (ID: `849082f5-e24f-4c07-b1a5-ed9b06aec2d7`)

**Backend - EN PROGRESO ⏳**
- **App ID**: `befe156a-6af6-44ca-9eaf-29fc8cadfa59`
- **Nombre**: `chefmax-backend`
- **Estado**: Resolviendo configuración TypeScript
- **Repositorio**: `systemadminlightinnoivationsla/chefmax-backend`
- **Branch**: `clean-master`
- **Puerto**: 3001 (configurado correctamente)

**Base de Datos - FUNCIONANDO ✅**
- **ID**: `a8a72f5e-80cf-42a2-9abe-698ac920e4c8`
- **Nombre**: `db-postgresql-nyc3-83444`
- **Engine**: PostgreSQL v17
- **Estado**: ONLINE
- **Región**: nyc3
- **Tamaño**: db-s-1vcpu-1gb (10GB storage)

### 🔧 Configuración de Repositorios

**Frontend Repository**
```bash
# Repositorio activo
https://github.com/systemadminlightinnoivationsla/chefmax-front.git

# Variables de entorno configuradas
VITE_API_URL=https://chefmax-backend.ondigitalocean.app/api/v1
VITE_BACKEND_URL=https://chefmax-backend.ondigitalocean.app
VITE_APP_NAME=ChefMax LATAM
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

## 🎨 UI de Autenticación (Login/Registro)

- Las rutas de autenticación son SPA: `http://localhost:3000/login`, `.../register`, `.../forgot-password`.
- El layout usa `front/src/components/auth/AuthLayout.tsx` con estilos dedicados en `front/src/styles/auth.css` para evitar interferencias de estilos globales.
- En páginas de auth se ocultan la promo bar y el header (`PublicLayout` ya lo implementa).
- Documentación detallada: `front/AUTH-UI.md`.

Producción (Static Site): agrega una regla catch‑all `/* → index.html (200)` en tu proveedor (DigitalOcean App Platform) para que `/login` funcione al acceder directamente.

**Backend Repository**
```bash
# Repositorio limpio (sin secretos)
https://github.com/systemadminlightinnoivationsla/chefmax-backend.git

# Configuración de producción
- Puerto: 3001 (estandarizado)
- TypeScript: Configuración production (tsconfig.production.json)
- Build: npm run build (tsc -p tsconfig.production.json)
- CORS: Configurado para frontend en producción
```

### 🛠️ Scripts de Deployment

**Scripts Disponibles**
```bash
# Scripts creados y ejecutables
./scripts/deploy-backend.sh     # Deploy individual backend
./scripts/deploy-frontend.sh    # Deploy individual frontend  
./scripts/deploy-full.sh        # Deploy completo del sistema
./scripts/pre-deploy-check.sh   # Validaciones pre-deployment
```

**Comandos de Deployment Usados**
```bash
# Frontend (redeploy exitoso)
doctl apps create-deployment 49c91c76-9255-48c1-ab1d-415a7cb21b66 --wait

# Backend (configuración actual)
doctl apps create --spec .do/backend-app.yaml --wait

# Verificar estado
doctl apps list
doctl apps get [APP_ID]
doctl apps logs [APP_ID] --deployment [DEPLOYMENT_ID] --type build
```

### 📁 Archivos de Configuración DO

**Backend App Spec** (`.do/backend-app.yaml`)
```yaml
name: chefmax-backend
region: nyc1
services:
- name: api
  github:
    repo: systemadminlightinnoivationsla/chefmax-backend
    branch: clean-master
    deploy_on_push: true
  build_command: npm run build
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 3001
  
  # Variables conectadas a infraestructura existente
  envs:
  - key: FRONTEND_URL
    value: "https://chefmax-latam-final-9veng.ondigitalocean.app"
  - key: CORS_ORIGINS  
    value: "https://chefmax-latam-final-9veng.ondigitalocean.app,https://chefmaxlatam.com"
  # ... (47+ variables configuradas)
```

**Frontend App Spec** (`.do/frontend-app.yaml`)
```yaml
name: chefmax-frontend
region: nyc1
static_sites:
- name: web
  github:
    repo: systemadminlightinnoivationsla/chefmax-front
    branch: main
    deploy_on_push: true
  build_command: npm run build
  output_dir: /dist
  environment_slug: node-js
```

### 🔐 Autenticación y Tokens

**GitHub Tokens Configurados**
```bash
# Token activo para deployment
ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Configurado en ~/.git-credentials para doctl
https://chefmax-user:ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@github.com
```

**DigitalOcean CLI**
```bash
# Autenticado y funcionando
doctl auth list      # ✅ default (current)
doctl apps list      # ✅ Acceso a todas las apps
```

### 🚨 Problemas Resueltos Durante Deploy

**1. Secretos en Repositorio**
- ✅ **Solucionado**: Limpiado .env y archivos con credenciales
- ✅ **Branch limpia**: `clean-master` sin secretos
- ✅ **GitHub Protection**: No más errores de push protection

**2. Configuración de Puertos**
- ✅ **Estandarizado**: Backend puerto 3001, Frontend puerto 3000
- ✅ **CORS actualizado**: URLs de producción configuradas
- ✅ **Dockerfile corregido**: EXPOSE 3001, healthcheck actualizado

**3. Dependencies TypeScript**
- ⏳ **En progreso**: Configuración `tsconfig.production.json`
- ✅ **TypeScript movido**: De devDependencies a dependencies
- ⏳ **Build errors**: Resolviendo últimos problemas de tipos

**4. Infraestructura Duplicada**
- ✅ **Evitado**: Usando BD existente `a8a72f5e-80cf-42a2-9abe-698ac920e4c8`
- ✅ **Frontend reutilizado**: App `49c91c76-9255-48c1-ab1d-415a7cb21b66` actualizada
- ✅ **Costos optimizados**: Sin duplicación de recursos

### 📈 Estado de Deployment Actual

**COMPLETADO ✅**
- [x] Repositorios GitHub configurados y limpios
- [x] Frontend desplegado y funcionando en producción  
- [x] Base de datos PostgreSQL online y disponible
- [x] Configuraciones YAML de DigitalOcean actualizadas
- [x] Scripts de deployment creados y ejecutables
- [x] Variables de entorno configuradas
- [x] CORS y networking configurado
- [x] Autenticación mock implementada (admin@chefmaxlatam.com / admin123)

**EN PROGRESO ⏳**
- [ ] Backend deployment (resolviendo errores TypeScript)
- [ ] Conexión BD-Backend (configuraciones listas)
- [ ] Testing integración completa

**PENDIENTE 📋**
- [ ] Configurar variables de entorno secretas en DO dashboard
- [ ] SSL y dominios personalizados
- [ ] Configurar backups automáticos BD
- [ ] Monitoring y alertas
- [ ] Load testing y optimización

### 🔗 URLs y Accesos

**Producción Actual**
- **Frontend**: https://chefmax-latam-final-9veng.ondigitalocean.app
- **Backend**: (próximamente) https://chefmax-backend.ondigitalocean.app  
- **Admin Demo**: admin@chefmaxlatam.com / admin123
- **Usuario Demo**: user@chefmaxlatam.com / admin123

**Desarrollo Local**
- **Frontend**: http://localhost:3000 (SIEMPRE puerto 3000)
- **Backend**: http://localhost:3001
- **DB**: DigitalOcean PostgreSQL Cloud (SIEMPRE)

### 💡 Preparación para Deployment Completo

1. **Instalar doctl CLI**
```bash
# Ubuntu/Debian
snap install doctl

# macOS
brew install doctl

# Autenticar
doctl auth init
```

2. **Configurar Spaces (si no existe)**
```bash
# Crear bucket para medios
doctl spaces buckets create chefmax-media --region nyc3
```

3. **Desplegar aplicación**
```bash
# Verificar estado
doctl apps list

# Deploy backend (cuando esté listo)
doctl apps create-deployment befe156a-6af6-44ca-9eaf-29fc8cadfa59 --wait

# O redeploy desde scripts
./scripts/deploy-backend.sh
./scripts/deploy-full.sh
```

### Configuración Post-Despliegue
1. Configurar variables de entorno secretas en el dashboard
2. Ejecutar migraciones de base de datos  
3. Configurar dominio personalizado y SSL
4. Configurar backups de base de datos
5. Setup monitoring y alertas

## 🧪 Testing

### Backend
```bash
cd back
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch para desarrollo
npm run test:coverage # Con cobertura de código
```

### Frontend
```bash
cd front
npm test              # Tests con Vitest
npm run test:watch    # Modo watch
npm run test:ui       # Interfaz gráfica de tests
```

### Tests E2E
```bash
# Ejecutar tests end-to-end (requiere servicios corriendo)
npm run test:e2e
```

## 📊 Monitoreo y Logs

### Desarrollo
```bash
# Ver logs del backend
cd back && npm run dev

# Ver logs del frontend (PUERTO 3000)
cd front && npm run dev
```

**⚠️ RECORDATORIO: Frontend SIEMPRE en puerto 3000 en desarrollo local**

### Producción (DigitalOcean)
```bash
# Ver logs de la aplicación
doctl apps logs <APP_ID> --follow

# Ver logs por servicio
doctl apps logs <APP_ID> --type build,deploy,run
```

## 🔧 Scripts Útiles

### Backend
```bash
npm run dev           # Servidor de desarrollo
npm run build         # Compilar TypeScript
npm run start         # Servidor de producción
npm run lint          # Linting con ESLint
npm run typecheck     # Verificar tipos TypeScript
npm run db:migrate    # Ejecutar migraciones
npm run db:rollback   # Revertir migración
npm run db:seed       # Poblar con datos de ejemplo
npm run db:reset      # Reset completo de BD
```

### Frontend
```bash
npm run dev           # Servidor de desarrollo Vite (PUERTO 3000)
npm run build         # Build de producción
npm run preview       # Preview del build
npm run lint          # Linting con ESLint
npm run typecheck     # Verificar tipos TypeScript
```

**⚠️ CONFIGURACIÓN CRÍTICA: vite.config.ts está configurado para puerto 3000**

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Convenciones
- **Commits**: Usar [Conventional Commits](https://conventionalcommits.org/)
- **Code Style**: ESLint + Prettier configurados
- **Testing**: Tests requeridos para nuevas funcionalidades
- **TypeScript**: Tipado estricto habilitado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Documentación**: [Wiki del proyecto](../../wiki)
- **Issues**: [GitHub Issues](../../issues)
- **Discusiones**: [GitHub Discussions](../../discussions)
- **Email**: dev@chefmaxlatam.com

## 🙏 Agradecimientos

- [ExcelJS](https://github.com/exceljs/exceljs) - Procesamiento avanzado de Excel
- [Sharp](https://sharp.pixelplumbing.com/) - Optimización de imágenes
- [Socket.IO](https://socket.io/) - Comunicación en tiempo real
- [Tailwind CSS](https://tailwindcss.com/) - Framework de estilos
- [DigitalOcean](https://digitalocean.com/) - Hosting y servicios cloud

---

**ChefMax Team** - Sistema de gestión de inventarios para proveedores de equipos de restaurante. 🍽️⚡
