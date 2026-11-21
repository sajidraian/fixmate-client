import Link from "next/link";

const steps = [
  ["01", "Find a Service", "Browse approved repair services by category, location and service mode."],
  ["02", "Send a Request", "Tell the technician what is wrong and choose a preferred service date."],
  ["03", "Get It Fixed", "Track your request as the technician accepts it and completes the repair."],
  ["04", "Pay After Completion", "Pay securely through Stripe only after the job is marked completed."],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080D19] px-5 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B8F36B]">How FixMate Works</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">Repair made simple, transparent and trusted.</h1>
        <p className="mt-6 max-w-2xl leading-7 text-gray-400">FixMate connects customers with technicians for smart device and home appliance repairs. Every request has a clear status, and payment is made after the work is complete.</p>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {steps.map(([number, title, description]) => (
            <article key={number} className="rounded-2xl border border-white/10 bg-[#111B2D] p-7">
              <span className="text-sm font-bold text-[#B8F36B]">{number}</span>
              <h2 className="mt-3 text-2xl font-bold">{title}</h2>
              <p className="mt-3 leading-7 text-gray-400">{description}</p>
            </article>
          ))}
        </div>
        <Link href="/services" className="mt-10 inline-flex rounded-full bg-[#B8F36B] px-7 py-3 font-bold text-[#080D19]">Browse Services</Link>
      </div>
    </main>
  );
}
