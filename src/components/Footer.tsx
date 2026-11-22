import Link from "next/link";

const categories = ["AC & Cooling", "Refrigerator", "Washing Machine", "TV & Display", "Kitchen Appliances"];

export default function Footer() {
  return <footer className="border-t border-white/10 bg-[#070C16] px-6 pb-8 pt-14 text-white">
    <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
      <div><Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-[#B8F36B]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B8F36B]/10">⌁</span>fixmate<span className="text-white">.</span></Link><p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">Smart device and home appliance repairs, made simple. Find trusted technicians and keep every repair moving.</p></div>
      <div><h2 className="text-sm font-extrabold">Explore</h2><div className="mt-4 flex flex-col gap-3 text-sm text-slate-400"><Link className="hover:text-[#B8F36B]" href="/">Home</Link><Link className="hover:text-[#B8F36B]" href="/services">All services</Link><Link className="hover:text-[#B8F36B]" href="/about">How it works</Link><Link className="hover:text-[#B8F36B]" href="/sign-up">Create account</Link></div></div>
      <div><h2 className="text-sm font-extrabold">Popular repairs</h2><div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">{categories.map(category=><Link className="hover:text-[#B8F36B]" key={category} href="/services">{category}</Link>)}</div></div>
      <div><h2 className="text-sm font-extrabold">Need a hand?</h2><p className="mt-4 text-sm leading-7 text-slate-400">Browse available services and send a repair request to a technician.</p><Link href="/services" className="mt-5 inline-flex rounded-xl bg-[#B8F36B] px-5 py-3 text-sm font-extrabold text-[#080D19] transition hover:bg-white">Find a service ↗</Link></div>
    </div>
    <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} FixMate. All rights reserved.</span><span>Repair smarter. Live easier.</span></div>
  </footer>;
}
