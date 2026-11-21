import Link from "next/link";

const categories = ["AC & Cooling", "Refrigerator", "Washing Machine", "TV & Display", "Kitchen Appliances"];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080D19] px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-2xl font-black text-[#B8F36B]">fixmate.</Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">Smart device and home appliance repairs, made simple. Find trusted technicians and track every repair.</p>
        </div>
        <div><h2 className="font-bold">Quick Links</h2><div className="mt-4 flex flex-col gap-3 text-sm text-gray-400"><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/about">How It Works</Link><Link href="/sign-up">Create Account</Link></div></div>
        <div><h2 className="font-bold">Popular Categories</h2><div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">{categories.map(category=><Link key={category} href={`/services?category=${encodeURIComponent(category)}`}>{category}</Link>)}</div></div>
        <div><h2 className="font-bold">Get in Touch</h2><p className="mt-4 text-sm leading-6 text-gray-400">Need help with a repair? Browse services and send a request to a technician.</p><Link href="/services" className="mt-4 inline-block text-sm font-semibold text-[#B8F36B]">Find a Service ↗</Link><div className="mt-4"><a href="https://x.com" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-[#B8F36B]">X / Twitter</a></div></div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-gray-500">© {new Date().getFullYear()} FixMate. All rights reserved.</div>
    </footer>
  );
}
