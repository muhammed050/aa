import Link from 'next/link';

const templates = [
  { name:'Minimal', desc:'بسيط ونظيف', bg:'#f7f8fc', accent:'#111827', shape:'rounded-[28px]', layout:'clean' },
  { name:'Creator', desc:'لصناع المحتوى', bg:'#fff7ed', accent:'#f97316', shape:'rounded-[40px]', layout:'creator' },
  { name:'Store', desc:'متجر', bg:'#f0fdf4', accent:'#16a34a', shape:'rounded-2xl', layout:'store' },
  { name:'Business', desc:'أعمال', bg:'#eff6ff', accent:'#2563eb', shape:'rounded-xl', layout:'business' },
  { name:'Restaurant', desc:'مطعم', bg:'#fff1f2', accent:'#be123c', shape:'rounded-[32px]', layout:'restaurant' },
  { name:'Services', desc:'خدمات', bg:'#f5f3ff', accent:'#7c3aed', shape:'rounded-3xl', layout:'services' },
  { name:'Luxury', desc:'فاخر', bg:'#171717', accent:'#d4af37', shape:'rounded-none', layout:'luxury' },
  { name:'Bento', desc:'شبكة Bento', bg:'#eef2ff', accent:'#4f46e5', shape:'rounded-[26px]', layout:'bento' },
];

export default function Template({index}:{index:number}) {
  const t = templates[index-1] || templates[0];
  const dark = t.layout === 'luxury';
  return <main className='min-h-screen px-4 py-10' style={{background:t.bg,color:dark?'#fafafa':'#111827'}}>
    <div className='mx-auto max-w-6xl'>
      <div className='mb-8 flex items-center justify-between gap-4'><div><span className='text-xs font-black uppercase tracking-[.25em] opacity-50'>رابطك / القوالب</span><h1 className='mt-2 text-3xl font-black'>{t.name}</h1><p className='mt-1 opacity-60'>{t.desc} · قالب {index}</p></div><Link href='/login' className='rounded-2xl px-5 py-3 text-sm font-black' style={{background:t.accent,color:dark?'#111':'#fff'}}>استخدم القالب</Link></div>
      <div className='mx-auto max-w-md overflow-hidden border shadow-2xl' style={{borderColor:dark?'#333':'rgba(0,0,0,.08)',background:dark?'#111':'rgba(255,255,255,.82)'}}>
        <div className='p-7 sm:p-9'>
          <div className='text-center'><div className='mx-auto grid size-24 place-items-center rounded-full' style={{background:t.accent,color:dark?'#111':'#fff'}}>M</div><h2 className='mt-5 text-2xl font-black'>محمد</h2><p className='mt-2 text-sm opacity-60'>{t.desc} · اصنع مساحتك بطريقتك</p></div>
          {t.layout==='bento' ? <div className='mt-8 grid grid-cols-2 gap-3'><div className='col-span-2 h-24 rounded-3xl' style={{background:t.accent}}/><div className='h-24 rounded-3xl bg-black/5'/><div className='h-24 rounded-3xl bg-black/5'/><div className='col-span-2 h-14 rounded-2xl bg-black/5'/></div>
          : t.layout==='creator' ? <div className='mt-8 space-y-3'><div className='h-32 rounded-[28px]' style={{background:`linear-gradient(135deg, ${t.accent}, #fb7185)`}}/>{['YouTube','TikTok','Instagram','آخر فيديو'].map(x=><div className='flex items-center justify-between rounded-[22px] bg-black/5 p-4 font-black' key={x}><span>{x}</span><span>↗</span></div>)}</div>
          : t.layout==='store' ? <div className='mt-8 grid grid-cols-2 gap-3'>{['منتج 01','منتج 02','منتج 03','منتج 04'].map(x=><div className='overflow-hidden rounded-2xl bg-black/5' key={x}><div className='h-28' style={{background:t.accent}}/><div className='p-3 font-black'>{x}</div></div>)}</div>
          : t.layout==='business' ? <div className='mt-8 space-y-3'>{['نبذة عن الشركة','خدماتنا','احجز استشارة','LinkedIn'].map(x=><div className='border-r-4 bg-black/5 p-4 font-black' style={{borderColor:t.accent}} key={x}>{x}</div>)}</div>
          : t.layout==='restaurant' ? <div className='mt-8 space-y-3'>{['قائمة الطعام','احجز طاولة','العروض اليوم','واتساب'].map((x,i)=><div className={`${t.shape} p-4 text-center font-black`} style={{background:i===0?t.accent:'rgba(0,0,0,.05)',color:i===0?'#fff':'inherit'}} key={x}>{x}</div>)}</div>
          : t.layout==='services' ? <div className='mt-8 space-y-3'>{['تصميم الهوية','استشارة استراتيجية','تطوير الموقع','اطلب عرض سعر'].map(x=><div className='rounded-3xl border p-5 font-black' key={x}><span style={{color:t.accent}}>✦</span><span className='mr-3'>{x}</span></div>)}</div>
          : <div className='mt-8 space-y-3'>{['الرابط المميز','آخر الأعمال','تواصل معي','Instagram / TikTok'].map(x=><div className={`${t.shape} p-4 text-center font-black`} style={{background:t.accent,color:dark?'#111':'#fff'}} key={x}>{x}</div>)}</div>}
          <div className='mt-8 text-center text-[10px] font-bold opacity-40'>Powered by رابطك</div>
        </div>
      </div>
    </div>
  </main>;
}
