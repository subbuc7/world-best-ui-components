import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req:Request){
 const s=await supabaseServer(); const {data:{user}}=await s.auth.getUser(); if(!user)return NextResponse.json({error:"Login required"},{status:401});
 const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=await req.json();
 if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature)return NextResponse.json({error:"Invalid payment response"},{status:400});
 const expected=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET!).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
 if(!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(razorpay_signature)))return NextResponse.json({error:"Signature verification failed"},{status:400});
 const admin=supabaseAdmin();
 const {data:p}=await admin.from("purchases").select("*").eq("razorpay_order_id",razorpay_order_id).eq("user_id",user.id).single();
 if(!p)return NextResponse.json({error:"Purchase record not found"},{status:404});
 const {error}=await admin.from("purchases").update({razorpay_payment_id,status:"paid",paid_at:new Date().toISOString()}).eq("id",p.id);
 if(error)return NextResponse.json({error:error.message},{status:500});
 await admin.from("access_permissions").upsert({user_id:user.id,component_version_id:p.component_version_id,purchase_id:p.id});
 return NextResponse.json({ok:true});
}
