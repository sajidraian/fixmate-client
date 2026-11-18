"use client";

import { useState } from "react";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";

export default function AddServicePage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Electronics",
    description: "",
    image: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "Home Visit",
    serviceArea: "",
    technicianName: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await authenticatedFetch("/api/services", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          basePrice: Number(formData.basePrice),
        }),
      });

      setMessage(result.message);

      setFormData({
        title: "",
        category: "Electronics",
        description: "",
        image: "",
        basePrice: "",
        estimatedDuration: "",
        serviceMode: "Home Visit",
        serviceArea: "",
        technicianName: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl bg-[#080D19] border border-gray-700 px-4 py-3 text-white outline-none focus:border-lime-300";

  return (
    <main className="min-h-screen bg-[#080D19] text-white px-5 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/technician"
          className="text-lime-300 hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-10 mb-8">
          <p className="text-lime-300 uppercase tracking-widest text-sm">
            Technician Workspace
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Add New Service
          </h1>

          <p className="text-gray-400 mt-3">
            Submit your repair service for admin approval.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111B2D] border border-gray-800 rounded-3xl p-6 md:p-9 space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm">Service Title</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AC Repair"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Electronics</option>
              <option>Cooling</option>
              <option>Kitchen</option>
              <option>Laundry</option>
              <option>General</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Description</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your repair service..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Image URL</label>
            <input
              required
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-sm">
                Base Price (BDT)
              </label>
              <input
                required
                type="number"
                min="1"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="1500"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Estimated Duration
              </label>
              <input
                required
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                placeholder="1-2 hours"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Service Mode</label>
            <select
              name="serviceMode"
              value={formData.serviceMode}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Home Visit</option>
              <option>Shop Drop-off</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm">Service Area</label>
            <input
              required
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              placeholder="e.g. Barishal"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Technician Name</label>
            <input
              required
              name="technicianName"
              value={formData.technicianName}
              onChange={handleChange}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          {message && (
            <p className="text-lime-300 bg-lime-300/10 p-3 rounded-xl">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-400 bg-red-400/10 p-3 rounded-xl">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-lime-300 text-[#080D19] font-bold py-4 rounded-xl hover:bg-lime-200 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Service for Approval"}
          </button>
        </form>
      </div>
    </main>
  );
}