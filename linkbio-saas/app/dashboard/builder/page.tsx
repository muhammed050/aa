import Builder from '@/components/builder';
import { redirect } from 'next/navigation';
import { myPage, mySections } from '@/lib/data';

export default async function Page() {
  const p = await myPage();
  if (!p) redirect('/dashboard/settings');
  const sections = await mySections();
  return <><h1 className='mb-2 text-3xl font-black'>باني الصفحة</h1><p className='mb-6 text-sm text-muted'>رتّب أقسام صفحتك وشاهد النتيجة مباشرة.</p><Builder initial={sections as any} /></>;
}
