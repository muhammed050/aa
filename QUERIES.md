# Query Examples

Common database queries for your Link-in-Bio SaaS application.

## User & Profile Queries

### Get user profile with page count
```javascript
const { data: profile } = await supabase
  .from('profiles')
  .select(`
    *,
    pages:pages(count)
  `)
  .eq('username', 'testuser')
  .single();
```

### Check if username is available
```javascript
const { data: isAvailable } = await supabase
  .rpc('check_username_available', { 
    username_to_check: 'newusername' 
  });
```

### Update user profile
```javascript
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'أحمد محمد',
    bio: 'مصمم جرافيك',
    category: 'creator'
  })
  .eq('id', userId);
```

## Page Queries

### Get published page with all sections
```javascript
const { data: page } = await supabase
  .from('pages')
  .select(`
    *,
    profile:profiles(*),
    sections:page_sections(
      *,
      order: position
    ),
    links(*),
    social_links(*),
    products(*),
    services(*)
  `)
  .eq('username', 'username')
  .eq('is_published', true)
  .single();
```

### Get user's pages
```javascript
const { data: pages } = await supabase
  .from('pages')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Create new page
```javascript
const { data: newPage, error } = await supabase
  .from('pages')
  .insert({
    user_id: userId,
    username: 'mypage',
    title: 'صفحتي الشخصية',
    language: 'ar',
    currency: 'SAR',
    theme_settings: {
      background_color: '#0F131C',
      accent_color: '#38BDF8',
      font: 'Cairo'
    }
  })
  .select()
  .single();
```

### Update page theme
```javascript
const { data } = await supabase
  .from('pages')
  .update({
    theme_settings: {
      background_color: '#0A0D12',
      accent_color: '#6EE7B7',
      font: 'Tajawal',
      button_style: 'rounded'
    }
  })
  .eq('id', pageId);
```

### Publish/unpublish page
```javascript
const { data } = await supabase
  .from('pages')
  .update({
    is_published: true,
    published_at: new Date().toISOString()
  })
  .eq('id', pageId);
```

## Section Queries

### Get sections for a page
```javascript
const { data: sections } = await supabase
  .from('page_sections')
  .select('*')
  .eq('page_id', pageId)
  .order('position', { ascending: true });
```

### Create new section
```javascript
const { data: section } = await supabase
  .from('page_sections')
  .insert({
    page_id: pageId,
    type: 'products',
    position: 3,
    is_visible: true,
    settings: {
      layout: 'grid',
      columns: 2,
      show_price: true
    }
  })
  .select()
  .single();
```

### Reorder sections
```javascript
const updates = sections.map((section, index) => ({
  id: section.id,
  position: index
}));

const { data } = await supabase
  .from('page_sections')
  .upsert(updates);
```

## Link Queries

### Get active links for a page
```javascript
const { data: links } = await supabase
  .from('links')
  .select('*')
  .eq('page_id', pageId)
  .eq('is_active', true)
  .order('position', { ascending: true });
```

### Create new link
```javascript
const { data: link } = await supabase
  .from('links')
  .insert({
    page_id: pageId,
    title: 'موقعي الإلكتروني',
    url: 'https://example.com',
    icon: 'globe',
    is_highlighted: true,
    position: 0
  })
  .select()
  .single();
```

### Increment link clicks
```javascript
await supabase.rpc('increment_link_clicks', { 
  link_uuid: linkId 
});
```

### Get scheduled links
```javascript
const now = new Date().toISOString();

const { data: activeLinks } = await supabase
  .from('links')
  .select('*')
  .eq('page_id', pageId)
  .eq('is_active', true)
  .or(`schedule_start.is.null,schedule_start.lte.${now}`)
  .or(`schedule_end.is.null,schedule_end.gte.${now}`)
  .order('position');
```

## Product Queries

### Get products with images
```javascript
const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    images:product_images(*)
  `)
  .eq('page_id', pageId)
  .eq('is_active', true)
  .order('position');
```

