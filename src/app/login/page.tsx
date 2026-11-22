
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const PRODUCTION_ORIGIN = "https://fixmate-client-psi.vercel.app";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const getRedirectPath = () => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");

    return redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/";
  };

  // Email and Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        return;
      }

      router.push(getRedirectPath());
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth must start and finish on the same production host.
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    if (
      process.env.NODE_ENV === "production" &&
      window.location.origin !== PRODUCTION_ORIGIN
    ) {
      const canonicalLoginURL = new URL(
        window.location.pathname + window.location.search,
        PRODUCTION_ORIGIN
      );
      window.location.assign(canonicalLoginURL.toString());
      return;
    }

    try {
      const { error: authError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: new URL(getRedirectPath(), PRODUCTION_ORIGIN).toString(),
      });

      if (authError) {
        console.error("FixMate Google sign-in error:", authError);
        setError(authError.message || "Google sign-in could not be started. Check the Google OAuth configuration.");
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("FixMate Google sign-in exception:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in with Google. Please try again."
      );
      setGoogleLoading(false);
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
              Welcome Back
            </p>

            <h1 className="text-5xl font-black leading-tight">
              Your home.
              <br />
              Our expertise.
            </h1>

            <p className="mt-6 max-w-sm leading-7 opacity-70">
              Sign in to manage your repairs, track bookings and
              connect with trusted technicians.
            </p>
          </div>

          <p className="relative text-xs font-semibold opacity-60">
            YOUR SMART REPAIR PARTNER.
          </p>
        </div>

        {/* Login Form */}
        <div className="p-7 md:p-12">
          <Link
            href="/"
            className="text-sm text-gray-400 transition hover:text-[#B8F36B]"
          >
            ← Back to Home
          </Link>

          <div className="mb-9 mt-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#B8F36B]">
              Welcome Back
            </p>

            <h2 className="text-3xl font-black">
              Sign In<span className="text-[#B8F36B]">.</span>
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              Enter your account details to continue.
            </p>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#080D19] py-4 text-sm font-semibold text-white transition hover:border-[#B8F36B] hover:bg-[#172235] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {googleLoading ? (
              "Connecting to Google..."
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.02 46.98 31.84 46.98 24.55Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.54 2.56 10.78l7.97-6.19Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.88 2.3-8.18 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium text-gray-500">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-[#080D19] px-4 py-4 text-sm outline-none transition focus:border-[#B8F36B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/10 bg-[#080D19] px-4 py-4 text-sm outline-none transition focus:border-[#B8F36B]"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-xl bg-[#B8F36B] py-4 font-bold text-[#080D19] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-[#B8F36B] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
