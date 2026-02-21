# Deploy Ashgate Backend & Database on Your Server

This guide is for deploying the **Ashgate Laravel backend** and **database** on your own server. The application and the database are **separate**: this repo contains only the application code and schema (migrations). You create and run the database (PostgreSQL) on your server and point the app to it via environment variables.

---

## 1. How Database and Code Are Separated

| What | Where | Who sets it up |
|------|--------|----------------|
| **Application code** | This GitHub repo (Laravel + API + Filament admin) | Clone from GitHub |
| **Database schema** | In the repo as Laravel **migrations** (`database/migrations/`) | Applied by you with `php artisan migrate` |
| **Database server** | **Not in the repo** – PostgreSQL (and optionally Redis) on your server | You create the DB and user, then configure `.env` |

So: you **create a PostgreSQL database (and optionally Redis) on your server**, then configure the Laravel app to use it. No database credentials or data live in the repo; everything is in `.env` (which is not committed).

---

## 2. Prerequisites on Your Server

- PHP 8.2+ with extensions: `php-pgsql`, `php-redis` (if using Redis), `php-mbstring`, `php-xml`, `php-curl`, `php-zip`, `php-gd`, etc.
- Composer
- PostgreSQL 14+ (installed and running)
- (Optional) Redis – for cache/sessions if you prefer over database
- Web server: Nginx or Apache with PHP-FPM

---

## 3. Step 1: Create the Database (PostgreSQL)

On your server, create a dedicated database and user for Ashgate. The app will connect to this; it is **separate** from the codebase.

```bash
# Example: connect as postgres superuser and run:

sudo -u postgres psql

CREATE USER ashgate_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE ashgate OWNER ashgate_user;
GRANT ALL PRIVILEGES ON DATABASE ashgate TO ashgate_user;
\q
```

Keep `ashgate_user` and `your_secure_password` (and the DB name if you change it) for the next step.

---

## 4. Step 2: Clone Repo and Install Dependencies

```bash
git clone https://github.com/YOUR_ORG/Ashgate-LTD.git
cd Ashgate-LTD

composer install --optimize-autoloader --no-dev
```

(Use your actual repo URL. For local/production dev you can use `composer install` without `--no-dev`.)

---

## 5. Step 3: Configure Environment (Point App to Your Database)

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set at least:

- **Database (required)** – use the PostgreSQL you created in Step 1:
  - `DB_CONNECTION=pgsql`
  - `DB_HOST=127.0.0.1` (or your DB host)
  - `DB_PORT=5432`
  - `DB_DATABASE=ashgate`
  - `DB_USERNAME=ashgate_user`
  - `DB_PASSWORD=your_secure_password`
- **App**
  - `APP_URL=https://api.yourdomain.com` (your backend base URL)
  - `APP_KEY` is set by `key:generate`
- **CORS & Sanctum** – your frontend origin(s):
  - `CORS_ALLOWED_ORIGINS=https://www.ashgate.co.ke,https://ashgate.co.ke`
  - `SANCTUM_STATEFUL_DOMAINS=www.ashgate.co.ke,ashgate.co.ke`
- **Mail** – SMTP settings if you use mail (e.g. password reset).
- **Storage** – `FILESYSTEM_DISK=public` for local disk, or configure Cloudflare R2 (see `.env.example`).

All variables are documented in `.env.example`. The database is **only** configured here; nothing is stored in the repo.

---

## 6. Step 4: Run Migrations (Create Tables in Your Database)

This applies the schema from the repo to **your** PostgreSQL database:

```bash
php artisan migrate --force
```

Optional: seed initial data if you have seeders:

```bash
php artisan db:seed --force
```

---

## 7. Step 5: Storage and Caches

```bash
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 8. Step 6: Web Server and Scheduler (Optional)

- Point your Nginx/Apache document root to `Ashgate-LTD/public` and use PHP-FPM for `index.php`.
- For scheduled tasks (e.g. cleanup), add a cron entry:
  `* * * * * cd /path/to/Ashgate-LTD && php artisan schedule:run >> /dev/null 2>&1`

---

## 9. Summary: What Lives Where

- **In the repo:** Laravel app, migrations (schema), seeders, config. **No database server or credentials.**
- **On your server:** PostgreSQL (and optionally Redis), web server, PHP, and the `.env` that connects the app to your database and other services.

The developer deploys the **backend** from this repo and the **database** by creating PostgreSQL (and optionally Redis) on their server and configuring `.env`; the “separation” is that the database is external and configured only via environment variables.

---

## 10. Quick Checklist for the Developer

- [ ] PostgreSQL installed and running; database and user created.
- [ ] Repo cloned; `composer install` run.
- [ ] `.env` created from `.env.example`; `DB_*`, `APP_URL`, `APP_KEY`, `CORS_ALLOWED_ORIGINS`, `SANCTUM_STATEFUL_DOMAINS` set.
- [ ] `php artisan migrate --force` run.
- [ ] `php artisan storage:link` run.
- [ ] Web server points to `public/`; API and Filament admin are reachable.
- [ ] Frontend `NEXT_PUBLIC_API_URL` (or equivalent) set to this backend URL.

For more context (e.g. Railway/Vercel), see `DEPLOYMENT_GUIDE.md` and `ENV_VARIABLES_CHECKLIST.md`.
