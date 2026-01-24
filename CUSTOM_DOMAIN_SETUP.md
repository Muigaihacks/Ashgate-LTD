# 🌐 Custom Domain Setup - ashgate.co.ke

This guide will help you configure your custom domain `ashgate.co.ke` for both frontend (Vercel) and backend (Railway).

---

## 📋 Overview

You'll need to:
1. **Frontend (Vercel):** Point `ashgate.co.ke` and `www.ashgate.co.ke` to your Vercel deployment
2. **Backend (Railway):** Optionally use a subdomain like `api.ashgate.co.ke` for the API (or keep Railway URL)
3. **Update CORS:** Include your custom domain in allowed origins
4. **Update Environment Variables:** Set `APP_URL` and `NEXT_PUBLIC_API_URL` to use custom domains

---

## 🎯 Recommended Setup

### Option 1: Custom Domain for Frontend Only (Simplest)

- **Frontend:** `ashgate.co.ke` → Vercel
- **Backend:** Keep Railway URL (e.g., `https://ashgate-api.railway.app`)
- **Admin Panel:** Access via Railway URL (e.g., `https://ashgate-api.railway.app/admin`)

**Pros:** Simple, no backend DNS changes needed  
**Cons:** Backend still uses Railway URL

### Option 2: Custom Domain for Both (Recommended)

- **Frontend:** `ashgate.co.ke` → Vercel
- **Backend/API:** `api.ashgate.co.ke` → Railway
- **Admin Panel:** `admin.ashgate.co.ke` → Railway (or use `api.ashgate.co.ke/admin`)

**Pros:** Professional, consistent branding  
**Cons:** Requires DNS configuration for subdomains

---

## ▲ Step 1: Add Custom Domain to Vercel (Frontend)

### 1.1 Add Domain in Vercel

1. Go to your **Vercel project dashboard**
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter: `ashgate.co.ke`
5. Click **"Add"**
6. Also add: `www.ashgate.co.ke` (Vercel will handle redirects)

### 1.2 Get DNS Configuration

Vercel will show you DNS records to add. You'll typically see:

**For `ashgate.co.ke`:**
- **Type:** `A` or `CNAME`
- **Name:** `@` or `ashgate.co.ke`
- **Value:** Vercel-provided IP or CNAME

**For `www.ashgate.co.ke`:**
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** Vercel-provided CNAME (e.g., `cname.vercel-dns.com`)

**Note:** Vercel will provide exact values - use those!

### 1.3 Configure DNS

**For DNS Administrator:** See `DNS_CONFIGURATION_GUIDE.md` for simple instructions to give to your DNS person.

1. Log in to your domain registrar (where you bought `ashgate.co.ke`)
2. Go to **DNS Management** or **DNS Settings**
3. Add the DNS records Vercel provided:
   - Add `A` record for root domain (`@` or `ashgate.co.ke`)
   - Add `CNAME` record for `www` subdomain
4. **Save** the DNS changes

**Tip:** Give `DNS_CONFIGURATION_GUIDE.md` to your DNS administrator - it has simple, clear instructions they can follow.

### 1.4 Wait for DNS Propagation

- DNS changes can take **15 minutes to 48 hours** to propagate
- Vercel will show "Valid Configuration" when DNS is correct
- You can check status in Vercel dashboard → Domains

### 1.5 Update Environment Variables