### Create product with images
```javascript
// First create the product
const { data: product } = await supabase
  .from('products')
  .insert({
    page_id: pageId,
    name: 'منتج جديد',
    description: 'وصف المنتج',
    price: 99.99,
    currency: 'SAR',
    is_active: true
  })
  .select()
  .single();

// Then add images
const images = imageUrls.map((url, index) => ({
  product_id: product.id,
  image_url: url,
  position: index
}));

await supabase
  .from('product_images')
  .insert(images);
```

### Get featured products
```javascript
const { data: featured } = await supabase
  .from('products')
  .select('*')
  .eq('page_id', pageId)
  .eq('is_featured', true)
  .eq('is_active', true)
  .limit(3);
```

### Track product interaction
```javascript
// Increment view count
await supabase.rpc('increment_product_views', { 
  product_uuid: productId 
});

// Increment click count
await supabase.rpc('increment_product_clicks', { 
  product_uuid: productId 
});
```

## Analytics Queries

### Record page view
```javascript
await supabase
  .from('page_views')
  .insert({
    page_id: pageId,
    session_id: sessionId,
    is_unique: isFirstVisit,
    country: 'SA',
    device: 'mobile',
    referrer: document.referrer
  });
```

### Record event
```javascript
await supabase
  .from('analytics_events')
  .insert({
    page_id: pageId,
    session_id: sessionId,
    event_type: 'link_click',
    event_target: linkId,
    metadata: {
      title: linkTitle,
      url: linkUrl
    }
  });
```

### Get analytics summary
```javascript
const { data: summary } = await supabase
  .rpc('get_page_analytics_summary', {
    page_uuid: pageId,
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date().toISOString()
  });

// Returns:
// {
//   total_views: 1234,
//   unique_views: 890,
//   total_clicks: 456,
//   top_links: [...],
//   top_countries: [...]
// }
```

### Get daily views for chart
```javascript
const { data: dailyViews } = await supabase
  .from('page_views')
  .select('created_at')
  .eq('page_id', pageId)
  .gte('created_at', startDate)
  .lte('created_at', endDate);

// Group by day in your app
const groupedByDay = dailyViews.reduce((acc, view) => {
  const day = new Date(view.created_at).toLocaleDateString();
  acc[day] = (acc[day] || 0) + 1;
  return acc;
}, {});
```

### Get top countries
```javascript
const { data: countries } = await supabase
  .from('page_views')
  .select('country')
  .eq('page_id', pageId)
  .gte('created_at', startDate)
  .not('country', 'is', null);

// Count in your app
const countryCounts = countries.reduce((acc, { country }) => {
  acc[country] = (acc[country] || 0) + 1;
  return acc;
}, {});
```

### Get click-through rate
```javascript
const { data: stats } = await supabase
  .from('analytics_events')
  .select('event_type, page_id')
  .eq('page_id', pageId)
  .gte('created_at', startDate);

const views = stats.filter(e => e.event_type === 'page_view').length;
const clicks = stats.filter(e => e.event_type.includes('_click')).length;
const ctr = views > 0 ? (clicks / views * 100).toFixed(2) : 0;
```

## Subscription Queries

### Get user subscription
```javascript
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId)
  .single();
```

### Get plan limits
```javascript
const { data: limits } = await supabase
  .rpc('get_user_plan_limits', { 
    user_uuid: userId 
  });

// Returns:
// {
//   max_links: 50,
//   max_products: 50,
//   custom_domain: true,
//   ...
// }
```

### Check if user can add more links
```javascript
const { data: limits } = await supabase
  .rpc('get_user_plan_limits', { user_uuid: userId });

const { count: currentLinks } = await supabase
  .from('links')
  .select('*', { count: 'exact', head: true })
  .eq('page_id', pageId);

const canAddMore = limits.max_links === -1 || currentLinks < limits.max_links;
```

