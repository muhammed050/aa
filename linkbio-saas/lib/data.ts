import { createClient } from './supabase/server';

export async function currentUser() {
  const s = await createClient();
  const { data } = await s.auth.getUser();
  return data.user;
}

export async function myPage() {
  const u = await currentUser();
  if (!u) return null;
  const s = await createClient();
  const { data, error } = await s.from('pages').select('*').eq('user_id', u.id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function mySections() {
  const p = await myPage();
  if (!p) return [];
  const s = await createClient();
  const { data, error } = await s.from('page_sections').select('*').eq('page_id', p.id).order('position', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function pageByUsername(username: string) {
  const s = await createClient();
  const { data, error } = await s.from('pages').select('*').eq('username', username.toLowerCase()).eq('published', true).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const { data: sections, error: sectionsError } = await s.from('page_sections').select('*').eq('page_id', data.id).eq('visible', true).order('position', { ascending: true });
  if (sectionsError) throw new Error(sectionsError.message);
  return { ...data, sections: sections ?? [] };
}

export async function myProducts() {
  const p = await myPage();
  if (!p) return [];
  const s = await createClient();
  return (await s.from('products').select('*').eq('page_id', p.id).order('created_at', { ascending: false })).data ?? [];
}

export async function myServices() {
  const p = await myPage();
  if (!p) return [];
  const s = await createClient();
  return (await s.from('services').select('*').eq('page_id', p.id).order('created_at', { ascending: false })).data ?? [];
}
