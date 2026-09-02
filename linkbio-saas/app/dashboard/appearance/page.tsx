'use client';
import { useState } from 'react';

const presets = [
  ['#f7f8fc','#635bff','Indigo'], ['#fff7ed','#f97316','Sunset'], ['#f0fdf4','#16a34a','Mint'], ['#fdf2f8','#db2777','Rose'], ['#eff6ff','#2563eb','Ocean'], ['#faf5ff','#9333ea','Violet'], ['#111827','#f59e0b','Night'], ['#0f172a','#22d3ee','Cyber'],
];

export default function Appearance() {
  const [background, setBackground] = useState('#f7f8fc');
  const [accent, setAccent] = useState('#635bff');
  const [template, setTemplate] = useState(1);
  async function save() {
    const r = await fetch('/api/page'); const x = await r.json(); if (!x.page) return;
    const res = await fetch('/api/page', { method:'PUT', headers:{'content-type':'application/json'}, body:JSON.stringify({ theme:{...(x.page.theme||{}),background,accent}, template }) });
    if (res.ok) alert('تم حفظ المظهر والقالب');
  }
  return <main className='max-w-5xl'>
    <h1 className='text-3xl font-black'>المظهر والقوالب</h1>
    <p className='mt-2 text-sm text-muted'>اختر من 8 هويات مختلفة بدل قالب واحد مكرر.</p>
    <div className='mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {presets.map(([bg,ac,name],i)=><button key={name} onClick={()=>{setBackground(bg);setAccent(ac);setTemplate(i+1)}} className={`group overflow-hidden rounded-3xl border bg-card text-right transition hover:-translate-y-1 hover:shadow-xl ${template===i+1?'ring-2 ring-primary':''}`}>
        <div className='h-44 p-5' style={{background:bg}}><div className='mx-auto max-w-[170px] rounded-[22px] bg-white/85 p-3 shadow-lg backdrop-blur'><div className='mx-auto size-9 rounded-full' style={{background:ac}}/><div className='mx-auto mt-3 h-2 w-20 rounded-full bg-black/10'/><div className='mt-4 space-y-2'><div className='h-7 rounded-xl' style={{background:ac}}/><div className='h-7 rounded-xl bg-black/5'/><div className='h-7 rounded-xl bg-black/5'/></div></div></div>
        <div className='flex items-center justify-between p-4'><div><b>{name}</b><p className='mt-1 text-xs text-muted'>قالب {i+1}</p></div><span className='rounded-full bg-soft px-2 py-1 text-[10px] font-black'>{template===i+1?'محدد':'اختيار'}</span></div>
      </button>)}
    </div>
    <div className='mt-7 rounded-3xl border bg-card p-6'><h2 className='text-lg font-black'>تخصيص الألوان</h2><div className='mt-5 grid gap-4 sm:grid-cols-2'><label className='font-bold'>الخلفية<input type='color' value={background} onChange={e=>setBackground(e.target.value)} className='mt-2 block h-12 w-full rounded-xl'/></label><label className='font-bold'>اللون الأساسي<input type='color' value={accent} onChange={e=>setAccent(e.target.value)} className='mt-2 block h-12 w-full rounded-xl'/></label></div><button onClick={save} className='mt-6 rounded-2xl bg-primary px-6 py-3 font-black text-primary-foreground'>حفظ التغييرات</button></div>
  </main>;
}
