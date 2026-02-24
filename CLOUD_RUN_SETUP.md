# Deploy Ashgate API on Cloud Run – Full Step-by-Step Guide

This guide assumes you **already have a GCP project** (e.g. **Ashgate-production**) and have never used Cloud Run. We will:

- Use **Cloud SQL for MySQL** (same as your VM: database `ashgate`, user `ashgate`).
- Keep the **same Filament admin login** (e.g. `admin@ashgate.co.ke` and the same password).
- Use **HTTPS automatically** – **no Certbot**. Cloud Run provides HTTPS for you.
- Point **api.ashgate.co.ke** at the backend when your tech does DNS.

---

## Do you still need Certbot (Part 13 from the VM guide)?

**No.** When the API runs on Cloud Run:

- Cloud Run gives you **HTTPS by default** on the `*.run.app` URL.
- When you add the custom domain **api.ashgate.co.ke** to your Cloud Run service, **Google provisions the SSL certificate** for that domain. You do **not** run Certbot on any server. Your tech only needs to add the DNS record you get from the Cloud Run console; HTTPS is handled by GCP.

So: **skip Part 13 (Certbot) entirely** for the backend once it’s on Cloud Run.

---

## What to tell your tech for DNS

Give this to whoever manages **ashgate.co.ke**:

| Purpose | Domain | What they should do |
|--------|--------|----------------------|
| **Frontend** | **ashgate.co.ke** (and **www.ashgate.co.ke** if you use it) | Point to wherever the frontend is hosted (e.g. Vercel). Usually a **CNAME** to the host they give you (e.g. `cname.vercel-dns.com`) or the A/CNAME they provide. |
| **Backend (API + admin)** | **api.ashgate.co.ke** | After you finish the “Custom domain” step below, Cloud Run will show a **CNAME target** (e.g. `ghs.googlehosted.com` or a `*.run.app`-style target). They should add a **CNAME** record: **Name** = `api`, **Target** = that CNAME (exactly as shown in the Cloud Console). Do **not** use an A record unless the console says so. |

You’ll get the exact **api.ashgate.co.ke** target in **Part 8** below.

---

# PART 1: Enable the right APIs

1. In **Google Cloud Console**, make sure the project **Ashgate-production** (or your project name) is selected at the top.
2. Open the **Navigation menu** (☰) → **APIs & Services** → **Library**.
3. Search for and **Enable** these (click the API, then **Enable**):
   - **Cloud Run API**
   - **Artifact Registry API** (for storing your container image)
   - **Cloud SQL Admin API** (for Cloud SQL)
   - **Cloud Build API** (to build the image in the cloud)

---

# PART 2: Create the MySQL database (Cloud SQL) – same as VM

In GCP, **Cloud SQL** is where you create managed MySQL instances. There is no separate “Databases” menu—use **Cloud SQL** in the left navigation; that’s the right place.

We create a **Cloud SQL for MySQL** instance with the **same database name and user** as on your VM so your app and credentials stay the same.

**2.1 – Create the Cloud SQL instance**

1. **Navigation menu** (☰) → **Cloud SQL** (or search “Cloud SQL”). Open **Get started** or **Instances**.
2. You may see:
   - A **“Create free instance”** / **“Experience Cloud SQL at no cost for 30 days”** form (Instance ID, Password, Region). That form uses **fixed** specs (e.g. 8 vCPU, 64 GB, 100 GB) and **no** machine-type or storage options—so it’s not ideal if you want a small instance and less storage.
   - **“Create custom instance”** (often at the top), or three cards: **Sandbox**, **Development**, **Production**.
3. **Use “Create custom instance”** so you can set **region**, **machine type**, and **storage** yourself. Click **Create custom instance**.
4. In the creation form:
   - **Choose MySQL** (if asked).
   - **Instance ID:** e.g. `ashgate-db` (lowercase, letters, numbers, hyphens).
   - **Password:** Set a strong password for the **root** user and save it (you need it once to create the DB and user). You can use the same root password as yesterday if you prefer.
   - **Region:** Pick the region you want for latency (e.g. **us-east1 (South Carolina)**). You have **not** created the Cloud Run service yet—we do that in Part 4. When we do, we’ll create the Cloud Run service in the **same** region as this Cloud SQL instance (e.g. us-east1). So: choose **us-east1** here, and in Part 4 choose **us-east1** for Cloud Run. No conflict—just use the same region for both.
   - **Zonal availability:** Single zone is enough to start.
   - **Machine type:** Pick a small one (e.g. **Shared core**, 1 vCPU, or the smallest available). You don’t need a large instance for the Laravel app.
   - **Storage:** Since videos and images are on **Cloudflare**, the database only holds app data (users, content metadata, etc.). **10–20 GB** is plenty. Set to **10 GB** (or 20 GB if you prefer a bit of headroom).
