# Enterprise Development Principles - Ashgate Platform

## Core Tenets (From Mentorship)

### 1. Multi-Tenancy Architecture ✅

**Principle:** Build one solution to serve multiple organizations, with data isolation per tenant.

**Implementation:**
- All tables include `organization_id` column
- Global query scoping via middleware/Eloquent
- Tenant identified via:
  - Subdomain (e.g., `ashgate.yourdomain.com`)
  - JWT token with `organization_id`
  - Session-based (for admin panel)

**Code Pattern:**
```php
// Middleware scopes all queries
class TenantScope {
    public function handle($request, Closure $next) {
        if ($tenant = $request->user()->organization_id) {
            Model::addGlobalScope('tenant', function ($query) use ($tenant) {
                $query->where('organization_id', $tenant);
            });
        }
        return $next($request);
    }
}
```

---

### 2. Database Optimization ✅

**Principle:** Optimize for fast data access and queries.

#### Strategies:

**A. Stored Procedures (PostgreSQL)**
- Use for complex calculations
- Avoid redundant table queries
- Example: Commission calculations

**B. Database Views**
- Create views for complex joins
- Pre-compute aggregations
- Reduce application-level processing

**C. Avoid Redundant Tables**
- ❌ Don't create `batch_commissions` that queries `commissions`
- ✅ Use stored procedures or computed views instead
- ✅ Denormalize only when necessary for performance

**D. Proper Indexing**
- Index all foreign keys
- Index frequently filtered columns
- Index search columns (full-text)
- Composite indexes for common query patterns

---

### 3. Data Categorization (CRITICAL) ✅

**Principle:** Categorize all data into three types during design phase. Failure to do so results in "useless tables."

### **MASTER DATA** (Reference Entities)
Core business entities that rarely change but are referenced frequently.

**Examples:**
- `organizations` - Tenant organizations
- `users` - System users
- `property_types` - Apartment, House, Land, etc.
- `amenities` - Wi-Fi, Security, Pool, etc.
- `expert_categories` - Legal, Solar, etc.
- `locations` - Cities, Areas

**Characteristics:**
- Low change frequency
- High read frequency
- Referenced by transactional data
- Usually have dropdown/select UI components

### **TRANSACTIONAL DATA** (Business Events)
Records of business activities and events.

**Examples:**
- `properties` - Property listings
- `property_images` - Images for properties
- `inquiries` - User inquiries
- `appointments` - Viewing appointments
- `property_views` - View tracking
- `expert_requests` - Requests to experts

**Characteristics:**
- High change frequency
- Tracks business events
- References master data via foreign keys
- Usually has timestamps for audit

### **CONFIGURATION DATA** (System Settings)
System-wide settings and configurations.

**Examples:**
- `system_settings` - App configuration
- `feature_flags` - Feature toggles
- `email_templates` - Email templates
- `notification_settings` - User preferences
- `seo_settings` - SEO metadata

**Characteristics:**
- Low change frequency
- Controls system behavior
- Usually key-value pairs or small records
- May be global or per-tenant

---

## Design Rules

### Rule 1: Categorize During Design Phase
- ✅ Before creating any table, classify as Master/Transaction/Config
- ✅ Document categorization in migration comments
- ✅ Group related tables in same migration file

### Rule 2: Master Data Relationships
- Master data → Transactional data (One-to-Many)
- Master data should NOT reference transactional data
- Master data can reference other master data

### Rule 3: Transactional Data Patterns
- Always references master data
- Contains business event timestamps
- May reference other transactional data
- Includes `organization_id` for multi-tenancy

### Rule 4: Configuration Data Patterns
- Usually simple key-value structure
- May be global or tenant-specific
- Rarely referenced by other data
- Changed through admin interface

---

## Database Security (To Be Updated)

*Additional security principles from tomorrow's mentorship session will be added here.*

---

## Code Quality Standards

### Naming Conventions
- Tables: `snake_case`, plural (e.g., `property_types`)
- Models: `PascalCase`, singular (e.g., `PropertyType`)
- Controllers: `PascalCase`, plural with `Controller` suffix
- Migrations: Descriptive with timestamp prefix

### Documentation
- All migrations include comments explaining categorization
- Complex queries documented with purpose
- Stored procedures include parameter descriptions

### Performance
- Use eager loading to prevent N+1 queries
- Cache frequently accessed master data
- Use database indexes strategically
- Monitor query performance in production

---

## Implementation Checklist

- [x] Multi-tenancy structure (organizations table)
- [x] Database migrations with proper categorization
- [ ] Multi-tenancy middleware implementation
- [ ] Stored procedures for complex queries
- [ ] Database views for aggregations
- [ ] Proper indexes on all tables
- [ ] Filament admin resources
- [ ] API endpoints with tenant scoping
- [ ] Database security rules (after mentorship)

---

## Notes

This document will be updated as more principles are learned during mentorship sessions.

Last Updated: 2025-12-08

