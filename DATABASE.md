# Database Schema Documentation

## Overview
Complete PostgreSQL schema for Arabic-first Link-in-Bio SaaS with visual page builder, store, analytics, and billing integration.

## Migration Files

### 1. `20260902000000_initial_schema.sql`
Main schema with all tables, indexes, RLS policies, and helper functions.

### 2. `20260902000001_storage_buckets.sql`
Storage buckets configuration and policies.

## Tables

### Core Tables

**profiles**
- Primary user profile linked to auth.users
- Username must be lowercase, URL-safe (a-z, 0-9, _, -)
- Supports Arabic/English language preference
- Category-based classification
- Verification and admin flags

**pages**
- User's public link-in-bio page
- Unique username per page
- JSONB theme_settings for flexible customization
- Publish/unpublish capability with timestamp
- Multi-language and multi-currency support

**page_sections**
- Modular sections for page builder
- 11 section types: profile, social_links, links, products, services, whatsapp, gallery, video, location, contact, custom
- Position-based ordering
- JSONB settings for flexible configuration per section type

**links**
- Individual links within a page
- Scheduling support (schedule_start/schedule_end)
- Click tracking with counter
- Badge support for highlighting
- Image/thumbnail support

**social_links**
- Social media platform links
- 18+ platform types supported
- Position-based ordering

**products**
- E-commerce products for selling
- Stock management
- WhatsApp order integration
- View and click tracking
- Featured/category support

**product_images**
- Multiple images per product
- Position-based gallery ordering

**services**
- Service offerings with booking
- Duration and pricing
- WhatsApp booking integration

**media**
- User media library
- File metadata tracking

### Analytics Tables

**analytics_sessions**
- Visitor session tracking
- Device, browser, OS detection
- Geo-location (country/region)
- Referrer tracking

**analytics_events**
- Granular event tracking
- 9 event types supported
- JSONB metadata for flexible event data
- Session linking

**page_views**
- Dedicated page view tracking
- Unique visitor detection
- Device and geo data

### Billing Tables

**subscriptions**
- User subscription management
- 3 tiers: free, pro, business
- Whop.com integration fields
- Status tracking with cancellation support

**webhook_events**
- Webhook event log
- Processing status tracking
- Error capture

## Indexes

### Performance Indexes
- Username lookups: `profiles_username_idx`, `pages_username_idx`
- User pages: `pages_user_id_idx`
- Analytics queries: composite indexes on `(page_id, created_at)`
- Session lookups: `analytics_sessions_session_id_idx`, `analytics_events_session_id_idx`
- Active content: partial indexes on `is_published`, `is_active`

### Optimization Strategy
- Composite indexes for common query patterns (page_id + created_at)
- Partial indexes for filtered queries (published pages, active links)
- DESC ordering on created_at for recent-first queries

## RLS Policies

### Public Access
- Published pages and all related content (sections, links, products, services)
- All profile data (usernames are public)

### Authenticated User Access
- Full CRUD on own profiles, pages, and content
- Read-only access to own analytics
- Read-only access to own subscription

### Anonymous Analytics Recording
- INSERT allowed on all analytics tables for public tracking
- No authentication required for page view/event recording

### Security Model
- All tables have RLS enabled
- Policies enforce ownership via JOIN to pages table
- Analytics tables allow anonymous inserts but restrict reads to page owners
- Webhook events are system-only (service role)

## Storage Buckets

### Bucket Configuration

| Bucket | Public | Size Limit | Allowed Types |
|--------|--------|------------|---------------|
| avatars | ✓ | 5MB | JPEG, PNG, WebP, GIF |
| products | ✓ | 10MB | JPEG, PNG, WebP |
| gallery | ✓ | 10MB | Images + MP4/WebM |
| backgrounds | ✓ | 5MB | JPEG, PNG, WebP |
| media | ✓ | 50MB | Images, Video, PDF |

### Storage Policies
- All buckets publicly readable
- Files organized by user ID folders
- Users can only upload/update/delete their own files
- Path pattern: `{bucket}/{user_id}/{filename}`

## Helper Functions

