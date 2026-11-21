"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";
import { useConfirm } from "@/components/ConfirmProvider";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  approvalStatus: string;
  isAvailable: boolean;
}

const emptyForm = {
  title: "", category: "", description: "", image: "", basePrice: "",
  estimatedDuration: "", serviceMode: "Home Visit", serviceArea: "", technicianName: "",
};

export default function ManageTechnicianServicesPage() {
  const confirm = useConfirm();
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const result = await authenticatedFetch("/api/services/technician/mine");
      setServices(result.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const edit = (service: Service) => {
    setEditingId(service._id);
    setForm({
      title: service.title,
      category: service.category,
      description: service.description,
      image: service.image,
      basePrice: String(service.basePrice),
      estimatedDuration: service.estimatedDuration,
      serviceMode: service.serviceMode,
      serviceArea: service.serviceArea,
      technicianName: service.technicianName,
    });
    setMessage("Editing service. Saving changes sends it for admin approval again.");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await authenticatedFetch("/api/services/" + editingId, {
        method: "PUT",
        body: JSON.stringify({ ...form, basePrice: Number(form.basePrice) }),
      });
      setMessage("Service updated and sent for admin approval.");
      setEditingId("");
      setForm(emptyForm);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (service: Service) => {
    setTogglingId(service._id);
    setError("");
    setMessage("");
    try {
      await authenticatedFetch(`/api/services/${service._id}/availability`, { method: "PATCH", body: JSON.stringify({ isAvailable: !service.isAvailable }) });
      setServices(old => old.map(item => item._id === service._id ? { ...item, isAvailable: !service.isAvailable } : item));
      setMessage(service.isAvailable ? "Service hidden from public listings." : "Service is now visible in public listings.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update availability.");
    } finally {
      setTogglingId(null);
    }
  };

  const remove = async (id: string) => {
    const accepted = await confirm({ title: "Delete service?", message: "This service listing will be permanently deleted. Continue?", confirmLabel: "Delete service", danger: true });
    if (!accepted) return;
    setError("");
    setMessage("");
    try {
      await authenticatedFetch("/api/services/" + id, { method: "DELETE" });
      setMessage("Service deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  };

  const field = "w-full rounded-xl border border-gray-700 bg-[#080D19] px-4 py-3 text-white";
  return (
    <main className="min-h-screen bg-[#080D19] px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/technician" className="text-lime-300">← Dashboard</Link>
        <h1 className="mt-6 text-3xl font-bold">Manage My Services</h1>
        <p className="mt-2 text-gray-400">Edit listings or remove services you own.</p>

        {editingId && (
          <form onSubmit={save} className="mt-8 grid gap-4 rounded-2xl border border-lime-300/30 bg-[#111B2D] p-6 md:grid-cols-2">
            <h2 className="text-xl font-bold md:col-span-2">Edit service</h2>
            <input className={field} required placeholder="Title" value={form.title} onChange={e => setForm({...form,title:e.target.value})} />
            <input className={field} required placeholder="Category" value={form.category} onChange={e => setForm({...form,category:e.target.value})} />
            <input className={field} required placeholder="Image URL" value={form.image} onChange={e => setForm({...form,image:e.target.value})} />
            <input className={field} required type="number" min="1" placeholder="Base price (BDT)" value={form.basePrice} onChange={e => setForm({...form,basePrice:e.target.value})} />
            <input className={field} required placeholder="Estimated duration" value={form.estimatedDuration} onChange={e => setForm({...form,estimatedDuration:e.target.value})} />
            <select className={field} value={form.serviceMode} onChange={e => setForm({...form,serviceMode:e.target.value})}><option>Home Visit</option><option>Shop Drop-off</option></select>
            <input className={field} required placeholder="Service area" value={form.serviceArea} onChange={e => setForm({...form,serviceArea:e.target.value})} />
            <input className={field} required placeholder="Technician name" value={form.technicianName} onChange={e => setForm({...form,technicianName:e.target.value})} />
            <textarea className={field + " md:col-span-2"} required rows={4} placeholder="Description" value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
            <div className="flex gap-3 md:col-span-2">
              <button disabled={saving} className="rounded-xl bg-lime-300 px-6 py-3 font-bold text-[#080D19]">{saving ? "Saving..." : "Save changes"}</button>
              <button type="button" onClick={() => {setEditingId("");setForm(emptyForm);}} className="rounded-xl border border-gray-600 px-6 py-3">Cancel</button>
            </div>
          </form>
        )}

        {message && <p className="mt-5 rounded-xl bg-lime-300/10 p-3 text-lime-300">{message}</p>}
        {error && <p className="mt-5 rounded-xl bg-red-400/10 p-3 text-red-300">{error}</p>}
        {loading ? <p className="mt-8 text-lime-300">Loading services...</p> : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {services.map(service => (
              <article key={service._id} className="overflow-hidden rounded-2xl border border-gray-800 bg-[#111B2D]">
                <img src={service.image} alt={service.title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <div className="flex justify-between gap-3"><h2 className="font-bold">{service.title}</h2><span className="text-xs capitalize text-yellow-300">{service.approvalStatus} · {service.isAvailable ? "Available" : "Hidden"}</span></div>
                  <p className="mt-2 text-sm text-gray-400">{service.category} · ৳{service.basePrice}</p>
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => edit(service)} className="flex-1 rounded-lg bg-lime-300 py-2 font-bold text-[#080D19]">Edit</button>
                    <button onClick={() => toggleAvailability(service)} disabled={togglingId === service._id} className="flex-1 rounded-lg border border-sky-400 py-2 text-sky-300 disabled:cursor-not-allowed disabled:opacity-50">{togglingId === service._id ? "Updating..." : service.isAvailable ? "Hide" : "Make Available"}</button>
                    <button onClick={() => remove(service._id)} className="flex-1 rounded-lg border border-red-400 py-2 text-red-300">Delete</button>
                  </div>
                </div>
              </article>
            ))}
            {!services.length && <p className="text-gray-400">No services submitted yet.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
