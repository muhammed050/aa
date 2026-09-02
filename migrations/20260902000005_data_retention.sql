-- =============================================
-- DATA RETENTION & CLEANUP
-- =============================================
-- Functions to maintain analytics data based on plan limits

create or replace function cleanup_expired_analytics()
returns void as $$
begin
  -- Free plan: 30 days retention
  delete from page_views
  where page_id in (
    select p.id from pages p
    join subscriptions s on s.user_id = p.user_id
    where s.plan = 'free' and s.status = 'active'
  )
  and created_at < now() - interval '30 days';

  delete from analytics_events
  where page_id in (
    select p.id from pages p
    join subscriptions s on s.user_id = p.user_id
    where s.plan = 'free' and s.status = 'active'
  )
  and created_at < now() - interval '30 days';

  delete from analytics_sessions
  where page_id in (
    select p.id from pages p
    join subscriptions s on s.user_id = p.user_id
    where s.plan = 'free' and s.status = 'active'
  )
  and started_at < now() - interval '30 days';

  -- Pro plan: 365 days retention
  delete from page_views
  where page_id in (
    select p.id from pages p
    join subscriptions s on s.user_id = p.user_id
    where s.plan = 'pro' and s.status = 'active'
  )
  and created_at < now() - interval '365 days';

  delete from analytics_events
  where page_id in (
    select p.id from pages p
    join subscriptions s on s.user_id = p.user_id
    where s.plan = 'pro' and s.status = 'active'
  )
  and created_at < now() - interval '365 days';

  delete from analytics_sessions
  where page_id in (
    select p.id from pages p
    join subscriptions s on s.user_id = p.user_id
    where s.plan = 'pro' and s.status = 'active'
  )
  and started_at < now() - interval '365 days';

  -- Business plan: unlimited (no cleanup)
end;
$$ language plpgsql security definer;

-- Cleanup old webhook events (keep 90 days)
create or replace function cleanup_old_webhooks()
returns void as $$
begin
  delete from webhook_events
  where created_at < now() - interval '90 days'
  and processed = true;
end;
$$ language plpgsql security definer;

-- Cleanup orphaned sessions (no activity for 24 hours)
create or replace function cleanup_stale_sessions()
returns void as $$
begin
  delete from analytics_sessions
  where last_activity_at < now() - interval '24 hours';
end;
$$ language plpgsql security definer;

-- Aggregate old analytics to summary tables before deletion
create or replace function archive_old_analytics()
returns void as $$
begin
  -- Create monthly summaries before deleting detailed data
  insert into analytics_monthly_summary (page_id, month, total_views, unique_views, total_clicks)
  select 
    page_id,
    date_trunc('month', created_at) as month,
    count(*) as total_views,
    count(*) filter (where is_unique = true) as unique_views,
    0 as total_clicks
  from page_views
  where created_at < now() - interval '90 days'
  group by page_id, date_trunc('month', created_at)
  on conflict (page_id, month) do update
  set total_views = excluded.total_views,
      unique_views = excluded.unique_views;
end;
$$ language plpgsql security definer;

-- Monthly summary table
create table if not exists analytics_monthly_summary (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  month timestamptz not null,
  total_views bigint not null default 0,
  unique_views bigint not null default 0,
  total_clicks bigint not null default 0,
  created_at timestamptz not null default now(),
  unique(page_id, month)
);

create index analytics_monthly_summary_page_month_idx on analytics_monthly_summary(page_id, month desc);

-- Schedule cleanup jobs (requires pg_cron)
-- select cron.schedule('cleanup-analytics', '0 2 * * *', 'select cleanup_expired_analytics()');
-- select cron.schedule('cleanup-webhooks', '0 3 * * 0', 'select cleanup_old_webhooks()');
-- select cron.schedule('cleanup-sessions', '0 */6 * * *', 'select cleanup_stale_sessions()');