### Update subscription status (webhook)
```javascript
const { data } = await supabase
  .from('subscriptions')
  .update({
    status: 'active',
    current_period_start: periodStart,
    current_period_end: periodEnd
  })
  .eq('whop_subscription_id', subscriptionId);
```

## Storage Queries

### Upload avatar
```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file, {
    cacheControl: '3600',
    upsert: true
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.jpg`);

// Update profile
await supabase
  .from('profiles')
  .update({ avatar_url: publicUrl })
  .eq('id', userId);
```

### Upload product images
```javascript
const uploadPromises = files.map((file, index) => 
  supabase.storage
    .from('products')
    .upload(`${userId}/${productId}/${index}.jpg`, file)
);

const results = await Promise.all(uploadPromises);

const imageUrls = results.map(({ data }) => 
  supabase.storage.from('products').getPublicUrl(data.path).data.publicUrl
);
```

### Delete old media
```javascript
const { data: oldFiles } = await supabase.storage
  .from('media')
  .list(userId);

const filesToDelete = oldFiles
  .filter(file => isOlderThan30Days(file.created_at))
  .map(file => `${userId}/${file.name}`);

await supabase.storage
  .from('media')
  .remove(filesToDelete);
```

## Admin Queries

### Get platform statistics
```javascript
const { data: stats } = await supabase
  .rpc('get_platform_stats');

// Returns:
// {
//   total_users: 1234,
//   verified_users: 56,
//   total_pages: 1100,
//   published_pages: 890,
//   active_subscriptions: { free: 1000, pro: 200, business: 34 },
//   ...
// }
```

### Get top performing pages
```javascript
const { data: topPages } = await supabase
  .rpc('get_top_pages', {
    limit_count: 10,
    days: 30
  });
```

### Get recent users
```javascript
const { data: recentUsers } = await supabase
  .rpc('get_recent_users', {
    limit_count: 20
  });
```

### Verify user
```javascript
await supabase.rpc('verify_user', {
  user_uuid: userId
});
```

### Get revenue summary
```javascript
const { data: revenue } = await supabase
  .rpc('get_revenue_summary', {
    months: 12
  });

// Returns:
// {
//   total_active_subscriptions: 234,
//   total_mrr: 15430,
//   by_plan: { pro: {...}, business: {...} },
//   churned_30d: 12
// }
```

## Realtime Subscriptions

### Subscribe to page changes
```javascript
const channel = supabase
  .channel('page-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'pages',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Page changed:', payload);
    }
  )
  .subscribe();
```

### Subscribe to new analytics events
```javascript
const channel = supabase
  .channel('analytics')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'analytics_events',
      filter: `page_id=eq.${pageId}`
    },
    (payload) => {
      console.log('New event:', payload.new);
    }
  )
  .subscribe();
```

## Complex Queries

### Get page with full analytics
```javascript
const { data: pageData } = await supabase
  .from('pages')
  .select(`
    *,
    links(id, title, click_count),
    products(id, name, view_count, click_count)
  `)
  .eq('id', pageId)
  .single();

const { data: analytics } = await supabase
  .rpc('get_page_analytics_summary', {
    page_uuid: pageId
  });

const fullPageData = { ...pageData, analytics };
```

### Search pages by username or title
```javascript
const { data: results } = await supabase
  .from('pages')
  .select('*, profile:profiles(full_name, avatar_url)')
  .or(`username.ilike.%${query}%,title.ilike.%${query}%`)
  .eq('is_published', true)
  .limit(20);
```

### Get user's total clicks across all pages
```javascript
const { data: userPages } = await supabase
  .from('pages')
  .select('id')
  .eq('user_id', userId);

const pageIds = userPages.map(p => p.id);

const { data: clickEvents } = await supabase
  .from('analytics_events')
  .select('id', { count: 'exact', head: true })
  .in('page_id', pageIds)
  .like('event_type', '%_click');

const totalClicks = clickEvents?.count || 0;
```
