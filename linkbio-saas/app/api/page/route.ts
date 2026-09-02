import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const reserved = new Set(["admin","api","login","signup","dashboard","settings","billing","support","help","about","pricing","terms","privacy","null","undefined"]);
const username = z.string().trim().toLowerCase().pipe(z.string().regex(/^[a-z0-9_-]{3,30}$/).refine((v) => !reserved.has(v), "اسم المستخدم محجوز"));
const section = z.object({
  id: z.string().min(1).max(80), type: z.enum(["profile","social","links","products","services","gallery","video","location","contact","whatsapp","booking","cta","text"]),
  title: z.string().max(160).optional(), subtitle: z.string().max(300).optional(), visible: z.boolean(),
  content: z.record(z.string(), z.unknown()), style: z.record(z.string(), z.unknown()).optional(),
});
const body = z.object({ username: username.optional(), sections: z.array(section).max(100), published: z.boolean().optional(), theme: z.record(z.string(), z.unknown()).optional(), name: z.string().min(1).max(120).optional(), bio: z.string().max(1000).nullable().optional(), template: z.number().int().min(1).max(8).optional(), seo_title: z.string().max(160).nullable().optional(), seo_description: z.string().max(320).nullable().optional(), noindex: z.boolean().optional() });

async function auth() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); return { supabase, user }; }

export async function GET() {
  const { supabase, user } = await auth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: page, error } = await supabase.from("pages").select("*").eq("user_id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ page });
}

export async function PUT(req: Request) {
  const { supabase, user } = await auth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة", details: parsed.error.flatten() }, { status: 400 });
  const values = parsed.data;
  let { data: page } = await supabase.from("pages").select("id").eq("user_id", user.id).maybeSingle();
  if (!page) {
    const u = values.username || `user-${user.id.slice(0, 8)}`;
    const { data: created, error } = await supabase.from("pages").insert({ user_id: user.id, username: u, name: values.name || "صفحتي", sections: values.sections, published: values.published ?? false }).select("id").single();
    if (error) return NextResponse.json({ error: error.code === "23505" ? "اسم المستخدم مستخدم بالفعل" : error.message }, { status: 400 });
    page = created;
  }
  const { data, error } = await supabase.from("pages").update({ ...values, updated_at: new Date().toISOString() }).eq("id", page.id).select("*").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "اسم المستخدم مستخدم بالفعل" : error.message }, { status: 400 });
  return NextResponse.json({ page: data });
}

export async function POST(req: Request) { return PUT(req); }
