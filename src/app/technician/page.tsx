"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";

export default function TechnicianDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name?: string;
    email: string;
    role: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const result = await authenticatedFetch("/api/users/me");

        if (result.data.role !== "technician") {
          router.replace("/");
          return;
        }

        setUser(result.data);
      } catch (error) {
        console.error("Dashboard authentication error:", error);
        router.replace("/login?redirect=/technician");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D19] flex items-center justify-center text-lime-300">
        Loading Dashboard...
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#080D19] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-lime-300 font-bold text-xl">
          fixmate.
        </Link>

        <div className="mt-12">
          <p className="text-lime-300 text-sm uppercase tracking-widest">
            Technician Dashboard
          </p>

          <h1 className="text-3xl md:text-5xl font-bold mt-3">
            Welcome, {user.name || "Technician"}!
          </h1>

          <p className="text-gray-400 mt-3">{user.email}</p>
        </div>

<div className="grid md:grid-cols-3 gap-5 mt-12">
  <Link
    href="/technician/services"
    className="bg-[#111B2D] border border-gray-800 rounded-2xl p-7 hover:border-lime-300 transition"
  >
    <h2 className="text-gray-400 text-sm">My Services</h2>
    <p className="text-xl font-bold mt-4">Manage Services →</p>
  </Link>

  <Link
    href="/technician/bookings"
    className="bg-[#111B2D] border border-gray-800 rounded-2xl p-7 hover:border-lime-300 transition"
  >
    <h2 className="text-gray-400 text-sm">Booking Requests</h2>
    <p className="text-xl font-bold mt-4">View Requests →</p>
  </Link>

  <div className="bg-[#111B2D] border border-gray-800 rounded-2xl p-7">
    <h2 className="text-gray-400 text-sm">My Earnings</h2>
    <p className="text-xl font-bold mt-4">Track Earnings</p>
  </div>
</div>
      </div>
    </main>
  );
}