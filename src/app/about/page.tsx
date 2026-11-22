import Link from "next/link";

const steps = [
  ["01", "Find a service", "Browse approved repair services and choose the appliance or device that needs attention.", "⌕"],
  ["02", "Send a request", "Describe the issue, add your address and select a date that works for you.", "▣"],
  ["03", "Track the repair", "Follow your booking as the technician accepts the job and works through each stage.", "◷"],
  ["04", "Pay when it’s done", "Once the repair is complete, pay securely online and keep your invoice.", "✓"],
];

export default function AboutPage() {
  return <main className="min-h-screen bg-[#080D19] px-5 py-12 text-white md:py-20">
    <div className="mx-auto max-w-7xl">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_85%_10%,rgba(184,243,107,.16),transparent_38%),linear-gradient(120deg,#142238,#0D1727_65%,#101B2B)] px-7 py-12 md:px-14 md:py-16">
        <div className="max-w-3xl"><div className="inline-flex rounded-full border border-[#B8F36B]/20 bg-[#B8F36B]/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[.18em] text-[#B8F36B]">HOW FIXMATE WORKS</div><h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">Less time worrying.<br/><span className="text-[#B8F36B]">More time living.</span></h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">FixMate brings customers and skilled technicians together for smart device and home appliance repairs. Clear booking updates, transparent service details and payment after completion keep the process simple.</p><Link href="/services" className="mt-8 inline-flex rounded-xl bg-[#B8F36B] px-6 py-3.5 text-sm font-extrabold text-[#080D19] hover:bg-white">Explore services ↗</Link></div>
      </section>
      <section className="py-16 md:py-20"><div className="max-w-2xl"><p className="text-xs font-extrabold tracking-[.2em] text-[#B8F36B]">A CLEARER REPAIR JOURNEY</p><h2 className="mt-3 text-3xl font-black md:text-4xl">Four simple steps. No guesswork.</h2><p className="mt-4 text-sm leading-7 text-slate-400">From the first search to the final payment, you can see what happens next.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{steps.map(([number,title,description,icon])=><article key={number} className="rounded-2xl border border-white/10 bg-[#111B2D] p-6 transition hover:-translate-y-1 hover:border-[#B8F36B]/40"><div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B8F36B]/10 text-2xl text-[#B8F36B]">{icon}</span><span className="text-4xl font-black text-white/10">{number}</span></div><h3 className="mt-7 text-lg font-extrabold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{description}</p></article>)}</div></section>
      <section className="rounded-[2rem] border border-[#B8F36B]/20 bg-[#B8F36B]/[.07] p-8 text-center md:p-12"><p className="text-xs font-extrabold tracking-[.2em] text-[#B8F36B]">READY WHEN YOU ARE</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black md:text-4xl">Let’s get your everyday essentials working again.</h2><Link href="/services" className="mt-7 inline-flex rounded-xl bg-[#B8F36B] px-6 py-3.5 text-sm font-extrabold text-[#080D19] hover:bg-white">Find a repair service ↗</Link></section>
    </div>
  </main>;
}
