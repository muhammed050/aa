-- =============================================
-- ADDITIONAL INDEXES FOR OPTIMIZATION
-- =============================================
-- Run this migration after monitoring production query patterns
-- These are optional indexes for specific use cases

-- Full-text search on profiles (for user discovery)
create index profiles_full_name_trgm_idx on profiles using gin (full_name gin_trgm_ops);
create index profiles_bio_trgm_idx on profiles using gin (bio gin_trgm_ops);

-- Full-text search on pages
create index pages_title_trgm_idx on pages using gin (title gin_trgm_ops);
create index pages_description_trgm_idx on pages using gin (description gin_trgm_ops);

-- Full-text search on products
create index products_name_trgm_idx on products using gin (name gin_trgm_ops);
create index products_description_trgm_idx on products using gin (description gin_trgm_ops);

-- JSONB indexes for theme settings queries
create index pages_theme_settings_idx on pages using gin (theme_settings);
create index page_sections_settings_idx on page_sections using gin (settings);

-- Analytics optimization
create index analytics_events_event_target_idx on analytics_events(event_target) where event_target is not null;
create index analytics_sessions_country_idx on analytics_sessions(country) where country is not null;
create index analytics_sessions_device_idx on analytics_sessions(device) where device is not null;

-- Composite indexes for common dashboard queries
create index page_views_page_country_date_idx on page_views(page_id, country, created_at desc);
create index page_views_page_device_date_idx on page_views(page_id, device, created_at desc);

-- Scheduled links optimization
create index links_schedule_idx on links(schedule_start, schedule_end) where schedule_start is not null;

-- Product stock monitoring
create index products_low_stock_idx on products(stock) where stock <= 10 and stock is not null;

-- Subscription expiry monitoring
create index subscriptions_expiring_idx on subscriptions(current_period_end) where status = 'active';

-- Note: Install pg_trgm extension first if not already enabled
-- Run: create extension if not exists pg_trgm;
