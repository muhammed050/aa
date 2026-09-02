-- =============================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================
-- Optional: Use this to populate test data

-- Note: You'll need to replace these UUIDs with actual auth.users IDs
-- after creating test users through Supabase Auth

-- Example test user profile
-- Replace 'YOUR-AUTH-USER-ID' with actual user ID from auth.users
/*
insert into profiles (id, username, full_name, email, bio, category, language)
values (
  'YOUR-AUTH-USER-ID',
  'testuser',
  'Test User',
  'test@example.com',
  'مرحباً! هذا حساب تجريبي',
  'creator',
  'ar'
);

-- Example page
insert into pages (user_id, username, title, description, language, currency, is_published)
values (
  'YOUR-AUTH-USER-ID',
  'testuser',
  'صفحتي التجريبية',
  'مرحباً بكم في صفحتي',
  'ar',
  'SAR',
  true
);

-- Get the page_id for the following inserts
-- Replace 'PAGE-UUID' with the actual UUID returned from the pages insert

-- Example page sections
insert into page_sections (page_id, type, position, is_visible, settings)
values 
  ('PAGE-UUID', 'profile', 0, true, '{"show_avatar": true, "show_bio": true}'),
  ('PAGE-UUID', 'social_links', 1, true, '{"layout": "icons"}'),
  ('PAGE-UUID', 'links', 2, true, '{"style": "rounded"}'),
  ('PAGE-UUID', 'products', 3, true, '{"layout": "grid", "columns": 2}');

-- Example links
insert into links (page_id, title, description, url, icon, position, is_active)
values 
  ('PAGE-UUID', 'موقعي الإلكتروني', 'زوروا موقعنا الرسمي', 'https://example.com', 'globe', 0, true),
  ('PAGE-UUID', 'مدونتي', 'اقرأ آخر المقالات', 'https://blog.example.com', 'book', 1, true),
  ('PAGE-UUID', 'تواصل معي', 'للاستفسارات والتعاون', 'mailto:test@example.com', 'mail', 2, true);

-- Example social links
insert into social_links (page_id, platform, username, url, position, is_visible)
values 
  ('PAGE-UUID', 'instagram', 'testuser', 'https://instagram.com/testuser', 0, true),
  ('PAGE-UUID', 'twitter', 'testuser', 'https://twitter.com/testuser', 1, true),
  ('PAGE-UUID', 'youtube', 'testuser', 'https://youtube.com/@testuser', 2, true),
  ('PAGE-UUID', 'tiktok', 'testuser', 'https://tiktok.com/@testuser', 3, true);

-- Example products
insert into products (page_id, name, description, price, currency, category, is_active, position)
values 
  ('PAGE-UUID', 'منتج تجريبي 1', 'وصف المنتج الأول', 99.00, 'SAR', 'electronics', true, 0),
  ('PAGE-UUID', 'منتج تجريبي 2', 'وصف المنتج الثاني', 149.00, 'SAR', 'fashion', true, 1),
  ('PAGE-UUID', 'منتج تجريبي 3', 'وصف المنتج الثالث', 79.00, 'SAR', 'beauty', true, 2);

-- Example services
insert into services (page_id, name, description, price, currency, duration, is_active, position)
values 
  ('PAGE-UUID', 'استشارة شخصية', 'جلسة استشارة لمدة ساعة', 200.00, 'SAR', 60, true, 0),
  ('PAGE-UUID', 'ورشة عمل', 'ورشة عمل تفاعلية', 500.00, 'SAR', 120, true, 1);

-- Example subscription
insert into subscriptions (user_id, plan, status)
values ('YOUR-AUTH-USER-ID', 'free', 'active');
*/

-- =============================================
-- ANALYTICS TEST DATA GENERATOR
-- =============================================
-- Generates sample analytics data for testing dashboards

/*
-- Generate page views for the last 30 days
do $$
declare
  test_page_id uuid := 'PAGE-UUID';
  test_date timestamptz;
  i int;
begin
  for i in 0..29 loop
    test_date := now() - (i || ' days')::interval;
    
    -- Generate 10-50 random views per day
    for j in 1..(10 + floor(random() * 40))::int loop
      insert into page_views (page_id, session_id, is_unique, country, device, created_at)
      values (
        test_page_id,
        'session_' || gen_random_uuid(),
        random() > 0.7,
        (array['SA', 'AE', 'EG', 'KW', 'QA', 'BH', 'OM'])[floor(random() * 7 + 1)],
        (array['mobile', 'desktop', 'tablet'])[floor(random() * 3 + 1)],
        test_date + (random() * interval '24 hours')
      );
    end loop;
  end loop;
end $$;

-- Generate link click events
do $$
declare
  test_page_id uuid := 'PAGE-UUID';
  test_link_ids uuid[];
  test_date timestamptz;
  i int;
begin
  -- Get all link IDs for the test page
  select array_agg(id) into test_link_ids from links where page_id = test_page_id;
  
  for i in 0..29 loop
    test_date := now() - (i || ' days')::interval;
    
    -- Generate 5-20 clicks per day
    for j in 1..(5 + floor(random() * 15))::int loop
      insert into analytics_events (page_id, session_id, event_type, event_target, created_at)
      values (
        test_page_id,
        'session_' || gen_random_uuid(),
        'link_click',
        test_link_ids[floor(random() * array_length(test_link_ids, 1) + 1)],
        test_date + (random() * interval '24 hours')
      );
    end loop;
  end loop;
end $$;
*/
