"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";

interface Booking { _id: string; status: string; paymentStatus: string; finalAmount: number; }
interface Service { _id: string; approvalStatus: string; }

export default function TechnicianDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email: string; role: string } | null>(null);
  const [stats, setStats] = useState({ services: 0, pending: 0, active: 0, completed: 0, paidEarnings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      let profileLoaded = false;
      try {
        const profile = await authenticatedFetch("/api/users/me");
        if (profile.data.role !== "technician") { router.replace("/"); return; }
        if (!active) return;
        setUser(profile.data); profileLoaded = true;
        const [bookingResult, serviceResult] = await Promise.all([authenticatedFetch("/api/bookings/technician"),authenticatedFetch("/api/services/technician/mine")]);
        if (!active) return;
        const bookings: Booking[] = bookingResult.data || [];
        const services: Service[] = serviceResult.data || [];
        setStats({ services: services.length, pending: bookings.filter(b=>b.status==="requested").length, active: bookings.filter(b=>["accepted","in-progress"].includes(b.status)).length, completed: bookings.filter(b=>b.status==="completed").length, paidEarnings: bookings.filter(b=>b.status==="completed"&&b.paymentStatus==="paid").reduce((sum,b)=>sum+Number(b.finalAmount||0),0) });
      } catch (err) { setError(err instanceof Error ? err.message : "Unable to load dashboard data."); if (!profileLoaded) router.replace("/login?redirect=/technician"); }
      finally { if (active) setLoading(false); }
    };
    loadDashboard(); return () => { active = false; };
  }, [router]);

  if (loading) return <main className="flex min-h-[65vh] items-center justify-center bg-[#080D19] text-[#B8F36B]">Loading your workspace…</main>;
  if (!user) return null;

  const cards = [
    { label: "My services", value: stats.services, href: "/technician/services", note: "Manage your listings", icon: "⌂" },
    { label: "New requests", value: stats.pending, href: "/technician/bookings", note: "Waiting for your response", icon: "◷" },
    { label: "Active repairs", value: stats.active, href: "/technician/bookings", note: "Accepted or in progress", icon: "⚒" },
    { label: "Completed jobs", value: stats.completed, href: "/technician/bookings", note: "Finished repair work", icon: "✓" },
  ];

  return <main className="min-h-screen bg-[#080D19] px-5 py-8 text-white md:px-8 md:py-12"><div className="mx-auto max-w-7xl">
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_85%_10%,rgba(184,243,107,.16),transparent_38%),linear-gradient(120deg,#142238,#0D1727_65%,#101B2B)] p-7 md:p-10"><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><div className="inline-flex rounded-full border border-[#B8F36B]/20 bg-[#B8F36B]/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[.18em] text-[#B8F36B]">TECHNICIAN WORKSPACE</div><h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">Good to see you, {user.name || "Technician"}<span className="text-[#B8F36B]">.</span></h1><p className="mt-3 text-sm text-slate-300">{user.email} · Your repair work, all in one place.</p></div><Link href="/technician/services" className="inline-flex items-center justify-center rounded-xl bg-[#B8F36B] px-5 py-3 text-sm font-extrabold text-[#080D19] hover:bg-white">＋ Add a service</Link></div></div>
    {error && <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</p>}
    <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card=><Link key={card.label} href={card.href} className="rounded-2xl border border-white/10 bg-[#111B2D] p-6 transition hover:-translate-y-1 hover:border-[#B8F36B]/50"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-300">{card.label}</p><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B8F36B]/10 text-xl text-[#B8F36B]">{card.icon}</span></div><p className="mt-5 text-4xl font-black">{card.value}</p><p className="mt-2 text-xs text-slate-400">{card.note}</p></Link>)}</section>
    <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl border border-white/10 bg-[#111B2D] p-6 md:p-7"><div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold">Work overview</h2><p className="mt-1 text-sm text-slate-400">Your current service and job activity.</p></div><span className="text-xs text-slate-500">Updated summary</span></div><div className="mt-7 space-y-5">{[["Services",stats.services],["New requests",stats.pending],["Active repairs",stats.active],["Completed jobs",stats.completed]].map(([label,value])=>{const maximum=Math.max(stats.services,stats.pending,stats.active,stats.completed,1);return <div key={String(label)}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">{label}</span><span className="font-bold text-[#B8F36B]">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#B8F36B]" style={{width:`${Math.max(2,Number(value)/maximum*100)}%`}}/></div></div>})}</div></div><div className="rounded-2xl border border-[#B8F36B]/20 bg-[#B8F36B]/[.07] p-6 md:p-7"><p className="text-xs font-extrabold tracking-[.18em] text-[#B8F36B]">PAID EARNINGS</p><p className="mt-4 text-4xl font-black">৳{stats.paidEarnings.toLocaleString()}</p><p className="mt-2 text-sm leading-6 text-slate-300">Earnings from completed jobs where the customer payment is confirmed.</p><Link href="/technician/bookings" className="mt-6 inline-flex rounded-xl border border-white/15 px-5 py-3 text-sm font-bold hover:border-[#B8F36B]">View job details ↗</Link></div></section>
    <section className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/technician/services/manage" className="rounded-2xl bg-[#B8F36B] p-6 text-[#080D19] transition hover:-translate-y-1 hover:bg-white"><p className="text-sm font-bold">SERVICE MANAGEMENT</p><h2 className="mt-2 text-xl font-black">Manage your listings ↗</h2><p className="mt-2 text-sm text-[#26351D]">Update pricing, details and availability.</p></Link><Link href="/technician/bookings" className="rounded-2xl border border-white/10 bg-[#111B2D] p-6 transition hover:-translate-y-1 hover:border-[#B8F36B]/50"><p className="text-sm font-bold text-[#B8F36B]">BOOKING MANAGEMENT</p><h2 className="mt-2 text-xl font-black">Review repair requests ↗</h2><p className="mt-2 text-sm text-slate-400">Respond to new requests and update job progress.</p></Link></section>
  </div></main>;
}
