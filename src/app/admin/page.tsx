"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";

type Stats = { totalUsers:number; totalTechnicians:number; pendingServices:number; totalBookings:number; totalPayments:number; totalRevenue:number };
type Service = { _id:string; title:string; category:string; description:string; image:string; basePrice:number; technicianName:string; technicianEmail:string; serviceArea:string };

const sections = [
  { href:"/dashboard/admin/users", title:"Manage Users", detail:"View accounts and update platform roles", icon:"👥" },
  { href:"/dashboard/admin/services", title:"Service Moderation", detail:"Review pending, approved and rejected listings", icon:"🛠️" },
  { href:"/dashboard/admin/bookings", title:"All Bookings", detail:"Monitor every repair request and status", icon:"📋" },
  { href:"/dashboard/admin/transactions", title:"Transactions", detail:"Review Stripe payments and revenue", icon:"💳" },
];

export default function AdminDashboard() {
  const [stats,setStats]=useState<Stats>({totalUsers:0,totalTechnicians:0,pendingServices:0,totalBookings:0,totalPayments:0,totalRevenue:0});
  const [services,setServices]=useState<Service[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");

  useEffect(()=>{
    (async()=>{
      try {
        const [statsResult,pendingResult]=await Promise.all([
          authenticatedFetch("/api/admin/stats"),
          authenticatedFetch("/api/services/admin/pending"),
        ]);
        setStats(statsResult.data);
        setServices(pendingResult.data||[]);
      } catch(e) {
        setError(e instanceof Error?e.message:"Failed to load admin dashboard.");
      } finally { setLoading(false); }
    })();
  },[]);

  const moderate=async(id:string,approvalStatus:"approved"|"rejected")=>{
    const service=services.find(item=>item._id===id);
    if(!service || !window.confirm(`${approvalStatus==="approved"?"Approve":"Reject"} ${service.title}?`)) return;
    try {
      await authenticatedFetch(`/api/services/${id}/approval`,{method:"PATCH",body:JSON.stringify({approvalStatus})});
      setServices(items=>items.filter(item=>item._id!==id));
      setStats(previous=>({...previous,pendingServices:Math.max(0,previous.pendingServices-1)}));
      setNotice(`Service ${approvalStatus} successfully.`);
    } catch(e) { setError(e instanceof Error?e.message:"Could not update service."); }
  };

  if(loading) return <main className="flex min-h-[60vh] items-center justify-center bg-[#080D19] text-[#B8F36B]">Loading Admin Dashboard…</main>;

  const cards=[
    ["Total Users",stats.totalUsers,"👥"],
    ["Technicians",stats.totalTechnicians,"🧰"],
    ["Pending Services",stats.pendingServices,"⏳"],
    ["Total Bookings",stats.totalBookings,"📋"],
    ["Paid Transactions",stats.totalPayments,"💳"],
    ["Total Revenue",`$${Number(stats.totalRevenue||0).toFixed(2)}`,"$"],
  ];

  return <main className="min-h-screen bg-[#080D19] px-5 py-10 text-white"><div className="mx-auto max-w-7xl">
    <p className="text-sm uppercase tracking-[.25em] text-[#B8F36B]">Administration</p>
    <h1 className="mt-3 text-4xl font-black md:text-5xl">Admin Dashboard</h1>
    <p className="mt-3 text-gray-400">Platform overview, user management and service approvals.</p>
    {error&&<p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</p>}
    {notice&&<p className="mt-4 rounded-xl border border-[#B8F36B]/20 bg-[#B8F36B]/10 p-4 text-[#B8F36B]">{notice}</p>}
    <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label,value,icon])=><article key={String(label)} className="rounded-2xl border border-white/10 bg-[#111B2D] p-6"><div className="flex items-center justify-between"><p className="text-sm text-gray-400">{label}</p><span className="text-2xl">{icon}</span></div><p className="mt-4 text-3xl font-black text-[#B8F36B]">{value}</p></article>)}</section>
    <section className="mt-10 rounded-2xl border border-white/10 bg-[#111B2D] p-6">
      <h2 className="text-xl font-bold">Platform Snapshot</h2>
      <p className="mt-1 text-sm text-gray-400">Quick comparison of current platform activity.</p>
      <div className="mt-6 space-y-4">
        {[
          ["Users", stats.totalUsers],
          ["Technicians", stats.totalTechnicians],
          ["Bookings", stats.totalBookings],
          ["Paid transactions", stats.totalPayments],
          ["Pending services", stats.pendingServices],
        ].map(([label, value]) => {
          const amount = Number(value);
          const maximum = Math.max(stats.totalUsers, stats.totalTechnicians, stats.totalBookings, stats.totalPayments, stats.pendingServices, 1);
          return <div key={String(label)}>
            <div className="mb-2 flex justify-between text-sm"><span className="text-gray-300">{label}</span><span className="font-semibold text-[#B8F36B]">{amount}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#B8F36B]" style={{ width: `${Math.max(2, amount / maximum * 100)}%` }} /></div>
          </div>;
        })}
      </div>
    </section>
    <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{sections.map(section=><Link key={section.href} href={section.href} className="rounded-2xl border border-white/10 bg-[#111B2D] p-5 transition hover:-translate-y-1 hover:border-[#B8F36B]/50"><span className="text-2xl">{section.icon}</span><h2 className="mt-4 font-bold">{section.title} ↗</h2><p className="mt-2 text-sm leading-6 text-gray-400">{section.detail}</p></Link>)}</section>
    <section className="mt-12"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-bold">Pending Service Approvals</h2><p className="mt-1 text-sm text-gray-400">Review new technician listings before publishing.</p></div><Link href="/dashboard/admin/services" className="text-sm font-semibold text-[#B8F36B]">View all services →</Link></div>
      {!services.length?<div className="rounded-2xl border border-white/10 bg-[#111B2D] p-9 text-center text-gray-400">No pending services right now.</div>:<div className="grid gap-5 md:grid-cols-2">{services.map(service=><article key={service._id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#111B2D] sm:flex"><img src={service.image} alt={service.title} className="h-48 w-full object-cover sm:h-auto sm:w-44"/><div className="flex-1 p-5"><p className="text-xs text-[#B8F36B]">{service.category} · {service.serviceArea}</p><h3 className="mt-2 text-lg font-bold">{service.title}</h3><p className="mt-1 text-sm text-gray-400">{service.technicianName} · ৳{service.basePrice}</p><p className="mt-3 line-clamp-2 text-sm text-gray-400">{service.description}</p><div className="mt-4 flex gap-2"><button onClick={()=>moderate(service._id,"approved")} className="rounded-lg bg-[#B8F36B] px-4 py-2 text-sm font-bold text-[#080D19]">Approve</button><button onClick={()=>moderate(service._id,"rejected")} className="rounded-lg border border-red-400/60 px-4 py-2 text-sm text-red-300">Reject</button></div></div></article>)}</div>}
    </section>
  </div></main>;
}
