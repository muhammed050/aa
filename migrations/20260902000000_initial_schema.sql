-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- CORE TABLES
-- =============================================

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_-]+$'),
  full_name text,
  email text unique not null,
  avatar_url text,
  bio text,
  category text check (category in ('creator', 'influencer', 'business', 'personal', 'other')),
  language text not null default 'ar' check (language in ('ar', 'en')),
  is_verified boolean not null default false,
  is_admin boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_-]+$'),
  title text not null,
  description text,
  seo_title text,
  seo_description text,
  language text not null default 'ar' check (language in ('ar', 'en')),
  country text,
  currency text not null default 'SAR',
  theme_settings jsonb not null default '{}',
  template_id uuid,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table page_sections (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  type text not null check (type in ('profile', 'social_links', 'links', 'products', 'services', 'whatsapp', 'gallery', 'video', 'location', 'contact', 'custom')),
  position integer not null default 0,
  is_visible boolean not null default true,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(page_id, position)
);

create table links (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  title text not null,
  description text,
  url text not null,
  icon text,
  image_url text,
  thumbnail_url text,
  badge_text text,
  is_highlighted boolean not null default false,
  opens_new_tab boolean not null default true,
  position integer not null default 0,
  is_active boolean not null default true,
  schedule_start timestamptz,
  schedule_end timestamptz,
  click_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table social_links (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'youtube', 'twitter', 'x', 'facebook', 'linkedin', 'snapchat', 'whatsapp', 'telegram', 'discord', 'twitch', 'pinterest', 'github', 'behance', 'dribbble', 'spotify', 'soundcloud', 'other')),
  username text,
  url text not null,
  position integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10,2) not null,
  currency text not null default 'SAR',
  image_url text,
  sku text,
  stock integer,
  category text,
  product_url text,
  whatsapp_order_link text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  position integer not null default 0,
  view_count bigint not null default 0,
  click_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table services (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10,2),
  currency text not null default 'SAR',
  duration integer,
  image_url text,
  booking_url text,
  whatsapp_number text,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table media (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size bigint not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);

-- =============================================
-- ANALYTICS TABLES
-- =============================================

