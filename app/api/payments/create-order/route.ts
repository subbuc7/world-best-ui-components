import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { razorpay } from "@/lib/razorpay";

export async function POST(req:Request){
 const s=await supabaseServer(); const {data:{user}}=await s.auth.getUser(); if(!user)return NextResponse.json({error:"Login required"},{status:401});
 const {versionId}=await req.json();
 const admin=supabaseAdmin(); const {data:v,error}=await admin.from("component_versions").select("id,name,price,is_free,components(name)").eq("id",versionId).eq("is_published",true).single();
 if(error||!v)return NextResponse.json({error:"Version not found"},{status:404});
 if(v.is_free)return NextResponse.json({error:"This version is free"},{status:400});
 const amount=Math.round(Number(v.price)*100); if(!amount)return NextResponse.json({error:"Invalid price"},{status:400});
 const order=await razorpay().orders.create({amount,currency:"INR",receipt:`wbu_${user.id.slice(0,8)}_${Date.now()}`,notes:{user_id:user.id,version_id:v.id}});
 await admin.from("purchases").insert({user_id:user.id,component_version_id:v.id,razorpay_order_id:order.id,amount:Number(v.price),currency:"INR",status:"created"});
 return NextResponse.json({orderId:order.id,keyId:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,amount,currency:"INR",description:`${(v as any).components?.name} · ${v.name}`});
}
