# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Diagrams

For detailed architecture and process flows, see `docs/DIAGRAMAS_FLUJO.md` in this repository.

## Development Commands

### Backend (Node.js + TypeScript)
```bash
cd back/
npm run dev           # Development server with hot reload (nodemon + ts-node)
npm run build         # Compile TypeScript to dist/
npm start             # Run production server
npm test              # Run Jest tests
npm run test:watch    # Jest watch mode
npm run lint          # ESLint check
npm run lint:fix      # ESLint fix
npm run typecheck     # TypeScript type checking
```

### Frontend (React + Vite + TypeScript) 
```bash
cd front/
npm run dev             # Vite development server
npm run build           # Production build (tsc + vite build)
npm run preview         # Preview production build
npm test                # Vitest tests
npm run test:ui         # Vitest UI
npm run test:coverage   # Test coverage report
npm run lint            # ESLint check
npm run lint:fix        # ESLint fix
npm run typecheck       # TypeScript type checking
npm run format          # Prettier formatting
npm run storybook       # Storybook development
```

### Database Operations (Backend)
```bash
cd back/
npm run db:migrate   # Run latest migrations
npm run db:rollback  # Rollback migrations  
npm run db:seed      # Run database seeds
npm run db:reset     # Rollback, migrate, and seed
# Uses PostgreSQL with connection pooling and SSL
# Database schema: users → suppliers → products → orders → file_uploads
```

### Docker Development
```bash
docker-compose -f docker-compose.dev.yml up -d redis  # Start Redis only (DB is DigitalOcean)
docker-compose logs -f                          # View logs
docker-compose down                             # Stop services
# Note: Adminer/Local Postgres not used by default
```

## Project Structure

### Key Directories
- `back/` - Backend API (Express + TypeScript + PostgreSQL)
- `front/` - Frontend SPA (React + TypeScript + Vite)
- `formats/` - Sample supplier Excel files for testing
- `cotizaciones/` - Sample quotation templates
- `marketing/` - Brand assets and presentation materials
- `products/` - Product images and generated assets
- `scripts/` - Deployment and automation scripts

### Modern E-commerce Landing Pages

ChefMax LATAM now features **multiple production-ready landing page implementations** optimized for B2B equipment sales:

#### Primary Landing Page (`front/src/pages/public/HomePageClean.tsx`)
**WebstaurantStore-inspired B2B e-commerce experience:**

- **Advanced Cart System**: Multi-step checkout with sidebar/modal views
- **Smart Geolocation**: Automatic country detection for LATAM markets
- **WhatsApp Integration**: Country-specific contact numbers and floating widgets
- **Product Categories**: Freidoras, campanas, woks, vaporeras, trampas de grasa
- **SEO Optimization**: Complete structured data and meta tags
- **Responsive Design**: Mobile-first with touch-friendly interactions
- **Real-time Updates**: Live cart state management and inventory tracking

#### Alternative Homepage Versions
- `HomePageWebstore3.tsx` - Advanced product grid layout
- `HomePageModern.tsx` - Modern animations and interactions
- `HomePageNew.tsx` - Latest design experiments

#### Frontend Tech Stack Evolution
- **React 18 + TypeScript** with Vite for lightning-fast development
- **Framer Motion** for sophisticated animations and micro-interactions
- **Advanced State Management**: React Query + Context API + localStorage persistence
- **Modern UI Components**: Radix UI + Headless UI + Bootstrap 5.3 + custom design system
- **Cart Context**: Global state management with persistent shopping cart (localStorage)
- **Geolocation Services**: IP-based LATAM country detection with WhatsApp integration
- **SEO Optimization**: React Helmet Async + structured data + dynamic meta tags

## High-Level Architecture

### Core System Purpose
**Dual-purpose platform**: ChefMax serves as both a **B2B e-commerce platform** for restaurant equipment sales and a **multi-format Excel processor** for supplier inventory management.

### Key Business Components

