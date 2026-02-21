# Ashgate Admin Not Opening – Checklist (including without terminal)

## 1. Yes, `index.php` is included

- **Location:** `public/index.php` (inside the Laravel project, inside the zip).
- The tech should see a **`public`** folder with **`index.php`** inside it.

If he doesn’t see it, he may be looking in the project root. It’s at:  
**`YourProjectFolder/public/index.php`**.

---

## 2. Document root must point to `public`

The web server (cPanel) must use the **`public`** folder as the document root, **not** the project root.

- **Wrong:** Document root = `.../ashgate` or `.../Ashgate-LTD`  
  → Server looks for `index.php` in the root, Laravel won’t run correctly.
- **Correct:** Document root = `.../ashgate/public` or `.../Ashgate-LTD/public`  
  → Requests hit `public/index.php`, Laravel runs and `/admin` works.

**In cPanel:** Domains → (subdomain or domain) → Document root → set to the path that ends with **`/public`**.

---

## 3. Why the “commands” matter (and what happens without them)

| Command | Why it matters |
|--------|-----------------|
| `php artisan key:generate` | Fills `APP_KEY` in `.env`. Without it, Laravel often shows a blank page or error and the app won’t work. |
| `php artisan config:clear` then `php artisan config:cache` | Loads the current `.env`. Without it, changes to `.env` may not apply. |
| `php artisan storage:link` | Links `public/storage` to `storage/app/public` so Filament/admin assets can load. |
| Create admin user | Without a user in the `users` table (with the right role), there are no login credentials for the admin panel. |

If the tech **cannot run any commands** (no terminal/SSH), then:

- **APP_KEY** must be set in `.env` some other way (see below).
- Config clear/cache can’t be run, so the server might need restart or the host may cache config.
- **Storage link** might be missing, so admin CSS/JS could break.
- **Admin user** must be created another way (e.g. phpMyAdmin).

So yes: **not running those commands can be the reason the admin panel doesn’t open or doesn’t work properly.**

---

## 4. Getting APP_KEY without terminal

**Option A – One-time PHP script (in this repo)**

1. Ensure the file **`public/setup-once.php`** is on the server (it’s in the project).
2. In the browser go to: **`https://api.ashgate.co.ke/setup-once.php`**
3. The page will show a line like: **`APP_KEY=base64:xxxxx...`**
4. Copy that **entire line** into the `.env` file (replace the existing `APP_KEY=` line).
5. **Delete `public/setup-once.php`** from the server after use (security).

**Option B – Generate locally and send**

If you have PHP on your machine (or use a small online PHP runner once):

- Run: `php -r "echo 'APP_KEY=base64:'.base64_encode(random_bytes(32));"`
- Copy the output and send it to the tech to put in `.env`.

---

## 5. Creating the first admin user without terminal (phpMyAdmin)

If the tech has **phpMyAdmin** but no terminal:

1. In phpMyAdmin, open the **`users`** table of the Ashgate database.
2. Add a new row (Insert) with at least:
   - `name`: e.g. **Admin**
   - `email`: e.g. **admin@ashgate.co.ke** (this will be the login)
   - `password`: a **bcrypt hash** of the chosen password (see below)
   - `email_verified_at`: **CURRENT_TIMESTAMP** or a date
   - `role`: **admin**
   - `is_active`: **1**
   - `created_at`, `updated_at`: **CURRENT_TIMESTAMP** (or leave default if the table allows)

To get a **bcrypt hash** for the password:

- You can run locally (PHP):  
  `php -r "echo password_hash('YourChosenPassword', PASSWORD_BCRYPT);"`
- Or use an online bcrypt generator once (choose “bcrypt”) and paste the hash into the `password` column.

Then the tech (or you) can log in at **api.ashgate.co.ke/admin** with that email and the chosen password.

---

## 6. Quick checklist for the tech

- [ ] Document root is set to the **`public`** folder (so `index.php` is used).
- [ ] **APP_KEY** is set in `.env` (via setup-once.php or generated and sent).
- [ ] **Delete `public/setup-once.php`** after copying APP_KEY.
- [ ] If possible, run: `php artisan config:clear` and `php artisan config:cache` (cPanel “Terminal” or SSH if the host provides it).
- [ ] First admin user exists in `users` (created via phpMyAdmin or tinker).
- [ ] Try **https://api.ashgate.co.ke/admin** (or **https://api.ashgate.co.ke/admin/login**).

---

## 7. Admin URL

- Use: **https://api.ashgate.co.ke/admin**  
  (Filament may redirect to `/admin/login` for the login form.)

Summary: **index.php is included** in `public/index.php`; the main issues are usually **document root not set to `public`** and **APP_KEY / admin user not set**, especially when the commands can’t be run. Use the steps above to set APP_KEY and the first user without terminal access.
