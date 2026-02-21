# Get the Admin URL Working – Checklist

If **nothing loads** when you open `https://api.ashgate.co.ke/admin` (or whatever URL you use), work through this list. The problem is usually: **backend not reachable at that URL**, or **wrong .env / web server config**.

---

## 1. Is the backend actually deployed at a URL?

The Laravel app must be:

- On a **server** (e.g. cPanel/InMotion) with PHP and the code in a folder.
- **Reachable via a URL**: either a subdomain (e.g. `api.ashgate.co.ke`) or the host’s domain (e.g. `yourdomain.com`).

**Check:** Open the **exact URL** where you think the backend is (e.g. `https://api.ashgate.co.ke` or `https://yourdomain.com`) in the browser.

- **Blank page / connection error / 404** → That URL is not serving the Laravel app. Go to **Step 2**.
- **Laravel welcome page or any Laravel response** → Backend is there. Admin = **that same URL + `/admin`**. Go to **Step 3** to fix .env if needed.

---

## 2. Point the domain to Laravel’s `public` folder (cPanel)

On cPanel/InMotion:

1. **Domains / Subdomains**
   - Create a **subdomain** (e.g. `api`) for `ashgate.co.ke` → `api.ashgate.co.ke`,  
     **or** use an addon domain.
   - Set the **document root** for that (sub)domain to the **Laravel `public`** folder.  
     Example: `/home/username/ashgate-backend/public`  
     **Not** `/home/username/ashgate-backend` (root of the project).

2. **DNS**
   - If the domain is on the same host, cPanel usually sets this.
   - If `api.ashgate.co.ke` is on another DNS (e.g. Cloudflare), add an **A** or **CNAME** record pointing to the server IP (or hostname) where the Laravel app runs.

After this, opening `https://api.ashgate.co.ke` (or your chosen URL) should show something from Laravel (welcome page or error), not a blank page.

---

## 3. .env on the server (must match the URL)

On the **same server** where the Laravel code lives, edit the **`.env`** in the project root (not in `public`).

Set:

```env
APP_URL=https://api.ashgate.co.ke
```

(Use the **exact** URL you use to open the backend – no trailing slash.)

Also ensure:

- `APP_KEY=` has a value (run `php artisan key:generate` if it’s empty).
- `APP_DEBUG=true` **temporarily** so you see errors instead of a blank page (set back to `false` later).
- DB settings match the database you created:
  - `DB_CONNECTION=mysql`
  - `DB_HOST=...`
  - `DB_DATABASE=...`
  - `DB_USERNAME=...`
  - `DB_PASSWORD=...`

Then:

```bash
php artisan config:clear
php artisan config:cache
```

---

## 4. Test the backend base URL, then admin

1. Open **only the base URL** in the browser, e.g. `https://api.ashgate.co.ke`.  
   You should get a Laravel page (welcome or error), not “can’t connect” or blank.

2. Then open **admin**: `https://api.ashgate.co.ke/admin`.  
   You should get the Filament login page.

If the base URL works but `/admin` is 404, the code might be old or routes cached: run `php artisan route:clear` and `php artisan route:cache` (or `php artisan route:list` and check for `admin`).

---

## 5. GitHub / codebase

- **Pushing the latest code to GitHub** does **not** by itself change what’s on the server. The developer must **pull** (or re-deploy) on the server to get new code.
- If he deployed from a **zip** and never set up a domain or document root, the “admin URL” will show nothing until **Step 2** is done.
- So: **first** make sure the backend is reachable at one URL (Step 1–2), **then** set `APP_URL` in .env to that URL (Step 3), then use **that URL + `/admin`** as the admin URL.

---

## Quick summary

| Problem | What to do |
|--------|------------|
| URL shows nothing / can’t connect | Backend not deployed at that URL or DNS wrong. Create subdomain, set **document root = Laravel `public`**, fix DNS. |
| URL loads but not Laravel | Document root is wrong (must be `.../public`). |
| Laravel loads but /admin 404 | Clear route cache; ensure code has Filament and `admin` route. |
| Blank or 500 with no message | Set `APP_DEBUG=true` in .env, run `php artisan config:clear`, check `storage/logs/laravel.log`. |
| Admin URL | **Always** = backend base URL + `/admin` (e.g. `https://api.ashgate.co.ke/admin`). |

Once the **base URL** shows Laravel, set that same URL as `APP_URL` in `.env`; the **admin URL** is that base URL + **`/admin`**.