#### E-commerce Platform (New Primary Focus)
- **Product Catalog**: Commercial kitchen equipment (freidoras, woks, campanas, etc.)
- **Smart Cart System**: Multi-step checkout with shipping and payment integration
- **LATAM Localization**: Country-specific pricing, WhatsApp contacts, and shipping
- **B2B Features**: Volume pricing, quote requests, and enterprise contact flows
- **SEO-First Design**: Structured data, sitemap, and conversion-optimized pages

#### Legacy Excel Processing System
- **Multi-format Excel processor** for restaurant suppliers
- **Configurable column mapping** per supplier via `SupplierFormatConfig`
- **Data transformation, validation, and normalization**
- **Detailed processing reports** with errors/warnings

### New Cart & E-commerce Architecture

#### Cart Context (`front/src/contexts/CartContext.tsx`)
**Global state management for shopping experience:**
- Persistent cart state across page refreshes (localStorage)
- Multi-step checkout flow (cart → shipping → payment → confirmation)
- Real-time price calculations (subtotal, tax, shipping)
- Inventory validation and quantity management
- Order creation and tracking

#### Cart Components Ecosystem
- **`CartSidebar.tsx`**: Slide-out cart panel with item management
- **`CartModal.tsx`**: Full-screen multi-step checkout experience
- **`FloatingCart.tsx`**: Persistent cart button with quick view
- **`SimpleCartModal.tsx`**: Lightweight cart overview

#### Advanced Geolocation System

#### GeolocationService (`front/src/services/geolocationService.ts`)
**Smart country detection for LATAM markets:**
- **Triple detection strategy**: IP geolocation + browser API + timezone analysis
- **Country-specific WhatsApp numbers**: Mexico, Peru, Ecuador, International
- **Caching and performance optimization**: Reduces API calls
- **Graceful fallbacks**: Always functional even if detection fails

#### Geolocation UI Components
- **`CountryIndicator.tsx`**: Flag display with country info
- **`WhatsAppButton.tsx`**: Simple floating WhatsApp contact
- **`WhatsAppFloat.tsx`**: Advanced expandable WhatsApp widget with country info
- **`GeolocationDemo.tsx`**: Testing and demonstration page

### SEO & Performance Architecture

#### SEO Implementation (`front/src/components/seo/SEOHead.tsx`)
**Enterprise-grade SEO optimization:**
- **Dynamic meta tags**: Title, description, keywords per page
- **Open Graph & Twitter Cards**: Social media optimization
- **Structured data integration**: Organization, LocalBusiness, Product schemas
- **LATAM-specific SEO**: Geographic targeting and local business markup
- **Canonical URLs and robots directives**

#### Structured Data (`front/src/utils/structuredData.ts`)
**Complete schema.org implementation:**
- **Organization Schema**: ChefMax company information
- **LocalBusiness Schema**: Contact details and service areas
- **Product Schema**: Equipment catalog with pricing and availability
- **WebSite Schema**: Site search and navigation structure
- **Breadcrumb Schema**: Navigation hierarchy

#### SEO Assets
- **`front/public/sitemap.xml`**: Comprehensive URL mapping (50+ pages)
- **`front/public/robots.txt`**: Search engine crawling directives
- **SEO Strategy Documentation**: Complete competitive analysis in `SEO_STRATEGY_ANALYSIS.md`

### Authentication & Authorization
- **JWT-based auth** with access tokens (24h) and refresh tokens (7d)
- **Role-based permissions**: superadmin, admin, cliente, viewer
- **Token management** in `front/src/services/authService.ts`
- **Protected routes** using `authMiddleware` in backend

### Real-time Updates
- **Socket.IO integration** for live file processing status
- **Cart state synchronization** across browser tabs
- **Live inventory updates** and availability checks
- **Real-time order status tracking**

#### Database Architecture (PostgreSQL + Knex.js)
- **Multi-tenant design**: suppliers → products → file_uploads → orders
- **E-commerce schema**: Enhanced with cart, orders, and checkout tables
- **Flexible supplier configuration** stored as JSONB
- **Product catalog** with pricing, inventory, and SEO metadata
- **Complete audit trail** for all transactions and processing operations

