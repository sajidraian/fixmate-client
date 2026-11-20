"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";

interface Booking {
  _id: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  finalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function TechnicianBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const result = await authenticatedFetch("/api/bookings/technician");
        setBookings(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const statusStyle: Record<string, string> = {
    requested: "bg-yellow-400/10 text-yellow-400",
    accepted: "bg-blue-400/10 text-blue-400",
    rejected: "bg-red-400/10 text-red-400",
    "in-progress": "bg-purple-400/10 text-purple-400",
    completed: "bg-green-400/10 text-green-400",
    cancelled: "bg-gray-400/10 text-gray-400",
  };

  return (
    <main className="min-h-screen bg-[#080D19] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/technician"
          className="text-sm text-[#B8F36B] hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B8F36B]">
            Technician Workspace
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            Booking <span className="text-[#B8F36B]">Requests</span>
          </h1>
          <p className="mt-3 text-gray-400">
            Manage customer requests and track your repair jobs.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">
            Loading your bookings...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center">
            <div className="text-5xl">📋</div>
            <h2 className="mt-5 text-xl font-bold">No booking requests yet</h2>
            <p className="mt-2 text-gray-400">
              New customer requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-2xl border border-white/10 bg-[#111827] p-6"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="text-sm text-[#B8F36B]">
                      {booking.category}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">
                      {booking.serviceTitle}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                      Booking ID: {booking._id}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                        statusStyle[booking.status] ||
                        "bg-gray-400/10 text-gray-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-semibold text-[#B8F36B]">
                      Customer Information
                    </h3>
                    <p className="text-gray-300">
                      Name: {booking.customerName}
                    </p>
                    <p className="mt-2 text-gray-300">
                      Email: {booking.customerEmail}
                    </p>
                    <p className="mt-2 text-gray-300">
                      Phone: {booking.customerPhone}
                    </p>
                    <p className="mt-2 text-gray-300">
                      Address: {booking.address}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-[#B8F36B]">
                      Repair Details
                    </h3>
                    <p className="text-gray-300">
                      Preferred Date:{" "}
                      {new Date(booking.preferredDate).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-gray-300">
                      Base Price: ৳{booking.basePrice}
                    </p>
                    <p className="mt-2 text-gray-300">
                      Final Amount: ৳{booking.finalAmount}
                    </p>
                    <p className="mt-2 text-gray-300">
                      Payment: {booking.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-[#080D19] p-4">
                  <h3 className="mb-2 font-semibold">Problem Description</h3>
                  <p className="text-sm leading-7 text-gray-400">
                    {booking.problemDescription}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}