5. Click **CREATE INSTANCE**. Wait until the instance shows a green tick and is **Running**.

**If you only see “Create free instance” and no “Create custom instance”:** Use the free-instance form if you like (Instance ID `ashgate-db`, password, region **us-east1**), then click **Create free instance**. You’ll get a larger default machine and 100 GB storage for 30 days; you can resize or create a smaller instance later. For a smaller, long-term instance, look for **Create custom instance** in the same Cloud SQL Get started / Instances page (sometimes at the top of the page).

**2.2 – Create the database and user (same as VM)**

1. Click the instance name (e.g. **ashgate-db**).
2. Open the **Databases** tab → **CREATE DATABASE**.
   - **Database name:** `ashgate`
   - Click **Create**.
3. Open the **Users** tab → **ADD USER ACCOUNT**.
   - **User type:** **Built-in**.
   - **Username:** `ashgate`
   - **Password:** Use the **same password** you used for the `ashgate` MySQL user on the VM (so your `.env` stays the same).
   - Click **Add**.

**2.3 – (Optional) Migrate existing data from the VM**

If your VM MySQL already has the admin user and other data and you want to **keep everything** (same login, same data):

1. From the VM (or from your PC with access to the VM’s MySQL), export the database:
   ```bash
   mysqldump -u ashgate -p ashgate > ashgate-backup.sql
   ```
2. In Cloud Console, open your Cloud SQL instance → **Databases** → ensure `ashgate` exists.
3. Use **Cloud SQL Auth Proxy** on your PC to connect to the Cloud SQL instance, then import:
   ```bash
   mysql -u ashgate -p -h 127.0.0.1 ashgate < ashgate-backup.sql
   ```
   Then you **don’t need to run Part 5** (create admin user) – the existing user and data are already there.

If you prefer a **fresh** database, skip this and run migrations from the container (Part 4) and create the admin user in Part 5.

**2.4 – Note the connection name**

1. On the instance overview page, find **Connection name**. It looks like:  
   `ashgate-production:us-east1:ashgate-db`  
   (format: `PROJECT_ID:REGION:INSTANCE_ID`; the region will match what you chose, e.g. us-east1).
2. **Copy and save** this; you’ll use it as the Cloud SQL connection in Cloud Run and for `DB_SOCKET`.

---

# PART 3: Build and push the container image

We build the image in the cloud with **Cloud Build**, using the **MySQL** Dockerfile so it matches your VM setup.

**3.1 – Create an Artifact Registry repository (one-time)**

1. **Navigation menu** → **Artifact Registry** → **Repositories**.
2. **CREATE REPOSITORY**.
3. **Name:** e.g. `ashgate`.
4. **Format:** **Docker**.
5. **Mode:** **Standard**.
6. **Location type:** **Region**; **Region:** use the same region as Cloud SQL and Cloud Run (e.g. **us-east1**).
7. Click **Create**.

**3.2 – Build the image from your machine**