### Frontend Architecture (React + TypeScript + Vite)

#### Modern E-commerce Features
- **Global cart management**: Persistent across sessions with localStorage
- **Multi-step checkout**: Cart → Shipping → Payment → Confirmation
- **Smart product catalog**: Category filtering, search, and recommendations
- **Geolocation integration**: Country detection for localized experience
- **SEO optimization**: Dynamic meta tags and structured data per page
- **Advanced animations**: Framer Motion for smooth user interactions

#### Key Frontend Files
- `front/src/contexts/CartContext.tsx` - Global cart state management
- `front/src/pages/public/HomePageClean.tsx` - Primary e-commerce landing page
- `front/src/components/cart/` - Complete cart component ecosystem
- `front/src/components/ui/CountryIndicator.tsx` - Geolocation display
- `front/src/components/ui/WhatsAppFloat.tsx` - LATAM contact integration
- `front/src/components/seo/SEOHead.tsx` - Dynamic SEO optimization
- `front/src/services/geolocationService.ts` - Country detection service

#### Admin Dashboard (Legacy)
- **File upload interface**: Multi-supplier Excel processing
- **Real-time processing feedback** via Socket.IO
- **Analytics dashboard**: Sales and inventory insights

### Backend Architecture (Express + TypeScript)

#### Enhanced Server Structure (`back/src/server.ts`)
- **Class-based Express server** with comprehensive middleware stack
- **E-commerce APIs**: Cart, checkout, orders, and payment processing  
- **Real-time features**: Socket.IO for live updates and notifications
- **Security**: Helmet CSP, CORS, rate limiting (100 req/15min), express-validator
- **Swagger documentation** auto-generated from JSDoc at `/api-docs`
- **Health checks** at `/health` endpoint with uptime and version info
- **Graceful shutdown** with proper cleanup (Redis, Socket.IO, HTTP server)

#### Key Backend Files
- `back/src/processors/ExcelProcessor.ts` - Legacy Excel processing engine
- `back/src/middleware/auth.ts` - JWT authentication middleware
- `back/src/routes/` - API routes (auth, products, cart, orders, uploads)
- `back/src/database/migrations/` - PostgreSQL schema with e-commerce tables
- `back/src/config/` - Database, Redis, and payment gateway configuration

## Development Patterns

### E-commerce Cart Architecture
**Modern shopping cart implementation:**

- **Context-based state**: Global cart state using React Context + useReducer
- **Persistent storage**: localStorage integration for cart persistence
- **Real-time calculations**: Automatic subtotal, tax, and shipping calculations
- **Multi-step checkout**: Guided flow with validation and error handling
- **Inventory validation**: Real-time stock checking before order creation

### Geolocation & Localization
**LATAM-focused user experience:**

- **IP-based detection**: Automatic country identification
- **WhatsApp integration**: Country-specific contact numbers
- **Localized content**: Pricing, shipping, and contact information
- **Fallback mechanisms**: Graceful degradation if detection fails

### SEO & Performance Architecture
**Enterprise-grade optimization:**

- **Dynamic meta tags**: Page-specific SEO optimization
- **Structured data**: Schema.org markup for search engines
- **Sitemap generation**: Automated URL discovery for crawlers
- **Core Web Vitals**: Performance monitoring and optimization
- **Image optimization**: Lazy loading and responsive images

### Authentication & Authorization
- **JWT tokens**: 24h access + 7d refresh token rotation
- **Role-based permissions**: superadmin, admin, cliente, viewer
- **E-commerce integration**: Customer accounts and order history
- **Social login**: Future integration with Google/Facebook
- **Session management**: Redis-based token storage

### Database Schema Evolution
**Enhanced multi-tenant PostgreSQL design with Knex.js:**
- `users` (UUID primary keys, roles: superadmin/admin/client/viewer, JSONB profiles)
- `suppliers` (format configurations as JSONB for Excel processing) 
- `products` (e-commerce catalog with media, SEO fields, inventory tracking)
- `orders` + `order_items` (complete e-commerce transaction system)
- `media_files` + `product_media` (image/video asset management)
- `file_uploads` (Excel processing audit trail with Socket.IO updates)
- `quotations` + `inventory_items` (B2B functionality and bulk processing)

