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
const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredBookings = statusFilter === "all" ? bookings : bookings.filter((booking) => booking.status === statusFilter);
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
const handleStatusUpdate = async (
  bookingId: string,
  status: string
) => {
  let finalAmount: number | undefined;

  if (status === "completed") {
    const amount = prompt("Enter the final repair amount (BDT):");

    if (amount === null) return;

    finalAmount = Number(amount);

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }
  }

  try {
    setUpdatingId(bookingId);

    const body: { status: string; finalAmount?: number } = { status };

    if (finalAmount !== undefined) {
      body.finalAmount = finalAmount;
    }

    await authenticatedFetch(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    setBookings((previous) =>
      previous.map((booking) =>
        booking._id === bookingId
          ? {
              ...booking,
              status,
              ...(finalAmount !== undefined ? { finalAmount } : {}),
            }
          : booking
      )
    );

    alert("Booking status updated successfully!");
  } catch (err) {
    alert(
      err instanceof Error ? err.message : "Failed to update booking."
    );
  } finally {
    setUpdatingId(null);
  }
};
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
          <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111827] p-4">
            <div><p className="font-semibold">Filter requests</p><p className="mt-1 text-sm text-gray-400">{filteredBookings.length} of {bookings.length} bookings</p></div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter bookings by status" className="rounded-xl border border-white/10 bg-[#080D19] px-4 py-3 text-white">
              <option value="all">All statuses</option><option value="requested">Requested</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option><option value="in-progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
          </div>
          {filteredBookings.length === 0 ? <div className="rounded-2xl border border-white/10 bg-[#111827] p-10 text-center text-gray-400">No bookings match this status.</div> : <div className="space-y-6">
            {filteredBookings.map((booking) => (
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
                <div className="mt-6 flex flex-wrap gap-3">
  {booking.status === "requested" && (
    <>
      <button
        onClick={() => handleStatusUpdate(booking._id, "accepted")}
        disabled={updatingId === booking._id}
        className="rounded-xl bg-[#B8F36B] px-5 py-3 font-bold text-[#080D19] transition hover:bg-white disabled:opacity-50"
      >
        Accept Booking
      </button>

      <button
        onClick={() => handleStatusUpdate(booking._id, "rejected")}
        disabled={updatingId === booking._id}
        className="rounded-xl border border-red-400 px-5 py-3 font-bold text-red-400 transition hover:bg-red-400 hover:text-white disabled:opacity-50"
      >
        Reject Booking
      </button>
    </>
  )}

  {booking.status === "accepted" && (
    <button
      onClick={() => handleStatusUpdate(booking._id, "in-progress")}
      disabled={updatingId === booking._id}
      className="rounded-xl bg-blue-500 px-5 py-3 font-bold text-white transition hover:bg-blue-400 disabled:opacity-50"
    >
      Start Repair
    </button>
  )}

  {booking.status === "in-progress" && (
    <button
      onClick={() => handleStatusUpdate(booking._id, "completed")}
      disabled={updatingId === booking._id}
      className="rounded-xl bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-400 disabled:opacity-50"
    >
      Complete Repair
    </button>
  )}

  {updatingId === booking._id && (
    <span className="self-center text-sm text-gray-400">
      Updating...
    </span>
  )}
</div>
              </article>
            ))}
          </div>}
          </>
        )}
      </div>
    </main>
  );
}