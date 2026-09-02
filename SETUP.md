# Supabase Database Setup Guide

## Quick Start

### 1. Initialize Supabase Project

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Or initialize a new local project
supabase init
```

### 2. Apply Migrations

Run migrations in order:

```bash
# Apply all migrations
supabase db push

# Or apply manually one by one
psql -h db.your-project.supabase.co -U postgres -d postgres -f migrations/20260902000000_initial_schema.sql
psql -h db.your-project.supabase.co -U postgres -d postgres -f migrations/20260902000001_storage_buckets.sql
```

### 3. Enable Required Extensions

```sql
-- Enable pg_trgm for full-text search (required for optional_indexes migration)
create extension if not exists pg_trgm;

-- Enable pg_cron for scheduled jobs (optional)
create extension if not exists pg_cron;
```

### 4. Verify Installation

```sql
-- Check all tables exist
select count(*) from information_schema.tables 
where table_schema = 'public';
-- Expected: 13 tables

-- Check RLS is enabled
select tablename from pg_tables 
where schemaname = 'public' and rowsecurity = true;
-- Expected: 13 tables

-- Check storage buckets
select * from storage.buckets;
-- Expected: 5 buckets

-- Test helper functions
select check_username_available('test123');
-- Expected: true

select get_platform_stats();
-- Expected: JSON with statistics
```

## Migration Files Overview

| File | Purpose | Required |
|------|---------|----------|
| `20260902000000_initial_schema.sql` | Core schema, tables, indexes, RLS | ✓ Yes |
| `20260902000001_storage_buckets.sql` | Storage buckets and policies | ✓ Yes |
| `20260902000002_seed_data.sql` | Development test data | Optional |
| `20260902000003_optional_indexes.sql` | Performance indexes for production | Optional |
| `20260902000004_analytics_views.sql` | Materialized views for dashboards | Optional |
| `20260902000005_data_retention.sql` | Cleanup functions | Recommended |
| `20260902000006_admin_functions.sql` | Admin dashboard functions | Recommended |

## Configuration Steps

### Storage Bucket Setup

After running the storage migration, configure CORS in Supabase dashboard:

1. Go to Storage → Settings
2. Enable CORS for your domain
3. Set max file size limits per bucket

### Environment Variables

Add to your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Whop Billing
WHOP_API_KEY=your-whop-api-key
WHOP_WEBHOOK_SECRET=your-webhook-secret

# Plans
FREE_PLAN_ID=plan_free
PRO_PLAN_ID=plan_xxx
BUSINESS_PLAN_ID=plan_xxx
```

### Scheduled Jobs (Optional)

If using pg_cron, enable it in Supabase:

```sql
-- Refresh analytics views daily at midnight
select cron.schedule(
  'refresh-analytics',
  '0 0 * * *',
  'select refresh_analytics_views()'
);

-- Cleanup old analytics data daily at 2 AM
select cron.schedule(
  'cleanup-analytics',
  '0 2 * * *',
  'select cleanup_expired_analytics()'
);

-- Cleanup stale sessions every 6 hours
select cron.schedule(
  'cleanup-sessions',
  '0 */6 * * *',
  'select cleanup_stale_sessions()'
);

-- Cleanup old webhooks weekly on Sunday at 3 AM
select cron.schedule(
  'cleanup-webhooks',
  '0 3 * * 0',
  'select cleanup_old_webhooks()'
);
```

## Testing the Schema

### Create Test User

```sql
-- 1. Create auth user first (via Supabase Dashboard or API)
-- Then insert profile:

insert into profiles (id, username, full_name, email, language)
values (
  'auth-user-uuid',
  'testuser',
  'Test User',
  'test@example.com',
  'ar'
);

-- 2. Create a page
insert into pages (user_id, username, title, language, is_published)
values (
  'auth-user-uuid',
  'testuser',
  'صفحة تجريبية',
  'ar',
  true
)
returning id;
```

### Test Analytics Recording

```sql
-- Record page view (anonymous)
insert into page_views (page_id, session_id, is_unique, country, device)
values (
  'page-uuid',
  'session-123',
  true,
  'SA',
  'mobile'
);

-- Record link click
insert into analytics_events (page_id, session_id, event_type, event_target)
values (
  'page-uuid',
  'session-123',
  'link_click',
  'link-uuid'
);

-- Increment link counter
select increment_link_clicks('link-uuid');

-- Get analytics summary
select get_page_analytics_summary('page-uuid');
```

### Test Plan Limits

```sql
-- Create subscription
insert into subscriptions (user_id, plan, status)
values ('user-uuid', 'pro', 'active');

-- Get plan limits
select get_user_plan_limits('user-uuid');

-- Expected output:
-- {
--   "max_links": 50,
--   "max_products": 50,
--   "max_services": 20,
--   "custom_domain": true,
--   "remove_branding": true,
--   "analytics_retention_days": 365,
--   "max_media_size_mb": 100
-- }
```

## Rollback Instructions

To rollback the initial schema:

```bash
psql -h your-host -U postgres -d your-db -f migrations/20260902000000_initial_schema_rollback.sql
```

**WARNING:** This will delete all data. Only use in development.

## Common Issues

### Issue: RLS blocks all queries

**Solution:** Ensure you're authenticated or querying published content:

```javascript
// Always set auth session before queries
const { data, error } = await supabase.auth.getSession();
```

### Issue: Storage upload fails

**Solution:** Check bucket policies and file path format:

```javascript
// Correct path format: {user_id}/{filename}
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file);
```

### Issue: Username already taken

**Solution:** Use the helper function:

```sql
select check_username_available('username');
```

```javascript
const { data: available } = await supabase
  .rpc('check_username_available', { username_to_check: 'username' });
```

### Issue: Analytics not recording

**Solution:** Verify anonymous inserts are allowed. RLS policies allow `insert` with `check (true)` for analytics tables.

## Performance Optimization

### 1. Monitor Slow Queries

```sql
-- Enable pg_stat_statements
create extension if not exists pg_stat_statements;

-- Find slow queries
select 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
from pg_stat_statements
order by mean_exec_time desc
limit 20;
```

### 2. Add Missing Indexes

Run the optional indexes migration after monitoring production:

```bash
psql -f migrations/20260902000003_optional_indexes.sql
```

### 3. Materialized Views

Enable materialized views for fast dashboard queries:

```bash
psql -f migrations/20260902000004_analytics_views.sql
```

Then refresh periodically:

```sql
select refresh_analytics_views();
```

### 4. Connection Pooling

Configure in Supabase dashboard:
- Pool size: 15-20 for most projects
- Enable PgBouncer for serverless deployments

## Security Checklist

- ✓ RLS enabled on all tables
- ✓ Storage policies restrict to user folders
- ✓ Service role key kept server-side only
- ✓ Webhook events table inaccessible to users
- ✓ Admin functions check is_admin flag
- ✓ Analytics allows anonymous inserts but restricts reads

## Backup & Recovery

### Automated Backups

Supabase provides daily backups. Enable in dashboard:
- Settings → Database → Backups
- Retention: 7-30 days (depending on plan)

### Manual Backup

```bash
# Dump schema and data
pg_dump -h your-host -U postgres -d your-db -F c -f backup.dump

# Restore
pg_restore -h your-host -U postgres -d your-db backup.dump
```

## Support

For migration issues or questions:
1. Check Supabase logs in dashboard
2. Review RLS policies if access denied
3. Verify extensions are enabled
4. Check function permissions (security definer)
