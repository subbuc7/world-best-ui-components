"use client";
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function Login(){
 const [email,setEmail]=useState(""); const [sent,setSent]=useState(false); const [token,setToken]=useState(""); const [msg,setMsg]=useState("");
 async function send(){setMsg(""); const {error}=await supabaseBrowser().auth.signInWithOtp({email,options:{shouldCreateUser:true}}); if(error)setMsg(error.message); else setSent(true);}
 async function verify(){setMsg(""); const {error}=await supabaseBrowser().auth.verifyOtp({email,token,type:"email"}); if(error)setMsg(error.message); else location.href="/account";}
 return <main className="mx-auto flex min-h-screen max-w-md items-center px-5"><div className="glass w-full rounded-3xl p-7"><Link href="/" className="text-sm text-white/45">← Home</Link><h1 className="mt-8 text-3xl font-semibold">Sign in</h1><p className="mt-2 text-white/45">Use your email to access purchases.</p>
 {!sent ? <><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-7 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"/><button onClick={send} className="mt-3 w-full rounded-xl bg-white py-3 font-medium text-black">Send OTP</button></>:
 <><input value={token} onChange={e=>setToken(e.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" placeholder="6-digit OTP" className="mt-7 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xl tracking-[.5em] outline-none"/><button onClick={verify} className="mt-3 w-full rounded-xl bg-white py-3 font-medium text-black">Verify OTP</button></>}
 {msg&&<p className="mt-4 text-sm text-red-300">{msg}</p>}</div></main>
}
