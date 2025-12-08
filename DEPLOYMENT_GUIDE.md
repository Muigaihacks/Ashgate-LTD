# Production Deployment Guide - Ashgate Platform

## Deployment Architecture Summary

### ✅ **Decision: Laravel + Filament + Next.js**

**Frontend:** Next.js 15 → Vercel (free tier)
**Backend:** Laravel 12 → Railway.app OR Render.com
**Database:** PostgreSQL → Railway Managed DB (included) OR Supabase/Neon
**Media:** Cloudinary (free 25GB tier) OR AWS S3
**CDN/DDoS:** Cloudflare (free tier)

---

## Step-by-Step Deployment Process

### Phase 1: Local Development & Testing ✅ (Current)

1. **Database Structure** ✅
   - ✅ Migrations created with proper categorization
   - ✅ Multi-tenancy structure (organization_id)
   - ⏳ Need to run migrations: `php artisan migrate`

2. **Backend API Development** ⏳
   - Create Laravel API controllers
   - Set up authentication (Sanctum)
   - Build Filament admin resources

3. **Frontend Integration** ⏳
   - Connect React components to Laravel API
   - Replace dummy data with API calls
   - Test all user flows

---

### Phase 2: Staging Environment Setup

#### Step 1: Railway/Render Account Setup

**Option A: Railway.app (Recommended - Easier)**
```bash
# 1. Create account at railway.app
# 2. Install Railway CLI
npm i -g @railway/cli

# 3. Login
railway login

# 4. Initialize project
railway init

# 5. Add PostgreSQL service
railway add postgresql
```

**Option B: Render.com (Alternative)**
```bash
# 1. Create account at render.com
# 2. Create PostgreSQL database
# 3. Create Web Service for Laravel
# 4. Connect GitHub repository
```

#### Step 2: Environment Variables Setup

Create `.env.production` with:
```env
APP_NAME="Ashgate Real Estate"
APP_ENV=production
APP_KEY=  # Generate with: php artisan key:generate
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=pgsql
DB_HOST=  # From Railway/Render
DB_PORT=5432
DB_DATABASE=  # From Railway/Render
DB_USERNAME=  # From Railway/Render
DB_PASSWORD=  # From Railway/Render

CLOUDINARY_URL=  # From Cloudinary dashboard
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io  # Or SendGrid, Mailgun
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
```

#### Step 3: Deploy Backend

**Railway:**
```bash
# Railway auto-deploys on git push
git push origin main

# Or manual deploy
railway up
```

**Render:**
- Connect GitHub repo
- Set build command: `composer install --optimize-autoloader --no-dev`
- Set start command: `php artisan serve --host=0.0.0.0 --port=8000`
- Set environment variables

#### Step 4: Database Migrations

```bash
# SSH into Railway/Render or use CLI
railway run php artisan migrate --force
railway run php artisan db:seed  # If you have seeders
```

#### Step 5: Deploy Frontend to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. In frontend directory
cd frontend
vercel

# 4. Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-api.railway.app
# NEXT_PUBLIC_MAPTILER_KEY=your_key
# NEXT_PUBLIC_GEOAPIFY_KEY=your_key
```

---

### Phase 3: Production Deployment

#### Step 1: Domain Setup

1. Purchase domain (e.g., Namecheap, GoDaddy)
2. Configure Cloudflare:
   - Add site to Cloudflare
   - Update nameservers at domain registrar
   - Add DNS records:
     - A record: `@` → Vercel IP
     - CNAME: `api` → Railway/Render URL
     - CNAME: `www` → Vercel URL

#### Step 2: SSL Certificates

- **Vercel:** Auto SSL (free)
- **Railway/Render:** Auto SSL (free)
- **Cloudflare:** SSL/TLS → Full (strict)

#### Step 3: Final Production Setup

```bash
# Backend: Update APP_URL
# In Railway/Render environment:
APP_URL=https://api.yourdomain.com

# Frontend: Update API endpoint
# In Vercel environment:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Clear caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

### Phase 4: Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Test frontend-backend integration
- [ ] Verify file uploads to Cloudinary
- [ ] Test email notifications
- [ ] Set up database backups (Railway auto, Render manual)
- [ ] Configure monitoring (Railway has built-in)
- [ ] Set up error tracking (Sentry free tier)
- [ ] Test multi-tenancy isolation
- [ ] Load testing (optional)

---

## Cost Estimate (Monthly)

### Free Tier (Initial Launch)
- **Vercel:** Free (Next.js hosting)
- **Railway:** $5/month (backend + database) OR Free tier with limitations
- **Cloudinary:** Free (25GB storage, 25GB bandwidth)
- **Cloudflare:** Free (CDN, DDoS protection)
- **Total:** ~$5-10/month

### Growth Tier (After Launch)
- **Vercel Pro:** $20/month (if needed)
- **Railway:** $20/month (better performance)
- **Cloudinary:** Pay-as-you-go or $99/month (unlimited)
- **Total:** ~$40-120/month depending on traffic

---

## Monitoring & Maintenance

### Daily Checks
- Error logs (Railway dashboard)
- Database performance
- API response times

### Weekly Tasks
- Review error reports
- Check backup status
- Monitor storage usage

### Monthly Tasks
- Update dependencies
- Review and optimize database queries
- Performance audit

---

## Troubleshooting

### Backend won't start
- Check environment variables
- Verify database connection
- Check Laravel logs: `railway logs`

### Frontend can't connect to API
- Verify `NEXT_PUBLIC_API_URL`
- Check CORS settings in Laravel
- Verify API is running

### Database connection errors
- Verify credentials in `.env`
- Check PostgreSQL is running
- Verify network access

---

## Next Steps After Deployment

1. **Analytics:** Set up Google Analytics or Plausible
2. **Error Tracking:** Sentry (free tier)
3. **Uptime Monitoring:** UptimeRobot (free tier)
4. **Backup Automation:** Configure automated backups
5. **CI/CD:** Set up GitHub Actions for auto-deployment

