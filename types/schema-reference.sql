-- =============================================
-- TYPE DEFINITIONS FOR TYPESCRIPT
-- =============================================
-- Generate TypeScript types from this schema using supabase gen types

-- Example usage:
-- supabase gen types typescript --local > types/database.types.ts

-- Or for remote:
-- supabase gen types typescript --project-id your-project-ref > types/database.types.ts

-- This file documents the expected structure for reference

/*
Database Tables:

profiles {
  id: string (uuid)
  username: string
  full_name: string | null
  email: string
  avatar_url: string | null
  bio: string | null
  category: 'creator' | 'influencer' | 'business' | 'personal' | 'other' | null
  language: 'ar' | 'en'
  is_verified: boolean
  is_admin: boolean
  onboarding_completed: boolean
  created_at: string (timestamptz)
  updated_at: string (timestamptz)
}

pages {
  id: string (uuid)
  user_id: string (uuid)
  username: string
  title: string
  description: string | null
  seo_title: string | null
  seo_description: string | null
  language: 'ar' | 'en'
  country: string | null
  currency: string
  theme_settings: Json
  template_id: string (uuid) | null
  is_published: boolean
  published_at: string (timestamptz) | null
  created_at: string (timestamptz)
  updated_at: string (timestamptz)
}

page_sections {
  id: string (uuid)
  page_id: string (uuid)
  type: 'profile' | 'social_links' | 'links' | 'products' | 'services' | 'whatsapp' | 'gallery' | 'video' | 'location' | 'contact' | 'custom'
  position: number
  is_visible: boolean
  settings: Json
  created_at: string (timestamptz)
  updated_at: string (timestamptz)
}

links {
  id: string (uuid)
  page_id: string (uuid)
  title: string
  description: string | null
  url: string
  icon: string | null
  image_url: string | null
  thumbnail_url: string | null
  badge_text: string | null
  is_highlighted: boolean
  opens_new_tab: boolean
  position: number
  is_active: boolean
  schedule_start: string (timestamptz) | null
  schedule_end: string (timestamptz) | null
  click_count: number
  created_at: string (timestamptz)
  updated_at: string (timestamptz)
}

social_links {
  id: string (uuid)
  page_id: string (uuid)
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'x' | 'facebook' | 'linkedin' | 'snapchat' | 'whatsapp' | 'telegram' | 'discord' | 'twitch' | 'pinterest' | 'github' | 'behance' | 'dribbble' | 'spotify' | 'soundcloud' | 'other'
  username: string | null
  url: string
  position: number
  is_visible: boolean
  created_at: string (timestamptz)
  updated_at: string (timestamptz)
}

products {
  id: string (uuid)
  page_id: string (uuid)
  name: string
  description: string | null
  price: number (decimal)
  currency: string
  image_url: string | null
  sku: string | null
  stock: number | null
  category: string | null
  product_url: string | null
  whatsapp_order_link: string | null
  is_active: boolean
  is_featured: boolean
  position: number
  view_count: number
  click_count: number
  created_at: string (timestamptz)
  updated_at: string (timestamptz)
}

product_images {
  id: string (uuid)
  product_id: string (uuid)
  image_url: string
  position: number
  created_at: string (timestamptz)
}

services {
  id: string (uuid)
  page_id: string (uuid)
  name: string
  description: string | null
  price: number (decimal) | null
  currency: string
  duration: number | null
  image_url: string | null
  booking_url: string | null
  whatsapp_number: string | null
  is_active: boolean
  position: number
  created_at: string (timestamptz)
  updated_at: string (timestamptz)
}

media {
  id: string (uuid)
  user_id: string (uuid)
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  mime_type: string
  created_at: string (timestamptz)
}

analytics_sessions {
  id: string (uuid)
  page_id: string (uuid)
  session_id: string
  visitor_id: string
  country: string | null
  region: string | null
  device: string | null
  browser: string | null
  os: string | null
  referrer: string | null
  landing_page: string | null
  started_at: string (timestamptz)
  last_activity_at: string (timestamptz)
}

analytics_events {
  id: string (uuid)
  page_id: string (uuid)
  session_id: string
  event_type: 'page_view' | 'link_click' | 'social_click' | 'product_view' | 'product_click' | 'service_click' | 'whatsapp_click' | 'gallery_view' | 'contact_submit' | 'custom'
  event_target: string | null
  section_type: string | null
  metadata: Json
  created_at: string (timestamptz)
}

page_views {
  id: string (uuid)
  page_id: string (uuid)
  session_id: string
  is_unique: boolean
  country: string | null
  device: string | null
  referrer: string | null
  created_at: string (timestamptz)
}

subscriptions {
  id: string (uuid)
  user_id: string (uuid)
  plan: 'free' | 'pro' | 'business'
  whop_subscription_id: string | null
  whop_customer_id: string | null
  status: 'active' | 'cancelled' | 'past_due' | 'paused' | 'expired'
  current_period_start: string (timestamptz) | null
  current_period_end: string (timestamptz) | null
  cancel_at: string (timestamptz) | null
  cancelled_at: string (timestamptz) | null
  created_at: string (timestamptz)
  updated_at: string (timestamptz)
}

webhook_events {
  id: string (uuid)
  event_id: string
  event_type: string
  payload: Json
  processed: boolean
  processed_at: string (timestamptz) | null
  error: string | null
  created_at: string (timestamptz)
}

Helper Functions:

check_username_available(username_to_check: string): boolean
get_page_analytics_summary(page_uuid: string, start_date?: string, end_date?: string): Json
get_user_plan_limits(user_uuid: string): Json
increment_link_clicks(link_uuid: string): void
increment_product_views(product_uuid: string): void
increment_product_clicks(product_uuid: string): void
get_platform_stats(): Json
get_top_pages(limit_count?: number, days?: number): Array<TopPage>
get_recent_users(limit_count?: number): Array<RecentUser>
verify_user(user_uuid: string): void
unverify_user(user_uuid: string): void
unpublish_page(page_uuid: string, reason?: string): void
get_revenue_summary(months?: number): Json
cleanup_expired_analytics(): void
cleanup_old_webhooks(): void
cleanup_stale_sessions(): void
refresh_analytics_views(): void

Storage Buckets:

avatars: { public: true, max_size: 5MB }
products: { public: true, max_size: 10MB }
gallery: { public: true, max_size: 10MB }
backgrounds: { public: true, max_size: 5MB }
media: { public: true, max_size: 50MB }
*/
