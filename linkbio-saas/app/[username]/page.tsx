import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {pageByUsername} from '@/lib/data';
import AnalyticsTracker from '@/components/analytics-tracker';

export const revalidate=60;

export async function generateMetadata({params}:{params:Promise<{username:string}>}):Promise<Metadata>{
  const {username}=await params; const p=await pageByUsername(username); if(!p)return {title:'غير موجود'};
  const theme=(p.theme_settings&&typeof p.theme_settings==='object')?p.theme_settings as Record<string,unknown>:{};
  const site=process.env.NEXT_PUBLIC_SITE_URL||'';
  return {title:p.seo_title||p.name,description:p.seo_description||p.bio||undefined,robots:theme.noindex?'noindex, nofollow':undefined,alternates:{canonical:`${site}/${p.username}`},openGraph:{type:'profile',title:p.seo_title||p.name,description:p.seo_description||p.bio||undefined,url:`${site}/${p.username}`,images:p.avatar_url?[p.avatar_url]:[]},twitter:{card:'summary_large_image',title:p.name,description:p.bio||undefined,images:p.avatar_url?[p.avatar_url]:[]}};
}

export default async function PublicPage({params}:{params:Promise<{username:string}>}){
  const {username}=await params; const p=await pageByUsername(username); if(!p)notFound();
  const sections=(p.sections||[]).filter((s:any)=>s.visible); const theme=(p.theme_settings&&typeof p.theme_settings==='object')?p.theme_settings as Record<string,unknown>:{};
  const template=Math.min(8,Math.max(1,Number(theme.template||1)));
  const palettes=[
    ['#f7f8fc','#111827','#635bff'],['#fff7ed','#1c1917','#f97316'],['#f0fdf4','#052e16','#16a34a'],['#eff6ff','#172554','#2563eb'],
    ['#fff1f2','#4c0519','#be123c'],['#f5f3ff','#2e1065','#7c3aed'],['#171717','#fafafa','#d4af37'],['#eef2ff','#1e1b4b','#4f46e5']
  ];
  const [bg,fg,accent]=palettes[template-1];
  const isLuxury=template===7;
  return <main dir={p.language==='en'?'ltr':'rtl'} className='min-h-screen px-4 py-8 sm:py-12' style={{background:String(theme.background||bg),color:String(theme.foreground||fg)}}>
    <AnalyticsTracker pageId={p.id}/>
    <div className={`mx-auto max-w-xl overflow-hidden border shadow-2xl ${template===1?'rounded-[34px]':template===2?'rounded-[44px]':template===4?'rounded-2xl':template===7?'rounded-none':'rounded-[30px]'}`} style={{background:isLuxury?'#111':'rgba(255,255,255,.78)',borderColor:isLuxury?'#333':'rgba(0,0,0,.08)'}}>
      <div className='p-6 sm:p-9'>
        <header className='text-center'>
          <div className='mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-white/80 text-2xl font-black shadow-lg' style={{background:accent,color:isLuxury?'#111':'#fff'}}>{p.avatar_url?<img src={p.avatar_url} alt={p.name} className='h-full w-full object-cover'/>:p.name?.slice(0,1)}</div>
          <h1 className='mt-5 text-3xl font-black'>{p.name}</h1>{p.bio&&<p className='mx-auto mt-2 max-w-md text-sm leading-7 opacity-65'>{p.bio}</p>}
        </header>
        {template===8&&<div className='mt-7 grid grid-cols-2 gap-3'><div className='col-span-2 h-20 rounded-3xl' style={{background:accent}}/><div className='h-16 rounded-3xl bg-black/5'/><div className='h-16 rounded-3xl bg-black/5'/></div>}
        <div className='mt-8 space-y-3'>{sections.map((s:any)=><Section key={s.id} page={p} s={s} template={template} accent={accent} luxury={isLuxury}/>)}</div>
        <footer className='mt-9 text-center text-[10px] font-bold opacity-40'>Powered by رابطك</footer>
      </div>
    </div>
    <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'ProfilePage',name:p.name,url:`${process.env.NEXT_PUBLIC_SITE_URL||''}/${p.username}`,description:p.bio,image:p.avatar_url})}}/>
  </main>
}

function Section({page,s,template,accent,luxury}:{page:any;s:any;template:number;accent:string;luxury:boolean}){
  const c=s.content||{}; const href=String(c.url||'');
  const radius=template===5?'rounded-[32px]':template===2?'rounded-[22px]':template===7?'rounded-none':template===3?'rounded-2xl':'rounded-2xl';
  const base=`block ${radius} p-4 text-center font-bold transition hover:-translate-y-0.5 hover:shadow-md`;
  if(['links','cta','booking'].includes(s.type)&&href)return <a href={href} target='_blank' rel='noopener noreferrer' className={base} style={{background:template===1||template===4?'#fff':accent,color:template===1||template===4?undefined:(luxury?'#111':'#fff'),border:template===1||template===4?'1px solid rgba(0,0,0,.08)':'none'}}>{s.title||c.title||'فتح الرابط'}{s.subtitle&&<small className='mt-1 block font-normal opacity-60'>{s.subtitle}</small>}</a>;
  if(s.type==='whatsapp'){const phone=String(c.phone||'').replace(/\D/g,'');const msg=String(c.message||'مرحباً، أريد التواصل معكم');return <a href={`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`} target='_blank' rel='noopener noreferrer' className={base} style={{background:'#25D366',color:'#fff'}}>واتساب</a>}
  if(s.type==='products')return <Products pageId={page.id} template={template} accent={accent} luxury={luxury}/>;
  if(s.type==='services')return <div className={`${radius} border p-5`}><h2 className='font-black'>{s.title||'الخدمات'}</h2><p className='mt-2 text-sm opacity-60'>تواصل معنا للحجز والاستفسار.</p></div>;
  if(s.type==='social')return <div className={`${radius} border p-4 text-center`}><b>{s.title||'تابعني على الشبكات الاجتماعية'}</b></div>;
  return <section className={`${radius} border p-5 text-center`}><h2 className='font-bold'>{s.title||s.type}</h2>{c.text&&<p className='mt-2 opacity-65'>{String(c.text)}</p>}</section>;
}

async function Products({pageId,template,accent,luxury}:{pageId:string;template:number;accent:string;luxury:boolean}){
  const {createClient}=await import('@/lib/supabase/server'); const s=await createClient();
  const {data}=await s.from('products').select('*').eq('page_id',pageId).eq('active',true).order('featured',{ascending:false}).order('created_at',{ascending:false});
  return <div className='grid gap-3 sm:grid-cols-2'>{(data||[]).map((x:any)=><article key={x.id} className='overflow-hidden rounded-2xl border' style={{background:luxury?'#181818':'rgba(255,255,255,.8)'}}>{x.image_url&&<img src={x.image_url} alt={x.name} className='h-40 w-full object-cover'/>}<div className='p-4'><h3 className='font-bold'>{x.name}</h3>{x.description&&<p className='mt-1 text-sm opacity-60'>{x.description}</p>}<div className='mt-3 font-black'>{Number(x.price).toFixed(2)} {x.currency}</div>{x.product_url&&<a href={x.product_url} target='_blank' rel='noopener noreferrer' className='mt-3 block rounded-xl p-2 text-center text-sm font-bold' style={{background:accent,color:luxury?'#111':'#fff'}}>عرض المنتج</a>}</div></article>)}</div>
}
