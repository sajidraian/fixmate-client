"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; message: string; kind: ToastKind };
const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const notify = useCallback((message: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, message, kind }]);
  }, []);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string; kind?: ToastKind }>).detail;
      if (detail?.message) notify(detail.message, detail.kind || "success");
    };
    window.addEventListener("fixmate:toast", handleToast);
    return () => window.removeEventListener("fixmate:toast", handleToast);
  }, [notify]);

  useEffect(() => {
    if (!items.length) return;
    const timers = items.map((item) =>
      window.setTimeout(() => setItems((current) => current.filter((toast) => toast.id !== item.id)), 3800)
    );
    return () => timers.forEach(window.clearTimeout);
  }, [items]);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed right-4 top-5 z-[100] flex w-[min(92vw,380px)] flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} role={item.kind === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 fade-in duration-200 ${
              item.kind === "success" ? "border-lime-300/30 bg-[#111B2D]/95 text-lime-200" :
              item.kind === "error" ? "border-red-400/30 bg-[#211522]/95 text-red-200" :
              "border-sky-300/30 bg-[#111B2D]/95 text-sky-200"
            }`}>
            <span className="mt-0.5 text-lg">{item.kind === "success" ? "✓" : item.kind === "error" ? "!" : "i"}</span>
            <p className="flex-1 text-sm leading-6">{item.message}</p>
            <button aria-label="Dismiss notification" onClick={() => setItems((current) => current.filter((toast) => toast.id !== item.id))} className="text-current/60 hover:text-current">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
