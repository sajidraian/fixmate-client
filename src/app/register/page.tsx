"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    area: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    const responseText = await response.text();


const result = responseText ? JSON.parse(responseText) : {};

if (!response.ok) {
  setError(
    result.message ||
    result.error?.message ||
    `Registration failed. Status: ${response.status}`
  );
  return;
}

      router.push("/sign-in");
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Check the browser console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080D19] px-5 py-12 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-2xl md:grid-cols-2">

        {/* Left Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#B8F36B] p-12 text-[#080D19] md:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-black/5" />

          <Link href="/" className="relative text-3xl font-black">
            fixmate.
          </Link>

          <div className="relative">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em]">
              Welcome to FixMate
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Better repairs.
              <br />
              Less stress.
            </h1>

            <p className="mt-6 max-w-sm leading-7 opacity-70">
              Join our platform and connect with trusted repair
              professionals for your everyday needs.
            </p>
          </div>

          <p className="relative text-xs font-semibold opacity-60">
            YOUR SMART REPAIR PARTNER.
          </p>
        </div>

        {/* Registration Form */}
        <div className="p-7 md:p-12">
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-[#B8F36B]"
          >
            ← Back to Home
          </Link>

          <div className="mb-8 mt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8F36B]">
              Create your account
            </p>

            <h2 className="text-3xl font-black">
              Join FixMate<span className="text-[#B8F36B]">.</span>
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              Enter your details to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/10 bg-[#080D19] px-4 py-3.5 text-sm outline-none transition focus:border-[#B8F36B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-[#080D19] px-4 py-3.5 text-sm outline-none transition focus:border-[#B8F36B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-white/10 bg-[#080D19] px-4 py-3.5 text-sm outline-none transition focus:border-[#B8F36B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full rounded-xl border border-white/10 bg-[#080D19] px-4 py-3.5 text-sm outline-none transition focus:border-[#B8F36B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Your Area
              </label>

              <input
                type="text"
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                placeholder="Your city or area"
                className="w-full rounded-xl border border-white/10 bg-[#080D19] px-4 py-3.5 text-sm outline-none transition focus:border-[#B8F36B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Register As
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#080D19] px-4 py-3.5 text-sm text-white outline-none focus:border-[#B8F36B]"
              >
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#B8F36B] py-4 font-bold text-[#080D19] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

          </form>

          <p className="mt-7 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#B8F36B] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}