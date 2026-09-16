import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { inr } from "@/lib/format";

export default async function Components({ searchParams }: { searchParams: Promise<{category?:string}> }) {
  const params = await searchParams;
  const supabase = await supabaseServer();
  const { data } = await supabase.from("components").select("id,name,slug,description,preview_html,is_featured,categories(name,slug),component_versions(id,name,price,is_free,is_published)").eq("is_published",true).order("created_at",{ascending:false});
  const filtered = (data ?? []).filter((c:any)=>!params.category || c.categories?.slug===params.category);
  return <main className="mx-auto max-w-7xl px-5 py-10">
    <Link href="/" className="text-sm text-white/45">← Home</Link>
    <h1 className="mt-8 text-4xl font-semibold">Components</h1>
    <p className="mt-2 text-white/45">Live-ready building blocks with versioned source code.</p>
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((c:any)=><Link href={`/components/${c.slug}`} key={c.id} className="glass card-hover overflow-hidden rounded-3xl">
        <div className="h-52 bg-black/30 p-5"><iframe title={c.name} srcDoc={c.preview_html} className="h-full w-full rounded-2xl border border-white/10 bg-white" sandbox="allow-scripts"/></div>
        <div className="p-5"><div className="text-xs text-white/35">{c.categories?.name}</div><h2 className="mt-2 text-xl font-semibold">{c.name}</h2><p className="mt-2 line-clamp-2 text-sm text-white/45">{c.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">{(c.component_versions??[]).filter((v:any)=>v.is_published).map((v:any)=><span key={v.id} className="rounded-full bg-white/7 px-3 py-1 text-xs">{v.name} · {v.is_free ? "Free" : inr(v.price)}</span>)}</div></div>
      </Link>)}
      {!filtered.length && <div className="glass rounded-3xl p-10 text-white/50">No published components yet. Add them from Admin.</div>}
    </div>
  </main>
}
