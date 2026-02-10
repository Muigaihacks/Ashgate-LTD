# Backend migration checklist (Railway → new host)

Use this when your tech person hosts the backend on their platform. It lists what you need from your current Railway setup and what the new host must support.

---

## What you need from Railway (before/during migration)

### 1. Environment variables (copy from Railway dashboard)

In Railway: **Your backend project → Variables**. Copy every variable; you’ll re‑enter them on the new platform (syntax may change).

**Critical ones:**

| Variable | Purpose |
|----------|--------|
| `APP_KEY` | Laravel encryption (must keep the same value) |
| `APP_URL` | Will become your new backend URL (e.g. `https://api.ashgate.co.ke`) |
| `APP_ENV=production` | `APP_DEBUG=false` |

### 2. PostgreSQL connection details

Railway gives you:

- **Host** (e.g. `xxx.railway.internal` or public host)
- **Port** (usually `5432`)
- **Database name**
- **Username**
- **Password**

**Options on the new host:**

- **A)** They provide a new Postgres DB → you’ll get new host/port/database/user/password. You then:
  - Export DB from Railway (see below).
  - Import into their Postgres.
- **B)** They let you keep using Railway Postgres → you only give them the connection string or the 5 values above so the backend can connect.

### 3. Database export (if you’re moving to their Postgres)

From your machine (with Railway CLI and access to the project):

```bash
# If Railway CLI is linked to your project:
railway run pg_dump -Fc $DATABASE_URL > ashgate_backup.dump
```

Or from Railway dashboard: **Postgres service → Data → Export** (if available).

You’ll **import** this into the new host’s Postgres using their instructions (e.g. `pg_restore` or their UI).

---

## What the new host must support

### 1. Runtime

- **PHP** (Laravel): project likely needs **PHP 8.1+**.
- **Composer** to install dependencies.
- **Node/npm** only if they build frontend assets; if you deploy pre-built assets, PHP + Composer may be enough.

### 2. Database

- **PostgreSQL** (your DB is Postgres).
- You need a way to set these in the environment (or in a `.env`):

  - `DB_CONNECTION=pgsql`
  - `DB_HOST=...`
  - `DB_PORT=5432`
  - `DB_DATABASE=...`
  - `DB_USERNAME=...`
  - `DB_PASSWORD=...`

### 3. Cloudflare R2 (images/videos)

Your app uses **Cloudflare R2** (S3-compatible) for media. No change needed to R2 itself; the backend only needs the right env vars.

**R2 env vars to set on the new host** (from your current backend `.env` or Railway):

```env
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET=...
CLOUDFLARE_R2_URL=...        # e.g. https://pub-xxx.r2.dev or your custom domain
CLOUDFLARE_R2_ENDPOINT=...   # e.g. https://xxx.r2.cloudflarestorage.com
```

If they don’t support arbitrary env vars, ask how to configure these (e.g. “S3-compatible storage” or “custom env vars”).

### 4. Other env vars to bring over

From **Railway** (see also `ENV_VARIABLES_CHECKLIST.md`):

- **Mail (SMTP):** `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`
- **CORS:** `CORS_ALLOWED_ORIGINS` — set to your frontend URL(s), e.g. `https://ashgate.co.ke,https://www.ashgate.co.ke`
- **Session/cache/queue:** `SESSION_DRIVER=database`, `CACHE_DRIVER=database`, `QUEUE_CONNECTION=database` (if they support background jobs; otherwise `sync` for queue)

---

## After the backend is live on the new host

1. **Run migrations** (if DB was recreated):  
   `php artisan migrate --force`
2. **Storage link** (if they use local/public disk for anything):  
   `php artisan storage:link`
3. **Frontend:** Update `NEXT_PUBLIC_API_URL` (Vercel or wherever the frontend is hosted) to the new backend URL.
4. **CORS:** Ensure `CORS_ALLOWED_ORIGINS` on the new backend includes your frontend domain(s).

---

## Quick list to ask the tech person

- Do you support **PHP 8.1+** and **Composer**?
- Can I use **PostgreSQL**? Do you provide it or do I bring my own (e.g. export/import from Railway)?
- Can I set **custom environment variables** (for Laravel, R2, SMTP, CORS)?
- How do I deploy? (e.g. Git push, Docker, upload build, CI/CD?)
- What will be the **backend URL** so I can set `APP_URL` and frontend `NEXT_PUBLIC_API_URL`?

Once you have their answers (and how they want you to get access), you can plug your Railway env vars and DB export into their process using this checklist.
