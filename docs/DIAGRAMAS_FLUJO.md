# Diagramas de Flujo — ChefMax LATAM

Este documento recoge los diagramas detallados del flujo de la aplicación ChefMax LATAM (arquitectura, autenticación, procesamiento de Excel, gestión de medios, carrito/checkout, geolocalización, CORS, despliegue, monitoreo y modelo de datos).

Referencias:
- Repos Frontend: `https://github.com/systemadminlightinnoivationsla/chefmax-front`
- Repos Backend: `https://github.com/systemadminlightinnoivationsla/chefmax-backend`
- Guía de despliegue: `docs/DEPLOYMENT.md`
- Nota de puertos locales: `PUERTO_FRONTEND.md`

## Índice

- [1) Arquitectura General del Sistema](#arquitectura)
- [2) Autenticación y Autorización (JWT + Refresh)](#auth)
- [3) Flujo de Procesamiento de Excel Multi‑Formato](#excel)
- [4) Gestión de Medios (Imágenes/Videos por Producto)](#media)
- [5) Carrito y Checkout (E‑commerce)](#carrito)
- [6) Geolocalización y WhatsApp (LATAM)](#geo)
- [7) CORS y Networking (Local y Producción)](#cors)
- [8) Despliegue (DigitalOcean App Platform)](#deploy)
- [9) Monitoreo y Logs](#monitoreo)
- [10) Modelo de Datos (ER)](#er)

## 1) Arquitectura General del Sistema {#arquitectura}

```mermaid
flowchart LR
  subgraph Client[Usuarios / Navegadores]
    A[SPA React (Vite)]
  end

  subgraph Infra[Infraestructura Cloud]
    B[Backend API<br/>Node.js + Express + TS]
    C[(PostgreSQL DO)]
    D[(Redis opcional)]
    E[DO Spaces (S3) <br/> + CDN]
    S[Socket.IO]
  end

  subgraph DevOps[Operaciones]
    G[DigitalOcean App Platform]
    H[doctl CLI / YAML Spec]
  end

  A -- HTTPS /api/v1 --> B
  B <--> C
  B <--> D
  B <--> E
  A <--> S

  H --> G
  G -. despliegue .-> B
  G -. despliegue .-> A
```

## 2) Autenticación y Autorización (JWT + Refresh) {#auth}

```mermaid
sequenceDiagram
  autonumber
  participant U as Usuario
  participant F as Frontend (SPA)
  participant B as Backend (Auth)
  participant DB as PostgreSQL

  U->>F: Ingresa email/contraseña
  F->>B: POST /auth/login (JSON)
  B->>DB: Verifica usuario + hash contraseña
  DB-->>B: OK / Error
  alt credenciales válidas
    B-->>F: 200 {accessToken, refreshToken?}
    F->>F: Guarda accessToken (memoria) / refresh (cookie httpOnly o storage seguro)
  else inválidas
    B-->>F: 401 Unauthorized
  end

  Note over F: Usa accessToken en Authorization: Bearer {token}
  F->>B: GET /profile (Bearer)
  B-->>F: 200 Perfil

  Note over F,B: Acceso expira -> Refresh
  F->>B: POST /auth/refresh (refresh token)
  B-->>F: 200 Nuevo accessToken

  U->>F: Logout
  F->>B: POST /auth/logout (invalida refresh)
  B-->>F: 204
```

## 3) Flujo de Procesamiento de Excel Multi‑Formato {#excel}

```mermaid
flowchart TD
  A[Admin: carga Excel] --> B[SPA react - Dropzone]
  B --> C[POST /uploads (multipart)]
  C --> D[Backend: detección proveedor]
  D --> E[Parse Excel (ExcelJS)]
  E --> F{Múltiples hojas?}
  F -- Sí --> G[Itera hojas relevantes]
  F -- No --> H[Trabaja hoja principal]
  G --> I[Normaliza columnas\n- map por proveedor\n- limpieza de precios\n- formatos numéricos]
  H --> I
  I --> J[Validación por tipos y reglas\n- requeridos\n- rangos\n- catálogos]
  J --> K{Errores?}
  K -- Sí --> L[Genera reporte con filas con error]
  K -- No --> M[Transformación final y upsert]
  M --> N[Persistencia en PostgreSQL\n- products\n- inventory_items\n- file_uploads\n- suppliers]
  N --> O[Emitir eventos Socket.IO\n- progreso\n- resumen]
  L --> O
  O --> P[Respuesta a Frontend:\n- totales\n- errores/advertencias\n- IDs creados]
```

## 4) Gestión de Medios (Imágenes/Videos por Producto) {#media}

```mermaid
sequenceDiagram
  autonumber
  participant U as Admin/Editor
  participant F as Frontend (SPA)
  participant B as Backend (Media)
  participant S3 as DO Spaces (S3)
  participant DB as PostgreSQL

  U->>F: Selecciona archivo (img/video)
  F->>B: POST /products/:id/media (multipart)
  B->>B: Valida producto + tamaño + mime
  B->>S3: Sube archivo (stream)
  par imágenes
    B->>B: Procesa con Sharp (thumbs, webp)
    B->>S3: Sube derivados
  end
  B->>DB: Inserta metadata (media_files + product_media)
  B-->>F: 201 {mediaId, urls (CDN)}

  Note over F: Mostrar previews, permitir eliminar
  F->>B: DELETE /products/:productId/media/:mediaId
  B->>S3: Elimina objetos
  B->>DB: Marca borrado/borra registros
  B-->>F: 204
```

## 5) Carrito y Checkout (E‑commerce) {#carrito}

```mermaid
flowchart LR
  A[Usuario navega catálogo] --> B[Añadir al carrito]
  B --> C[CartContext (localStorage)\n- items\n- cantidades\n- subtotal]
  C --> D[Ver carrito (Sidebar/Modal)]
  D --> E[Checkout paso 1: Envío]
  E --> F[Checkout paso 2: Pago]
  F --> G[Crear Orden (POST /orders)]
  G --> H[Validación stock y totales]
  H --> I{Stock OK?}
  I -- No --> J[Respuesta error\n- ajustar cantidades]
  I -- Sí --> K[Persistir order + items]
  K --> L[Respuesta 201 {orderId, estado}]
  L --> M[Confirmación + notificaciones]
```

## 6) Geolocalización y WhatsApp (LATAM) {#geo}

```mermaid
flowchart TD
  A[Inicio SPA] --> B{País en cache?}
  B -- Sí --> C[Usar cache]
  B -- No --> D[Detección por IP]
  D --> E{Éxito?}
  E -- No --> F[Geolocalización navegador]
  F --> G{Éxito?}
  G -- No --> H[Heurística zona horaria]
  E -- Sí --> I[Determina país]
  G -- Sí --> I
  H --> I
  I --> J[Selecciona número WhatsApp por país]
  J --> K[Render WhatsApp Float / CTA]
  I --> L[Localiza contenidos (precio/leyendas)]
  I --> M[Cachear en localStorage]
```

## 7) CORS y Networking (Local y Producción) {#cors}

```mermaid
sequenceDiagram
  autonumber
  participant F as Frontend 3000 (dev) / prod domain
  participant B as Backend 3001 (dev) / prod domain

  Note over F: Solicitud XHR/Fetch cross‑origin
  F->>B: OPTIONS /api/v1/... (Preflight)
  B-->>F: 204 + Access-Control-Allow-Origin, -Methods, -Headers
  F->>B: GET/POST con credenciales/headers
  B-->>F: 200/4xx/5xx

  Note over B: CORS_ORIGINS incluye http://localhost:3000 y dominios de producción
```

## 8) Despliegue (DigitalOcean App Platform) {#deploy}

```mermaid
flowchart LR
  Dev[Dev push a GitHub] --> DO[DO App Platform]
  Spec[Spec YAML (p.ej. backend-update.yaml)] --> DO
  CLI[doctl create-deployment <APP_ID>] --> DO

  DO --> Build[Build & Provision]
  Build --> Run[Run containers]
  Run --> Health[Health checks /health]
  Health --> Live[App activa]
  Live --> Logs[Logs build/deploy/run]
```

## 9) Monitoreo y Logs {#monitoreo}

```mermaid
flowchart TD
  A[doctl apps logs <APP_ID>] --> B[build logs]
  A --> C[deploy logs]
  A --> D[run logs]
  E[GET /health] --> F{OK?}
  F -- 200 --> G[Aplicación saludable]
  F -- Error --> H[Inspección logs + alertas]
```

## 10) Modelo de Datos (ER) {#er}

```mermaid
erDiagram
  USERS ||--o{ ORDERS : places
  USERS ||--o{ FILE_UPLOADS : uploads
  SUPPLIERS ||--o{ PRODUCTS : supplies
  PRODUCTS ||--o{ PRODUCT_MEDIA : has
  MEDIA_FILES ||--o{ PRODUCT_MEDIA : linked
  ORDERS ||--o{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : ordered
  PRODUCTS ||--o{ INVENTORY_ITEMS : tracked
  FILE_UPLOADS ||--o{ INVENTORY_ITEMS : produced
  PRODUCTS ||--o{ QUOTATIONS : quoted

  USERS {
    uuid id
    text email
    text role
    text password_hash
    jsonb profile
  }
  SUPPLIERS {
    uuid id
    text name
    jsonb format_config
  }
  PRODUCTS {
    uuid id
    text name
    text sku
    numeric price
    int inventory
    jsonb seo
  }
  MEDIA_FILES {
    uuid id
    text url
    text mime
    jsonb variants
    uuid uploaded_by
  }
  PRODUCT_MEDIA {
    uuid id
    uuid product_id
    uuid media_id
    text role
  }
  FILE_UPLOADS {
    uuid id
    text filename
    text supplier_detected
    jsonb report
    uuid uploaded_by
  }
  INVENTORY_ITEMS {
    uuid id
    uuid product_id
    uuid file_upload_id
    int quantity
    numeric cost
  }
  ORDERS {
    uuid id
    uuid user_id
    numeric subtotal
    numeric total
    text status
  }
  ORDER_ITEMS {
    uuid id
    uuid order_id
    uuid product_id
    int qty
    numeric unit_price
  }
  QUOTATIONS {
    uuid id
    uuid product_id
    text currency
    numeric price
  }
```

---

Sugerencias de evolución:
- Añadir colas (p.ej. para procesamiento pesado de imágenes/Excel).
- Telemetría/alertas (APM/metrics) y dashboards.
- Endpoints de health detallados (DB, Redis, Spaces).