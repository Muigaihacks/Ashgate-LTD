# Free Tier Deployment Guide - Railway + Vercel

## 🎯 Deployment Architecture (100% Free)

- **Frontend (Next.js):** Vercel (Free Hobby tier) ✅
- **Backend (Laravel):** Railway.app (Free tier with $5 monthly credit) ✅
- **Database (PostgreSQL):** Railway Managed PostgreSQL (Free tier) ✅ OR Supabase Free tier ✅
- **File Storage:** Railway public storage (Free) ✅ OR Cloudinary Free tier (25GB) ✅
- **Email:** Outlook/Microsoft 365 SMTP (via your existing account) ✅

**Total Monthly Cost: $0** 🎉

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Deploy:

- [ ] **Email SMTP Setup Complete**
  - [ ] Outlook account password obtained OR App Password created (if 2FA enabled)
  - [ ] Test email sending locally with `.env` configuration
  - [ ] Verify agent onboarding email works

- [ ] **Code Ready**
  - [ ] All features tested locally
  - [ ] Database migrations tested
  - [ ] Environment variables documented
  - [ ] Git repository pushed to GitHub

- [ ] **API Keys Ready**
  - [ ] MapTiler API key
  - [ ] Geoapify API key (if using)
  - [ ] Any other third-party API keys

---

## 🚂 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account (Free Tier)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended for easy deployment)
3. **Important:** Railway gives you **$5 free credit monthly** on the free tier
4. This is enough for:
   - Backend hosting (Laravel)
   - PostgreSQL database (small to medium size)
   - Basic traffic (< 100GB bandwidth/month)
5. Complete account setup

### 1.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `Ashgate-LTD` repository
4. Railway will detect it's a Laravel project

### 1.3 Add PostgreSQL Database (Free Tier)

