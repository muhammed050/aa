-- =============================================
-- ADMIN FUNCTIONS & MODERATION
-- =============================================
-- Functions for admin dashboard and content moderation

-- Get platform statistics
create or replace function get_platform_stats()
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total_users', (select count(*) from profiles),
    'verified_users', (select count(*) from profiles where is_verified = true),
    'total_pages', (select count(*) from pages),
    'published_pages', (select count(*) from pages where is_published = true),
    'total_products', (select count(*) from products),
    'total_services', (select count(*) from services),
    'total_links', (select count(*) from links),
    'active_subscriptions', (
      select json_build_object(
        'free', count(*) filter (where plan = 'free'),
        'pro', count(*) filter (where plan = 'pro'),
        'business', count(*) filter (where plan = 'business')
      )
      from subscriptions where status = 'active'
    ),
    'total_views_30d', (
      select count(*) from page_views 
      where created_at > now() - interval '30 days'
    ),
    'total_clicks_30d', (
      select count(*) from analytics_events 
      where event_type like '%_click' 
      and created_at > now() - interval '30 days'
    ),
    'new_users_7d', (
      select count(*) from profiles 
      where created_at > now() - interval '7 days'
    ),
    'new_pages_7d', (
      select count(*) from pages 
      where created_at > now() - interval '7 days'
    )
  ) into result;
  
  return result;
end;
$$ language plpgsql security definer;

-- Get top performing pages
create or replace function get_top_pages(limit_count int default 10, days int default 30)
returns table(
  page_id uuid,
  username text,
  user_full_name text,
  total_views bigint,
  unique_views bigint,
  total_clicks bigint,
  ctr numeric
) as $$
begin
  return query
  select 
    p.id as page_id,
    p.username,
    pr.full_name as user_full_name,
    count(distinct pv.id) as total_views,
    count(distinct pv.id) filter (where pv.is_unique = true) as unique_views,
    count(distinct ae.id) filter (where ae.event_type like '%_click') as total_clicks,
    (count(distinct ae.id) filter (where ae.event_type like '%_click')::float / 
     nullif(count(distinct pv.id), 0) * 100)::numeric(5,2) as ctr
  from pages p
  join profiles pr on pr.id = p.user_id
  left join page_views pv on pv.page_id = p.id 
    and pv.created_at > now() - (days || ' days')::interval
  left join analytics_events ae on ae.page_id = p.id 
    and ae.created_at > now() - (days || ' days')::interval
  where p.is_published = true
  group by p.id, p.username, pr.full_name
  order by total_views desc
  limit limit_count;
end;
$$ language plpgsql security definer;

-- Get recent user activity
create or replace function get_recent_users(limit_count int default 20)
returns table(
  user_id uuid,
  username text,
  full_name text,
  email text,
  category text,
  is_verified boolean,
  page_count bigint,
  created_at timestamptz
) as $$
begin
  return query
  select 
    p.id as user_id,
    p.username,
    p.full_name,
    p.email,
    p.category,
    p.is_verified,
    count(pg.id) as page_count,
    p.created_at
  from profiles p
  left join pages pg on pg.user_id = p.id
  group by p.id, p.username, p.full_name, p.email, p.category, p.is_verified, p.created_at
  order by p.created_at desc
  limit limit_count;
end;
$$ language plpgsql security definer;

-- Verify user (admin only)
create or replace function verify_user(user_uuid uuid)
returns void as $$
begin
  update profiles
  set is_verified = true
  where id = user_uuid;
end;
$$ language plpgsql security definer;

-- Unverify user (admin only)
create or replace function unverify_user(user_uuid uuid)
returns void as $$
begin
  update profiles
  set is_verified = false
  where id = user_uuid;
end;
$$ language plpgsql security definer;

-- Unpublish page (moderation)
create or replace function unpublish_page(page_uuid uuid, reason text default null)
returns void as $$
begin
  update pages
  set is_published = false
  where id = page_uuid;
  
  -- Log moderation action (implement moderation_log table if needed)
end;
$$ language plpgsql security definer;

-- Get subscription revenue summary
create or replace function get_revenue_summary(months int default 12)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total_active_subscriptions', count(*) filter (where status = 'active'),
    'total_mrr', (
      count(*) filter (where plan = 'pro' and status = 'active') * 29 +
      count(*) filter (where plan = 'business' and status = 'active') * 99
    ),
    'by_plan', json_build_object(
      'pro', json_build_object(
        'count', count(*) filter (where plan = 'pro' and status = 'active'),
        'mrr', count(*) filter (where plan = 'pro' and status = 'active') * 29
      ),
      'business', json_build_object(
        'count', count(*) filter (where plan = 'business' and status = 'active'),
        'mrr', count(*) filter (where plan = 'business' and status = 'active') * 99
      )
    ),
    'churned_30d', count(*) filter (
      where status = 'cancelled' 
      and cancelled_at > now() - interval '30 days'
    )
  ) into result
  from subscriptions
  where created_at > now() - (months || ' months')::interval;
  
  return result;
end;
$$ language plpgsql security definer;

-- RLS policies for admin functions
create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
    or auth.uid() = id
  );

create policy "Admins can view all pages"
  on pages for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
    or user_id = auth.uid()
    or is_published = true
  );

create policy "Admins can update any page"
  on pages for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
    or user_id = auth.uid()
  );
