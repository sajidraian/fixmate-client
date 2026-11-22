"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import NotificationBell from "@/components/NotificationBell";

type UserRole = "customer" | "technician" | "admin";
type SessionUser = { name?: string | null; email?: string | null; image?: string | null; role?: UserRole };
const dashboardFor = (role?: string) => role === "technician" ? "/dashboard/technician" : role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  useEffect(() => { const light = localStorage.getItem("fixmate-theme") === "light"; setLightMode(light); document.documentElement.dataset.theme = light ? "light" : "dark"; }, []);
  const toggleTheme = () => { const next = !lightMode; setLightMode(next); document.documentElement.dataset.theme = next ? "light" : "dark"; localStorage.setItem("fixmate-theme", next ? "light" : "dark"); };
  const user = session?.user as SessionUser | undefined;
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = async () => { await authClient.signOut(); setProfileOpen(false); closeMenu(); router.push("/"); router.refresh(); };
  const linkClass = (href: string) => `rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/5 hover:text-[#B8F36B] ${pathname === href ? "text-[#B8F36B]" : "text-slate-300"}`;

  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080D19]/90 text-white shadow-lg shadow-black/5 backdrop-blur-xl">
    <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
      <Link href="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2 text-2xl font-black tracking-tight text-[#B8F36B]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B8F36B]/10 text-lg">⌁</span>fixmate<span className="text-white">.</span></Link>
      <div className="hidden items-center gap-1 rounded-xl border border-white/5 bg-white/[.03] p-1 md:flex"><Link className={linkClass("/")} href="/">Home</Link><Link className={linkClass("/services")} href="/services">Services</Link><Link className={linkClass("/about")} href="/about">How it works</Link></div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <button type="button" onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg transition hover:border-[#B8F36B]/50" aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"} title={lightMode ? "Dark mode" : "Light mode"}>{lightMode ? "☀️" : "🌙"}</button>
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? <span className="px-3 text-xs text-slate-400">Loading…</span> : user ? <div className="relative">
            <button type="button" onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-2 pr-3 text-left transition hover:border-[#B8F36B]/40" aria-expanded={profileOpen}>
              {user.image ? <img src={user.image} alt="" className="h-8 w-8 rounded-lg object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B8F36B] font-bold text-[#080D19]">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>}
              <span className="max-w-32"><span className="block truncate text-xs font-bold text-white">{user.name || "Account"}</span><span className="block text-[10px] capitalize text-[#B8F36B]">{user.role || "customer"}</span></span><span className="text-xs text-slate-400">⌄</span>
            </button>
            {profileOpen && <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#111B2D] p-2 shadow-2xl"><Link onClick={() => setProfileOpen(false)} href={dashboardFor(user.role)} className="block rounded-xl px-3 py-2.5 text-sm text-white hover:bg-white/5">Dashboard</Link><Link onClick={() => setProfileOpen(false)} href="/dashboard/profile" className="block rounded-xl px-3 py-2.5 text-sm text-white hover:bg-white/5">Update profile</Link><button onClick={handleLogout} className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-300 hover:bg-white/5">Sign out</button></div>}
          </div> : <><Link href="/sign-in" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 hover:text-[#B8F36B]">Sign in</Link><Link href="/sign-up" className="rounded-xl bg-[#B8F36B] px-5 py-2.5 text-sm font-extrabold text-[#080D19] transition hover:-translate-y-0.5 hover:bg-white">Get started ↗</Link></>}
        </div>
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? "✕" : "☰"}</button>
      </div>
    </nav>
    {menuOpen && <div className="border-t border-white/10 bg-[#080D19] px-5 py-4 md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-2"><Link onClick={closeMenu} className={linkClass("/")} href="/">Home</Link><Link onClick={closeMenu} className={linkClass("/services")} href="/services">Services</Link><Link onClick={closeMenu} className={linkClass("/about")} href="/about">How it works</Link><div className="my-2 border-t border-white/10" />{isPending ? <span className="px-3 py-2 text-sm text-slate-400">Loading account…</span> : user ? <><Link onClick={closeMenu} className={linkClass(dashboardFor(user.role))} href={dashboardFor(user.role)}>Dashboard</Link><Link onClick={closeMenu} className={linkClass("/dashboard/profile")} href="/dashboard/profile">Update profile</Link><button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-300">Sign out</button></> : <div className="grid grid-cols-2 gap-2"><Link onClick={closeMenu} href="/sign-in" className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-bold">Sign in</Link><Link onClick={closeMenu} href="/sign-up" className="rounded-xl bg-[#B8F36B] px-4 py-3 text-center text-sm font-extrabold text-[#080D19]">Get started</Link></div>}</div></div>}
  </header>;
}
