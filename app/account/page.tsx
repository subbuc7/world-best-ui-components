import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export default async function Account(){
 const s=await supabaseServer(); const {data:{user}}=await s.auth.getUser(); if(!user) redirect("/login");
 const {data:purchases}=await s.from("purchases").select("id,amount,status,created_at,component_versions(name,components(name,slug))").eq("user_id",user.id).eq("status","paid").order("created_at",{ascending:false});
 return <main className="mx-auto max-w-5xl px-5 py-10"><Link href="/" className="text-sm text-white/45">← Home</Link><h1 className="mt-8 text-4xl font-semibold">Your library</h1><p className="mt-2 text-white/45">{user.email}</p>
 <div className="mt-10 space-y-3">{(purchases??[]).map((p:any)=><div key={p.id} className="glass flex items-center justify-between rounded-2xl p-5"><div><div className="font-medium">{p.component_versions?.components?.name}</div><div className="mt-1 text-xs text-white/40">{p.component_versions?.name}</div></div><a href={`/api/code/${p.component_versions?.id}`} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">Get Code</a></div>)}</div></main>
}
