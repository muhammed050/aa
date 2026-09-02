import { createClient } from "./server";
export async function currentUser(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();return user}
export async function myPage(){const user=await currentUser();if(!user)return null;const supabase=await createClient();const {data}=await supabase.from("pages").select("*").eq("user_id",user.id).maybeSingle();return data}
