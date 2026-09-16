import Link from "next/link";
import { ArrowRight, Code2, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";

const fallback = [
  "Form & Input","Layout & Containers","Navigation","Feedback & Status","Identity & User",
  "Data & Visualization","Authentication","E-commerce","AI","Charts","Marketing","Mobile","Landing Pages"
];

export default async function Home() {
  const supabase = await supabaseServer();
  const { data: categories } = await supabase.from("categories").select("id,name,slug,component_count").eq("is_published",true).order("sort_order");
  const cats = categories?.length ? categories : fallback.map((name,i)=>({id:String(i),name,slug:name.toLowerCase().replaceAll(" ","-"),component_count:0}));

  return <main className="min-h-screen">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
      <Link href="/" className="text-lg font-semibold tracking-tight">WB<span className="text-violet-300">UI</span></Link>
      <nav className="flex gap-3">
        <Link href="/components" className="rounded-full px-4 py-2 text-sm text-white/70 hover:text-white">Browse</Link>
        <Link href="/admin" className="glass rounded-full px-4 py-2 text-sm">Admin</Link>
      </nav>
    </header>

    <section className="mx-auto max-w-7xl px-5 pb-20 pt-16">
      <div className="max-w-4xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-xs text-white/70">
          <Sparkles size={14}/> Premium UI library
        </div>
        <h1 className="text-5xl font-bold tracking-[-.04em] sm:text-7xl">
          <span className="gradient-text">World Best UI Components</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">
          Production-ready components, live previews and clean source code for modern web products.
        </p>
        <Link href="/components" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black">
          Explore components <ArrowRight size={17}/>
        </Link>
      </div>

      <div className="mt-20 grid gap-4 sm:grid-cols-3">
        {[
          [Layers3,"13","Categories"],
          [Code2,"4+","Code formats"],
          [ShieldCheck,"100%","Entitlement protected"]
        ].map(([Icon,value,label]) => {
          const I = Icon as any;
          return <div key={label as string} className="glass rounded-3xl p-6"><I size={20}/><div className="mt-7 text-3xl font-semibold">{value}</div><div className="mt-1 text-sm text-white/45">{label}</div></div>
        })}
      </div>

      <div className="mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div><p className="text-sm text-white/40">Library</p><h2 className="mt-1 text-3xl font-semibold">Categories</h2></div>
          <Link href="/components" className="text-sm text-white/55 hover:text-white">View all →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c:any)=><Link key={c.id} href={`/components?category=${c.slug}`} className="glass card-hover rounded-2xl p-5">
            <div className="flex items-center justify-between"><span className="font-medium">{c.name}</span><ArrowRight size={16} className="text-white/30"/></div>
            <div className="mt-3 text-sm text-white/40">{c.component_count ?? 0} components</div>
          </Link>)}
        </div>
      </div>
    </section>
  </main>
}
