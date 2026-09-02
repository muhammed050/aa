-- =============================================
-- ADVANCED ANALYTICS VIEWS
-- =============================================
-- Materialized views for fast dashboard queries

-- Daily page statistics
create materialized view daily_page_stats as
select 
  page_id,
  date_trunc('day', created_at) as day,
  count(*) as total_views,
  count(*) filter (where is_unique = true) as unique_views,
  count(distinct country) as countries_count,
  count(*) filter (where device = 'mobile') as mobile_views,
  count(*) filter (where device = 'desktop') as desktop_views,
  count(*) filter (where device = 'tablet') as tablet_views
from page_views
group by page_id, date_trunc('day', created_at);

create unique index daily_page_stats_page_day_idx on daily_page_stats(page_id, day desc);

-- Top performing links per page
create materialized view top_links as
select 
  l.page_id,
  l.id as link_id,
  l.title,
  l.click_count,
  count(ae.id) as recent_clicks_30d,
  row_number() over (partition by l.page_id order by l.click_count desc) as rank
from links l
left join analytics_events ae on ae.event_target::uuid = l.id 
  and ae.event_type = 'link_click' 
  and ae.created_at > now() - interval '30 days'
where l.is_active = true
group by l.page_id, l.id, l.title, l.click_count;

create index top_links_page_idx on top_links(page_id, rank);

-- Page performance summary
create materialized view page_performance as
select 
  p.id as page_id,
  p.username,
  p.is_published,
  count(distinct pv.id) as total_views,
  count(distinct pv.id) filter (where pv.is_unique = true) as unique_visitors,
  count(distinct ae.id) filter (where ae.event_type like '%_click') as total_clicks,
  count(distinct ae.id) filter (where ae.event_type = 'link_click') as link_clicks,
  count(distinct ae.id) filter (where ae.event_type = 'product_click') as product_clicks,
  (count(distinct ae.id) filter (where ae.event_type like '%_click')::float / 
   nullif(count(distinct pv.id), 0) * 100)::numeric(5,2) as click_through_rate,
  max(pv.created_at) as last_view_at
from pages p
left join page_views pv on pv.page_id = p.id
left join analytics_events ae on ae.page_id = p.id
where p.is_published = true
group by p.id, p.username, p.is_published;

create unique index page_performance_page_id_idx on page_performance(page_id);
create index page_performance_ctr_idx on page_performance(click_through_rate desc nulls last);

-- Refresh functions (call these periodically via cron or scheduled job)
create or replace function refresh_analytics_views()
returns void as $$
begin
  refresh materialized view concurrently daily_page_stats;
  refresh materialized view concurrently top_links;
  refresh materialized view concurrently page_performance;
end;
$$ language plpgsql security definer;

-- Auto-refresh daily stats at midnight
-- Note: Requires pg_cron extension
-- select cron.schedule('refresh-analytics', '0 0 * * *', 'select refresh_analytics_views()');
