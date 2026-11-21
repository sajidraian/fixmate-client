"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#080D19] px-5 text-center text-white">
      <div className="max-w-lg">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-black">We couldn't load this page.</h1>
        <p className="mt-3 text-gray-400">Please try again. Your account and repair data have not been intentionally changed.</p>
        <button onClick={() => reset()} className="mt-7 rounded-full bg-[#B8F36B] px-7 py-3 font-bold text-[#080D19]">Try Again</button>
      </div>
    </main>
  );
}
