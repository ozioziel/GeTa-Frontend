# GeTa Web

Proyecto full stack de GeTa con:

- `client/`: frontend React + Vite
- `Backend/`: API NestJS
- `Backend/database/schema.sql`: esquema y datos iniciales para Supabase/PostgreSQL

## Puesta en marcha

1. Configura el backend:

```powershell
cd Backend
Copy-Item .env.example .env
```

2. Edita `Backend/.env` con tus credenciales de Supabase.

3. Desde la raiz del proyecto, verifica conexion:

```powershell
npm run db:check
```

4. Crea tablas y carreras iniciales:

```powershell
npm run db:setup
```

5. Inicia backend:

```powershell
npm run dev:backend
```

6. Prueba estas rutas:

```text
http://localhost:3000/api
http://localhost:3000/api/health
http://localhost:3000/api/careers
```

7. Inicia frontend:

```powershell
cd client
Copy-Item .env.example .env
npm install
npm run dev
```

El frontend usa `VITE_API_URL=http://localhost:3000/api` por defecto.
