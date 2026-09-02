import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/data';

const nav = [['','نظرة عامة'],['/builder','الباني'],['/products','المنتجات'],['/services','الخدمات'],['/analytics','التحليلات'],['/appearance','المظهر'],['/settings','الإعدادات'],['/billing','الفوترة']];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  return <div dir="rtl" className="min-h-screen bg-background"><div className="mx-auto flex min-h-screen max-w-[1500px]">
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l bg-card px-4 py-5 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-3 px-2 pb-8"><span className="grid size-10 place-items-center rounded-2xl bg-primary font-black text-primary-foreground">ر</span><span className="text-xl font-black">رابطك<span className="text-neutral-400">.</span></span></Link>
      <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">مساحة العمل</p>
      <nav className="space-y-1">{nav.map(([href,label],i)=><Link key={href} href={`/dashboard${href}`} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition hover:bg-soft ${i===0?'bg-soft':'text-neutral-500 hover:text-foreground'}`}><span className="grid size-7 place-items-center rounded-lg bg-white text-[10px] font-black">{String(i+1).padStart(2,'0')}</span>{label}</Link>)}</nav>
      <div className="mt-auto rounded-2xl bg-primary p-4 text-primary-foreground"><p className="text-xs font-bold opacity-60">صفحتك جاهزة؟</p><Link href="/dashboard/builder" className="mt-2 block text-sm font-black">تخصيص الصفحة ↗</Link></div>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-xl"><div className="flex h-16 items-center justify-between px-4 sm:px-7"><Link href="/dashboard" className="flex items-center gap-2 font-black lg:hidden"><span className="grid size-8 place-items-center rounded-xl bg-primary text-xs text-primary-foreground">ر</span>رابطك.</Link><div className="hidden text-sm font-bold text-neutral-500 sm:block">مساحة العمل / <span className="text-foreground">لوحة التحكم</span></div><div className="flex items-center gap-2"><Link href="/dashboard/builder" className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-primary-foreground">تخصيص الصفحة</Link><Link href="/" className="grid size-9 place-items-center rounded-xl border bg-card text-sm">⌂</Link></div></div></header>
      <main className="px-4 py-7 sm:px-7 lg:px-10 lg:py-10">{children}</main>
      <nav className="sticky bottom-0 z-30 flex border-t bg-card/95 p-2 backdrop-blur lg:hidden">{nav.slice(0,5).map(([href,label])=><Link key={href} href={`/dashboard${href}`} className="flex-1 rounded-xl p-2 text-center text-[10px] font-bold text-neutral-500"><span className="mx-auto mb-1 grid size-6 place-items-center rounded-lg bg-soft">•</span>{label}</Link>)}</nav>
    </div>
  </div></div>;
}