### `check_username_available(username_to_check text) -> boolean`
Checks if username is available across both profiles and pages tables.

**Usage:**
```sql
select check_username_available('myusername');
```

### `get_page_analytics_summary(page_uuid uuid, start_date timestamptz, end_date timestamptz) -> json`
Returns comprehensive analytics summary for a page.

**Returns:**
- total_views
- unique_views
- total_clicks
- top_links (top 5 by clicks)
- top_countries (top 5 by views)

**Usage:**
```sql
select get_page_analytics_summary(
  'page-uuid',
  now() - interval '30 days',
  now()
);
```

### `get_user_plan_limits(user_uuid uuid) -> json`
Returns plan limits based on user's active subscription.

**Returns:**
- max_links (10/50/unlimited)
- max_products (5/50/unlimited)
- max_services (3/20/unlimited)
- custom_domain (boolean)
- remove_branding (boolean)
- analytics_retention_days
- max_media_size_mb

**Usage:**
```sql
select get_user_plan_limits(auth.uid());
```

### Counter Functions
- `increment_link_clicks(link_uuid)` - Atomic link click counter
- `increment_product_views(product_uuid)` - Atomic product view counter
- `increment_product_clicks(product_uuid)` - Atomic product click counter

## Triggers

### Updated At Automation
All tables with `updated_at` columns have triggers that automatically update the timestamp on every update:
- profiles
- pages
- page_sections
- links
- social_links
- products
- services
- subscriptions

## Plan Limits

### Free Plan
- 10 links
- 5 products
- 3 services
- 30 days analytics retention
- 10MB max media size
- Branding included

### Pro Plan
- 50 links
- 50 products
- 20 services
- 365 days analytics retention
- 100MB max media size
- Custom domain
- Remove branding

### Business Plan
- Unlimited links
- Unlimited products
- Unlimited services
- Unlimited analytics retention
- 500MB max media size
- Custom domain
- Remove branding

## Running Migrations

### Supabase CLI
```bash
supabase db push
```

### Manual Application
```bash
psql -h your-db-host -U postgres -d your-db-name -f migrations/20260902000000_initial_schema.sql
psql -h your-db-host -U postgres -d your-db-name -f migrations/20260902000001_storage_buckets.sql
```

## Verification Steps

After running migrations:

1. **Verify tables created:**
```sql
select table_name from information_schema.tables 
where table_schema = 'public' 
order by table_name;
```

2. **Verify indexes:**
```sql
select indexname, tablename from pg_indexes 
where schemaname = 'public' 
order by tablename, indexname;
```

3. **Verify RLS enabled:**
```sql
select tablename, rowsecurity from pg_tables 
where schemaname = 'public';
```

4. **Verify storage buckets:**
```sql
select id, name, public, file_size_limit from storage.buckets;
```

5. **Test helper functions:**
```sql
select check_username_available('testuser');
select get_user_plan_limits('user-uuid');
```

## Performance Considerations

### Analytics Tables
- Analytics tables will grow rapidly
- Consider partitioning by date for large-scale deployments
- Implement data retention policies based on plan limits
- Use materialized views for dashboard aggregations

### Indexes Strategy
- Composite indexes optimize common query patterns
- Partial indexes reduce index size for filtered queries
- Monitor slow queries and add indexes as needed

### JSONB Fields
- `theme_settings`: Page customization (colors, fonts, layout)
- `settings`: Section-specific configuration
- `metadata`: Event-specific data
- `payload`: Webhook event data

All JSONB fields are indexed automatically by PostgreSQL for efficient querying.

## Security Notes

- All user passwords managed by Supabase Auth
- RLS enforces data isolation
- Storage policies enforce folder-based access
- Anonymous analytics recording allowed for public pages
- Webhook events restricted to service role
- No direct foreign keys to auth.users (uses profiles as intermediary)

## Arabic-First Considerations

- Default language set to 'ar' across tables
- Language field on profiles and pages
- RTL support handled at application layer
- Text fields support full Unicode (Arabic, emoji, etc.)
- Currency defaults to SAR (Saudi Riyal)
- Country field for regional customization
