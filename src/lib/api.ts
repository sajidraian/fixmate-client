import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://fixmate-server-x1b6.onrender.com";

export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const method = (options.method || "GET").toUpperCase();
  const emitToast = (message: string, kind: "success" | "error") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("fixmate:toast", { detail: { message, kind } }));
    }
  };
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    const message = "Please login to continue.";
    if (method !== "GET") emitToast(message, "error");
    throw new Error(message);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${data.token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const message = result.message || "API request failed.";
    emitToast(message, "error");
    throw new Error(message);
  }

  if (method !== "GET") {
    const message = typeof result.message === "string" && result.message.trim()
      ? result.message
      : "Your changes have been saved successfully.";
    emitToast(message, "success");
  }

  return result;
};