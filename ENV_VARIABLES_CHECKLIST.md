# Environment Variables Checklist

Use this checklist when setting up environment variables in Railway and Vercel.

---

## 🚂 Railway (Backend) Environment Variables

### Required Variables:

```env
# App Configuration
APP_NAME="Ashgate Limited"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-app-name.railway.app

# Database (Railway auto-provides - use exact syntax)
DB_CONNECTION=pgsql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=info@ashgate.co.ke
MAIL_PASSWORD=PLACEHOLDER_UPDATE_LATER
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

# Activity Logging
ACTIVITY_LOGGER_ENABLED=true
ACTIVITY_LOGGER_TABLE_NAME=activity_log
```

### How to Generate APP_KEY:

```bash
cd /Users/user/Documents/GitHub/Ashgate-LTD
php artisan key:generate --show
```

Copy the output and paste it as the value for `APP_KEY`.

### After Vercel Deployment:

Update `CORS_ALLOWED_ORIGINS` to:
```env
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

**Note:** After custom domain setup, you'll update this to include `ashgate.co.ke`. See `DNS_CONFIGURATION_GUIDE.md` for instructions to give to your DNS administrator.

### When You Get SMTP Password:

Update `MAIL_PASSWORD` to the actual password (or App Password if 2FA enabled).

---

## ▲ Vercel (Frontend) Environment Variables

### Required Variables:

```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

### Optional Variables (if you have these services):

```env
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key
NEXT_PUBLIC_GEOAPIFY_KEY=your_geoapify_key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=your_facebook_pixel_id
```

**Analytics & marketing:** The cookie banner controls when these run. If set, Google Analytics (GA4) loads only when the user accepts **Analytics** cookies; Facebook Pixel loads only when the user accepts **Marketing** cookies. Get GA4 ID from [Google Analytics](https://analytics.google.com/) (Admin → Data Streams → your web stream). Get Pixel ID from [Meta Events Manager](https://business.facebook.com/events_manager).

**Important:** 
- Replace `https://your-railway-app.railway.app` with your actual Railway URL
- All `NEXT_PUBLIC_*` variables are exposed to the browser

---

## ✅ Quick Checklist

### Before Deployment:
- [ ] Generated `APP_KEY` locally
- [ ] Copied `APP_KEY` value
- [ ] Have Railway account ready
- [ ] Have Vercel account ready

### During Railway Setup:
- [ ] Added all required environment variables
- [ ] Used `${{Postgres.*}}` syntax for database variables
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_ENV=production`
- [ ] Configured build and start commands

### During Vercel Setup:
- [ ] Set root directory to `frontend`
- [ ] Added `NEXT_PUBLIC_API_URL` with Railway URL
- [ ] Added any optional API keys if needed

### After Both Deployments:
- [ ] Updated `CORS_ALLOWED_ORIGINS` in Railway with Vercel URL
- [ ] Tested API connection from frontend
- [ ] Ran database migrations
- [ ] Created storage symlink

### When SMTP Password Arrives:
- [ ] Updated `MAIL_PASSWORD` in Railway
- [ ] Tested email sending
- [ ] Verified agent onboarding email works
- [ ] Verified password reset email works

---

## 🔍 Verification Commands

### Test Database Connection (Railway):
```bash
railway run php artisan tinker
# Then in tinker:
DB::connection()->getPdo();
```

### Test Email (Railway):
```bash
railway run php artisan tinker
# Then in tinker:
Mail::raw('Test email', function($m) {
    $m->to('your-email@example.com')->subject('Test');
});
```

### Clear Config Cache (Railway):
```bash
railway run php artisan config:clear
railway run php artisan config:cache
```

---

## 📝 Notes

- **Database Variables:** Railway automatically provides database connection details via `${{Postgres.*}}` syntax. Don't manually set these values.
- **APP_URL:** Railway will auto-generate this, but you can update it after first deployment.
- **CORS:** Must be updated after Vercel deployment to include the Vercel URL.
- **MAIL_PASSWORD:** Can be updated later when you receive the Outlook password.
