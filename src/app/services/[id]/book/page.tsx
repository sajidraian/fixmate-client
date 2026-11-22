"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";

interface Service {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  technicianName: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    customerPhone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `https://fixmate-server-x1b6.onrender.com/api/services/${serviceId}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Service not found.");
        }

        setService(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load service."
        );
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await authenticatedFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          ...formData,
        }),
      });

      setSuccess("Booking request submitted successfully!");

      setTimeout(() => {
        router.push("/customer/bookings");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Booking submission failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080D19] flex items-center justify-center text-[#B8F36B]">
        Loading booking form...
      </main>
    );
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-[#080D19] flex flex-col items-center justify-center text-white px-6">
        <p className="text-red-400 mb-4">{error || "Service not found."}</p>
        <Link href="/services" className="text-[#B8F36B]">
          Back to Services
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080D19] text-white px-5 py-12">
      <div className="max-w-5xl mx-auto">
        <Link
          href={`/services/${serviceId}`}
          className="text-sm text-[#B8F36B] hover:underline"
        >
          ← Back to Service
        </Link>

        <div className="mt-8 mb-10">
          <p className="text-[#B8F36B] text-sm font-semibold tracking-widest uppercase">
            FixMate Booking
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">
            Book Your Service
          </h1>
          <p className="text-gray-400 mt-3">
            Provide your details and tell us about the problem.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">
              Booking Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full bg-[#080D19] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#B8F36B]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Service Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your complete address"
                  className="w-full bg-[#080D19] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#B8F36B]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={minDate}
                  required
                  className="w-full bg-[#080D19] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#B8F36B] [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Describe Your Problem
                </label>
                <textarea
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  required
                  minLength={20}
                  rows={5}
                  placeholder="Describe the device and the issue (at least 20 characters)..."
                  className="w-full bg-[#080D19] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#B8F36B] resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-[#B8F36B] text-sm bg-[#B8F36B]/10 p-3 rounded-lg">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#B8F36B] text-[#080D19] font-bold py-4 rounded-xl hover:bg-[#c9ff7c] transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Confirm Booking Request →"}
              </button>
            </form>
          </section>

          <aside className="bg-[#111827] border border-gray-800 rounded-2xl p-6 h-fit">
            <h2 className="text-lg font-semibold mb-5">Service Summary</h2>

            <img
              src={service.image}
              alt={service.title}
              className="w-full h-44 object-cover rounded-xl mb-5"
            />

            <p className="text-xs text-[#B8F36B] uppercase tracking-widest">
              {service.category}
            </p>

            <h3 className="text-xl font-bold mt-2">{service.title}</h3>

            <div className="border-t border-gray-700 mt-5 pt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-400">Technician</span>
                <span>{service.technicianName}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-400">Duration</span>
                <span>{service.estimatedDuration}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-400">Service Mode</span>
                <span>{service.serviceMode}</span>
              </div>

              <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                <span className="text-gray-300">Base Price</span>
                <span className="text-2xl font-bold text-[#B8F36B]">
                  ৳{service.basePrice}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-5">
              Final payment will be available after the technician completes
              your service.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}