
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";
import { useConfirm } from "@/components/ConfirmProvider";

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
  statusHistory?: { status: string; at: string; by?: string }[];
  review?: { rating: number; comment: string; createdAt: string };
}

export default function CustomerBookingsPage() {
  const confirm = useConfirm();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");
  const [payingId, setPayingId] = useState("");
  const [verifyingId, setVerifyingId] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { rating: number; comment: string }>>({});
  const [reviewingId, setReviewingId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async (): Promise<Booking[]> => {
    try {
      const result = await authenticatedFetch("/api/bookings/my?page=" + page + "&limit=2");
      const items: Booking[] = result.data || [];
      setBookings(items);
      setTotalPages(Math.max(1, Number(result.pagination?.totalPages) || 1));
      return items;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load bookings."
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const paymentStatus = params.get("payment");
  const bookingId = params.get("bookingId");
  const sessionId = params.get("session_id");
  let cancelled = false;
  let pollTimer: ReturnType<typeof setTimeout> | undefined;

  if (paymentStatus === "success") {
    setPaymentMessage("Payment received. Verifying directly with Stripe...");
  } else if (paymentStatus === "cancelled") {
    setPaymentMessage("Payment was cancelled. You can try again anytime.");
  }

  if (paymentStatus) {
    window.history.replaceState({}, "", window.location.pathname);
  }

  const refreshAndVerify = async (attempt = 0) => {
    if (cancelled) return;

    if (paymentStatus === "success" && sessionId && attempt === 0) {
      try {
        await authenticatedFetch("/api/payments/verify-checkout-session", {
          method: "POST",
          body: JSON.stringify({ sessionId: sessionId || undefined, bookingId }),
        });
      } catch {
        // The Stripe webhook may still confirm the payment; keep polling below.
      }
    }

    const latestBookings = await fetchBookings();
    if (cancelled || paymentStatus !== "success" || !bookingId) return;

    const paidBooking = latestBookings.find(
      (booking) => booking._id === bookingId && booking.paymentStatus === "paid"
    );

    if (paidBooking) {
      setPaymentMessage("Payment verified successfully. Your booking is now marked as paid.");
      return;
    }

    if (attempt < 14) {
      pollTimer = setTimeout(() => {
        void refreshAndVerify(attempt + 1);
      }, 2000);
    } else {
      setPaymentMessage("Payment confirmation is still pending. Refresh this page shortly; your payment will not be charged again by refreshing.");
    }
  };

  void refreshAndVerify();

  return () => {
    cancelled = true;
    if (pollTimer) clearTimeout(pollTimer);
  };
}, []);

  useEffect(() => { void fetchBookings(); }, [page]);

  const handleCancel = async (bookingId: string) => {
    const confirmed = await confirm({ title: "Cancel booking?", message: "Are you sure you want to cancel this booking? This action cannot be undone.", confirmLabel: "Cancel booking", danger: true });
    if (!confirmed) return;

    try {
      setCancellingId(bookingId);

      await authenticatedFetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking.");
    } finally {
      setCancellingId("");
    }
  };

  const handleVerifyExistingPayment = async (bookingId: string) => {
    try {
      setVerifyingId(bookingId);
      setPaymentMessage("Checking Stripe for an existing successful payment...");
      const result = await authenticatedFetch("/api/payments/verify-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      });
      await fetchBookings();
      setPaymentMessage(result.message || "Payment verified successfully.");
    } catch (err) {
      setPaymentMessage(
        err instanceof Error ? err.message : "No confirmed payment was found. You can use Pay Now if you have not paid yet."
      );
    } finally {
      setVerifyingId("");
    }
  };

  const handleReview = async (bookingId: string) => {
    const draft = reviewDrafts[bookingId] || { rating: 5, comment: "" };
    try { setReviewingId(bookingId); await authenticatedFetch(`/api/bookings/${bookingId}/review`, { method: "POST", body: JSON.stringify(draft) }); await fetchBookings(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not submit review."); }
    finally { setReviewingId(""); }
  };

  const handlePayment = async (bookingId: string) => {
    try {
      setPayingId(bookingId);
      setError("");

      const result = await authenticatedFetch(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({ bookingId }),
        }
      );

      const checkoutUrl = result.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Stripe checkout URL was not generated.");
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start payment."
      );
      setPayingId("");
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

        {paymentMessage && (
          <div className="mb-6 rounded-xl border border-[#B8F36B]/30 bg-[#B8F36B]/10 p-4 text-[#B8F36B]">
            {paymentMessage}
          </div>
        )}

        {loading && (
          <p className="text-center text-[#B8F36B] py-20">
            Loading your bookings...
          </p>
        )}

        {error && (
          <div className="bg-red-400/10 text-red-400 p-4 rounded-xl mb-6">
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
                          {new Date(
                            booking.preferredDate
                          ).toLocaleString()}
                        </span>
                      </p>

                      <p className="text-gray-400">
                        Address:{" "}
                        <span className="text-white">
                          {booking.address}
                        </span>
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

                      <div className="flex flex-wrap gap-3">
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

                        {booking.status === "completed" &&
                          booking.paymentStatus !== "paid" && (
                            <>
                              <button
                                onClick={() => handleVerifyExistingPayment(booking._id)}
                                disabled={verifyingId === booking._id || payingId === booking._id}
                                className="border border-[#B8F36B]/60 text-[#B8F36B] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#B8F36B]/10 transition disabled:opacity-50"
                              >
                                {verifyingId === booking._id ? "Checking..." : "Verify Existing Payment"}
                              </button>
                              <button
                                onClick={() => handlePayment(booking._id)}
                                disabled={payingId === booking._id || verifyingId === booking._id}
                                className="bg-[#B8F36B] text-[#080D19] px-6 py-2.5 rounded-xl font-bold hover:bg-white transition disabled:opacity-50"
                              >
                                {payingId === booking._id ? "Redirecting..." : "Pay Now →"}
                              </button>
                            </>
                          )}

                        {booking.paymentStatus === "paid" && (
                          <span className="bg-[#B8F36B]/10 text-[#B8F36B] px-5 py-2.5 rounded-xl font-semibold">
                            ✓ Payment Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-800 pt-5">
                  <h3 className="font-semibold text-[#B8F36B]">Booking Timeline</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(booking.statusHistory?.length ? booking.statusHistory : [{ status: "requested", at: booking.createdAt }]).map((entry, index) => <div key={index} className="rounded-xl border border-white/10 bg-[#080D19] px-3 py-2 text-xs"><p className="font-semibold capitalize text-white">{entry.status.replace("-", " ")}</p><p className="mt-1 text-gray-400">{new Date(entry.at).toLocaleString()}</p></div>)}
                  </div>
                </div>
                {booking.status === "completed" && booking.paymentStatus === "paid" && <div className="mt-5 border-t border-gray-800 pt-5">
                  {booking.review ? <div><h3 className="font-semibold text-[#B8F36B]">Your Review</h3><p className="mt-1 text-yellow-300">{"★".repeat(booking.review.rating)}{"☆".repeat(5-booking.review.rating)}</p><p className="mt-1 text-sm text-gray-300">{booking.review.comment || "No written comment."}</p></div> : <div><h3 className="font-semibold text-[#B8F36B]">Rate this repair</h3><div className="mt-3 flex flex-wrap items-center gap-3"><select aria-label="Rating" value={reviewDrafts[booking._id]?.rating ?? 5} onChange={event=>setReviewDrafts(current=>({...current,[booking._id]:{rating:Number(event.target.value),comment:current[booking._id]?.comment||""}}))} className="rounded-lg border border-white/10 bg-[#080D19] p-2 text-white">{[5,4,3,2,1].map(value=><option key={value} value={value}>{value} / 5 stars</option>)}</select><input value={reviewDrafts[booking._id]?.comment||""} onChange={event=>setReviewDrafts(current=>({...current,[booking._id]:{rating:current[booking._id]?.rating??5,comment:event.target.value}}))} maxLength={1000} placeholder="Share your experience (optional)" className="min-w-[220px] flex-1 rounded-lg border border-white/10 bg-[#080D19] px-3 py-2 text-sm text-white"/><button onClick={()=>void handleReview(booking._id)} disabled={reviewingId===booking._id} className="rounded-lg bg-[#B8F36B] px-4 py-2 text-sm font-bold text-[#080D19] disabled:opacity-50">{reviewingId===booking._id?"Submitting...":"Submit Review"}</button></div></div>}
                  <div className="mt-4"><Link href={"/customer/invoices/"+booking._id} className="inline-block rounded-xl border border-[#B8F36B]/50 px-4 py-2 text-sm font-semibold text-[#B8F36B]">View / Print Invoice</Link></div>
                </div>}
              </article>
            ))}
          </div>
        )}
        {!loading && totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-4"><button onClick={()=>setPage(value=>Math.max(1,value-1))} disabled={page===1} className="rounded-xl border border-white/15 px-4 py-2 disabled:opacity-40">Previous</button><span className="text-sm text-gray-400">Page {page} of {totalPages}</span><button onClick={()=>setPage(value=>Math.min(totalPages,value+1))} disabled={page===totalPages} className="rounded-xl border border-white/15 px-4 py-2 disabled:opacity-40">Next</button></div>}
      </div>
    </main>
  );
}