After domain is active, update Vercel environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.ashgate.co.ke
```

Or if keeping Railway URL:
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

---

## 🚂 Step 2: Add Custom Domain to Railway (Backend - Optional)

### 2.1 Add Domain in Railway

1. Go to your **Railway project dashboard**
2. Click on your **Laravel service**
3. Go to **"Settings"** tab
4. Scroll to **"Domains"** section
5. Click **"Generate Domain"** or **"Add Custom Domain"**
6. Enter: `api.ashgate.co.ke` (or `admin.ashgate.co.ke`)

**Note:** Railway free tier supports custom domains! ✅

### 2.2 Get DNS Configuration

Railway will show you DNS records to add:

**For `api.ashgate.co.ke`:**
- **Type:** `CNAME`
- **Name:** `api`
- **Value:** Railway-provided CNAME (e.g., `xxxx.railway.app`)

### 2.3 Configure DNS

**For DNS Administrator:** See `DNS_CONFIGURATION_GUIDE.md` for simple instructions to give to your DNS person.

1. Go to your domain registrar's DNS settings
2. Add the `CNAME` record Railway provided:
   - **Name:** `api`
   - **Type:** `CNAME`
   - **Value:** Railway-provided value
3. **Save** DNS changes

### 2.4 Wait for DNS Propagation

- Wait for DNS to propagate (15 minutes to 48 hours)
- Railway will show domain status in dashboard

### 2.5 Update Environment Variables

After domain is active, update Railway environment variables:

```env
APP_URL=https://api.ashgate.co.ke
```

Or if using separate admin subdomain:
```env
APP_URL=https://admin.ashgate.co.ke
```

---

## 🔧 Step 3: Update CORS Configuration

After both domains are active, update CORS in Railway:

1. Go to **Railway** → Your Laravel service → **"Variables"** tab
2. Find `CORS_ALLOWED_ORIGINS`
3. Update to:
```env
CORS_ALLOWED_ORIGINS=https://ashgate.co.ke,https://www.ashgate.co.ke,https://api.ashgate.co.ke
```

4. Clear config cache:
```bash
railway run php artisan config:clear
railway run php artisan config:cache
```

---

## 📝 Complete DNS Records Summary

Here's what your DNS should look like after setup:

```
ashgate.co.ke          A        [Vercel IP]           (Frontend)
www.ashgate.co.ke      CNAME    [Vercel CNAME]        (Frontend)
api.ashgate.co.ke      CNAME    [Railway CNAME]       (Backend/API - Optional)
```

---

## ✅ Step 4: Verify Everything Works

### Test Frontend:
1. Open `https://ashgate.co.ke` - should load your site
2. Open `https://www.ashgate.co.ke` - should redirect or load site
3. Check browser console for API errors

### Test Backend:
1. Open `https://api.ashgate.co.ke/api/properties` - should return JSON
2. Open `https://api.ashgate.co.ke/admin` - should show admin login

### Test CORS:
1. Open `https://ashgate.co.ke` in browser
2. Open DevTools → Network tab
3. Navigate around the site
4. Check that API calls succeed (no CORS errors)

---

## 🎯 Recommended Final Configuration

### Railway Environment Variables:
```env
APP_URL=https://api.ashgate.co.ke
CORS_ALLOWED_ORIGINS=https://ashgate.co.ke,https://www.ashgate.co.ke,https://api.ashgate.co.ke
```

### Vercel Environment Variables:
```env
NEXT_PUBLIC_API_URL=https://api.ashgate.co.ke
```

---

## 🐛 Common Issues

### Issue: Domain Not Resolving

**Solution:**
1. Check DNS records are correct in your registrar
2. Wait for DNS propagation (can take up to 48 hours)
3. Use DNS checker tools: [whatsmydns.net](https://www.whatsmydns.net)
4. Verify records match exactly what Vercel/Railway provided

### Issue: SSL Certificate Not Issued

**Solution:**
1. Vercel and Railway automatically issue SSL certificates
2. Wait 5-15 minutes after DNS propagation
3. Check domain status in Vercel/Railway dashboard
4. If still not working, remove and re-add domain

### Issue: CORS Errors After Domain Setup

**Solution:**
1. Verify `CORS_ALLOWED_ORIGINS` includes your custom domain
2. Clear config cache: `railway run php artisan config:clear && railway run php artisan config:cache`
3. Check that domain is using `https://` (not `http://`)

### Issue: www Redirect Not Working

**Solution:**
1. Vercel automatically handles www redirects
2. Verify both `ashgate.co.ke` and `www.ashgate.co.ke` are added in Vercel
3. Check DNS records for both domains

---

## 📊 DNS Propagation Check

Use these tools to check if DNS has propagated:

- [whatsmydns.net](https://www.whatsmydns.net) - Global DNS checker
- [dnschecker.org](https://dnschecker.org) - DNS propagation checker
- [mxtoolbox.com](https://mxtoolbox.com) - DNS lookup tool

---

## 🎉 You're Done!

Once DNS propagates and domains are active:
- ✅ Frontend accessible at `https://ashgate.co.ke`
- ✅ Backend API accessible at `https://api.ashgate.co.ke` (if configured)
- ✅ Admin panel accessible at `https://api.ashgate.co.ke/admin`
- ✅ All CORS configured correctly
- ✅ SSL certificates automatically issued

**Remember:** DNS changes can take time. Be patient! ⏰

---

## 📞 Need Help?

If you encounter issues:
1. Check DNS records match exactly what Vercel/Railway provided
2. Wait for DNS propagation (up to 48 hours)
3. Verify SSL certificates are issued (check domain status in dashboards)
4. Check CORS configuration includes all domains

Good luck with your custom domain setup! 🌐
