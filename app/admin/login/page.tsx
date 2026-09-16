"use client";
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

const ADMIN_EMAIL="reddysubramanyam.h@gmail.com";
export default function AdminLogin(){
 const [sent,setSent]=useState(false),[otp,setOtp]=useState(""),[msg,setMsg]=useState(""),[busy,setBusy]=useState(false);
 async function send(){setBusy(true);setMsg("");const {error}=await supabaseBrowser().auth.signInWithOtp({email:ADMIN_EMAIL,options:{shouldCreateUser:false}});setBusy(false);if(error)setMsg(error.message);else setSent(true);}
 async function verify(){setBusy(true);setMsg("");const {error}=await supabaseBrowser().auth.verifyOtp({email:ADMIN_EMAIL,token:otp,type:"email"});setBusy(false);if(error)setMsg(error.message);else location.href="/admin";}
 return <main className="mx-auto flex min-h-screen max-w-md items-center px-5"><div className="glass w-full rounded-3xl p-7"><Link href="/" className="text-sm text-white/45">← Home</Link><h1 className="mt-8 text-3xl font-semibold">Admin access</h1><p className="mt-2 text-white/45">OTP will be delivered to the configured admin Gmail.</p>{!sent?<button disabled={busy} onClick={send} className="mt-8 w-full rounded-xl bg-white py-3 font-medium text-black">{busy?"Sending…":"Send OTP"}</button>:<><input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" placeholder="6-digit OTP" className="mt-8 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl tracking-[.5em] outline-none"/><button disabled={busy} onClick={verify} className="mt-3 w-full rounded-xl bg-white py-3 font-medium text-black">{busy?"Verifying…":"Verify OTP"}</button><button onClick={send} className="mt-3 w-full py-2 text-sm text-white/45">Resend OTP</button></>}{msg&&<p className="mt-4 text-sm text-red-300">{msg}</p>}</div></main>
}
