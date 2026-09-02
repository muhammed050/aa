-- =============================================
-- STORAGE BUCKETS CONFIGURATION
-- =============================================

-- Create storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'products',
    'products',
    true,
    10485760, -- 10MB
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  (
    'gallery',
    'gallery',
    true,
    10485760, -- 10MB
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
  ),
  (
    'backgrounds',
    'backgrounds',
    true,
    5242880, -- 5MB
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  ),
  (
    'media',
    'media',
    true,
    52428800, -- 50MB
    array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf']
  )
on conflict (id) do nothing;

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Avatars bucket policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Products bucket policies
create policy "Product images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'products'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own product images"
  on storage.objects for update
  using (
    bucket_id = 'products'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own product images"
  on storage.objects for delete
  using (
    bucket_id = 'products'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Gallery bucket policies
create policy "Gallery files are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Authenticated users can upload gallery files"
  on storage.objects for insert
  with check (
    bucket_id = 'gallery'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own gallery files"
  on storage.objects for update
  using (
    bucket_id = 'gallery'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own gallery files"
  on storage.objects for delete
  using (
    bucket_id = 'gallery'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Backgrounds bucket policies
create policy "Background images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'backgrounds');

create policy "Authenticated users can upload background images"
  on storage.objects for insert
  with check (
    bucket_id = 'backgrounds'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own background images"
  on storage.objects for update
  using (
    bucket_id = 'backgrounds'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own background images"
  on storage.objects for delete
  using (
    bucket_id = 'backgrounds'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Media bucket policies
create policy "Media files are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated users can upload media files"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own media files"
  on storage.objects for update
  using (
    bucket_id = 'media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own media files"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
