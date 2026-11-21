"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type UserRole = "customer" | "technician" | "admin";
type SessionUser = { name?: string | null; email?: string | null; image?: string | null; role?: UserRole };

const dashboardFor = (role?: string) => {
  if (role === "technician") return "/dashboard/technician";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/customer";
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = session?.user as SessionUser | undefined;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const navLink = (href: string, label: string) => (
    <Link href={href} onClick={() => setMenuOpen(false)} className={`transition hover:text-[#B8F36B] ${pathname === href ? "text-[#B8F36B]" : "text-gray-300"}`}>
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080D19]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black text-[#B8F36B]"><span aria-hidden="true">🔧</span> fixmate.</Link>
        <div className="hidden items-center gap-8 text-sm md:flex">
          {navLink("/", "Home")}
          {navLink("/services", "Services")}
          {navLink("/about", "How It Works")}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? <span className="text-sm text-gray-400">Loading...</span> : user ? (
            <div className="relative">
              <button type="button" onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 rounded-full border border-white/10 bg-[#111B2D] px-3 py-2 text-left" aria-expanded={profileOpen}>
                {user.image ? <img src={user.image} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B8F36B] font-bold text-[#080D19]">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>}
                <span><span className="block text-sm font-semibold text-white">{user.name}</span><span className="block text-xs capitalize text-[#B8F36B]">{user.role || "customer"}</span></span>
                <span className="text-gray-400">⌄</span>
              </button>
              {profileOpen && <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#111B2D] p-2 shadow-xl">
                <Link onClick={() => setProfileOpen(false)} href={dashboardFor(user.role)} className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5">Dashboard</Link>
                <Link onClick={() => setProfileOpen(false)} href="/dashboard/profile" className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5">Update Profile</Link>
                <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-white/5">Sign Out</button>
              </div>}
            </div>
          ) : <><Link href="/sign-in" className="text-sm text-white hover:text-[#B8F36B]">Sign In</Link><Link href="/sign-up" className="rounded-full bg-[#B8F36B] px-5 py-2.5 text-sm font-bold text-[#080D19] hover:bg-white">Sign Up</Link></>}
        </div>
        <button type="button" className="rounded-lg border border-white/15 px-3 py-2 text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? "✕" : "☰"}</button>
      </div>
      {menuOpen && <div className="border-t border-white/10 bg-[#080D19] px-5 py-5 md:hidden"><div className="flex flex-col gap-5 text-sm">
        {navLink("/", "Home")}{navLink("/services", "Services")}{navLink("/about", "How It Works")}
        {user ? <>{navLink(dashboardFor(user.role), "Dashboard")}{navLink("/dashboard/profile", "Update Profile")}<button onClick={handleLogout} className="text-left text-red-300">Sign Out</button></> : <>{navLink("/sign-in", "Sign In")}{navLink("/sign-up", "Sign Up")}</>}
      </div></div>}
    </nav>
  );
}
