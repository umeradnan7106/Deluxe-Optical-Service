"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await authApi.register({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        phone: form.phone || undefined,
      });
      login(data.user, data.access_token, data.refresh_token);
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 text-sm text-center mb-8">
          Join <span className="text-[#E8670A]">Deluxe<strong>Opt</strong></span> to track orders and save wishlists
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm">{error}</div>
          )}

          {[
            { label: "Full Name", key: "full_name", type: "text", required: true },
            { label: "Email", key: "email", type: "email", required: true },
            { label: "Phone (optional)", key: "phone", type: "tel", required: false },
            { label: "Password", key: "password", type: "password", required: true },
            { label: "Confirm Password", key: "confirm", type: "password", required: true },
          ].map(({ label, key, type, required }) => (
            <div key={key}>
              <label className="text-gray-700 text-xs font-medium block mb-1">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={required}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2.5 min-h-[44px] rounded-[5px] outline-none focus:border-[#E8670A]"
              />
            </div>
          ))}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#E8670A] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
