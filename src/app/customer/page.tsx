"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/api";

interface Booking { _id: string; status: string; paymentStatus: string; }

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email: string; role: string } | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, unpaid: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      let profileLoaded = false;
      try {
        const profile = await authenticatedFetch("/api/users/me");
        if (profile.data.role !== "customer") { router.replace("/"); return; }
        if (!active) return;
        setUser(profile.data); profileLoaded = true;
        const result = await authenticatedFetch("/api/bookings/my");
        if (!active) return;
        const bookings: Booking[] = result.data || [];
        setStats({
          total: bookings.length,
          active: bookings.filter((booking) => ["requested", "accepted", "in-progress"].includes(booking.status)).length,
          completed: bookings.filter((booking) => booking.status === "completed").length,
          unpaid: bookings.filter((booking) => booking.status === "completed" && booking.paymentStatus !== "paid").length,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
        if (!profileLoaded) router.replace("/login?redirect=/customer");
      } finally { if (active) setLoading(false); }
    };
    loadDashboard();
    return () => { active = false; };
  }, [router]);

  if (loading) return <main className="flex min-h-[65vh] items-center justify-center bg-[#080D19] text-[#B8F36B]">Loading your dashboard…</main>;
  if (!user) return null;

  const cards = [
    { label: "Total bookings", value: stats.total, icon: "▤", note: "All repair requests", color: "from-sky-400/15 to-sky-400/0" },
    { label: "Active repairs", value: stats.active, icon: "◷", note: "In progress or awaiting", color: "from-amber-300/15 to-amber-300/0" },
    { label: "Completed", value: stats.completed, icon: "✓", note: "Successfully repaired", color: "from-lime-300/15 to-lime-300/0" },
    { label: "Payments due", value: stats.unpaid, icon: "৳", note: "Ready for checkout", color: "from-violet-400/15 to-violet-400/0" },
  ];
  const shortcuts = [
    { href: "/services", icon: "⌕", title: "Book a repair", detail: "Find the right service for your device.", action: "Explore services" },
    { href: "/customer/bookings", icon: "▤", title: "My bookings", detail: "Follow your repair from request to completion.", action: "Track bookings" },
    { href: "/customer/payments", icon: "৳", title: "Payment history", detail: "See your completed and paid transactions.", action: "View payments" },
  ];

  return <main className="min-h-screen bg-[#080D19] px-5 py-8 text-white md:px-8 md:py-12">
    <div className="mx-auto max-w-7xl">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_85%_10%,rgba(184,243,107,.16),transparent_38%),linear-gradient(120deg,#142238,#0D1727_65%,#101B2B)] p-7 md:p-10">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div><div className="inline-flex items-center gap-2 rounded-full border border-[#B8F36B]/20 bg-[#B8F36B]/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[.18em] text-[#B8F36B]">CUSTOMER SPACE</div><h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">Welcome back, {user.name || "Customer"}<span className="text-[#B8F36B]">.</span></h1><p className="mt-3 text-sm text-slate-300">{user.email} · Here’s what’s happening with your repairs.</p></div>
          <Link href="/services" className="inline-flex items-center justify-center rounded-xl bg-[#B8F36B] px-5 py-3 text-sm font-extrabold text-[#080D19] transition hover:-translate-y-0.5 hover:bg-white">＋ Book a repair</Link>
        </div>
      </div>
      {error && <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</p>}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card=><article key={card.label} className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${card.color} bg-[#111B2D] p-6`}><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-300">{card.label}</p><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-[#B8F36B]">{card.icon}</span></div><p className="mt-5 text-4xl font-black tracking-tight">{card.value}</p><p className="mt-2 text-xs text-slate-400">{card.note}</p></article>)}</section>
      <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-2xl border border-white/10 bg-[#111B2D] p-6 md:p-7"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold">Your repair overview</h2><p className="mt-1 text-sm text-slate-400">A quick look at your current activity.</p></div><span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">Live summary</span></div><div className="mt-7 space-y-5">{[["Active repairs",stats.active],["Completed repairs",stats.completed],["Payments due",stats.unpaid]].map(([label,value])=><div key={String(label)}><div className="mb-2 flex justify-between text-sm"><span className="text-slate-300">{label}</span><span className="font-bold text-[#B8F36B]">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#B8F36B]" style={{width:`${stats.total ? Math.max(2,Number(value)/stats.total*100) : 0}%`}}/></div></div>)}</div></div>
        <div className="rounded-2xl border border-[#B8F36B]/20 bg-[#B8F36B]/[.07] p-6 md:p-7"><span className="text-3xl">🛠️</span><h2 className="mt-4 text-xl font-extrabold">Need something fixed?</h2><p className="mt-2 text-sm leading-6 text-slate-300">Browse available services and connect with a technician who can help.</p><Link href="/services" className="mt-6 inline-flex rounded-xl bg-[#B8F36B] px-5 py-3 text-sm font-extrabold text-[#080D19] hover:bg-white">Find a technician ↗</Link></div>
      </section>
      <section className="mt-9"><div className="mb-5"><p className="text-xs font-extrabold tracking-[.2em] text-[#B8F36B]">QUICK ACCESS</p><h2 className="mt-2 text-2xl font-black">Make yourself at home.</h2></div><div className="grid gap-4 md:grid-cols-3">{shortcuts.map(item=><Link key={item.href} href={item.href} className="group rounded-2xl border border-white/10 bg-[#111B2D] p-6 transition hover:-translate-y-1 hover:border-[#B8F36B]/50"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B8F36B]/10 text-2xl text-[#B8F36B]">{item.icon}</span><h3 className="mt-5 text-lg font-extrabold">{item.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{item.detail}</p><p className="mt-5 text-sm font-bold text-[#B8F36B]">{item.action} ↗</p></Link>)}</div></section>
    </div>
  </main>;
}
