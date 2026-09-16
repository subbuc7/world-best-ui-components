import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { supabaseServer } from "@/lib/supabase-server";
import AdminClient from "./ui";

export default async function Admin(){
 try{await requireAdmin();}catch{redirect("/admin/login");}
 const s=await supabaseServer();
 const [{data:categories},{data:components},{data:versions}]=await Promise.all([
  s.from("categories").select("*").order("sort_order"),
  s.from("components").select("*,categories(name)").order("created_at",{ascending:false}),
  s.from("component_versions").select("*,components(name)").order("created_at",{ascending:false})
 ]);
 return <AdminClient initial={{categories:categories??[],components:components??[],versions:versions??[]}}/>
}
