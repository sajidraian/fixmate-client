"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";

interface Booking {
  _id: string;
  status: string;
  paymentStatus: string;
  finalAmount: number;
}
interface Service {
  _id: string;
  approvalStatus: string;
}

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
        if (profile.data.role !== "technician") {
          router.replace("/");
          return;
        }
        if (!active) return;
        setUser(profile.data);
        profileLoaded = true;

        const [bookingResult, serviceResult] = await Promise.all([
          authenticatedFetch("/api/bookings/technician"),
          authenticatedFetch("/api/services/technician/mine"),
        ]);
        if (!active) return;
        const bookings: Booking[] = bookingResult.data || [];
        const services: Service[] = serviceResult.data || [];
        setStats({
          services: services.length,
          pending: bookings.filter((booking) => booking.status === "requested").length,
          active: bookings.filter((booking) => ["accepted", "in-progress"].includes(booking.status)).length,
          completed: bookings.filter((booking) => booking.status === "completed").length,
          paidEarnings: bookings.filter((booking) => booking.status === "completed" && booking.paymentStatus === "paid").reduce((sum, booking) => sum + Number(booking.finalAmount || 0), 0),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
        if (!profileLoaded) router.replace("/login?redirect=/technician");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDashboard();
    return () => { active = false; };
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#080D19] flex items-center justify-center text-lime-300">Loading Dashboard...</div>;
  if (!user) return null;

  const cards = [
    { label: "My Services", value: stats.services, href: "/technician/services", detail: "Manage your listings" },
    { label: "New Requests", value: stats.pending, href: "/technician/bookings", detail: "Requests awaiting response" },
    { label: "Active Repairs", value: stats.active, href: "/technician/bookings", detail: "Accepted or in progress" },
    { label: "Completed Jobs", value: stats.completed, href: "/technician/bookings", detail: "Finished repair jobs" },
    { label: "Paid Earnings", value: `৳${stats.paidEarnings.toLocaleString()}`, href: "/technician/bookings", detail: "From paid completed bookings" },
  ];

  return (
    <main className="min-h-screen bg-[#080D19] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-lime-300 font-bold text-xl">fixmate.</Link>
        <div className="mt-12">
          <p className="text-lime-300 text-sm uppercase tracking-widest">Technician Dashboard</p>
          <h1 className="text-3xl md:text-5xl font-bold mt-3">Welcome, {user.name || "Technician"}!</h1>
          <p className="text-gray-400 mt-3">{user.email}</p>
          <p className="text-gray-500 mt-2">Here is a live overview of your repair work.</p>
        </div>
        {error && <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</p>}
        <section className="grid gap-5 mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="rounded-2xl border border-gray-800 bg-[#111B2D] p-7 transition hover:border-lime-300">
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="mt-3 text-3xl font-bold text-lime-300">{card.value}</p>
              <p className="mt-2 text-sm text-gray-500">{card.detail}</p>
            </Link>
          ))}
        </section>
        <section className="mt-8 rounded-2xl border border-gray-800 bg-[#111B2D] p-6">
          <h2 className="text-xl font-bold">Work Overview</h2>
          <p className="mt-1 text-sm text-gray-400">Your services and job progress.</p>
          <div className="mt-5 space-y-4">
            {[
              ["Services", stats.services],
              ["New requests", stats.pending],
              ["Active repairs", stats.active],
              ["Completed jobs", stats.completed],
            ].map(([label, value]) => {
              const maximum = Math.max(stats.services, stats.pending, stats.active, stats.completed, 1);
              return <div key={String(label)}>
                <div className="mb-2 flex justify-between text-sm"><span className="text-gray-300">{label}</span><span className="text-lime-300">{value}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-lime-300" style={{ width: `${Math.max(2, Number(value) / maximum * 100)}%` }} /></div>
              </div>;
            })}
          </div>
        </section>
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/technician/services" className="rounded-2xl bg-lime-300 p-6 font-bold text-[#080D19] hover:bg-white">＋ Add or manage a service</Link>
          <Link href="/technician/bookings" className="rounded-2xl border border-white/15 p-6 font-bold hover:border-lime-300">View booking requests →</Link>
        </section>
      </div>
    </main>
  );
}