You need the **Google Cloud SDK** (`gcloud`) on your computer. If you don’t have it: [Install the gcloud CLI](https://cloud.google.com/sdk/docs/install).

1. Open a terminal (or PowerShell) on your **PC** (not the VM).
2. Log in and set project:
   ```bash
   gcloud auth login
   gcloud config set project Ashgate-production
   ```
   (Use your actual project ID if different.)
3. Go to your **Ashgate-LTD** repo (where the Dockerfile and code are):
   ```bash
   cd /path/to/Ashgate-LTD
   ```
4. Build using the **Cloud Run Dockerfile** (MySQL support) and push to Artifact Registry. Replace `REGION` and `ashgate` if you used different names (e.g. use `us-east1` if that’s your Cloud SQL/Cloud Run region):
   ```bash
   gcloud builds submit --config cloudbuild.yaml .
   ```
   This can take several minutes. When it finishes, the image will be in Artifact Registry.

**If you don’t have gcloud on your PC:** In the Cloud Console go to **Cloud Build** → **History** and use **Submit build** (trigger from GitHub or upload source). Use **Dockerfile.cloudrun** as the Dockerfile path and the same tag.

**Deploying new code later:** Cloud Run serves a **container image**. To get new code live: (1) Push your changes to GitHub. (2) Build a **new** image from the repo: `gcloud builds submit --config cloudbuild.yaml .` (from the repo root). (3) In Cloud Run, open the **ashgate-api** service → **Edit & deploy new revision** → leave the image as **latest** (Cloud Build will have updated the `latest` tag) or select the new image/tag → **Deploy**. A plain “Redeploy” without building a new image keeps the old code.

---

**Quick rebuild & redeploy (after pushing to GitHub):**

1. **From your machine** (in the Ashgate-LTD repo):  
   `cd /path/to/Ashgate-LTD` then `gcloud config set project Ashgate-production` and `gcloud builds submit --config cloudbuild.yaml .`  
   Wait for the build to finish. The new image is in Artifact Registry as `latest`.

2. **Deploy:** Cloud Console → **Cloud Run** → **ashgate-api** → **EDIT & DEPLOY NEW REVISION** → confirm container image (e.g. `REGION-docker.pkg.dev/Ashgate-production/ashgate/ashgate-api:latest`) → **DEPLOY**.

3. **Verify:** Visit `https://api.ashgate.co.ke`, log in, add a listing or upload a file to confirm new code and R2.

---

# PART 4: Deploy the service to Cloud Run

**4.1 – Create the service**

1. **Navigation menu** → **Cloud Run** → **Create Service**.
2. **Deploy one revision from an existing container image**.
3. Click **SELECT** next to **Container image URL**.
   - Choose **Artifact Registry** and the repo you created (e.g. `ashgate`).
   - Select the image **ashgate-api**, tag **latest** (or the tag you used).
   - Click **Select**.
4. **Service name:** e.g. `ashgate-api`.
5. **Region:** Use the **same region** you used for Cloud SQL (e.g. **us-east1** if you chose that for lower latency).
6. Click **CONFIGURE** (or expand **Container, Variables and Secrets, Connections, Security**).

**4.2 – Container configuration**

1. **Container port:** `8080` (the Caddyfile listens on 8080 / PORT).
2. **Environment variables** – Add these (use **Add variable** for each). Use the **same** values you had on the VM where possible:

   | Name | Value (example; use your real values) |
   |------|--------------------------------------|
   | `APP_NAME` | `Ashgate Limited` |
   | `APP_ENV` | `production` |
   | `APP_KEY` | Your existing Laravel `APP_KEY` from the VM (from `.env`) |
   | `APP_DEBUG` | `false` |
   | `APP_URL` | `https://api.ashgate.co.ke` |
   | `DB_CONNECTION` | `mysql` |
   | `DB_HOST` | `127.0.0.1` (when using socket below) |
   | `DB_PORT` | `3306` |
   | `DB_DATABASE` | `ashgate` |
   | `DB_USERNAME` | `ashgate` |
   | `DB_PASSWORD` | The **same** password you set for the `ashgate` Cloud SQL user |
   | `DB_SOCKET` | `/cloudsql/PROJECT_ID:REGION:INSTANCE_ID` (e.g. `/cloudsql/ashgate-production:us-east1:ashgate-db` if your instance is in us-east1) |
   | `CORS_ALLOWED_ORIGINS` | `https://www.ashgate.co.ke,https://ashgate.co.ke,https://api.ashgate.co.ke` |
   | `SANCTUM_STATEFUL_DOMAINS` | `www.ashgate.co.ke,ashgate.co.ke,api.ashgate.co.ke` |

   Add **all** of the variables from the **Full environment variable list** below (including Mail, Cloudflare R2, and any Redis/Recaptcha you use). For secrets (APP_KEY, DB_PASSWORD, MAIL_PASSWORD, R2 keys), you can use **Secret Manager** (Reference a secret) instead of plain variables.

**4.3 – Where to get the values (you don’t have VM access)**

- You **don’t** have the VM’s `.env` file. Use:
  1. **ENV_FOR_GCP_REFERENCE.txt** in this repo – same list of variable names; fill from the sources below.
  2. **Cloudflare R2:** Cloudflare dashboard → R2 → your bucket → **Manage R2 API Tokens** (or Object Storage → API Tokens). Copy Access Key ID, Secret Access Key; bucket name and endpoint/URL are on the bucket page.
  3. **Mail:** Whoever set up **mail.ashgate.co.ke** (or your SMTP provider) has the host, port, username, password. Ask your tech or check the provider’s dashboard (e.g. cPanel email, Mailgun, SendGrid). Your local `.env` might have had these for dev – only use if they match production.
  4. **APP_KEY:** If you had the backend on Railway before, the key might be in Railway’s env. Otherwise generate one locally: `php artisan key:generate --show` (in the repo) and use that.
  5. **Redis:** On the VM you may have used Redis. On Cloud Run you can **skip Redis**: set `QUEUE_CONNECTION=database`, `CACHE_STORE=database`, `SESSION_DRIVER=database` (no REDIS_* needed). If you want Redis, use a hosted Redis (e.g. Redis Cloud, Upstash) and set REDIS_HOST (and REDIS_PASSWORD if required) to that service’s URL/host.
  6. **Recaptcha (if used):** From [Google reCAPTCHA admin](https://www.google.com/recaptcha/admin) – same site key and secret you used on the VM.

**4.4 – Full environment variable list (copy into Cloud Run)**

Use this as the checklist. Set each in Cloud Run **Variables** (or **Secrets** for sensitive ones).

| Variable | Where to get it / example value |
|----------|----------------------------------|
| `APP_NAME` | `Ashgate Limited` |
| `APP_ENV` | `production` |
| `APP_KEY` | From Railway or `php artisan key:generate --show` (Secret Manager recommended) |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://api.ashgate.co.ke` |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `127.0.0.1` (with Cloud SQL socket) |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | `ashgate` |
| `DB_USERNAME` | `ashgate` |
| `DB_PASSWORD` | Same as Cloud SQL user `ashgate` (Secret Manager recommended) |
| `DB_SOCKET` | `/cloudsql/PROJECT_ID:REGION:INSTANCE_ID` (e.g. `/cloudsql/ashgate-production:us-east1:ashgate-db`) |
| `CORS_ALLOWED_ORIGINS` | `https://www.ashgate.co.ke,https://ashgate.co.ke,https://api.ashgate.co.ke` |
| `SANCTUM_STATEFUL_DOMAINS` | `www.ashgate.co.ke,ashgate.co.ke,api.ashgate.co.ke` |
| `FILESYSTEM_DISK` | `r2` (or `public` if not using R2 yet) |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | Cloudflare R2 → API token (Secret Manager recommended) |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | Cloudflare R2 → API token (Secret Manager recommended) |
| `CLOUDFLARE_R2_BUCKET` | Your R2 bucket name |
| `CLOUDFLARE_R2_URL` | R2 bucket public URL (e.g. `https://pub-xxx.r2.dev` or your custom domain) |
| `CLOUDFLARE_R2_ENDPOINT` | R2 endpoint URL (e.g. `https://ACCOUNT_ID.r2.cloudflarestorage.com`) |
| `MAIL_MAILER` | `smtp` |
| `MAIL_HOST` | Your SMTP host (e.g. `mail.ashgate.co.ke`) |
| `MAIL_PORT` | `465` or `587` (SSL vs TLS) |
| `MAIL_USERNAME` | e.g. `info@ashgate.co.ke` |
| `MAIL_PASSWORD` | SMTP password from your mail provider (Secret Manager recommended) |
| `MAIL_ENCRYPTION` | `ssl` (port 465) or `tls` (port 587) |
| `MAIL_FROM_ADDRESS` | `info@ashgate.co.ke` |
| `MAIL_FROM_NAME` | `Ashgate Limited` |
| `QUEUE_CONNECTION` | `database` (no Redis on Cloud Run unless you add hosted Redis) |
| `CACHE_STORE` | `database` |
| `SESSION_DRIVER` | `database` |
| `REDIS_HOST` | Only if using hosted Redis; else omit or leave default |
| `REDIS_PASSWORD` | Only if using hosted Redis |
| `REDIS_PORT` | `6379` if using Redis |
| `ACTIVITY_LOGGER_ENABLED` | `true` |
| `ACTIVITY_LOGGER_TABLE_NAME` | `activity_log` |
| `RECAPTCHA_SITE_KEY` | From Google reCAPTCHA admin (if you use it) |
| `RECAPTCHA_SECRET_KEY` | From Google reCAPTCHA admin (if you use it) |
| `HASH_DRIVER` | `argon2id` (optional) |

**4.4a – Common clarifications**

- **Volumes:** You do **not** need to set up the Volumes section for photos/videos. On Railway, the container disk was ephemeral so uploads were lost on redeploy. Here you store files in **Cloudflare R2** (via `FILESYSTEM_DISK=r2` and the R2 env vars). The app uploads to R2, not to the container filesystem, so nothing in the container needs to persist. Leave Volumes empty unless you have another reason to mount storage (e.g. a GCP bucket).
- **Geoapify, Maptiler, etc.:** Those keys live in your **frontend** (e.g. `frontend/.env.local`) and are used by the Next.js/app that runs on Vercel or elsewhere. The Cloud Run service is the **Laravel API only**. The API does not use map keys, so do **not** add Geoapify/Maptiler (or any frontend-only keys) to Cloud Run.
- **Mail – Office 365:** Laravel has no separate `office365` mailer. For Office 365 / Outlook you use **SMTP**: set `MAIL_MAILER=smtp`, `MAIL_HOST=smtp.office365.com`, and your Office 365 email and app password (or account password) for `MAIL_USERNAME` and `MAIL_PASSWORD`. Port is usually `587` with `MAIL_ENCRYPTION=tls`. So “Office 365” = same as SMTP with Office 365’s host and credentials.
- **MAIL_PASSWORD (and other secrets):** In Cloud Run’s Variables (or Secret Manager), enter the **raw** password only. Do **not** include double quotes `"` around the value—those would be treated as part of the password and authentication would fail.
- **DB_SOCKET:** Cloud SQL shows the connection name as `ashgate-production:us-east1:ashgate-db` (no prefix). For Laravel you must use the **full Unix socket path**. Set `DB_SOCKET` to **`/cloudsql/ashgate-production:us-east1:ashgate-db`** (with the `/cloudsql/` prefix). So: take the connection name from the console and put `/cloudsql/` in front of it.

**4.5 – Connect Cloud SQL**

1. Open the **Connections** tab (or **Connections** in the create form).
2. Under **Cloud SQL connections**, click **ADD CONNECTION**.
3. Select your instance (e.g. **ashgate-db**).
4. Confirm.

**4.6 – Create the service**

1. Leave **Authentication** as **Require authentication** if you want only logged-in/invoked access, or set to **Allow unauthenticated invocations** so the API and admin can be reached by the browser (you’ll need this for **https://api.ashgate.co.ke** and **https://api.ashgate.co.ke/admin**).
2. Click **CREATE**. Wait until the service is deployed and you see a green tick and a URL like `https://ashgate-api-xxxxx-uc.a.run.app`.

**4.7 – Test**

Open that URL in the browser. You should see the Laravel welcome page or your app. Then open **https://YOUR_SERVICE_URL/admin**. The first time, the container will run migrations (in the entrypoint). If you see a login page, the app is running; we add the admin user in Part 6.

---

# PART 5: Create the same Filament admin user

You want the **same** login as on the VM (e.g. `admin@ashgate.co.ke` and the same password).

**Option A – One-off Cloud Run Job (recommended)**

1. **Navigation menu** → **Cloud Run** → **Jobs**.
2. **CREATE JOB**.
3. **Name:** e.g. `ashgate-create-admin`.
4. **Region:** Same as the service (e.g. **us-east1**).
5. **Container image:** Same image as the service (e.g. `us-east1-docker.pkg.dev/Ashgate-production/ashgate/ashgate-api:latest`—use the same region as in Part 3).
6. Under **Container(s)** → **Override** the startup command so the container runs only the user-creation script:
   - **Command:** `php`
   - **Arguments:** `artisan` `tinker` `--execute` `$u=new \App\Models\User();$u->name='Admin';$u->email='admin@ashgate.co.ke';$u->password=bcrypt('MySecurePass123!');$u->email_verified_at=now();$u->role='admin';$u->is_active=true;$u->save();`
   - Replace `MySecurePass123!` with the **exact same password** you used on the VM for the admin user. (If your UI has a single “Command” field, use: `php artisan tinker --execute="$u=new \App\Models\User();$u->name='Admin';$u->email='admin@ashgate.co.ke';$u->password=bcrypt('MySecurePass123!');$u->email_verified_at=now();$u->role='admin';$u->is_active=true;$u->save();"` and escape any quotes as the console requires.)
7. Under **Connections**, add the same **Cloud SQL** instance as the service.
8. Under **Variables**, add the **same environment variables** as the Cloud Run service (at least `APP_KEY`, `DB_*`, `DB_SOCKET`).
9. Create the job, then **EXECUTE** it once. After it runs successfully, you can log in at **https://api.ashgate.co.ke/admin** (once DNS is set) or at the `*.run.app` URL with that email and password.

**Option B – From your PC with Cloud SQL Proxy**

If you prefer to run it locally:

1. Install and start the [Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/mysql/connect-auth-proxy).
2. Connect to the instance and run:
   ```bash
   mysql -u ashgate -p -h 127.0.0.1 ashgate
   ```
   Then create the user row (or import your existing schema and users). Alternatively, from your Laravel repo with `.env` pointing at the proxy, run:
   ```bash
   php artisan tinker
   ```
   and paste the same user-creation code as in **DEPLOY_ASHGATE_ON_GCP.md** Part 10 (same email and password).

---

# PART 6: Map custom domain (api.ashgate.co.ke)

1. In **Cloud Run**, open your service (**ashgate-api**).
2. Go to the **Domain mappings** tab (or **Manage custom domains**).
3. Click **ADD MAPPING** (or **Map domain**).
4. Select your service (e.g. **ashgate-api**).
5. **Domain:** `api.ashgate.co.ke`.
6. Click **Continue** (or equivalent). The console will show a **CNAME target** (and possibly instructions).
7. **Copy that CNAME target** and send it to your tech with this instruction:

   - **Record type:** CNAME  
   - **Name:** `api` (so the full name is `api.ashgate.co.ke`)  
   - **Target / Value:** paste the CNAME target from Cloud Run (e.g. `ghs.googlehosted.com` or the exact value shown)  
   - **TTL:** 300 or Auto  

8. After DNS has propagated (can take up to 24–48 hours, often minutes), Cloud Run will finish provisioning the certificate and **https://api.ashgate.co.ke** (and **https://api.ashgate.co.ke/admin**) will work with **HTTPS automatically**. No Certbot needed.

---

# PART 7: Update Laravel APP_URL (if needed)

If you had `APP_URL` set to the VM or run.app URL, update it to the final URL:

- In the Cloud Run service, edit the **ashgate-api** service → **Revisions** → **Edit & deploy new revision** → **Variables** → set **APP_URL** = `https://api.ashgate.co.ke` → **Deploy**.

---

# PART 8: Final checklist

- [ ] APIs enabled (Cloud Run, Artifact Registry, Cloud SQL Admin, Cloud Build).
- [ ] Cloud SQL MySQL instance created; database `ashgate`, user `ashgate` (same password as VM).
- [ ] Image built with **Dockerfile.cloudrun** and pushed to Artifact Registry.
- [ ] Cloud Run service created with same env vars, **DB_SOCKET** for Cloud SQL, and Cloud SQL connection added.
- [ ] Admin user created (same email/password as VM) via Job or tinker.
- [ ] Custom domain **api.ashgate.co.ke** mapped in Cloud Run; tech has added the CNAME.
- [ ] **HTTPS:** Provided by Cloud Run – no Certbot.
- [ ] Frontend DNS: tech points **ashgate.co.ke** (and www if needed) to your frontend host.

After DNS propagates, **https://api.ashgate.co.ke** and **https://api.ashgate.co.ke/admin** will work with the same Filament login and same database setup as on the VM.
