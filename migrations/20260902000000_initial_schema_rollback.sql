-- =============================================
-- ROLLBACK SCRIPT
-- =============================================
-- Use this to revert the initial_schema migration
-- WARNING: This will delete all data

-- Drop helper functions
drop function if exists increment_product_clicks(uuid);
drop function if exists increment_product_views(uuid);
drop function if exists increment_link_clicks(uuid);
drop function if exists get_user_plan_limits(uuid);
drop function if exists get_page_analytics_summary(uuid, timestamptz, timestamptz);
drop function if exists check_username_available(text);

-- Drop triggers
drop trigger if exists subscriptions_updated_at on subscriptions;
drop trigger if exists services_updated_at on services;
drop trigger if exists products_updated_at on products;
drop trigger if exists social_links_updated_at on social_links;
drop trigger if exists links_updated_at on links;
drop trigger if exists page_sections_updated_at on page_sections;
drop trigger if exists pages_updated_at on pages;
drop trigger if exists profiles_updated_at on profiles;

-- Drop trigger function
drop function if exists update_updated_at_column();

-- Drop tables (in reverse dependency order)
drop table if exists webhook_events;
drop table if exists subscriptions;
drop table if exists page_views;
drop table if exists analytics_events;
drop table if exists analytics_sessions;
drop table if exists media;
drop table if exists services;
drop table if exists product_images;
drop table if exists products;
drop table if exists social_links;
drop table if exists links;
drop table if exists page_sections;
drop table if exists pages;
drop table if exists profiles;
