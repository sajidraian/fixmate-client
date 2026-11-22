"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  available: boolean;
}

const categories = [
  "All",
  "Cooling",
  "Kitchen",
  "Laundry",
  "Electronics",
  "General",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("category") || "All" : "All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "9");
        if (search.trim()) params.set("search", search.trim());
        if (category !== "All") params.set("category", category);
        if (sort !== "newest") params.set("sort", sort);
        const query = params.toString();
        const response = await fetch("https://fixmate-server-x1b6.onrender.com" + "/api/services" + (query ? "?" + query : ""));

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const result = await response.json();

        const formattedServices: Service[] = result.data.map(
          (service: any) => ({
            id: service._id,
            title: service.title,
            category: service.category,
            description: service.description,
            price: service.basePrice,
            duration: service.estimatedDuration,
            icon: "🔧",
            available: service.isAvailable,
          })
        );

        setServices(formattedServices);
        setTotalPages(Math.max(1, Number(result.pagination?.totalPages) || 1));
      } catch (err) {
        setError("Unable to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [search, category, sort, page]);

  const filteredServices = services;

  return (
    <main className="min-h-screen bg-[#080D19] text-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5 px-6 py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#B8F36B]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B8F36B]/20 bg-[#B8F36B]/10 px-4 py-2 text-xs font-semibold tracking-wider text-[#B8F36B]">
            <span className="h-2 w-2 rounded-full bg-[#B8F36B]" />
            PROFESSIONAL REPAIR SERVICES
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight md:text-6xl">
            The right fix.
            <br />
            <span className="text-[#B8F36B]">Right when you need it.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-400 md:text-lg">
            Explore reliable home appliance and device repair services.
            Find the right expert and get your everyday problems fixed.
          </p>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
            <span>✦ Verified technicians</span>
            <span>✦ Transparent pricing</span>
            <span>✦ Easy booking</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {/* Search */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#111827] p-3 shadow-xl shadow-black/10 md:flex md:items-center md:gap-4">
          <div className="flex flex-1 items-center gap-3 px-3">
            <span className="text-xl">⌕</span>

            <input
              type="text"
              placeholder="Search for a repair service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="hidden h-8 w-px bg-white/10 md:block" />

          <div className="flex items-center gap-3 px-3 py-2">
            <p className="text-xs text-gray-400">{services.length} services found</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-white/10 bg-[#080D19] px-3 py-2 text-xs text-white">
              <option value="newest">Newest</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => { setCategory(item); const params = new URLSearchParams(window.location.search); if (item === "All") params.delete("category"); else params.set("category", item); const query = params.toString(); window.history.replaceState({}, "", window.location.pathname + (query ? "?" + query : "")); }}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                category === item
                  ? "border-[#B8F36B] bg-[#B8F36B] text-[#080D19]"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-[#B8F36B]/50 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Section Heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B8F36B]">
              Find your solution
            </p>

            <h2 className="text-3xl font-bold">
              Explore our services<span className="text-[#B8F36B]">.</span>
            </h2>
          </div>

          {!loading && !error && (
            <p className="text-sm text-gray-500">
              Showing {filteredServices.length} results
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-white/10 bg-[#111827]"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
            <p className="mb-3 text-3xl">⚠️</p>
            <h3 className="text-xl font-bold text-white">
              Something went wrong
            </h3>
            <p className="mt-2 text-sm text-gray-400">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#B8F36B] px-6 py-3 text-sm font-bold text-[#080D19] transition hover:bg-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="group flex flex-col rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:border-[#B8F36B]/50 hover:bg-[#151F30] hover:shadow-xl"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#B8F36B]/20 bg-[#B8F36B]/10 text-3xl">
                    {service.icon}
                  </div>

                  <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                    Available
                  </span>
                </div>

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#B8F36B]">
                  {service.category}
                </p>

                <h3 className="mb-3 text-xl font-bold transition group-hover:text-[#B8F36B]">
                  {service.title}
                </h3>

                <p className="mb-6 min-h-12 text-sm leading-6 text-gray-400">
                  {service.description}
                </p>

                <div className="mb-6 mt-auto grid grid-cols-2 gap-3 border-y border-white/10 py-4">
                  <div>
                    <p className="text-xs text-gray-500">Starting price</p>
                    <p className="mt-1 text-lg font-bold text-[#B8F36B]">
                      ৳{service.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Estimated time</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {service.duration}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/services/${service.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[.04] px-5 py-3.5 text-sm font-bold transition hover:border-[#B8F36B] hover:bg-[#B8F36B] hover:text-[#080D19]"
                >
                  View Details
                  <span className="text-lg transition group-hover:translate-x-1">
                    ↗
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && <div className="mt-10 flex items-center justify-center gap-4"><button onClick={()=>setPage(current=>Math.max(1,current-1))} disabled={page===1} className="rounded-xl border border-white/15 px-4 py-2 disabled:opacity-40">Previous</button><span className="text-sm text-gray-400">Page {page} of {totalPages}</span><button onClick={()=>setPage(current=>Math.min(totalPages,current+1))} disabled={page===totalPages} className="rounded-xl border border-white/15 px-4 py-2 disabled:opacity-40">Next</button></div>}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#111827] px-6 py-16 text-center">
            <div className="mb-4 text-5xl">🔍</div>

            <h3 className="text-xl font-bold">No services found</h3>

            <p className="mt-2 text-sm text-gray-400">
              {services.length === 0
                ? "No approved services are available yet. Please check back later."
                : "Try another search term or choose a different category."}
            </p>

            <button
              onClick={() => {
                setSearch("");
                setPage(1);
                setCategory("All");
                setSort("newest");
                window.history.replaceState({}, "", window.location.pathname);
              }}
              className="mt-6 rounded-full bg-[#B8F36B] px-6 py-3 text-sm font-bold text-[#080D19] transition hover:bg-white"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}