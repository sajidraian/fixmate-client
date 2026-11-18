"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authenticatedFetch } from "@/lib/api";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  serviceArea: string;
  approvalStatus: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userResult = await authenticatedFetch("/api/users/me");

        if (userResult.data.role !== "admin") {
          router.replace("/");
          return;
        }

        const result = await authenticatedFetch(
          "/api/services/admin/pending"
        );

        setServices(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleApproval = async (
    serviceId: string,
    approvalStatus: "approved" | "rejected"
  ) => {
    try {
      await authenticatedFetch(
        `/api/services/${serviceId}/approval`,
        {
          method: "PATCH",
          body: JSON.stringify({ approvalStatus }),
        }
      );

      setServices((previous) =>
        previous.filter((service) => service._id !== serviceId)
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080D19] flex items-center justify-center text-lime-300">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080D19] text-white px-5 py-10">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-lime-300 font-bold text-2xl">
          fixmate.
        </Link>

        <section className="mt-12">
          <p className="text-lime-300 uppercase tracking-widest text-sm">
            Administration
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Admin Dashboard
          </h1>

          <p className="text-gray-400 mt-3">
            Review and manage technician service submissions.
          </p>
        </section>

        <section className="mt-10 grid md:grid-cols-3 gap-5">
          <div className="bg-[#111B2D] border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">Pending Services</p>
            <h2 className="text-4xl font-bold text-lime-300 mt-3">
              {services.length}
            </h2>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Pending Approvals</h2>
            <span className="text-sm text-gray-400">
              {services.length} submissions
            </span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {!error && services.length === 0 && (
            <div className="bg-[#111B2D] border border-gray-800 rounded-2xl p-10 text-center">
              <p className="text-gray-300 text-lg">
                No pending services right now.
              </p>
              <p className="text-gray-500 mt-2">
                New technician submissions will appear here.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-[#111B2D] border border-gray-800 rounded-2xl overflow-hidden"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-6">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-lime-300 text-sm">
                      {service.category}
                    </span>

                    <span className="text-xs bg-yellow-400/10 text-yellow-300 px-3 py-1 rounded-full">
                      Pending
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mt-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 mt-3 text-sm leading-6">
                    {service.description}
                  </p>

                  <div className="border-t border-gray-800 mt-5 pt-5 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Technician:</span>{" "}
                      {service.technicianName}
                    </p>

                    <p>
                      <span className="text-gray-500">Email:</span>{" "}
                      {service.technicianEmail}
                    </p>

                    <p>
                      <span className="text-gray-500">Area:</span>{" "}
                      {service.serviceArea}
                    </p>

                    <p className="text-lime-300 font-bold text-lg">
                      ৳{service.basePrice}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() =>
                        handleApproval(service._id, "approved")
                      }
                      className="flex-1 bg-lime-300 text-[#080D19] font-bold py-3 rounded-xl hover:bg-lime-200 transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleApproval(service._id, "rejected")
                      }
                      className="flex-1 border border-red-400 text-red-400 font-bold py-3 rounded-xl hover:bg-red-400/10 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}