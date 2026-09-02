import Link from 'next/link';

const features = [
  ['01', 'صفحتك، بطريقتك', 'قوالب عصرية، ألوان، خطوط وأقسام قابلة للتخصيص بدون تعقيد.'],
  ['02', 'روابط + متجر', 'حوّل جمهورك إلى عملاء من خلال المنتجات والخدمات والروابط في مكان واحد.'],
  ['03', 'واتساب وحجز', 'اجعل التواصل والطلب والحجز أقرب بخطوة واحدة من أي جهاز.'],
  ['04', 'أرقام تفهمها', 'تابع المشاهدات والتفاعل لتعرف ما الذي يعمل فعلاً.'],
];

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="grid-noise absolute inset-0 -z-10 opacity-60" />
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-sm font-black text-primary-foreground">ر</span>
          <span className="text-xl font-black tracking-tight">رابطك<span className="text-neutral-400">.</span></span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-500 md:flex">
          <a href="#features" className="transition hover:text-foreground">المميزات</a>
          <a href="#how" className="transition hover:text-foreground">كيف يعمل؟</a>
          <a href="#templates" className="transition hover:text-foreground">القوالب</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-bold sm:block">دخول</Link>
          <Link href="/login" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-black/10 transition hover:-translate-y-0.5">ابدأ مجاناً</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1.5 text-xs font-bold shadow-sm">
            <span className="size-2 rounded-full bg-lime-400" /> منصة عربية لصناعة حضورك الرقمي
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-.04em] sm:text-7xl lg:text-[84px]">
            رابط واحد.<br /><span className="relative inline-block">كل عالمك<span className="absolute -bottom-1 right-0 h-3 w-full -z-10 rounded-full bg-accent" /></span>.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted sm:text-xl">أنشئ صفحة شخصية مختلفة، اجمع روابطك ومنتجاتك وخدماتك وواتساب، وشاركها برابط واحد يليق بك.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-2xl bg-primary px-7 py-4 font-black text-primary-foreground shadow-xl shadow-black/15 transition hover:-translate-y-1">أنشئ صفحتك الآن ↗</Link>
            <Link href="/1" className="rounded-2xl border bg-white/80 px-7 py-4 font-black transition hover:bg-white">استكشف القوالب</Link>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-muted"><span className="font-bold text-foreground">مجاني للبدء</span><span>•</span><span>بدون بطاقة</span><span>•</span><span>جاهز للمشاركة</span></div>
        </div>

        <div id="templates" className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-8 rounded-[3rem] bg-lime-200/30 blur-3xl" />
          <div className="relative rotate-2 rounded-[2.5rem] border-8 border-neutral-900 bg-neutral-900 p-2 shadow-2xl">
            <div className="overflow-hidden rounded-[2rem] bg-[#f4f3ed]">
              <div className="flex justify-between p-4 text-[10px] font-bold"><span>9:41</span><span>● ● ●</span></div>
              <div className="px-6 pb-8 pt-6 text-center">
                <div className="mx-auto grid size-20 place-items-center rounded-full bg-neutral-900 text-2xl font-black text-white">م</div>
                <h2 className="mt-4 text-2xl font-black">محمد</h2>
                <p className="mt-1 text-xs text-neutral-500">مصمم • صانع محتوى • مؤسس</p>
                <div className="mt-6 space-y-3">
                  {['موقعي الرسمي ↗','متجري ومنتجاتي','تواصل معي على واتساب','آخر أعمالي'].map((x, i) => <div key={x} className={`rounded-2xl border bg-white p-4 text-sm font-bold shadow-sm ${i === 2 ? 'bg-neutral-900 text-white' : ''}`}>{x}</div>)}
                </div>
                <div className="mt-6 text-[10px] font-bold text-neutral-400">صُنع بواسطة رابطك.</div>
              </div>
            </div>
          </div>
          <div className="absolute -left-8 bottom-10 hidden rounded-2xl border bg-white p-4 shadow-xl sm:block"><div className="text-[10px] font-bold text-neutral-400">نمو هذا الشهر</div><div className="mt-1 text-2xl font-black">+42.8%</div></div>
        </div>
      </section>

      <section id="features" className="border-y bg-white/60">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-black uppercase tracking-widest text-neutral-400">لماذا رابطك؟</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">أكثر من مجرد Bio.</h2></div><p className="max-w-md text-sm leading-7 text-muted">كل الأدوات التي تحتاجها لتحويل الرابط في البايو إلى واجهة رقمية كاملة.</p></div>
          <div className="grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([n, title, text]) => <article key={n} className="bg-white p-7"><span className="text-xs font-black text-neutral-400">{n}</span><h3 className="mt-12 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-muted">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8 lg:py-28">
        <p className="text-sm font-black text-neutral-400">ثلاث خطوات فقط</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">من الصفر إلى رابطك.</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 text-right md:grid-cols-3">
          {['أنشئ حسابك', 'صمّم صفحتك', 'شارك الرابط'].map((x, i) => <div key={x} className="rounded-3xl border bg-white p-6"><div className="mb-12 grid size-10 place-items-center rounded-xl bg-neutral-100 font-black">{i + 1}</div><h3 className="font-black">{x}</h3><p className="mt-2 text-sm leading-6 text-muted">إعداد بسيط وواجهة واضحة بدون خطوات مزعجة.</p></div>)}
        </div>
      </section>

      <footer className="border-t bg-neutral-950 px-5 py-10 text-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5"><div><b className="text-lg">رابطك.</b><p className="mt-1 text-xs text-neutral-500">كل عالمك في رابط واحد.</p></div><Link href="/login" className="rounded-xl bg-accent px-5 py-3 text-sm font-black text-accent-foreground">ابدأ مجاناً ↗</Link></div></footer>
    </main>
  );
}
