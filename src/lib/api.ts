import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please login to continue.");
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
    throw new Error(result.message || "API request failed.");
  }

  return result;
};