import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_:Request,{params}:{params:Promise<{versionId:string}>}){
 const {versionId}=await params; const s=await supabaseServer(); const {data:{user}}=await s.auth.getUser();
 const admin=supabaseAdmin();
 const {data:v}=await admin.from("component_versions").select("id,is_free,is_published").eq("id",versionId).single();
 if(!v||!v.is_published)return NextResponse.json({error:"Not found"},{status:404});
 if(!v.is_free){
  if(!user)return NextResponse.json({error:"Purchase required"},{status:401});
  const {data:a}=await admin.from("access_permissions").select("id").eq("user_id",user.id).eq("component_version_id",versionId).single();
  if(!a)return NextResponse.json({error:"Purchase required"},{status:402});
 }
 const {data:code}=await admin.from("component_code").select("html,css,js,code_text").eq("component_version_id",versionId).single();
 if(!code)return NextResponse.json({error:"Code unavailable"},{status:404});
 return NextResponse.json(code,{headers:{"Cache-Control":"private, no-store"}});
}
