"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/api";

interface Booking {
  _id: string;
  status: string;
  paymentStatus: string;
}

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
        if (profile.data.role !== "customer") {
          router.replace("/");
          return;
        }
        if (!active) return;
        setUser(profile.data);
        profileLoaded = true;
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
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDashboard();
    return () => { active = false; };
  }, [router]);

  if (loading) return <main className="min-h-screen bg-[#080D19] flex items-center justify-center text-lime-300">Loading Dashboard...</main>;
  if (!user) return null;

  const cards = [
    { label: "Total Bookings", value: stats.total, detail: "All your repair requests" },
    { label: "Active Repairs", value: stats.active, detail: "Requests and ongoing repairs" },
    { label: "Completed Repairs", value: stats.completed, detail: "Finished repair jobs" },
    { label: "Payments Due", value: stats.unpaid, detail: "Completed bookings awaiting payment" },
  ];

  return (
    <main className="min-h-screen bg-[#080D19] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-lime-300 text-xl font-bold">fixmate.</Link>
        <section className="mt-12">
          <p className="text-lime-300 text-sm uppercase tracking-widest">Customer Dashboard</p>
          <h1 className="text-3xl md:text-5xl font-bold mt-3">Welcome, {user.name || "Customer"}!</h1>
          <p className="text-gray-400 mt-3">{user.email}</p>
        </section>
        {error && <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</p>}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-800 bg-[#111B2D] p-6">
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="mt-3 text-3xl font-bold text-lime-300">{card.value}</p>
              <p className="mt-2 text-xs text-gray-500">{card.detail}</p>
            </div>
          ))}
        </section>
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <Link href="/customer/bookings" className="rounded-2xl border border-gray-800 bg-[#111B2D] p-8 transition hover:border-lime-300">
            <p className="text-gray-400">My Bookings</p>
            <h2 className="mt-4 text-2xl font-bold">View bookings →</h2>
            <p className="mt-3 text-gray-400">Track repair status, cancel pending requests, and pay completed bookings.</p>
          </Link>
          <Link href="/customer/payments" className="rounded-2xl border border-gray-800 bg-[#111B2D] p-8 transition hover:border-lime-300"><p className="text-gray-400">Payments</p><h2 className="mt-4 text-2xl font-bold">View payment history →</h2><p className="mt-3 text-gray-400">Review your Stripe receipts and paid transactions.</p></Link>
          <Link href="/services" className="rounded-2xl border border-gray-800 bg-[#111B2D] p-8 transition hover:border-lime-300">
            <p className="text-gray-400">Explore Services</p>
            <h2 className="mt-4 text-2xl font-bold">Book a repair →</h2>
            <p className="mt-3 text-gray-400">Find a technician for your device or appliance.</p>
          </Link>
        </section>
      </div>
    </main>
  );
}
