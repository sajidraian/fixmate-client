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
  technicianName: string;
  preferredDate: string;
  address: string;
  problemDescription: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const fetchBookings = async () => {
    try {
      const result = await authenticatedFetch("/api/bookings/my");
      setBookings(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);

      await authenticatedFetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      await fetchBookings();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to cancel booking."
      );
    } finally {
      setCancellingId("");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-[#B8F36B] bg-[#B8F36B]/10";
      case "rejected":
      case "cancelled":
        return "text-red-400 bg-red-400/10";
      case "in-progress":
        return "text-blue-400 bg-blue-400/10";
      case "accepted":
        return "text-purple-400 bg-purple-400/10";
      default:
        return "text-yellow-400 bg-yellow-400/10";
    }
  };

  return (
    <main className="min-h-screen bg-[#080D19] text-white px-5 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <p className="text-[#B8F36B] text-sm font-semibold tracking-widest uppercase">
              Customer Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mt-3">
              My Bookings
            </h1>
            <p className="text-gray-400 mt-2">
              Track and manage your repair service requests.
            </p>
          </div>

          <Link
            href="/services"
            className="bg-[#B8F36B] text-[#080D19] px-6 py-3 rounded-xl font-bold text-center hover:bg-white transition"
          >
            + Book Another Service
          </Link>
        </div>

        {loading && (
          <p className="text-center text-[#B8F36B] py-20">
            Loading your bookings...
          </p>
        )}

        {error && (
          <div className="bg-red-400/10 text-red-400 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center bg-[#111827] border border-gray-800 rounded-2xl p-12">
            <div className="text-5xl mb-5">🔧</div>
            <h2 className="text-2xl font-bold">No bookings yet</h2>
            <p className="text-gray-400 mt-3">
              Find a service and book your first repair.
            </p>
            <Link
              href="/services"
              className="inline-block mt-6 bg-[#B8F36B] text-[#080D19] px-6 py-3 rounded-xl font-bold"
            >
              Explore Services
            </Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-5 md:p-7"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    className="w-full md:w-48 h-40 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-[#B8F36B] uppercase tracking-widest">
                        {booking.category}
                      </span>

                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${statusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold mt-3">
                      {booking.serviceTitle}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
                      <p className="text-gray-400">
                        Technician:{" "}
                        <span className="text-white">
                          {booking.technicianName}
                        </span>
                      </p>

                      <p className="text-gray-400">
                        Preferred Date:{" "}
                        <span className="text-white">
                          {new Date(booking.preferredDate).toLocaleString()}
                        </span>
                      </p>

                      <p className="text-gray-400">
                        Address:{" "}
                        <span className="text-white">{booking.address}</span>
                      </p>

                      <p className="text-gray-400">
                        Payment:{" "}
                        <span className="text-white capitalize">
                          {booking.paymentStatus}
                        </span>
                      </p>
                    </div>

                    <div className="border-t border-gray-800 mt-5 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          {booking.status === "completed"
                            ? "Final Amount"
                            : "Estimated Price"}
                        </p>
                        <p className="text-2xl font-bold text-[#B8F36B]">
                          ৳
                          {booking.status === "completed"
                            ? booking.finalAmount
                            : booking.basePrice}
                        </p>
                      </div>

                      {booking.status === "requested" && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="border border-red-400 text-red-400 px-5 py-2.5 rounded-xl hover:bg-red-400 hover:text-white transition disabled:opacity-50"
                        >
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}