import Link from 'next/link';

const templates = [
  ['Minimal','بسيط ونظيف','#f7f8fc','#111827'], ['Creator','لصناع المحتوى','#fff7ed','#f97316'], ['Store','متجر','#f0fdf4','#16a34a'], ['Business','أعمال','#eff6ff','#2563eb'], ['Restaurant','مطعم','#fff1f2','#be123c'], ['Services','خدمات','#f5f3ff','#7c3aed'], ['Luxury','فاخر','#171717','#d4af37'], ['Bento','شبكة Bento','#eef2ff','#4f46e5'],
];

export default function TemplatesPage(){
  return <main dir='rtl' className='min-h-screen bg-background px-4 py-10 sm:px-8'>
    <div className='mx-auto max-w-7xl'>
      <div className='flex flex-wrap items-end justify-between gap-5'><div><span className='text-xs font-black tracking-[.25em] text-primary'>رابطك / القوالب</span><h1 className='mt-3 text-4xl font-black tracking-tight'>اختر شكل صفحتك.</h1><p className='mt-2 max-w-xl text-sm leading-7 text-muted'>ثمانية تصاميم مختلفة فعلياً، لكل واحد شخصية واستخدام مختلف.</p></div><Link href='/login' className='rounded-2xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground'>ابدأ مجاناً</Link></div>
      <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {templates.map(([name,desc,bg,accent],i)=><Link href={`/${i+1}`} key={name} className='group overflow-hidden rounded-[30px] border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-2xl'>
          <div className='relative h-[390px] overflow-hidden p-7' style={{background:bg}}><div className='absolute inset-x-7 top-7 flex items-center justify-between'><span className='rounded-full bg-black/5 px-3 py-1 text-[10px] font-black'>0{i+1}</span><span className='text-[10px] font-black opacity-50'>{name}</span></div><div className='mx-auto mt-12 max-w-[210px] overflow-hidden rounded-[32px] bg-white/90 p-4 shadow-xl'><div className='mx-auto size-14 rounded-full' style={{background:accent}}/><div className='mx-auto mt-3 h-3 w-24 rounded-full bg-black/10'/><div className='mx-auto mt-2 h-2 w-32 rounded-full bg-black/5'/><div className='mt-6 space-y-2'>{i===7?<><div className='h-20 rounded-2xl' style={{background:accent}}/><div className='grid grid-cols-2 gap-2'><div className='h-16 rounded-2xl bg-black/5'/><div className='h-16 rounded-2xl bg-black/5'/></div></>:i===1?<><div className='h-24 rounded-2xl' style={{background:`linear-gradient(135deg,${accent},#fb7185)`}}/><div className='h-10 rounded-2xl bg-black/5'/><div className='h-10 rounded-2xl bg-black/5'/></>:i===2?<div className='grid grid-cols-2 gap-2'>{[1,2,3,4].map(x=><div className='h-20 rounded-xl bg-black/5' key={x}/>)}</div>:['الرابط المميز','خدماتي','تواصل'].map(x=><div className='h-10 rounded-xl' style={{background:accent}} key={x}/>)}</div></div></div>
          <div className='flex items-center justify-between p-5'><div><h2 className='font-black'>{name}</h2><p className='mt-1 text-xs text-muted'>{desc}</p></div><span className='rounded-xl bg-soft px-3 py-2 text-xs font-black text-primary transition group-hover:bg-primary group-hover:text-primary-foreground'>معاينة ↗</span></div>
        </Link>)}
      </div>
    </div>
  </main>;
}
