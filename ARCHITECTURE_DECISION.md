# Ashgate Platform Architecture & Deployment Guide

## Backend Decision: Laravel + Filament ✅

**Why Laravel:**
- Already partially implemented
- Excellent React integration via API
- Strong multi-tenancy support (Stancl/Tenancy package)
- PostgreSQL optimized with Eloquent ORM
- Filament admin is mature and feature-rich
- Active ecosystem and documentation

## Deployment Architecture

### Production Stack:
```
Frontend (Next.js 15)  →  Vercel
Backend (Laravel 12)   →  Railway.app OR Render.com
Database (PostgreSQL)  →  Railway Managed DB OR Supabase/Neon
Media Storage          →  Cloudinary OR AWS S3
CDN/DDoS Protection    →  Cloudflare (free tier available)
```

### Recommended Services:
1. **Vercel** - Frontend deployment (free tier for Next.js)
2. **Railway.app** - Backend + Database (easy PostgreSQL setup)
   - Alternative: **Render.com** (generous free tier)
3. **Cloudinary** - Image/video storage (free tier: 25GB)
   - Alternative: **AWS S3** (pay-as-you-go)
4. **Cloudflare** - CDN, DDoS protection, SSL (free tier)

### Why NOT Akamai?
- Akamai is enterprise-grade CDN/DDoS (expensive, overkill for startups)
- Cloudflare free tier is sufficient for initial launch

## Multi-Tenancy Implementation

### Approach: Database Per Tenant (Optional) OR Shared Database with Tenant Scoping

**Recommended: Shared Database with `tenant_id` scoping**
- Easier to manage
- Cost-effective
- Sufficient for most use cases

### Implementation:
- All tables include `tenant_id` column
- Global middleware scopes all queries by tenant
- Tenant identified via subdomain or JWT token
- Data isolation at query level

## Database Design Principles

### Data Categorization (CRITICAL):

1. **MASTER DATA** (Reference entities)
   - `organizations` (tenants)
   - `users`
   - `property_types`
   - `amenities`
   - `categories` (for experts)

2. **TRANSACTIONAL DATA** (Business events)
   - `properties` (listings)
   - `property_views`
   - `inquiries`
   - `appointments`
   - `payments` (future)

3. **CONFIGURATION DATA** (System settings)
   - `system_settings`
   - `feature_flags`
   - `email_templates`
   - `notification_settings`

### Optimization Strategies:

1. **Stored Procedures** for complex calculations
   - Commission calculations
   - Property statistics aggregations
   - Revenue reports

2. **Database Views** for:
   - Complex joins (property with amenities)
   - Aggregated statistics
   - Frequently accessed filtered data

3. **Indexes** on:
   - Foreign keys
   - Frequently filtered columns
   - Search columns (full-text search)

4. **Avoid Redundant Tables:**
   - ❌ `batch_commissions` (unnecessary)
   - ✅ Use computed views or stored procedures instead

## Production Deployment Checklist

### Phase 1: Pre-Deployment (Development)
- [ ] Multi-tenancy middleware implemented
- [ ] All database migrations categorized (Master/Transaction/Config)
- [ ] API endpoints tested with Postman/Insomnia
- [ ] Frontend-Backend integration complete
- [ ] File upload to Cloudinary working
- [ ] Environment variables documented

### Phase 2: Staging Deployment
- [ ] Create staging environment on Railway/Render
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Deploy backend, test API endpoints
- [ ] Deploy frontend to Vercel (staging branch)
- [ ] Test full user flows

### Phase 3: Production Deployment
- [ ] Purchase domain name
- [ ] Set up Cloudflare (DNS + SSL)
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Configure custom domain on Vercel
- [ ] Set up monitoring (Railway has built-in)
- [ ] Database backups configured

### Phase 4: Post-Deployment
- [ ] Monitor error logs
- [ ] Set up uptime monitoring (UptimeRobot free tier)
- [ ] Configure email notifications for errors
- [ ] Performance monitoring
- [ ] User feedback collection

## Arcade MCP Integration (Optional)

**Note:** Arcade MCP appears to be a specialized tool. If you have specific documentation, we can integrate it. However, the standard deployment process above should work without it initially.

**To Integrate:**
1. Get Arcade MCP API credentials
2. Add to `.env` file
3. Create service provider for MCP integration
4. Add to deployment environment variables

## Next Steps

1. **Today:** Set up database structure with proper categorization
2. **This Week:** Implement multi-tenancy middleware
3. **Next Week:** Build Filament admin resources
4. **Before Deployment:** Complete staging environment testing

