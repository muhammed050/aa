import Builder from "@/components/builder";import {redirect} from "next/navigation";import {myPage} from "@/lib/data";
export default async function BuilderPage(){const page=await myPage();if(!page)redirect("/dashboard/settings");return <main className="container py-8"><h1 className="text-3xl font-black mb-6">باني الصفحة</h1><Builder initial={page.sections||[]}/></main>}
