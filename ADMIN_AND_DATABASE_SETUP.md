# Admin Panel URL & Database Setup

## Why you get 404 on ashgate.co.ke/admin/login

**The admin panel is part of the Laravel backend, not the main website.**

- **ashgate.co.ke** = Next.js frontend (Vercel) — no `/admin` route, so **404 is expected**.
- **Admin panel** = Laravel app (Filament). It must be opened at **the backend URL** where the developer deployed the API.

So:

- **Wrong:** `https://ashgate.co.ke/admin/login` → 404 (that’s the frontend).
- **Correct:** `https://<BACKEND_URL>/admin/login`  
  Examples: `https://api.ashgate.co.ke/admin/login` or `https://backend.ashgate.co.ke/admin/login` (whatever URL the backend is actually deployed at).

The developer should:

1. Deploy the Laravel backend and note its base URL (e.g. `https://api.ashgate.co.ke`).
2. Open **that URL** + `/admin` (e.g. `https://api.ashgate.co.ke/admin`) to use the admin panel.
3. (Optional) Point a subdomain (e.g. `api.ashgate.co.ke`) to that backend so you have a clear, stable admin URL.

---

## Database: two ways to create tables

The developer can either **import the SQL file** you send, or **run Laravel migrations**. Both create the same schema.

### Option A: Import the PostgreSQL schema file (what he asked for)

1. On his server, create an empty database and user (see `DEPLOY_ON_YOUR_SERVER.md`).
2. He receives from you: **`ashgate-database-schema.sql`** (or `database/schema/pgsql-schema.sql` from the repo).
3. Import it into that database:

   ```bash
   psql -U ashgate_user -d ashgate -f ashgate-database-schema.sql
   ```

   Or, if he uses the file from the repo:

   ```bash
   psql -U ashgate_user -d ashgate -f path/to/Ashgate-LTD/database/schema/pgsql-schema.sql
   ```

4. In Laravel `.env`, set `DB_CONNECTION=pgsql` and the same `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
5. He does **not** need to run `php artisan migrate` if he imported this schema (tables already exist). He should still run:
   - `php artisan storage:link`
   - Create an admin user (e.g. via Filament or a seeder) if the schema has no users yet.

### Option B: Use Laravel migrations (no SQL file)

1. Create an empty PostgreSQL database and user.
2. In `.env` set `DB_CONNECTION=pgsql` and the DB credentials.
3. Run:

   ```bash
   composer install --no-dev
   php artisan key:generate
   php artisan migrate --force
   php artisan storage:link
   ```

4. Create the first admin user (e.g. run a user seeder or register via Filament if registration is open).

---

## Summary for the developer

- **Admin URL:** Use the **backend** base URL + `/admin` (e.g. `https://api.ashgate.co.ke/admin`). Do not use `ashgate.co.ke/admin`.
- **Database:** Either import the provided **`ashgate-database-schema.sql`** into his PostgreSQL database, or run **`php artisan migrate`** against an empty database. Then point Laravel `.env` at that database and create an admin user so you can log in.
