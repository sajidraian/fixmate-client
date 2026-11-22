"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const PRODUCTION_API_URL = "https://fixmate-server-x1b6.onrender.com";
// Preview deployments must opt into a staging API explicitly. Never let a
// preview build silently write notifications to the production backend.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\\/$/, "") ||
  (process.env.VERCEL_ENV === "preview" ? "" : PRODUCTION_API_URL);

type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  type: "booking" | "service";
  href: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const unreadCount = items.filter((item) => !item.read).length;
  const userEmail = session?.user?.email;

  const loadNotifications = useCallback(async () => {
    if (!API_URL) {
      setItems([]);
      return;
    }
    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      setItems([]);
      return;
    }
    const response = await fetch(API_URL + "/api/notifications", {
      headers: { Authorization: "Bearer " + data.token },
      cache: "no-store",
    });
    if (!response.ok) return;
    const result = await response.json();
    setItems(Array.isArray(result.data) ? result.data : []);
  }, []);

  useEffect(() => {
    if (!userEmail) {
      setItems([]);
      return;
    }
    void loadNotifications();
  }, [userEmail, loadNotifications]);

  useEffect(() => {
    if (!userEmail || !API_URL) return;
    const controller = new AbortController();

    const connect = async () => {
      let retryDelay = 1000;
      while (!controller.signal.aborted) {
        try {
          const { data, error } = await authClient.token();
          if (error || !data?.token) throw new Error("Notification authentication unavailable");
          const response = await fetch(API_URL + "/api/notifications/stream", {
            headers: { Authorization: "Bearer " + data.token },
            signal: controller.signal,
            cache: "no-store",
          });
          if (!response.ok || !response.body) throw new Error("Notification stream unavailable");

          retryDelay = 1000;
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (!controller.signal.aborted) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let boundary = buffer.indexOf("\n\n");
            while (boundary !== -1) {
              const frame = buffer.slice(0, boundary);
              buffer = buffer.slice(boundary + 2);
              const dataLine = frame.split("\n").find((line) => line.startsWith("data: "));
              if (dataLine) {
                try {
                  const payload = JSON.parse(dataLine.slice(6));
                  const incoming = payload.notification as NotificationItem | undefined;
                  if (incoming?._id) {
                    setItems((current) => [
                      incoming,
                      ...current.filter((item) => item._id !== incoming._id),
                    ].slice(0, 100));
                  }
                } catch {
                  // Ignore malformed stream frames and keep the connection alive.
                }
              }
              boundary = buffer.indexOf("\n\n");
            }
          }
        } catch {
          if (controller.signal.aborted) break;
        }
        if (controller.signal.aborted) break;
        await new Promise((resolve) => window.setTimeout(resolve, retryDelay));
        retryDelay = Math.min(retryDelay * 2, 15000);
      }
    };

    void connect();
    return () => controller.abort();
  }, [userEmail]);

  const markRead = async (id: string) => {
    if (!API_URL) return;
    const { data, error } = await authClient.token();
    if (error || !data?.token) return;
    await fetch(API_URL + "/api/notifications/" + id + "/read", {
      method: "PATCH",
      headers: { Authorization: "Bearer " + data.token },
    });
    setItems((current) => current.map((item) => item._id === id ? { ...item, read: true } : item));
  };

  const markAllRead = async () => {
    if (!API_URL || !unreadCount) return;
    setBusy(true);
    try {
      const { data, error } = await authClient.token();
      if (error || !data?.token) return;
      const response = await fetch(API_URL + "/api/notifications/read-all", {
        method: "PATCH",
        headers: { Authorization: "Bearer " + data.token },
      });
      if (response.ok) setItems((current) => current.map((item) => ({ ...item, read: true })));
    } finally {
      setBusy(false);
    }
  };

  const openNotification = async (item: NotificationItem) => {
    if (!item.read) await markRead(item._id);
    setOpen(false);
    router.push(item.href || "/");
  };

  if (!userEmail) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={"Notifications" + (unreadCount ? ", " + unreadCount + " unread" : "")}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg transition hover:border-[#B8F36B]/50"
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B8F36B] px-1 text-[10px] font-black text-[#080D19]">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="absolute right-0 z-[70] mt-3 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-white/10 bg-[#111B2D] text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <h2 className="text-sm font-extrabold">Notifications</h2>
              <p className="text-xs text-slate-400">{unreadCount} unread</p>
            </div>
            <button type="button" disabled={!unreadCount || busy} onClick={markAllRead} className="text-xs font-semibold text-[#B8F36B] disabled:opacity-40">Mark all read</button>
          </div>
          <div className="max-h-[min(65vh,440px)] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">You’re all caught up.</p>
            ) : items.slice(0, 30).map((item) => (
              <button key={item._id} type="button" onClick={() => void openNotification(item)} className={"flex w-full gap-3 border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5 " + (item.read ? "opacity-70" : "bg-white/[.035]")}>
                <span className={"mt-1 h-2.5 w-2.5 shrink-0 rounded-full " + (item.read ? "bg-slate-600" : "bg-[#B8F36B]")} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-300">{item.message}</span>
                  <span className="mt-1 block text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
