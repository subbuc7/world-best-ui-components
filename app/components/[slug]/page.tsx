import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { inr } from "@/lib/format";
import { PurchaseButton } from "@/components/PurchaseButton";

export default async function ComponentPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const supabase = await supabaseServer();
  const { data: c } = await supabase.from("components").select("id,name,slug,description,preview_html,categories(name),component_versions(id,name,price,is_free,is_published)").eq("slug",slug).eq("is_published",true).single();
  if (!c) notFound();
  return <main className="mx-auto max-w-6xl px-5 py-10">
    <Link href="/components" className="text-sm text-white/45">← Components</Link>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_.6fr]">
      <section className="glass overflow-hidden rounded-3xl">
        <div className="border-b border-white/10 p-5"><div className="text-xs text-white/35">{(c as any).categories?.name}</div><h1 className="mt-2 text-3xl font-semibold">{c.name}</h1><p className="mt-2 text-white/45">{c.description}</p></div>
        <div className="h-[520px] bg-black/30 p-4"><iframe title={c.name} srcDoc={c.preview_html} className="h-full w-full rounded-2xl bg-white" sandbox="allow-scripts"/></div>
      </section>
      <aside className="space-y-3">
        <div className="mb-5 text-sm text-white/45">Choose a code version</div>
        {(c as any).component_versions?.filter((v:any)=>v.is_published).map((v:any)=><div key={v.id} className="glass rounded-2xl p-5">
          <div className="flex justify-between"><span className="font-medium">{v.name}</span><span>{v.is_free ? "Free" : inr(v.price)}</span></div>
          <div className="mt-4">{v.is_free ? <a href={`/api/code/${v.id}`} className="block rounded-xl bg-white px-4 py-3 text-center text-sm font-medium text-black">Get Code</a> : <PurchaseButton versionId={v.id}/>}</div>
        </div>)}
      </aside>
    </div>
  </main>
}
