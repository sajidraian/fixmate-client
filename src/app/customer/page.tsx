"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/api";

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const result = await authenticatedFetch("/api/users/me");

        if (result.data.role !== "customer") {
          router.replace("/");
          return;
        }

        setUser(result.data);
      } catch (error) {
        console.error("Customer dashboard error:", error);
        router.replace("/login?redirect=/customer");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080D19] flex items-center justify-center text-lime-300">
        Loading Dashboard...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#080D19] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-lime-300 text-xl font-bold">
          fixmate.
        </Link>

        <section className="mt-12">
          <p className="text-lime-300 text-sm uppercase tracking-widest">
            Customer Dashboard
          </p>

          <h1 className="text-3xl md:text-5xl font-bold mt-3">
            Welcome, {user.name || "Customer"}!
          </h1>

          <p className="text-gray-400 mt-3">{user.email}</p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/customer/bookings"
            className="bg-[#111B2D] border border-gray-800 rounded-2xl p-8 hover:border-lime-300 transition"
          >
            <p className="text-gray-400">My Bookings</p>
            <h2 className="text-2xl font-bold mt-4">
              View Bookings →
            </h2>
            <p className="text-gray-400 mt-3">
              Track your repair requests and payment status.
            </p>
          </Link>

          <Link
            href="/services"
            className="bg-[#111B2D] border border-gray-800 rounded-2xl p-8 hover:border-lime-300 transition"
          >
            <p className="text-gray-400">Explore Services</p>
            <h2 className="text-2xl font-bold mt-4">
              Book a Repair →
            </h2>
            <p className="text-gray-400 mt-3">
              Find a technician for your device or appliance.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}