### Testing & Quality Assurance
- **Frontend**: Vitest + React Testing Library for component tests
- **Backend**: Jest + Supertest for API testing
- **E2E Testing**: Playwright for complete user journey testing
- **TypeScript strict mode** enabled across both codebases
- **ESLint + Prettier** for consistent code style
- **Performance monitoring**: Lighthouse CI integration

## Environment Setup

### Required Environment Variables
**Backend (.env)**:
```bash
# Database (PostgreSQL with SSL)
DATABASE_URL=postgresql://USER:PASSWORD@DB-HOST:25060/DBNAME?sslmode=require
DB_HOST=your-db-host
DB_PORT=25060
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true

# Services
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key

# CORS & API
FRONTEND_URL=http://localhost:3000
FRONTEND_PROD_URL=https://chefmax-frontend.ondigitalocean.app
API_VERSION=v1
PORT=3001
RATE_LIMIT_MAX=100

# External APIs (optional)
STRIPE_SECRET_KEY=sk_test_...
WHATSAPP_API_TOKEN=your-token
```

**Frontend (.env.local)**:
```bash
VITE_API_URL=http://localhost:3001/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_ANALYTICS_ID=G-...
```

## E-commerce Workflow (Primary)

1. **Product Discovery**: User browses categories on optimized landing pages
2. **Cart Management**: Products added to persistent cart with real-time calculations
3. **Geolocation**: Country detection for localized pricing and contact info
4. **Checkout Flow**: Multi-step guided checkout (shipping → payment → confirmation)
5. **Order Processing**: Backend validation, inventory check, and order creation
6. **Real-time Updates**: Live status updates via Socket.IO
7. **Confirmation**: Email notifications and order tracking information

## Excel Processing Workflow (Legacy)

1. **Upload**: Admin uploads Excel file via web interface (`InventoryPage.tsx`)
2. **Detection**: System identifies supplier and loads JSONB format configuration  
3. **Processing**: `ExcelProcessor.ts` applies supplier-specific column mapping
4. **Validation**: Row-by-row validation against business rules and data types
5. **Storage**: Valid products saved to database with complete audit trail
6. **Real-time Updates**: Socket.IO broadcasts processing status to admin dashboard
7. **Reporting**: Detailed summary with successful/failed rows returned to frontend

## Common Development Tasks

### Adding New Product Categories
1. Update category configuration in `HomePageClean.tsx`
2. Add category-specific structured data in `structuredData.ts`
3. Create SEO-optimized landing pages for new categories
4. Update sitemap.xml with new category URLs
5. Test geolocation and WhatsApp integration per country

### Implementing New Cart Features
1. Extend `CartContext.tsx` with new state and actions
2. Update cart components (`CartSidebar.tsx`, `CartModal.tsx`)
3. Add backend API endpoints for new cart functionality
4. Implement real-time synchronization via Socket.IO
5. Add comprehensive testing for cart state management

### SEO Optimization for New Pages
1. Create page-specific SEO configuration using `SEOHead.tsx`
2. Generate appropriate structured data using `structuredData.ts`
3. Update `sitemap.xml` with new URLs and priorities
4. Add OpenGraph and Twitter Card optimization
5. Test meta tag generation and social media sharing

### Database Schema Changes  
1. Create migration: `knex migrate:make description` (in `back/`)
2. Define up/down migrations in generated file
3. Run `npm run db:migrate` to apply changes
4. Update TypeScript interfaces in `back/src/types/index.ts`
5. Update any affected cart or e-commerce functionality

### Running Tests
**Frontend**: `cd front/ && npm test` (Vitest + Testing Library)
**Backend**: `cd back/ && npm test` (Jest + Supertest)
**E2E**: `cd front/ && npm run test:e2e` (Playwright)
**Type Safety**: Run `npm run typecheck` in both directories before commits
**Performance**: `npm run build && npm run preview` for Lighthouse testing
