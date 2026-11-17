
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  console.log("User Profile:", session?.user);
  console.log("Profile Image:", session?.user?.image);

  return (
    <nav className="w-full border-b border-white/10 bg-[#080D19]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        <Link href="/" className="text-2xl font-bold text-[#B8F36B]">
          fixmate.
        </Link>

        <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          <Link href="/" className="hover:text-[#B8F36B]">
            Home
          </Link>

          <Link href="/services" className="hover:text-[#B8F36B]">
            Services
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isPending ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : session?.user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#B8F36B] bg-[#172235]">
                  {session.user.image ? (
                    <img
                      key={session.user.image}
                      src={session.user.image}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        console.error("Profile image failed to load")
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#B8F36B]">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {session.user.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full bg-[#B8F36B] px-5 py-2 text-sm font-semibold text-[#080D19] hover:bg-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white hover:text-[#B8F36B]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-[#B8F36B] px-5 py-2 text-sm font-semibold text-[#080D19]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
