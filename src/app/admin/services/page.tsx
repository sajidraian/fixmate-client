"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch } from "@/lib/api";

type Service = {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: string;
  serviceArea: string;
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async (selectedStatus = status) => {
    setLoading(true);
    try {
      const result = await authenticatedFetch(
        `/api/admin/services${selectedStatus === "all" ? "" : `?status=${selectedStatus}`}`
      );
      setItems(result.data || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(status);
  }, [status]);

  const moderate = async (service: Service, approvalStatus: "approved" | "rejected") => {
    const action = approvalStatus === "approved" ? "approve" : "reject";
    if (!window.confirm(`Are you sure you want to ${action} "${service.title}"?`)) return;
    setBusyId(service._id);
    setError("");
    setMessage("");
    try {
      await authenticatedFetch(`/api/services/${service._id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      });
      setMessage(`"${service.title}" was ${approvalStatus}.`);
      await load(status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update service approval.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#080D19] px-5 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <a href="/dashboard/admin" className="text-[#B8F36B]">← Admin Dashboard</a>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">Service Moderation</h1>
            <p className="mt-2 text-gray-400">Approve or reject technician listings.</p>
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-white/10 bg-[#111B2D] px-4 py-3">
            <option value="pending">Pending first</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All statuses</option>
          </select>
        </div>
        {message && <p role="status" className="mt-5 rounded-xl bg-lime-300/10 p-3 text-lime-300">{message}</p>}
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-400/10 p-3 text-red-300">{error}</p>}
        {loading ? <p className="mt-8 text-gray-400">Loading services…</p> : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((service) => (
              <article key={service._id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#111B2D]">
                <img src={service.image} alt={service.title} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="text-[#B8F36B]">{service.category}</span>
                    <span className="capitalize text-gray-400">{service.approvalStatus}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{service.title}</h2>
                  <p className="mt-2 text-sm text-gray-400">{service.technicianName} · {service.technicianEmail}</p>
                  <p className="mt-1 text-sm text-gray-400">{service.serviceArea}</p>
                  <p className="mt-3 font-bold text-[#B8F36B]">৳{service.basePrice}</p>
                  {service.approvalStatus === "pending" && (
                    <div className="mt-5 flex gap-3">
                      <button disabled={busyId === service._id} onClick={() => moderate(service, "approved")} className="flex-1 rounded-lg bg-[#B8F36B] py-2 font-bold text-[#080D19] disabled:opacity-50">
                        {busyId === service._id ? "Updating…" : "Approve"}
                      </button>
                      <button disabled={busyId === service._id} onClick={() => moderate(service, "rejected")} className="flex-1 rounded-lg border border-red-400 py-2 text-red-300 disabled:opacity-50">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        {!loading && !items.length && <p className="mt-10 rounded-2xl bg-[#111B2D] p-10 text-center text-gray-400">No services in this filter.</p>}
      </div>
    </main>
  );
}
