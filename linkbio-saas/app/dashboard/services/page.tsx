import {redirect} from "next/navigation";import {currentUser} from "@/lib/data";
export default async function Services(){if(!await currentUser())redirect("/login");return <main className="container py-8"><h1 className="text-3xl font-black">الخدمات</h1><div className="card p-8 mt-6"><p className="muted">الخدمات تدعم السعر، المدة، الصور، رابط الحجز وواتساب.</p></div></main>}
