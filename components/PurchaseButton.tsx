"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function PurchaseButton({versionId}:{versionId:string}) {
  const [busy,setBusy]=useState(false);
  async function buy(){
    setBusy(true);
    try{
      const s=supabaseBrowser();
      const {data:{user}}=await s.auth.getUser();
      if(!user){ location.href="/login?next="+encodeURIComponent(location.pathname); return; }
      const r=await fetch("/api/payments/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({versionId})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error||"Unable to create order");
      const Razorpay=(window as any).Razorpay;
      if(!Razorpay) throw new Error("Razorpay checkout unavailable");
      const checkout=new Razorpay({key:d.keyId,amount:d.amount,currency:"INR",name:"World Best UI Components",description:d.description,order_id:d.orderId,
        handler: async (response:any)=>{
          const v=await fetch("/api/payments/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(response)});
          const out=await v.json(); if(!v.ok) throw new Error(out.error||"Payment verification failed");
          location.href="/account?purchase=success";
        }});
      checkout.open();
    }catch(e:any){ alert(e.message); } finally { setBusy(false); }
  }
  return <>
    <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    <button disabled={busy} onClick={buy} className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black disabled:opacity-50">{busy?"Opening…":"Buy & Get Code"}</button>
  </>
}
