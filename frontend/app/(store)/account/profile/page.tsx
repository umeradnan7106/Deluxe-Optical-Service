"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import Button from "@/components/ui/Button";

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

  return (
    <div className="max-w-lg space-y-8">
      <h2 className="text-white text-xl font-semibold">Profile Settings</h2>

      {/* Profile form */}
      <form onSubmit={handleSaveProfile} className="bg-[#1a1a1a] rounded p-5 space-y-4">
        <h3 className="text-white font-medium">Personal Information</h3>
        <div>
          <label className="text-gray-300 text-xs font-medium block mb-1">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#E8670A]" />
        </div>
        <div>
          <label className="text-gray-300 text-xs font-medium block mb-1">Email (read-only)</label>
          <input value={user?.email ?? ""} disabled className="w-full bg-[#1a1a1a] border border-[#3a3a3a] text-gray-500 text-sm px-3 py-2.5 rounded-[5px]" />
        </div>
        <div>
          <label className="text-gray-300 text-xs font-medium block mb-1">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#E8670A]" />
        </div>
        {saveMsg && <p className="text-sm text-green-400">{saveMsg}</p>}
        <Button type="submit" variant="primary" size="md" disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </form>

      {/* Change password */}
      <form onSubmit={handleChangePassword} className="bg-[#1a1a1a] rounded p-5 space-y-4">
        <h3 className="text-white font-medium">Change Password</h3>
        {["Current Password", "New Password", "Confirm New Password"].map((label, i) => {
          const vals = [currentPw, newPw, confirmPw];
          const setters = [setCurrentPw, setNewPw, setConfirmPw];
          return (
            <div key={label}>
              <label className="text-gray-300 text-xs font-medium block mb-1">{label}</label>
              <input type="password" value={vals[i]} onChange={(e) => setters[i](e.target.value)} className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm px-3 py-2.5 rounded-[5px] outline-none focus:border-[#E8670A]" />
            </div>
          );
        })}
        {pwError && <p className={`text-sm ${pwError.includes("success") ? "text-green-400" : "text-red-400"}`}>{pwError}</p>}
        <Button type="submit" variant="dark" size="md" disabled={changingPw}>
          {changingPw ? "Changing…" : "Change Password"}
        </Button>
      </form>

      {/* Logout */}
      <Button variant="outline" size="md" onClick={handleLogout} className="border-red-500 text-red-400 hover:bg-red-500/10">
        Sign Out
      </Button>
    </div>
  );
}
