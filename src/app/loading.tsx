export default function Loading() {
  return (
    <main className="min-h-[60vh] bg-[#080D19] px-5 py-16 text-white">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-8 w-56 rounded-lg bg-white/10" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-48 rounded-2xl border border-white/10 bg-[#111B2D]" />)}
        </div>
      </div>
    </main>
  );
}
