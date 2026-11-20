"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  technicianEmail: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Service not found");
        }

        setService(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load service details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080D19] text-white">
        <p className="animate-pulse text-lg text-[#B8F36B]">
          Loading service details...
        </p>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080D19] px-6 text-white">
        <div className="max-w-md text-center">
          <div className="mb-5 text-5xl">🔍</div>

          <h1 className="text-3xl font-bold">
            Service not found
          </h1>

          <p className="mt-3 text-gray-400">
            {error || "This service is unavailable or may have been removed."}
          </p>

          <Link
            href="/services"
            className="mt-7 inline-block rounded-full bg-[#B8F36B] px-7 py-3 font-bold text-[#080D19] transition hover:bg-white"
          >
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080D19] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black">
            fixmate<span className="text-[#B8F36B]">.</span>
          </Link>

          <Link
            href="/services"
            className="text-sm text-gray-300 transition hover:text-[#B8F36B]"
          >
            ← All Services
          </Link>
        </div>
      </nav>

      {/* Service Details */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <div className="mb-6 inline-flex rounded-full border border-[#B8F36B]/20 bg-[#B8F36B]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#B8F36B]">
              {service.category}
            </div>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              {service.title}
              <span className="text-[#B8F36B]">.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-400">
              {service.description}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
                <p className="text-sm text-gray-500">
                  Starting Price
                </p>

                <p className="mt-2 text-2xl font-black text-[#B8F36B]">
                  ৳{service.basePrice}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
                <p className="text-sm text-gray-500">
                  Estimated Duration
                </p>

                <p className="mt-2 text-xl font-bold">
                  {service.estimatedDuration}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
                <p className="text-sm text-gray-500">
                  Service Mode
                </p>

                <p className="mt-2 font-bold">
                  {service.serviceMode}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
                <p className="text-sm text-gray-500">
                  Service Area
                </p>

                <p className="mt-2 font-bold">
                  {service.serviceArea}
                </p>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="h-fit rounded-3xl border border-white/10 bg-[#111827] p-7 md:p-9">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B8F36B]/10 text-4xl">
              🔧
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8F36B]">
              Your Repair Expert
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              {service.technicianName}
            </h2>

            <p className="mt-2 break-all text-sm text-gray-400">
              {service.technicianEmail}
            </p>

            <div className="my-8 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Service Starting Price
              </span>

              <span className="text-2xl font-black text-[#B8F36B]">
                ৳{service.basePrice}
              </span>
            </div>

          <Link
  href={`/login?redirect=/services/${service._id}/book`}
  className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#B8F36B] px-6 py-4 font-bold text-[#080D19] transition hover:bg-white"
>
  Book This Service →
</Link>
            <p className="mt-4 text-center text-xs leading-6 text-gray-500">
              Sign in to request this repair service.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} FixMate. Making repairs easier.
      </footer>
    </main>
  );
}