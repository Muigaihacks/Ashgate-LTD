# 🚀 Quick Deploy - Optimized for Free Tier

**This is your streamlined deployment guide with all optimizations included.**

---

## ⚡ Pre-Deployment (2 minutes)

### Generate APP_KEY:
```bash
cd /Users/user/Documents/GitHub/Ashgate-LTD
php artisan key:generate --show
```
**Copy the output** - you'll need it for Railway.

---

## 🚂 Step 1: Deploy Backend to Railway (10 minutes)

### 1.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub** → Select `Ashgate-LTD`

### 1.2 Add PostgreSQL Database
1. **+ New** → **Database** → **Add PostgreSQL**

### 1.3 Set Environment Variables

**Copy-paste these into Railway Variables tab:**

```env
# App Configuration
APP_NAME="Ashgate Limited"
APP_ENV=production
APP_KEY=base64:PASTE_YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-app-name.railway.app

# Database (Railway auto-provides)
DB_CONNECTION=pgsql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# Email (Update MAIL_PASSWORD later)
MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=info@ashgate.co.ke
MAIL_PASSWORD=placeholder-will-update-later
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@ashgate.co.ke
MAIL_FROM_NAME="Ashgate Limited"

# File Storage
FILESYSTEM_DISK=public

# CORS (Update after Vercel deployment)
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Session & Cache
SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database

# PHP Optimizations (Free Tier Optimization)
PHP_MEMORY_LIMIT=128M
OPCACHE_ENABLE=1
OPCACHE_VALIDATE_TIMESTAMPS=0
OPCACHE_REVALIDATE_FREQ=0

# Activity Logging
ACTIVITY_LOGGER_ENABLED=true
ACTIVITY_LOGGER_TABLE_NAME=activity_log
```

### 1.4 Set Build & Start Commands

**Build Command:**
```bash
composer install --optimize-autoloader --no-dev && php artisan config:cache && php artisan route:cache && php artisan view:cache
```

**Start Command:**
```bash
php artisan serve --host=0.0.0.0 --port=$PORT
```

### 1.5 Configure Database Region (Optional)

Railway auto-selects region, but you can check:
1. PostgreSQL service → Settings → Look for "Region"
2. **Recommended for Kenya:** Europe (Frankfurt) - lowest latency
3. If no option visible, Railway handles it automatically ✅

### 1.6 Deploy & Get URL
- Railway auto-deploys
- **Migrations run automatically** as part of start command
- **Copy your Railway URL** (e.g., `https://ashgate-api.railway.app`)
- Check deployment logs to verify migrations ran successfully

---

## ▲ Step 2: Deploy Frontend to Vercel (5 minutes)

### 2.1 Import Project
1. Go to [vercel.com](https://vercel.com)
2. **Add New** → **Project** → Import `Ashgate-LTD`
3. **Root Directory:** `frontend`

### 2.2 Set Environment Variable
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```
(Replace with your actual Railway URL)

### 2.3 Deploy
- Click **Deploy**
- **Copy your Vercel URL** (e.g., `https://ashgate-ltd.vercel.app`)

---

## 🔧 Step 3: Connect Frontend & Backend (2 minutes)

### Update CORS in Railway:
1. Railway → Variables → `CORS_ALLOWED_ORIGINS`
2. Update to: `https://your-vercel-app.vercel.app`
3. Railway auto-redeploys

### Clear Cache:
```bash
railway run php artisan config:clear
railway run php artisan config:cache
```

---

## ✅ Step 4: Test (3 minutes)

1. **Backend:** `https://your-railway-app.railway.app/api/properties`
2. **Frontend:** `https://your-vercel-app.vercel.app`
3. **Admin:** `https://your-railway-app.railway.app/admin`

---

## 📊 Step 5: Monitor Usage

1. Railway Dashboard → Account → Usage
2. Check daily for first week
3. Should see: **$1.70 - $3.50/month** for Ashgate
4. Combined with Sokofresh: **$2.67 - $4.47/month** ✅

---

## 🎉 Done!

**Total Time:** ~20 minutes  
**Expected Cost:** $1.70 - $3.50/month (well under $5 limit)  
**Status:** Optimized and ready! 🚀

---

## 📝 Later: Add SMTP Password

When you get the Outlook password:
1. Railway → Variables → `MAIL_PASSWORD`
2. Update with actual password
3. Railway auto-redeploys

---

**That's it! You're live and optimized!** 🎊
