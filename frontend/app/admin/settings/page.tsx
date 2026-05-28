"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [storeInfo, setStoreInfo] = useState({
    store_name: "DeluxeOpt",
    store_email: "support@deluxeopt.com",
    store_phone: "+92-300-0000000",
    store_address: "Karachi, Pakistan",
  });
  const [shipping, setShipping] = useState({
    free_shipping_threshold: 3000,
    default_shipping_fee: 200,
  });
  const [payment, setPayment] = useState({
    cod_enabled: true,
    easypaisa_enabled: true,
    jazzcash_enabled: true,
    bank_transfer_enabled: true,
    online_discount_pct: 15,
  });
  const [adminPassword, setAdminPassword] = useState({ current: "", new_password: "", confirm: "" });
  const [saved, setSaved] = useState<string | null>(null);

  function handleSave(section: string) {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  }

  const inputCls = "w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] text-sm px-3 py-2 rounded outline-none focus:border-[#E8670A]";
  const labelCls = "text-xs text-[#6b7280] font-medium block mb-1";
  const saveBtnCls = "px-4 py-2 bg-[#0F0F0F] text-white text-sm rounded hover:bg-[#1a1a1a] transition-colors";
  const savedBtnCls = "px-4 py-2 bg-green-600 text-white text-sm rounded";

  return (
    <div className="max-w-2xl">
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold mb-6">Settings</h1>

      {/* Store Info */}
      <section className="bg-white border border-[#e5e7eb] rounded-lg p-6 mb-5">
        <h2 className="text-[#1a1a1a] font-semibold mb-4">Store Information</h2>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Store Name</label>
            <input className={inputCls} value={storeInfo.store_name} onChange={(e) => setStoreInfo((s) => ({ ...s, store_name: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Support Email</label>
            <input type="email" className={inputCls} value={storeInfo.store_email} onChange={(e) => setStoreInfo((s) => ({ ...s, store_email: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={storeInfo.store_phone} onChange={(e) => setStoreInfo((s) => ({ ...s, store_phone: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input className={inputCls} value={storeInfo.store_address} onChange={(e) => setStoreInfo((s) => ({ ...s, store_address: e.target.value }))} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={() => handleSave("store")} className={saved === "store" ? savedBtnCls : saveBtnCls}>
            {saved === "store" ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Shipping */}
      <section className="bg-white border border-[#e5e7eb] rounded-lg p-6 mb-5">
        <h2 className="text-[#1a1a1a] font-semibold mb-4">Shipping</h2>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Free Shipping Threshold (Rs.)</label>
            <input
              type="number"
              className={inputCls}
              value={shipping.free_shipping_threshold}
              onChange={(e) => setShipping((s) => ({ ...s, free_shipping_threshold: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className={labelCls}>Default Shipping Fee (Rs.)</label>
            <input
              type="number"
              className={inputCls}
              value={shipping.default_shipping_fee}
              onChange={(e) => setShipping((s) => ({ ...s, default_shipping_fee: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={() => handleSave("shipping")} className={saved === "shipping" ? savedBtnCls : saveBtnCls}>
            {saved === "shipping" ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-white border border-[#e5e7eb] rounded-lg p-6 mb-5">
        <h2 className="text-[#1a1a1a] font-semibold mb-4">Payment Methods</h2>
        <div className="space-y-3">
          {([
            { key: "cod_enabled" as const, label: "Cash on Delivery" },
            { key: "easypaisa_enabled" as const, label: "EasyPaisa" },
            { key: "jazzcash_enabled" as const, label: "JazzCash" },
            { key: "bank_transfer_enabled" as const, label: "Bank Transfer" },
          ] as { key: keyof typeof payment; label: string }[]).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-[#1a1a1a]">{label}</span>
              <button
                onClick={() => setPayment((p) => ({ ...p, [key]: !p[key] }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${payment[key] ? "bg-[#E8670A]" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${payment[key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
          <div>
            <label className={labelCls}>Online Payment Discount (%)</label>
            <input
              type="number"
              min={0} max={50}
              className={inputCls}
              value={payment.online_discount_pct}
              onChange={(e) => setPayment((p) => ({ ...p, online_discount_pct: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={() => handleSave("payment")} className={saved === "payment" ? savedBtnCls : saveBtnCls}>
            {saved === "payment" ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Admin Password */}
      <section className="bg-white border border-[#e5e7eb] rounded-lg p-6 mb-5">
        <h2 className="text-[#1a1a1a] font-semibold mb-4">Change Admin Password</h2>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Current Password</label>
            <input type="password" className={inputCls} value={adminPassword.current} onChange={(e) => setAdminPassword((p) => ({ ...p, current: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input type="password" className={inputCls} value={adminPassword.new_password} onChange={(e) => setAdminPassword((p) => ({ ...p, new_password: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input type="password" className={inputCls} value={adminPassword.confirm} onChange={(e) => setAdminPassword((p) => ({ ...p, confirm: e.target.value }))} />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={() => handleSave("password")} className={saved === "password" ? savedBtnCls : saveBtnCls}>
            {saved === "password" ? "Saved!" : "Update Password"}
          </button>
        </div>
      </section>
    </div>
  );
}
