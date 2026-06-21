"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await authApi.login({ email, password });
      login(data.user, data.access_token, data.refresh_token);
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-playfair text-3xl text-[#1B2B5E] font-bold text-center mb-2">
          Sign In
        </h1>
        <p className="text-gray-600 text-sm text-center mb-8">
          Welcome back to <span className="text-[#C9A84C]">Deluxe<strong>Opt</strong></span>
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-gray-700 text-xs font-medium block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2.5 min-h-[44px] rounded-[5px] outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-gray-700 text-xs font-medium">Password</label>
              <Link href="/auth/forgot-password" className="text-[#C9A84C] text-xs hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2.5 min-h-[44px] rounded-[5px] outline-none focus:border-[#C9A84C]"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-[#C9A84C] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
