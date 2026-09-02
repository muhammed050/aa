import Link from 'next/link';

const features = [
  ['01', 'هوية تليق بك', 'ابنِ مساحة رقمية لها شخصية، بدل صفحة روابط تشبه الجميع.'],
  ['02', 'حوّل المتابع إلى عميل', 'روابط، منتجات، خدمات، واتساب وحجز في تجربة واحدة.'],
  ['03', 'كل شيء قابل للتخصيص', 'رتّب المحتوى وغيّر الشكل حتى تصبح الصفحة امتداداً لعلامتك.'],
];

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:-rotate-6">ر</span>
          <span className="text-xl font-black tracking-[-.03em]">رابطك</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-muted md:flex">
          <a href="#features" className="transition hover:text-primary">المميزات</a>
          <a href="#story" className="transition hover:text-primary">كيف يعمل؟</a>
          <Link href="/1" className="transition hover:text-primary">القوالب</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-bold transition hover:bg-soft">دخول</Link>
          <Link href="/login" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5">ابدأ مجاناً</Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute right-1/2 top-20 -z-10 size-[34rem] translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-black shadow-sm">
            <span className="size-2 rounded-full bg-success shadow-[0_0_0_5px_rgba(22,163,74,.10)]" />
            حضورك الرقمي، لكن بطريقتك
          </div>
          <h1 className="text-5xl font-black leading-[1.02] tracking-[-.055em] sm:text-7xl lg:text-[92px]">
            لا تشارك رابطاً فقط،
            <br />
            <span className="bg-gradient-to-l from-primary via-[#7c6cff] to-accent bg-clip-text text-transparent">شارك عالمك.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
            رابطك يحوّل صفحة البايو إلى واجهة رقمية حقيقية تجمع شخصيتك، محتواك، منتجاتك وعملاءك في مكان واحد.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/login" className="rounded-2xl bg-primary px-8 py-4 font-black text-primary-foreground shadow-xl shadow-primary/25 transition hover:-translate-y-1 hover:shadow-2xl">أنشئ صفحتك مجاناً ↗</Link>
            <Link href="/1" className="rounded-2xl border bg-card px-8 py-4 font-black transition hover:border-primary/30 hover:bg-soft">شاهد مثالاً</Link>
          </div>
          <div className="mt-6 text-sm font-semibold text-muted">مجاني للبدء · بدون بطاقة · رابطك جاهز خلال دقائق</div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] border bg-card p-2 shadow-[0_30px_100px_rgba(99,91,255,.16)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent" />
            <div className="rounded-[1.5rem] bg-soft p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-border pb-4 text-xs font-bold text-muted">
                <span>رابطك / محمد</span><span className="rounded-full bg-card px-3 py-1.5 text-success">● منشورة</span>
              </div>
              <div className="grid gap-6 pt-6 lg:grid-cols-[.72fr_1.28fr]">
                <div className="rounded-[1.5rem] bg-card p-7 text-center shadow-sm">
                  <div className="mx-auto grid size-24 place-items-center rounded-[2rem] bg-gradient-to-br from-primary to-accent text-3xl font-black text-white shadow-xl shadow-primary/20">م</div>
                  <h2 className="mt-5 text-2xl font-black">محمد الدكارلي</h2>
                  <p className="mt-2 text-sm text-muted">صانع محتوى · مؤسس · مصمم</p>
                  <div className="mt-5 flex justify-center gap-2"><span className="rounded-full bg-soft px-3 py-1.5 text-xs font-bold">12.4K متابع</span><span className="rounded-full bg-soft px-3 py-1.5 text-xs font-bold">18 رابط</span></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['موقعي الشخصي ↗','شاهد آخر أعمالي','متجري الرقمي','احجز استشارة','تواصل عبر واتساب','تابعني على TikTok'].map((x, i) => <div key={x} className={`flex min-h-24 items-end rounded-[1.5rem] border bg-card p-5 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-primary/30 ${i === 2 ? 'bg-primary text-primary-foreground border-primary' : ''}`}><span>{x}</span></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y bg-card">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-2xl"><span className="text-xs font-black tracking-[.2em] text-primary">بسيط من الخارج، قوي من الداخل</span><h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-6xl">أنت لست قالباً.</h2><p className="mt-5 text-lg leading-8 text-muted">لذلك لا يجب أن تبدو صفحتك كأنها قالب جاهز.</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(([n, title, text]) => <article key={n} className="group rounded-[1.75rem] border bg-background p-7 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"><span className="text-xs font-black text-primary">{n}</span><h3 className="mt-16 text-2xl font-black">{title}</h3><p className="mt-3 leading-7 text-muted">{text}</p><div className="mt-8 h-1 w-10 rounded-full bg-primary transition-all group-hover:w-20" /></article>)}
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div><span className="text-xs font-black tracking-[.2em] text-primary">ثلاث خطوات</span><h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-6xl">من فكرتك إلى رابطك.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-muted">أنشئ، خصص، شارك. بدون تعقيد وبدون الحاجة لمعرفة التصميم أو البرمجة.</p></div>
          <div className="space-y-3">{['أنشئ حسابك خلال دقيقة', 'ابنِ صفحتك بالسحب والتخصيص', 'شارك رابطك أينما كان جمهورك'].map((x, i) => <div key={x} className="flex items-center gap-5 rounded-2xl border bg-card p-5"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft font-black text-primary">0{i + 1}</span><span className="font-black">{x}</span></div>)}</div>
        </div>
      </section>

      <footer className="bg-[#171827] px-5 py-12 text-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6"><div><div className="text-xl font-black">رابطك</div><p className="mt-1 text-sm text-white/50">مساحتك الرقمية في رابط واحد.</p></div><Link href="/login" className="rounded-2xl bg-primary px-6 py-3.5 font-black text-white shadow-lg shadow-primary/30">ابدأ الآن ↗</Link></div></footer>
    </main>
  );
}
