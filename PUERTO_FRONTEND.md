# ⚠️ CONFIGURACIÓN CRÍTICA DEL FRONTEND

## PUERTO DEL FRONTEND EN DESARROLLO LOCAL

**EL FRONTEND SIEMPRE DEBE CORRER EN PUERTO 3000 EN LOCAL**

### ✅ Configuración Actual

1. **vite.config.ts** - Puerto configurado en línea 22:
   ```typescript
   server: {
     port: 3000,
     host: true,
     // ...
   }
   ```

2. **Backend .env** - URLs del frontend:
   ```bash
   FRONTEND_URL=http://localhost:3000
   ADMIN_FRONTEND_URL=http://localhost:3000
   ```

3. **Backend .env.example** - Template con puerto correcto:
   ```bash
   FRONTEND_URL=http://localhost:3000
   ADMIN_FRONTEND_URL=http://localhost:3000
   ```

### 🚨 ANTES DE HACER CUALQUIER CAMBIO

**SIEMPRE VALIDAR QUE:**
- El frontend corre en puerto 3000
- El backend está configurado para puerto 3000 del frontend
- Todas las URLs apuntan a puerto 3000

### 📋 Checklist de Validación

- [ ] `vite.config.ts` tiene `port: 3000`
- [ ] Backend `.env` tiene `FRONTEND_URL=http://localhost:3000`
- [ ] Backend `.env.example` tiene `FRONTEND_URL=http://localhost:3000`
- [ ] Documentación menciona puerto 3000
- [ ] Todos los scripts apuntan a puerto 3000

### 🔧 Comandos de Verificación

```bash
# Verificar configuración de Vite
grep -n "port:" front/vite.config.ts

# Verificar configuración del backend
grep -n "FRONTEND_URL" back/.env
grep -n "FRONTEND_URL" back/.env.example

# Verificar que el frontend inicie en puerto 3000
cd front && npm run dev
```

### 📚 URLs del Sistema

- **Frontend**: http://localhost:3000 ⚠️ **SIEMPRE PUERTO 3000**
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs
  

---

**RECORDATORIO: NUNCA CAMBIAR EL PUERTO 3000 DEL FRONTEND EN DESARROLLO LOCAL**