create table analytics_sessions (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  session_id text not null,
  visitor_id text not null,
  country text,
  region text,
  device text,
  browser text,
  os text,
  referrer text,
  landing_page text,
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create table analytics_events (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  session_id text not null,
  event_type text not null check (event_type in ('page_view', 'link_click', 'social_click', 'product_view', 'product_click', 'service_click', 'whatsapp_click', 'gallery_view', 'contact_submit', 'custom')),
  event_target text,
  section_type text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table page_views (
  id uuid primary key default uuid_generate_v4(),
  page_id uuid not null references pages(id) on delete cascade,
  session_id text not null,
  is_unique boolean not null default false,
  country text,
  device text,
  referrer text,
  created_at timestamptz not null default now()
);

-- =============================================
-- BILLING TABLES
-- =============================================

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references profiles(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  whop_subscription_id text,
  whop_customer_id text,
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due', 'paused', 'expired')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table webhook_events (
  id uuid primary key default uuid_generate_v4(),
  event_id text unique not null,
  event_type text not null,
  payload jsonb not null,
  processed boolean not null default false,
  processed_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

-- =============================================
-- INDEXES
-- =============================================

create index profiles_username_idx on profiles(username);
create index profiles_email_idx on profiles(email);
create index profiles_created_at_idx on profiles(created_at desc);

create index pages_user_id_idx on pages(user_id);
create index pages_username_idx on pages(username);
create index pages_is_published_idx on pages(is_published) where is_published = true;
create index pages_created_at_idx on pages(created_at desc);

create index page_sections_page_id_idx on page_sections(page_id);
create index page_sections_position_idx on page_sections(page_id, position);

create index links_page_id_idx on links(page_id);
create index links_position_idx on links(page_id, position);
create index links_is_active_idx on links(is_active) where is_active = true;

create index social_links_page_id_idx on social_links(page_id);
create index social_links_platform_idx on social_links(platform);

create index products_page_id_idx on products(page_id);
create index products_position_idx on products(page_id, position);
create index products_is_active_idx on products(is_active) where is_active = true;
create index products_category_idx on products(category);

create index product_images_product_id_idx on product_images(product_id);

create index services_page_id_idx on services(page_id);
create index services_position_idx on services(page_id, position);

create index media_user_id_idx on media(user_id);
create index media_created_at_idx on media(created_at desc);

create index analytics_sessions_page_id_idx on analytics_sessions(page_id);
create index analytics_sessions_session_id_idx on analytics_sessions(session_id);
create index analytics_sessions_visitor_id_idx on analytics_sessions(visitor_id);
create index analytics_sessions_started_at_idx on analytics_sessions(started_at desc);

create index analytics_events_page_id_created_at_idx on analytics_events(page_id, created_at desc);
create index analytics_events_session_id_idx on analytics_events(session_id);
create index analytics_events_event_type_idx on analytics_events(event_type);
create index analytics_events_created_at_idx on analytics_events(created_at desc);

create index page_views_page_id_created_at_idx on page_views(page_id, created_at desc);
create index page_views_session_id_idx on page_views(session_id);
create index page_views_is_unique_idx on page_views(is_unique) where is_unique = true;

create index subscriptions_user_id_idx on subscriptions(user_id);
create index subscriptions_status_idx on subscriptions(status);
create index subscriptions_whop_subscription_id_idx on subscriptions(whop_subscription_id);

create index webhook_events_event_id_idx on webhook_events(event_id);
create index webhook_events_processed_idx on webhook_events(processed) where processed = false;
create index webhook_events_created_at_idx on webhook_events(created_at desc);

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

create trigger pages_updated_at before update on pages
  for each row execute function update_updated_at_column();

create trigger page_sections_updated_at before update on page_sections
  for each row execute function update_updated_at_column();

create trigger links_updated_at before update on links
  for each row execute function update_updated_at_column();

create trigger social_links_updated_at before update on social_links
  for each row execute function update_updated_at_column();

create trigger products_updated_at before update on products
  for each row execute function update_updated_at_column();

create trigger services_updated_at before update on services
  for each row execute function update_updated_at_column();

create trigger subscriptions_updated_at before update on subscriptions
  for each row execute function update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table profiles enable row level security;
alter table pages enable row level security;
alter table page_sections enable row level security;
alter table links enable row level security;
alter table social_links enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table services enable row level security;
alter table media enable row level security;
alter table analytics_sessions enable row level security;
alter table analytics_events enable row level security;
alter table page_views enable row level security;
alter table subscriptions enable row level security;
alter table webhook_events enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Pages policies
create policy "Published pages are viewable by everyone"
  on pages for select
  using (is_published = true or auth.uid() = user_id);

create policy "Users can insert their own pages"
  on pages for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pages"
  on pages for update
  using (auth.uid() = user_id);

create policy "Users can delete their own pages"
  on pages for delete
  using (auth.uid() = user_id);

-- Page sections policies
create policy "Sections from published pages are viewable by everyone"
  on page_sections for select
  using (
    exists (
      select 1 from pages
      where pages.id = page_sections.page_id
      and (pages.is_published = true or pages.user_id = auth.uid())
    )
  );

create policy "Users can insert sections for their own pages"
  on page_sections for insert
  with check (
    exists (
      select 1 from pages
      where pages.id = page_sections.page_id
      and pages.user_id = auth.uid()
    )
  );

create policy "Users can update sections for their own pages"
  on page_sections for update
  using (
    exists (
      select 1 from pages
      where pages.id = page_sections.page_id
      and pages.user_id = auth.uid()
    )
  );

create policy "Users can delete sections for their own pages"
  on page_sections for delete
  using (
    exists (
      select 1 from pages
      where pages.id = page_sections.page_id
      and pages.user_id = auth.uid()
    )
  );

-- Links policies
create policy "Links from published pages are viewable by everyone"
  on links for select
  using (
    exists (
      select 1 from pages
      where pages.id = links.page_id
      and (pages.is_published = true or pages.user_id = auth.uid())
    )
  );

create policy "Users can insert links for their own pages"
  on links for insert
  with check (
    exists (
      select 1 from pages
      where pages.id = links.page_id
      and pages.user_id = auth.uid()
    )
  );

create policy "Users can update links for their own pages"
  on links for update
  using (
    exists (
      select 1 from pages
      where pages.id = links.page_id
      and pages.user_id = auth.uid()
    )
  );

create policy "Users can delete links for their own pages"
  on links for delete
  using (
    exists (
      select 1 from pages
      where pages.id = links.page_id
      and pages.user_id = auth.uid()
    )
  );

-- Social links policies
create policy "Social links from published pages are viewable by everyone"
  on social_links for select
  using (
    exists (
      select 1 from pages
      where pages.id = social_links.page_id
      and (pages.is_published = true or pages.user_id = auth.uid())
    )
  );

create policy "Users can manage social links for their own pages"
  on social_links for all
  using (
    exists (
      select 1 from pages
      where pages.id = social_links.page_id
      and pages.user_id = auth.uid()
    )
  );

-- Products policies
create policy "Products from published pages are viewable by everyone"
  on products for select
  using (
    exists (
      select 1 from pages
      where pages.id = products.page_id
      and (pages.is_published = true or pages.user_id = auth.uid())
    )
  );

create policy "Users can manage products for their own pages"
  on products for all
  using (
    exists (
      select 1 from pages
      where pages.id = products.page_id
      and pages.user_id = auth.uid()
    )
  );

-- Product images policies
create policy "Product images are viewable by everyone"
  on product_images for select
  using (
    exists (
      select 1 from products
      join pages on pages.id = products.page_id
      where products.id = product_images.product_id
      and (pages.is_published = true or pages.user_id = auth.uid())
    )
  );

create policy "Users can manage product images for their own products"
  on product_images for all
  using (
    exists (
      select 1 from products
      join pages on pages.id = products.page_id
      where products.id = product_images.product_id
      and pages.user_id = auth.uid()
    )
  );

-- Services policies
create policy "Services from published pages are viewable by everyone"
  on services for select
  using (
    exists (
      select 1 from pages
      where pages.id = services.page_id
      and (pages.is_published = true or pages.user_id = auth.uid())
    )
  );

create policy "Users can manage services for their own pages"
  on services for all
  using (
    exists (
      select 1 from pages
      where pages.id = services.page_id
      and pages.user_id = auth.uid()
    )
  );

-- Media policies
create policy "Users can view their own media"
  on media for select
  using (auth.uid() = user_id);

create policy "Users can insert their own media"
  on media for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own media"
  on media for delete
  using (auth.uid() = user_id);

-- Analytics policies (allow anonymous inserts for tracking)
create policy "Users can view analytics for their own pages"
  on analytics_sessions for select
  using (
    exists (
      select 1 from pages
      where pages.id = analytics_sessions.page_id
      and pages.user_id = auth.uid()
    )
  );

create policy "Anyone can insert analytics sessions"
  on analytics_sessions for insert
  with check (true);

create policy "Users can view events for their own pages"
  on analytics_events for select
  using (
    exists (
      select 1 from pages
      where pages.id = analytics_events.page_id
      and pages.user_id = auth.uid()
    )
  );

create policy "Anyone can insert analytics events"
  on analytics_events for insert
  with check (true);

create policy "Users can view page views for their own pages"
  on page_views for select
  using (
    exists (
      select 1 from pages
      where pages.id = page_views.page_id
      and pages.user_id = auth.uid()
    )
  );

create policy "Anyone can insert page views"
  on page_views for insert
  with check (true);

-- Subscriptions policies
create policy "Users can view their own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscription"
  on subscriptions for insert
  with check (auth.uid() = user_id);

create policy "System can update subscriptions"
  on subscriptions for update
  using (true);

-- Webhook events policies (service role only)
create policy "Webhook events are system managed"
  on webhook_events for all
  using (false);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

create or replace function check_username_available(username_to_check text)
returns boolean as $$
begin
  return not exists (
    select 1 from profiles where username = username_to_check
  ) and not exists (
    select 1 from pages where username = username_to_check
  );
end;
$$ language plpgsql security definer;

create or replace function get_page_analytics_summary(
  page_uuid uuid,
  start_date timestamptz default now() - interval '30 days',
  end_date timestamptz default now()
)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total_views', (
      select count(*) from page_views
      where page_id = page_uuid
      and created_at between start_date and end_date
    ),
    'unique_views', (
      select count(*) from page_views
      where page_id = page_uuid
      and is_unique = true
      and created_at between start_date and end_date
    ),
    'total_clicks', (
      select count(*) from analytics_events
      where page_id = page_uuid
      and event_type in ('link_click', 'social_click', 'product_click', 'service_click')
      and created_at between start_date and end_date
    ),
    'top_links', (
      select json_agg(json_build_object('title', title, 'clicks', click_count))
      from (
        select l.title, l.click_count
        from links l
        where l.page_id = page_uuid
        order by l.click_count desc
        limit 5
      ) top
    ),
    'top_countries', (
      select json_agg(json_build_object('country', country, 'views', count))
      from (
        select country, count(*) as count
        from page_views
        where page_id = page_uuid
        and created_at between start_date and end_date
        and country is not null
        group by country
        order by count desc
        limit 5
      ) countries
    )
  ) into result;
  
  return result;
end;
$$ language plpgsql security definer;

create or replace function get_user_plan_limits(user_uuid uuid)
returns json as $$
declare
  user_plan text;
  result json;
begin
  select plan into user_plan
  from subscriptions
  where user_id = user_uuid
  and status = 'active';
  
  if user_plan is null then
    user_plan := 'free';
  end if;
  
  result := case user_plan
    when 'free' then json_build_object(
      'max_links', 10,
      'max_products', 5,
      'max_services', 3,
      'custom_domain', false,
      'remove_branding', false,
      'analytics_retention_days', 30,
      'max_media_size_mb', 10
    )
    when 'pro' then json_build_object(
      'max_links', 50,
      'max_products', 50,
      'max_services', 20,
      'custom_domain', true,
      'remove_branding', true,
      'analytics_retention_days', 365,
      'max_media_size_mb', 100
    )
    when 'business' then json_build_object(
      'max_links', -1,
      'max_products', -1,
      'max_services', -1,
      'custom_domain', true,
      'remove_branding', true,
      'analytics_retention_days', -1,
      'max_media_size_mb', 500
    )
  end;
  
  return result;
end;
$$ language plpgsql security definer;

create or replace function increment_link_clicks(link_uuid uuid)
returns void as $$
begin
  update links
  set click_count = click_count + 1
  where id = link_uuid;
end;
$$ language plpgsql security definer;

create or replace function increment_product_views(product_uuid uuid)
returns void as $$
begin
  update products
  set view_count = view_count + 1
  where id = product_uuid;
end;
$$ language plpgsql security definer;

create or replace function increment_product_clicks(product_uuid uuid)
returns void as $$
begin
  update products
  set click_count = click_count + 1
  where id = product_uuid;
end;
$$ language plpgsql security definer;
