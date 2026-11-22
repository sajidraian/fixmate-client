"use client";

import Link from "next/link";

const services = [
  { icon: "❄️", title: "AC & Cooling", description: "Stay comfortable with reliable cooling repairs.", category: "COOLING" },
  { icon: "🧊", title: "Refrigerator", description: "Keep your kitchen running with expert care.", category: "KITCHEN" },
  { icon: "🫧", title: "Washing Machine", description: "Get laundry day back on track, without the hassle.", category: "LAUNDRY" },
  { icon: "📺", title: "TV & Display", description: "Bring your screens and entertainment back to life.", category: "ELECTRONICS" },
  { icon: "⚡", title: "Microwave", description: "Safe, careful repairs for everyday appliances.", category: "KITCHEN" },
  { icon: "🔌", title: "Other Devices", description: "Find help for the devices you rely on every day.", category: "MORE" },
];

const steps = [
  { number: "01", icon: "⌕", title: "Find your service", detail: "Browse repair services and choose what you need fixed." },
  { number: "02", icon: "▣", title: "Book with confidence", detail: "Tell us what happened and choose a convenient date." },
  { number: "03", icon: "✓", title: "Track your repair", detail: "Follow every step and pay securely after completion." },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080D19] text-white">
      <section className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_20%,rgba(184,243,107,.13),transparent_38%),radial-gradient(ellipse_at_10%_80%,rgba(59,130,246,.12),transparent_36%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#B8F36B]/25 bg-[#B8F36B]/10 px-4 py-2 text-xs font-bold tracking-[.16em] text-[#B8F36B]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#B8F36B]" /> SMARTER REPAIRS START HERE
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Life moves on.<br /><span className="text-[#B8F36B]">We fix what</span><br />slows it down.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
              From home appliances to everyday devices, find skilled technicians, book in minutes and keep every repair on track.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/services" className="inline-flex items-center justify-center rounded-xl bg-[#B8F36B] px-7 py-4 text-sm font-extrabold text-[#080D19] shadow-lg shadow-lime-300/10 transition hover:-translate-y-1 hover:bg-white">Explore services <span className="ml-3 text-lg">↗</span></Link>
              <Link href="/sign-up" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:border-[#B8F36B]/60 hover:bg-white/10">Join as a technician</Link>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-7">
              <div><p className="text-2xl font-black text-white">24/7</p><p className="mt-1 text-xs text-slate-400">Online booking</p></div>
              <div><p className="text-2xl font-black text-white">Easy</p><p className="mt-1 text-xs text-slate-400">Service tracking</p></div>
              <div><p className="text-2xl font-black text-white">Secure</p><p className="mt-1 text-xs text-slate-400">Online payments</p></div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 rounded-full bg-[#B8F36B]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1B2B40] via-[#111D2E] to-[#0B1220] p-5 shadow-2xl shadow-black/40 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><p className="text-xs font-bold tracking-[.18em] text-[#B8F36B]">FIXMATE SERVICE HUB</p><p className="mt-1 text-sm text-slate-400">Your home, back in working order.</p></div><span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-300">● Ready to help</span></div>
              <div className="grid grid-cols-2 gap-3 py-5">
                <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="text-4xl">❄️</span><p className="mt-5 font-bold">Cooling</p><p className="mt-1 text-xs text-slate-400">AC & ventilation</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="text-4xl">🧺</span><p className="mt-5 font-bold">Appliances</p><p className="mt-1 text-xs text-slate-400">Home essentials</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="text-4xl">📱</span><p className="mt-5 font-bold">Devices</p><p className="mt-1 text-xs text-slate-400">Everyday tech</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="text-4xl">🛠️</span><p className="mt-5 font-bold">Expert help</p><p className="mt-1 text-xs text-slate-400">Skilled technicians</p></div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-[#B8F36B] p-4 text-[#080D19]"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10 text-2xl">✓</span><div className="min-w-0 flex-1"><p className="font-extrabold">A simpler way to get things fixed</p><p className="mt-1 text-xs text-[#26351D]">Book · Track · Pay</p></div><span className="text-2xl">↗</span></div>
            </div>
            <div className="absolute -left-5 top-1/3 hidden rounded-2xl border border-white/10 bg-[#17263B] px-4 py-3 shadow-xl sm:block"><p className="text-xs text-slate-400">Booking made simple</p><p className="mt-1 text-sm font-bold text-white">Just a few clicks ✨</p></div>
            <div className="absolute -right-4 bottom-10 hidden rounded-2xl border border-white/10 bg-[#17263B] px-4 py-3 shadow-xl sm:block"><p className="text-xs text-slate-400">Repair progress</p><p className="mt-1 text-sm font-bold text-[#B8F36B]">Track every step ✓</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0D1524] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-extrabold tracking-[.22em] text-[#B8F36B]">WHAT NEEDS FIXING?</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">One place for every repair<span className="text-[#B8F36B]">.</span></h2><p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">Choose a category to explore services from technicians on the FixMate platform.</p></div><Link href="/services" className="text-sm font-bold text-[#B8F36B] hover:text-white">Browse all services ↗</Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{services.map((service,index)=><Link href={`/services?category=${encodeURIComponent(service.category === "COOLING" ? "Cooling" : service.category === "KITCHEN" ? "Kitchen" : service.category === "LAUNDRY" ? "Laundry" : service.category === "ELECTRONICS" ? "Electronics" : "General")}`} key={service.title} className="group rounded-2xl border border-white/[.08] bg-[#121E30] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#B8F36B]/50 hover:bg-[#17263B]"><div className="flex items-center justify-between"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8F36B]/10 text-3xl">{service.icon}</span><span className="text-xs font-bold tracking-widest text-slate-600">0{index+1}</span></div><p className="mt-6 text-[10px] font-extrabold tracking-[.2em] text-[#B8F36B]">{service.category}</p><h3 className="mt-2 text-lg font-extrabold">{service.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{service.description}</p><div className="mt-6 flex justify-end"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition group-hover:border-[#B8F36B] group-hover:bg-[#B8F36B] group-hover:text-[#080D19]">↗</span></div></Link>)}</div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-24"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold tracking-[.22em] text-[#B8F36B]">HOW FIXMATE WORKS</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">From problem to fixed.</h2><p className="mt-4 text-sm leading-7 text-slate-400">A clear, simple process keeps you in control from the first click to the finished repair.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{steps.map(step=><div key={step.number} className="rounded-2xl border border-white/10 bg-[#101A2A] p-7"><div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B8F36B]/10 text-2xl text-[#B8F36B]">{step.icon}</span><span className="text-4xl font-black text-white/10">{step.number}</span></div><h3 className="mt-7 text-lg font-extrabold">{step.title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{step.detail}</p></div>)}</div></div></section>
      <section className="px-6 pb-20 md:pb-24"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#B8F36B] px-7 py-14 text-center text-[#080D19] md:px-16"><p className="text-xs font-black tracking-[.2em]">LET’S GET IT WORKING AGAIN</p><h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black sm:text-5xl">Your next repair starts with one simple step.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#26351D]">Explore services, find the right help and take the stress out of repairs.</p><Link href="/services" className="mt-8 inline-flex rounded-xl bg-[#080D19] px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-1 hover:bg-[#17263B]">Find a service ↗</Link></div></section>
    </main>
  );
}
