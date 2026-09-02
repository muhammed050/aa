import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const reserved = new Set(['admin','api','login','signup','dashboard','settings','billing','support','help','about','pricing','terms','privacy','null','undefined']);
const username = z.string().trim().toLowerCase().pipe(z.string().regex(/^[a-z0-9_-]{3,30}$/).refine((v) => !reserved.has(v), 'اسم المستخدم محجوز'));
const section = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(['profile','social','links','products','services','gallery','video','location','contact','whatsapp','booking','cta','text']),
  title: z.string().max(160).optional(),
  subtitle: z.string().max(300).optional(),
  visible: z.boolean(),
  content: z.record(z.string(), z.unknown()),
  style: z.record(z.string(), z.unknown()).optional(),
});
const body = z.object({
  username: username.optional(),
  sections: z.array(section).max(100).optional(),
  published: z.boolean().optional(),
  theme: z.record(z.string(), z.unknown()).optional(),
  name: z.string().min(1).max(120).optional(),
  bio: z.string().max(1000).nullable().optional(),
  template: z.number().int().min(1).max(8).optional(),
  language: z.enum(['ar', 'en']).optional(),
  seo_title: z.string().max(160).nullable().optional(),
  seo_description: z.string().max(320).nullable().optional(),
  noindex: z.boolean().optional(),
});

async function auth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await auth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: page, error } = await supabase.from('pages').select('*').eq('user_id', user.id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!page) return NextResponse.json({ page: null, sections: [] });
  const { data: sections, error: sectionsError } = await supabase.from('page_sections').select('*').eq('page_id', page.id).order('position', { ascending: true });
  if (sectionsError) return NextResponse.json({ error: sectionsError.message }, { status: 500 });
  return NextResponse.json({ page: { ...page, sections: sections ?? [] }, sections: sections ?? [] });
}

export async function PUT(req: Request) {
  const { supabase, user } = await auth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let payload: unknown;
  try { payload = await req.json(); } catch { return NextResponse.json({ error: 'JSON غير صالح' }, { status: 400 }); }
  const parsed = body.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: 'بيانات غير صالحة', details: parsed.error.flatten() }, { status: 400 });

  const values = parsed.data;
  const { sections, theme, template, noindex, ...pageValues } = values;
  let { data: page, error: pageLookupError } = await supabase.from('pages').select('id,theme_settings').eq('user_id', user.id).maybeSingle();
  if (pageLookupError) return NextResponse.json({ error: pageLookupError.message }, { status: 500 });

  if (!page) {
    const u = values.username || `user-${user.id.slice(0, 8)}`;
    const { data: created, error } = await supabase.from('pages').insert({
      user_id: user.id,
      username: u,
      name: values.name || 'صفحتي',
      bio: values.bio ?? null,
      language: values.language || 'ar',
      published: values.published ?? false,
      is_published: values.published ?? false,
      theme_settings: { ...(theme || {}), ...(template ? { template } : {}), ...(noindex !== undefined ? { noindex } : {}) },
    }).select('id,theme_settings').single();
    if (error) {
      if (error.code === '23503') return NextResponse.json({ error: 'جلسة الحساب غير متزامنة مع قاعدة البيانات. سجّل الخروج ثم ادخل مجدداً.' }, { status: 409 });
      return NextResponse.json({ error: error.code === '23505' ? 'اسم المستخدم مستخدم بالفعل' : error.message }, { status: 400 });
    }
    page = created;
  }

  const currentTheme = (page.theme_settings && typeof page.theme_settings === 'object' && !Array.isArray(page.theme_settings)) ? page.theme_settings as Record<string, unknown> : {};
  const nextTheme = {
    ...currentTheme,
    ...(theme || {}),
    ...(template !== undefined ? { template } : {}),
    ...(noindex !== undefined ? { noindex } : {}),
  };
  const updateValues = { ...pageValues, theme_settings: nextTheme, updated_at: new Date().toISOString() };
  if (Object.keys(updateValues).length > 1) {
    const { error } = await supabase.from('pages').update(updateValues).eq('id', page.id);
    if (error) return NextResponse.json({ error: error.code === '23505' ? 'اسم المستخدم مستخدم بالفعل' : error.message }, { status: 400 });
  }

  if (sections) {
    const { error: deleteError } = await supabase.from('page_sections').delete().eq('page_id', page.id);
    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });
    if (sections.length) {
      const rows = sections.map((s, position) => ({ id: s.id, page_id: page.id, type: s.type, title: s.title ?? null, subtitle: s.subtitle ?? null, position, visible: s.visible, content: s.content, style: s.style ?? {} }));
      const { error: insertError } = await supabase.from('page_sections').insert(rows);
      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });
    }
  }

  const { data: result, error: resultError } = await supabase.from('pages').select('*').eq('id', page.id).single();
  if (resultError) return NextResponse.json({ error: resultError.message }, { status: 500 });
  return NextResponse.json({ page: result });
}

export async function POST(req: Request) { return PUT(req); }
