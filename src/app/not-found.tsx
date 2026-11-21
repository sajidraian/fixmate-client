import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080D19] px-5 text-center text-white">
      <div className="max-w-xl">
        <div className="text-7xl" aria-hidden="true">🔧</div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#B8F36B]">404 · Page Not Found</p>
        <h1 className="mt-3 text-4xl font-black">Looks like this repair route is missing.</h1>
        <p className="mt-4 text-gray-400">The page may have moved or the link may be incorrect.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-[#B8F36B] px-7 py-3 font-bold text-[#080D19]">Back to Home</Link>
      </div>
    </main>
  );
}
