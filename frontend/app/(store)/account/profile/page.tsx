"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi, ordersApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import Button from "@/components/ui/Button";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function passwordStrength(pw: string): { label: string; color: string; pct: number } {
  if (!pw) return { label: "", color: "bg-gray-200", pct: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", color: "bg-red-400", pct: 25 };
  if (score <= 2) return { label: "Fair", color: "bg-yellow-400", pct: 50 };
  if (score <= 3) return { label: "Good", color: "bg-blue-400", pct: 75 };
  return { label: "Strong", color: "bg-green-400", pct: 100 };
}

const inputCls = "w-full bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#C9A84C] transition-colors";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();

  const [name, setName] = useState(user?.full_name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    ordersApi.myOrders().then(({ data }) => {
      const orders = data as Order[];
      setTotalOrders(orders.length);
      setTotalSpent(orders.reduce((sum, o) => sum + (o.total ?? 0), 0));
    }).catch(() => {});
  }, []);

  const strength = passwordStrength(newPw);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile({ full_name: name, phone });
      setUser(data);
      setSaveMsg("Profile updated successfully");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }
    if (newPw.length < 6) { setPwError("Password must be at least 6 characters"); return; }
    setChangingPw(true);
    setPwError("");
    try {
      await authApi.changePassword({ current_password: currentPw, new_password: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwError("Password changed successfully");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setPwError(msg || "Failed to change password");
    } finally {
      setChangingPw(false);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  const initials = user ? getInitials(user.full_name) : "?";

  return (
    <div className="max-w-lg space-y-5">
      {/* Header with avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xl">{initials}</span>
        </div>
        <div>
          <h2 className="text-gray-900 text-xl font-semibold">{user?.full_name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Card 1: Personal Info */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-gray-200 shadow-sm rounded p-5 space-y-4">
        <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wide">Personal Information</h3>
        <div>
          <label className="text-gray-600 text-xs font-medium block mb-1">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-gray-600 text-xs font-medium block mb-1">Email (read-only)</label>
          <input value={user?.email ?? ""} disabled className="w-full bg-gray-50 border border-gray-200 text-gray-400 text-sm px-3 py-2.5 rounded-[5px]" />
        </div>
        <div>
          <label className="text-gray-600 text-xs font-medium block mb-1">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className={inputCls} />
        </div>
        {saveMsg && (
          <p className={`text-sm ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>{saveMsg}</p>
        )}
        <Button type="submit" variant="primary" size="md" disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </form>

      {/* Card 2: Change Password */}
      <form onSubmit={handleChangePassword} className="bg-white border border-gray-200 shadow-sm rounded p-5 space-y-4">
        <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wide">Change Password</h3>
        <div>
          <label className="text-gray-600 text-xs font-medium block mb-1">Current Password</label>
          <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-gray-600 text-xs font-medium block mb-1">New Password</label>
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className={inputCls} />
          {newPw && (
            <div className="mt-1.5">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: `${strength.pct}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{strength.label}</p>
            </div>
          )}
        </div>
        <div>
          <label className="text-gray-600 text-xs font-medium block mb-1">Confirm New Password</label>
          <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={inputCls} />
        </div>
        {pwError && (
          <p className={`text-sm ${pwError.includes("success") ? "text-green-600" : "text-red-500"}`}>{pwError}</p>
        )}
        <Button type="submit" variant="dark" size="md" disabled={changingPw}>
          {changingPw ? "Changing…" : "Change Password"}
        </Button>
      </form>

      {/* Card 3: Account Activity */}
      <div className="bg-white border border-gray-200 shadow-sm rounded p-5">
        <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wide mb-4">Account Activity</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Orders", value: totalOrders },
            { label: "Total Spent", value: formatPrice(totalSpent) },
            { label: "Member Since", value: user?.created_at ? formatDate(user.created_at) : "—" },
            { label: "Last Login", value: "Current session" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded p-3">
              <p className="text-gray-500 text-xs mb-0.5">{label}</p>
              <p className="text-gray-900 font-semibold text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4: Danger Zone */}
      <div className="bg-white border border-red-100 shadow-sm rounded p-5">
        <h3 className="text-red-500 font-semibold text-sm uppercase tracking-wide mb-3">Danger Zone</h3>
        <p className="text-gray-500 text-sm mb-3">Sign out of your account on this device.</p>
        <Button variant="outline" size="md" onClick={handleLogout} className="border-red-400 text-red-400 hover:bg-red-50">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
