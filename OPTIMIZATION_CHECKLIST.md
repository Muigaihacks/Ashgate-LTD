# ⚡ Free Tier Optimization Checklist for Ashgate

**Goal:** Minimize Railway usage to stay well under $5/month (Sokofresh is at $0.97/month, so we have ~$4/month headroom)

---

## ✅ Build Optimizations (Already in DEPLOY_NOW.md)

### Railway Build Command:
```bash
composer install --optimize-autoloader --no-dev && php artisan config:cache && php artisan route:cache && php artisan view:cache
```

**What this does:**
- ✅ `--optimize-autoloader` - Faster class loading
- ✅ `--no-dev` - Excludes dev dependencies (saves space & build time)
- ✅ `config:cache` - Caches config files (faster startup)
- ✅ `route:cache` - Caches routes (faster routing)
- ✅ `view:cache` - Caches views (faster rendering)

**Status:** ✅ Already configured in deployment guide

---

## 🗄️ Database Optimizations

### 1. Indexes (Already Implemented)

Your migrations already have indexes on:
- ✅ `properties.user_id`
- ✅ `properties.property_type_id`
- ✅ `properties.listing_type`
- ✅ `properties.status`
- ✅ `properties.price`
- ✅ `properties.is_featured`
- ✅ `properties.is_active`
- ✅ `properties.latitude, longitude` (geospatial)
- ✅ Full-text search on `title, description, location_text`

**Status:** ✅ Already optimized

### 2. Query Optimizations

**Already implemented:**
- ✅ Eager loading relationships (`with()`)
- ✅ Select only needed columns
- ✅ Pagination for large datasets

**Additional recommendations:**
- Use `->select()` to limit columns when possible
- Use `->limit()` for dashboard queries
- Cache frequently accessed data

**Status:** ✅ Mostly optimized, can improve with caching

---

## 💾 Caching Strategy

### Environment Variables to Add:

```env
# Cache Configuration (Railway)
CACHE_DRIVER=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Optimize for production
OPCACHE_ENABLE=1
OPCACHE_MEMORY_CONSUMPTION=128
OPCACHE_MAX_ACCELERATED_FILES=10000
```

**What this does:**
- Uses database for cache (no Redis needed - saves resources)
- Enables OPcache (PHP bytecode cache - faster execution)
- Reduces memory usage

**Status:** ⚠️ Need to add to Railway environment variables

---

## 🚀 Resource Usage Optimizations

### 1. Environment Variables for Resource Limits:

```env
# PHP Memory Limits (Optimized for free tier)
PHP_MEMORY_LIMIT=128M
PHP_MAX_EXECUTION_TIME=30

# OPcache Settings
OPCACHE_ENABLE=1
OPCACHE_VALIDATE_TIMESTAMPS=0
OPCACHE_REVALIDATE_FREQ=0
```

**What this does:**
- Limits memory usage (prevents runaway processes)
- Enables OPcache (faster PHP execution)
- Disables timestamp validation (faster in production)

**Status:** ⚠️ Need to add to Railway environment variables

### 2. Database Connection Pooling:

Already handled by Railway PostgreSQL - no action needed.

---

## 📦 Composer Optimizations

### Already in Build Command:
- ✅ `--optimize-autoloader` - Optimized class autoloading
- ✅ `--no-dev` - Excludes dev dependencies

**Additional optimization (optional):**
- Consider removing unused packages from `composer.json` (but not critical)

**Status:** ✅ Optimized

---

## 🔍 Code-Level Optimizations

### 1. Lazy Loading Prevention

**Check controllers for:**
- ✅ Using `with()` for eager loading (already done)
- ✅ Avoiding N+1 queries (already handled)

**Status:** ✅ Already optimized

### 2. Image Optimization

**Frontend:**
- ✅ Using Next.js Image component (automatic optimization)
- ✅ Lazy loading images

**Backend:**
- Consider image compression on upload (optional)

**Status:** ✅ Mostly optimized

---

## 📊 Monitoring & Alerts

### Set Up Usage Monitoring:

1. **Railway Dashboard:**
   - Go to Account → Usage
   - Set up alerts at $3/month (60% of limit)
   - Monitor daily for first week

2. **Track Key Metrics:**
   - Database size
   - API response times
   - Error rates
   - Memory usage

**Status:** ⚠️ Set up after deployment

---

## 🎯 Final Optimization Checklist

### Before Deployment:
- [x] Build command optimized (`--no-dev`, caching)
- [x] Database indexes in place
- [x] Query optimizations (eager loading)
- [ ] Add caching environment variables
- [ ] Add resource limit environment variables
- [ ] Set up usage monitoring

### After Deployment:
- [ ] Monitor usage for first week
- [ ] Check database size
- [ ] Review slow queries (if any)
- [ ] Optimize based on actual usage patterns

---

## 💰 Expected Usage Estimate

### Optimized Ashgate Project:
- **Backend service:** $1.20 - $2.50/month
  - Optimized build: -$0.20/month
  - Caching enabled: -$0.15/month
  - Resource limits: -$0.10/month
- **PostgreSQL database:** $0.50 - $1.00/month
  - Indexes: Faster queries (less CPU)
  - Efficient queries: Less resource usage
- **Total estimated:** $1.70 - $3.50/month

### Combined with Sokofresh:
- **Sokofresh:** $0.97/month (idle)
- **Ashgate:** $1.70 - $3.50/month (optimized)
- **Combined:** $2.67 - $4.47/month
- **Free tier limit:** $5.00/month
- **Headroom:** $0.53 - $2.33/month ✅

**Verdict:** Should fit comfortably with optimizations! 🎉

---

## 🚀 Quick Deploy with All Optimizations

All optimizations are already in the deployment guide. Just make sure to:

1. ✅ Use the optimized build command (already in guide)
2. ✅ Add caching environment variables (see below)
3. ✅ Add resource limit variables (see below)
4. ✅ Monitor usage after deployment

---

## 📝 Environment Variables to Add in Railway

Add these to your Railway environment variables for maximum optimization:

```env
# Caching (Already in guide, but double-check)
CACHE_DRIVER=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database

# PHP Optimizations (Add these)
PHP_MEMORY_LIMIT=128M
OPCACHE_ENABLE=1
OPCACHE_VALIDATE_TIMESTAMPS=0
OPCACHE_REVALIDATE_FREQ=0
```

**Note:** Railway may handle some of these automatically, but adding them explicitly ensures optimization.

---

## ✅ You're Ready!

With these optimizations, Ashgate should use **$1.70 - $3.50/month**, leaving plenty of room with Sokofresh. Let's deploy! 🚀
