# Admin UI (`/admin`)

The admin app is a React SPA **mounted at `/admin`** on the same dev server as the marketing site.

## Run (project root)

```bash
cd ..   # repo root (parent of this folder)
cp .env.example .env.local   # add Supabase keys
npm install
npm run dev
```

- Marketing site: **http://localhost:8080/**
- Admin: **http://localhost:8080/admin/login**

`VITE_*` variables live in **`.env.local` at the repo root** (not inside `admin/`).

## Production static hosting

After `npm run build`, deploy the `dist/` folder. Use SPA fallback so `/admin/*` serves `admin/index.html` (see root `serve.json` for the `serve` CLI).
