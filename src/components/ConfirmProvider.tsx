"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
type Options = { title: string; message: string; confirmLabel?: string; danger?: boolean };
const ConfirmContext = createContext<(options: Options) => Promise<boolean>>(async () => false);
export function useConfirm() { return useContext(ConfirmContext); }
export default function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<(Options & { resolve: (v: boolean) => void }) | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const confirm = useCallback((options: Options) => new Promise<boolean>((resolve) => {
    resolver.current = resolve; setPending({ ...options, resolve });
  }), []);
  const close = (value: boolean) => { resolver.current?.(value); resolver.current = null; setPending(null); };
  return <ConfirmContext.Provider value={confirm}>{children}
    {pending && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) close(false); }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111B2D] p-6 text-white shadow-2xl">
        <div className="mb-5 flex items-start gap-3"><span className={"grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl " + (pending.danger ? "bg-red-400/10 text-red-300" : "bg-lime-300/10 text-lime-300")}>{pending.danger ? "!" : "?"}</span>
          <div><h2 id="confirm-title" className="text-xl font-bold">{pending.title}</h2><p className="mt-2 text-sm leading-6 text-gray-400">{pending.message}</p></div></div>
        <div className="flex gap-3"><button type="button" onClick={() => close(false)} className="flex-1 rounded-xl border border-white/15 px-4 py-3 font-semibold text-gray-300 hover:bg-white/5">Cancel</button>
          <button type="button" autoFocus onClick={() => close(true)} className={"flex-1 rounded-xl px-4 py-3 font-bold text-[#080D19] " + (pending.danger ? "bg-red-300" : "bg-[#B8F36B]")}>{pending.confirmLabel || "Confirm"}</button></div>
      </section></div>}
  </ConfirmContext.Provider>;
}