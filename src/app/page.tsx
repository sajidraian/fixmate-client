import Link from "next/link";
import Navbar from "@/components/Navbar";
const services = [
  {
    icon: "❄️",
    title: "AC & Cooling",
    description: "Cooling system repair and maintenance.",
    tag: "POPULAR",
    number: "01",
  },
  {
    icon: "🧊",
    title: "Refrigerator",
    description: "Keep your food fresh with expert care.",
    tag: "HOME SERVICE",
    number: "02",
  },
  {
    icon: "🫧",
    title: "Washing Machine",
    description: "Fast solutions for laundry problems.",
    tag: "EXPERT CARE",
    number: "03",
  },
  {
    icon: "📺",
    title: "TV & Display",
    description: "Professional screen and electronics repair.",
    tag: "TECH SERVICE",
    number: "04",
  },
  {
    icon: "⚡",
    title: "Microwave",
    description: "Safe and reliable kitchen appliance repair.",
    tag: "QUICK FIX",
    number: "05",
  },
  {
    icon: "🔌",
    title: "Other Devices",
    description: "Solutions for your everyday tech problems.",
    tag: "MORE",
    number: "06",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080D19] text-white">
      {/* NAVBAR */}
           {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-2 md:pt-24">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="relative z-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#B8F36B]/20 bg-[#B8F36B]/5 px-4 py-2 text-xs font-semibold tracking-widest text-[#B8F36B]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#B8F36B]" />
            YOUR SMART REPAIR PARTNER
          </div>

          <h1 className="text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">
            Broken things?
            <br />
            <span className="text-[#B8F36B]">We fix</span> them.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-gray-400 md:text-lg">
            From home appliances to smart devices, connect with skilled
            technicians and get your everyday problems fixed without the
            headache.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="rounded-full bg-[#B8F36B] px-8 py-4 font-bold text-[#080D19] transition hover:scale-105 hover:bg-white"
            >
              Explore Services ↗
            </Link>

            <Link
              href="/register"
              className="rounded-full border border-white/20 px-8 py-4 font-semibold transition hover:border-[#B8F36B] hover:text-[#B8F36B]"
            >
              Become a Technician
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-8 border-t border-white/10 pt-8">
            <div>
              <h3 className="text-3xl font-black text-white">24/7</h3>
              <p className="mt-1 text-xs text-gray-500">Booking access</p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-white">100%</h3>
              <p className="mt-1 text-xs text-gray-500">Convenience focused</p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-white">1 click</h3>
              <p className="mt-1 text-xs text-gray-500">To get started</p>
            </div>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="relative mx-auto flex min-h-[420px] w-full max-w-lg items-center justify-center">
          <div className="absolute h-80 w-80 rounded-full border border-[#B8F36B]/10" />
          <div className="absolute h-64 w-64 rounded-full border border-[#B8F36B]/20" />
          <div className="absolute h-48 w-48 rounded-full bg-[#B8F36B]/10 blur-3xl" />

          <div className="relative z-10 flex h-72 w-72 rotate-[-8deg] items-center justify-center rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#1D2B43] to-[#101827] shadow-2xl shadow-blue-950/50 md:h-80 md:w-80">
            <div className="text-center">
              <div className="text-9xl drop-shadow-[0_0_30px_rgba(184,243,107,0.25)]">
                🔧
              </div>
              <p className="mt-5 text-xs font-bold tracking-[0.4em] text-[#B8F36B]">
                REPAIR. RESTORE. REPEAT.
              </p>
            </div>
          </div>

          <div className="absolute right-0 top-10 z-20 rounded-2xl border border-white/10 bg-[#172235] p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B8F36B]/15 text-xl">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold">Easy Booking</p>
                <p className="text-xs text-gray-400">Just a few clicks</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-0 z-20 rounded-2xl border border-white/10 bg-[#172235] p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🛠️</div>
              <div>
                <p className="text-sm font-bold">Expert Technicians</p>
                <p className="text-xs text-gray-400">Professional service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#0D1524] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-xs font-bold tracking-[0.3em] text-[#B8F36B]">
                WHAT WE CAN FIX
              </p>
              <h2 className="text-4xl font-black md:text-5xl">
                One platform.
                <br />
                <span className="text-gray-500">Every solution.</span>
              </h2>
            </div>

            <Link
              href="/services"
              className="text-sm font-bold text-[#B8F36B] transition hover:text-white"
            >
              View all services ↗
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                href="/services"
                key={service.number}
                className="group rounded-3xl border border-white/[0.07] bg-[#121E30] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#B8F36B]/50 hover:bg-[#17263B]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{service.icon}</span>
                  <span className="text-sm font-bold text-gray-600">
                    {service.number}
                  </span>
                </div>

                <p className="mt-9 text-[10px] font-bold tracking-[0.2em] text-[#B8F36B]">
                  {service.tag}
                </p>

                <h3 className="mt-2 text-xl font-bold">{service.title}</h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {service.description}
                </p>

                <div className="mt-7 flex justify-end">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition group-hover:border-[#B8F36B] group-hover:bg-[#B8F36B] group-hover:text-[#080D19]">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-[#B8F36B]">
              SIMPLE PROCESS
            </p>
            <h2 className="text-4xl font-black md:text-5xl">
              Fix it in three steps.
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: "🔎",
                title: "Find your service",
                description: "Choose the appliance or device that needs attention.",
              },
              {
                number: "02",
                icon: "📅",
                title: "Book a technician",
                description: "Describe your problem and select a convenient date.",
              },
              {
                number: "03",
                icon: "✨",
                title: "Get it fixed",
                description: "Track your repair and pay securely when completed.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-white/10 bg-[#101A2A] p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="text-5xl font-black text-white/10">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-9 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#B8F36B] px-8 py-16 text-center text-[#080D19] md:px-16">
          <p className="text-xs font-black tracking-[0.3em]">
            READY TO GET STARTED?
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-black md:text-6xl">
            Your broken device deserves a second chance.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-[#24351A]">
            Join FixMate and discover a smarter way to manage your repair needs.
          </p>
          <Link
            href="/register"
            className="mt-9 inline-block rounded-full bg-[#080D19] px-9 py-4 font-bold text-white transition hover:scale-105 hover:bg-[#17263B]"
          >
            Join FixMate Today ↗
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <Link href="/" className="text-2xl font-black">
            fix<span className="text-[#B8F36B]">mate.</span>
          </Link>

          <p className="text-sm text-gray-500">
            Smart Device & Home Appliance Repair Platform.
          </p>

          <p className="text-xs text-gray-600">
            © 2026 FixMate. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}