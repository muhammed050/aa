'use client';
import { FormEvent, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const templates = [
  ['1','Minimal','بسيط ونظيف'], ['2','Creator','لصناع المحتوى'], ['3','Store','متجر'], ['4','Business','أعمال'],
  ['5','Restaurant','مطعم'], ['6','Services','خدمات'], ['7','Luxury','فاخر'], ['8','Bento','شبكة Bento'],
];

export default function Settings() {
  const [form, setForm] = useState({ name:'', username:'', bio:'', template:1, language:'ar', published:false });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/page').then(r=>r.json()).then(x=>{
      const p=x.page;
      if (p) setForm({ name:p.name||'', username:p.username||'', bio:p.bio||'', template:Number(p.theme_settings?.template||1), language:p.language||'ar', published:Boolean(p.published) });
    }).finally(()=>setLoading(false));
  }, []);

  async function save(e:FormEvent) {
    e.preventDefault(); setStatus('جار الحفظ…');
    const r=await fetch('/api/page',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({name:form.name,username:form.username,bio:form.bio,template:form.template,language:form.language,published:form.published})});
    const x=await r.json(); setStatus(r.ok?'تم الحفظ بنجاح':x.error||'تعذر الحفظ');
  }
  async function logout(){ await createClient().auth.signOut(); location.href='/login'; }

  if (loading) return <div className='mx-auto max-w-5xl py-16 text-center text-sm text-muted'>جار تحميل إعداداتك…</div>;
  return <form onSubmit={save} dir='rtl' className='mx-auto max-w-6xl space-y-7'>
    <div><p className='text-xs font-black tracking-widest text-primary'>SETTINGS</p><h1 className='mt-2 text-3xl font-black'>إعدادات صفحتك</h1><p className='mt-2 text-sm text-muted'>اختر الشكل الذي يمثل هويتك، ثم عدّل معلوماتك وانشرها.</p></div>

    <section className='rounded-[28px] border bg-card p-5 sm:p-7'>
      <div className='flex items-end justify-between gap-4'><div><h2 className='text-xl font-black'>اختر القالب</h2><p className='mt-1 text-sm text-muted'>كل قالب مختلف فعلياً. اضغط على المعاينة لتجربته.</p></div><span className='rounded-full bg-soft px-3 py-1 text-xs font-black text-primary'>القالب {form.template} / 8</span></div>
      <div className='mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
        {templates.map(([id,name,desc])=> <button type='button' key={id} onClick={()=>setForm({...form,template:Number(id)})} className={`group overflow-hidden rounded-[24px] border-2 bg-background text-right transition hover:-translate-y-1 hover:shadow-xl ${form.template===Number(id)?'border-primary ring-4 ring-primary/10':'border-border'}`}>
          <div className='relative h-[300px] overflow-hidden bg-neutral-100'><iframe title={`معاينة ${name}`} src={`/${id}`} className='pointer-events-none absolute left-1/2 top-0 h-[900px] w-[390px] -translate-x-1/2 origin-top scale-[.73] border-0' /><div className='absolute inset-0' /></div>
          <div className='flex items-center justify-between p-4'><div><p className='font-black'>{name}</p><p className='mt-1 text-xs text-muted'>{desc}</p></div><span className={`grid size-9 place-items-center rounded-full text-xs font-black ${form.template===Number(id)?'bg-primary text-primary-foreground':'bg-soft text-muted'}`}>{form.template===Number(id)?'✓':id}</span></div>
        </button>)}
      </div>
    </section>

    <section className='rounded-[28px] border bg-card p-5 sm:p-7'>
      <h2 className='text-xl font-black'>المعلومات الأساسية</h2>
      <div className='mt-5 grid gap-4 sm:grid-cols-2'>
        <label className='block'><span className='text-xs font-black text-muted'>الاسم</span><input required className='mt-2 w-full rounded-2xl border bg-background p-4 outline-none focus:border-primary' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
        <label className='block'><span className='text-xs font-black text-muted'>اسم المستخدم</span><input required minLength={3} maxLength={30} pattern='[a-zA-Z0-9_-]+' className='mt-2 w-full rounded-2xl border bg-background p-4 outline-none focus:border-primary' value={form.username} onChange={e=>setForm({...form,username:e.target.value.toLowerCase()})}/></label>
      </div>
      <textarea className='mt-4 min-h-32 w-full rounded-2xl border bg-background p-4 outline-none focus:border-primary' placeholder='اكتب نبذة قصيرة عنك…' value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/>
      <div className='mt-4 flex flex-wrap items-center gap-3'><select className='rounded-2xl border bg-background p-3' value={form.language} onChange={e=>setForm({...form,language:e.target.value})}><option value='ar'>العربية</option><option value='en'>English</option></select><label className='flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 text-sm font-bold'><input type='checkbox' checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> نشر الصفحة</label></div>
      <div className='mt-6 flex flex-wrap items-center gap-3'><button className='rounded-2xl bg-primary px-6 py-3 font-black text-primary-foreground transition hover:-translate-y-0.5'>حفظ التغييرات</button><button type='button' onClick={logout} className='rounded-2xl border px-6 py-3 font-bold'>تسجيل الخروج</button>{status&&<span className='text-sm font-bold text-success'>{status}</span>}</div>
    </section>
  </form>;
}