**Option A: Railway PostgreSQL (Recommended - Free)**
1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL database automatically (uses free tier credit)
4. **Free tier includes:** Up to 1GB storage, sufficient for initial launch
5. Note the connection details (you'll need these)

**Option B: Supabase PostgreSQL (Alternative Free Option)**
If Railway free tier runs out, you can use Supabase:
1. Go to [supabase.com](https://supabase.com)
2. Sign up (free tier available)
3. Create new project → PostgreSQL database
4. Get connection string from Settings → Database
5. Use Supabase connection details in Railway environment variables

### 1.4 Configure Environment Variables

In Railway project → **Variables** tab, add these:

```env
# App Configuration
APP_NAME="Ashgate Limited"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-app-name.railway.app

# Database (Railway auto-provides these, but verify)
DB_CONNECTION=pgsql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# Email Configuration (Outlook/Microsoft 365)
MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=info@ashgate.co.ke
MAIL_PASSWORD=your-outlook-password-or-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@ashgate.co.ke
MAIL_FROM_NAME="Ashgate Limited"

# File Storage (Free options)
FILESYSTEM_DISK=public
# OR use Cloudinary free tier (25GB storage, 25GB bandwidth/month)
# CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# CORS (Important for Vercel frontend)
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://yourdomain.com

# Session & Cache
SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database

# Activity Logging
ACTIVITY_LOGGER_ENABLED=true
ACTIVITY_LOGGER_TABLE_NAME=activity_log
```

**Important Notes:**
- `APP_KEY`: Generate locally with `php artisan key:generate` and copy the key
- Database variables: Railway provides these automatically via `${{Postgres.*}}` syntax
- `CORS_ALLOWED_ORIGINS`: Update with your actual Vercel URL after deployment

### 1.5 Configure Build Settings

In Railway project → **Settings** → **Build Command**:

```bash
composer install --optimize-autoloader --no-dev && php artisan config:cache && php artisan route:cache && php artisan view:cache
```

**Start Command:**
```bash
php artisan serve --host=0.0.0.0 --port=$PORT
```

**Note:** Railway automatically sets `$PORT` environment variable.

### 1.6 Deploy

Railway will automatically deploy when you push to your main branch, or you can:

1. Click **"Deploy"** button in Railway dashboard
2. Or push to GitHub: `git push origin main`

### 1.7 Run Migrations

After first deployment, run migrations:

1. In Railway dashboard, go to your service
2. Click **"Deployments"** → **"View Logs"**
3. Click **"Shell"** tab (or use Railway CLI)
4. Run:
```bash
php artisan migrate --force
php artisan db:seed  # If you have seeders
php artisan storage:link  # Create storage symlink
```

**Or use Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run php artisan migrate --force
railway run php artisan db:seed
railway run php artisan storage:link
```

### 1.8 Get Your Backend URL

After deployment, Railway will provide a URL like:
- `https://ashgate-api-production.up.railway.app`

**Note this URL** - you'll need it for Vercel configuration.

---

## ▲ Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account (Free Tier)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. **Vercel Hobby (Free) Plan includes:**
   - Unlimited bandwidth ✅
   - 100GB storage ✅
   - Automatic SSL ✅
   - Global CDN ✅
   - Perfect for Next.js apps ✅
4. Complete account setup

### 2.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your `Ashgate-LTD` repository
3. Select the **`frontend`** folder as root directory

### 2.3 Configure Build Settings

Vercel should auto-detect Next.js, but verify:

- **Framework Preset:** Next.js
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (or leave default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install`

### 2.4 Set Environment Variables

In Vercel project → **Settings** → **Environment Variables**, add:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app

# Map Services
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key
NEXT_PUBLIC_GEOAPIFY_KEY=your_geoapify_key

# ReCAPTCHA (if using)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

**Important:** 
- Replace `your-railway-app.railway.app` with your actual Railway URL
- All `NEXT_PUBLIC_*` variables are exposed to the browser

### 2.5 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy automatically
3. You'll get a URL like: `https://ashgate-ltd.vercel.app`

---

## 🔧 Step 3: Post-Deployment Configuration

### 3.1 Update CORS in Laravel

After getting your Vercel URL, update Railway environment variables:

```env
CORS_ALLOWED_ORIGINS=https://ashgate-ltd.vercel.app,https://www.ashgate.co.ke
```

Then redeploy or run:
```bash
railway run php artisan config:clear
railway run php artisan config:cache
```

### 3.2 Update Frontend API URL

If you change Railway URL, update Vercel environment variables and redeploy.

### 3.3 Test Email Sending

1. Test agent onboarding flow
2. Check Railway logs for email errors
3. Verify emails are received

---

## ✅ Post-Deployment Testing Checklist

### Backend Tests:
- [ ] API health check: `GET https://your-api.railway.app/api/properties`
- [ ] Database connection working
- [ ] File uploads working (check storage)
- [ ] Email sending works (test agent onboarding)
- [ ] Admin panel accessible: `https://your-api.railway.app/admin`
- [ ] Authentication endpoints working

### Frontend Tests:
- [ ] Homepage loads correctly
- [ ] API calls to backend succeed
- [ ] Property listings display
- [ ] Search functionality works
- [ ] User login/logout works
- [ ] Dashboard accessible
- [ ] File uploads work

### Integration Tests:
- [ ] Agent onboarding flow complete
- [ ] Property creation from dashboard
- [ ] News articles display
- [ ] Partners display
- [ ] Testimonials display
- [ ] Contact forms submit correctly

---

## 🐛 Common Issues & Solutions

### Issue: CORS Errors

**Solution:**
1. Check `CORS_ALLOWED_ORIGINS` in Railway includes your Vercel URL
2. Verify `config/cors.php` allows your origins
3. Clear config cache: `railway run php artisan config:clear`

### Issue: Database Connection Failed

**Solution:**
1. Verify Railway PostgreSQL is running
2. Check environment variables use `${{Postgres.*}}` syntax
3. Test connection: `railway run php artisan tinker` → `DB::connection()->getPdo();`

### Issue: 500 Errors

**Solution:**
1. Check Railway logs: Dashboard → Deployments → View Logs
2. Verify `APP_DEBUG=false` in production
3. Check Laravel logs: `railway run php artisan log:show`

### Issue: File Uploads Not Working

**Solution:**
1. Run `railway run php artisan storage:link`
2. Check `FILESYSTEM_DISK=public` in environment
3. Verify storage directory permissions

### Issue: Email Not Sending

**Solution:**
1. Verify SMTP credentials in Railway environment
2. Check Outlook account allows SMTP access
3. If 2FA enabled, use App Password
4. Test with: `railway run php artisan tinker` → `Mail::raw('Test', fn($m) => $m->to('test@example.com')->subject('Test'));`

---

## 💰 Cost Estimate (100% Free Tier)

### Monthly Costs:

- **Railway:** **FREE** - $5 monthly credit covers backend + PostgreSQL for small-medium apps
- **Vercel:** **FREE** (Hobby plan) - Unlimited bandwidth, 100GB storage
- **Supabase (if needed):** **FREE** - 500MB database, 2GB storage, 2GB bandwidth
- **Cloudinary (optional):** **FREE** - 25GB storage, 25GB bandwidth/month
- **Outlook Email:** **FREE** (your existing account)
- **MapTiler:** **FREE** tier available
- **Total Monthly Cost: $0** 🎉

### Free Tier Limits:

**Railway Free Tier:**
- $5 credit/month (usually enough for small-medium apps)
- ~100GB bandwidth/month
- ~1GB database storage
- Sufficient for initial launch and early growth

**Vercel Free Tier:**
- Unlimited bandwidth ✅
- 100GB storage ✅
- Perfect for Next.js apps ✅

**When Free Tier Runs Out:**

You'll know it's time to upgrade when:
- Railway usage exceeds $5/month (they'll notify you)
- Database exceeds 1GB
- Traffic exceeds 100GB/month
- You need more resources

**Upgrade Options (Only when needed):**
- **Railway:** $5/month (starter) → $20/month (pro)
- **Vercel:** Free → $20/month (Pro) if you need team features
- **Database:** Railway auto-scales OR migrate to Supabase Pro ($25/month)

---

## 🔐 Security Checklist

- [ ] `APP_DEBUG=false` in production
- [ ] Strong `APP_KEY` generated
- [ ] Database credentials secure (Railway handles this)
- [ ] CORS configured correctly
- [ ] Environment variables not exposed in frontend
- [ ] HTTPS enabled (Railway & Vercel auto-provide)
- [ ] Admin panel protected (Filament Shield)
- [ ] Rate limiting configured (if needed)

---

## 📊 Monitoring Setup

### Railway Monitoring:
- Built-in metrics in Railway dashboard
- View logs: Dashboard → Deployments → View Logs
- Set up alerts for errors

### Recommended Add-ons:
- **Sentry** (free tier): Error tracking
- **UptimeRobot** (free): Uptime monitoring
- **Google Analytics**: User analytics

---

## 🚀 Next Steps After Deployment

1. **Set up custom domain** (optional):
   - Add domain in Railway settings
   - Add domain in Vercel settings
   - Update DNS records

2. **Configure backups**:
   - Railway auto-backups PostgreSQL
   - Export database regularly: `railway run pg_dump > backup.sql`

3. **Set up CI/CD**:
   - Railway auto-deploys on git push
   - Vercel auto-deploys on git push
   - No additional setup needed!

4. **Monitor performance**:
   - Check Railway metrics weekly
   - Review error logs
   - Monitor database size

---

## 📝 Quick Reference Commands

### Railway CLI:
```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run command
railway run php artisan migrate

# Open shell
railway shell
```

### Vercel CLI:
```bash
# Install
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# View logs
vercel logs
```

---

## ✅ You're Ready to Deploy!

Once you have:
1. ✅ Email SMTP password/app password
2. ✅ Tested agent onboarding locally
3. ✅ All code pushed to GitHub

Follow the steps above and you'll be live in ~30 minutes! 🎉
