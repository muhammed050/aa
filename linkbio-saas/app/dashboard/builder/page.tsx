import Builder from '@/components/builder';import {redirect} from 'next/navigation';import {myPage} from '@/lib/data';
export default async function Page(){const p=await myPage();if(!p)redirect('/dashboard/settings');return <><h1 className='mb-5 text-3xl font-black'>باني الصفحة</h1><Builder initial={p.sections||[]}/></>}
