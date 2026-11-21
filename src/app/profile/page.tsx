"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/api";

interface Profile {
  name: string;
  email: string;
  role: string;
  phone?: string;
  area?: string;
  bio?: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    role: "",
    phone: "",
    area: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await authenticatedFetch("/api/users/me");

        setProfile({
          name: result.data.name || "",
          email: result.data.email || "",
          role: result.data.role || "",
          phone: result.data.phone || "",
          area: result.data.area || "",
          bio: result.data.bio || "",
        });
      } catch {
        router.replace("/login?redirect=/profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const result = await authenticatedFetch("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          area: profile.area,
          bio: profile.bio,
        }),
      });

      setProfile((previous) => ({
        ...previous,
        ...result.data,
      }));

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080D19] flex items-center justify-center text-lime-300">
        Loading Profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080D19] text-white px-5 py-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-lime-300 text-2xl font-bold">
          fixmate.
        </Link>

        <div className="mt-10 mb-8">
          <p className="text-lime-300 uppercase tracking-widest text-sm">
            Account Settings
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">
            Manage Your Profile
          </h1>
          <p className="text-gray-400 mt-2">
            Keep your personal information up to date.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111B2D] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full Name
            </label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-[#080D19] border border-gray-700 px-4 py-3 outline-none focus:border-lime-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>
            <input
              value={profile.email}
              disabled
              className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Account Role
            </label>
            <input
              value={profile.role}
              disabled
              className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-gray-400 capitalize"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              placeholder="Your phone number"
              className="w-full rounded-xl bg-[#080D19] border border-gray-700 px-4 py-3 outline-none focus:border-lime-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Area / Location
            </label>
            <input
              name="area"
              value={profile.area || ""}
              onChange={handleChange}
              placeholder="Your location"
              className="w-full rounded-xl bg-[#080D19] border border-gray-700 px-4 py-3 outline-none focus:border-lime-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              About Me
            </label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Write something about yourself..."
              className="w-full rounded-xl bg-[#080D19] border border-gray-700 px-4 py-3 outline-none focus:border-lime-300"
            />
          </div>

          {message && (
            <p className="text-lime-300 text-sm">{message}</p>
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#B8F36B] px-6 py-4 font-bold text-[#080D19] hover:bg-white transition disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </form>

        <Link
          href="/"
          className="inline-block mt-6 text-gray-400 hover:text-lime-300"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}