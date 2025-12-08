# Database Design - Enterprise Architecture

## Data Categorization

### MASTER DATA (Reference Entities)
Core business entities that don't change frequently but are referenced in transactions.

1. **organizations** - Tenant organizations (multi-tenancy root)
2. **users** - System users (linked to organizations)
3. **property_types** - Apartment, House, Land, Commercial, Industrial
4. **amenities** - Wi-Fi, Security, Pool, Gym, etc.
5. **expert_categories** - Legal, Solar, Landscaping, etc.
6. **locations** - Cities, Areas (reference data)
7. **currencies** - KSh, USD, EUR (if multi-currency)

### TRANSACTIONAL DATA (Business Events)
Records of business activities and events.

1. **properties** - Property listings (main transactional entity)
2. **property_images** - Images linked to properties
3. **property_amenities** - Junction table (properties ↔ amenities)
4. **inquiries** - User inquiries about properties
5. **appointments** - Scheduled property viewings
6. **property_views** - Track property view counts
7. **expert_requests** - Requests to community experts
8. **news_articles** - News/blog posts (if transactional)
9. **favorites** - User saved properties

### CONFIGURATION DATA (System Settings)
System-wide settings and configurations.

1. **system_settings** - General app settings
2. **feature_flags** - Feature toggle configuration
3. **email_templates** - Email template definitions
4. **notification_settings** - User notification preferences
5. **seo_settings** - SEO metadata configuration

## Multi-Tenancy Structure

All tables (except system-wide config) include:
- `organization_id` (foreign key to organizations table)
- Global scope applied via middleware to filter by current tenant

## Database Optimization

### Stored Procedures (PostgreSQL)
1. **calculate_commission** - Calculate agent/owner commissions
2. **get_property_statistics** - Aggregate property stats by organization
3. **search_properties** - Optimized property search with filters

### Database Views
1. **v_properties_with_details** - Properties with joined amenities, images, location
2. **v_property_statistics** - Aggregated stats per organization
3. **v_user_dashboard_data** - User-specific dashboard aggregations

### Indexes
- Foreign keys automatically indexed
- `properties.organization_id` - Multi-tenancy filtering
- `properties.location` - Search filtering
- `properties.price` - Price range filtering
- `properties.status` - Availability filtering
- Full-text indexes on searchable text fields

## Table Relationships

```
organizations (Master)
  ├── users (Master) [organization_id]
  ├── properties (Transaction) [organization_id]
  │   ├── property_images (Transaction) [property_id]
  │   ├── property_amenities (Transaction) [property_id, amenity_id]
  │   └── inquiries (Transaction) [property_id]
  └── expert_profiles (Transaction) [organization_id]

property_types (Master)
  └── properties (Transaction) [property_type_id]

amenities (Master)
  └── property_amenities (Transaction) [amenity_id]

expert_categories (Master)
  └── expert_profiles (Transaction) [category_id]
```

