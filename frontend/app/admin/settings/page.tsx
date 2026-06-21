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
    estimated_delivery: "3-5",
  });
  const [payment, setPayment] = useState({
    cod_enabled: true,
    easypaisa_enabled: true,
    jazzcash_enabled: true,
    bank_transfer_enabled: true,
    online_discount_pct: 15,
    easypaisa_number: "03001234567",
    jazzcash_number: "03001234567",
    bank_account: "",
  });
  const [rx, setRx] = useState({
    sph_min: "-12.00", sph_max: "+12.00",
    cyl_min: "-6.00", cyl_max: "+6.00",
    step: "0.25",
  });
  const [email, setEmail] = useState({
    api_key: "", from_email: "orders@deluxeopt.com",
    send_confirmation: true, send_status: true, send_abandoned: false,
  });
  const [cloudinary, setCloudinary] = useState({
    cloud_name: "", api_key: "", api_secret: "",
  });
  const [adminPassword, setAdminPassword] = useState({ current: "", new_password: "", confirm: "" });
  const [saved, setSaved] = useState<string | null>(null);

  function handleSave(section: string) {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  }

  const inputCls = "w-full bg-white border-[1.5px] border-[#E2E8F0] text-[#0F172A] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#1B2B5E] transition-colors";
  const labelCls = "text-[10px] font-semibold uppercase tracking-[.06em] text-[#64748b] block mb-1.5";
  const saveBtnCls = "px-4 py-2 bg-[#1B2B5E] hover:bg-[#243570] text-white text-sm font-semibold rounded-lg transition-colors";
  const savedBtnCls = "px-4 py-2 bg-[#059669] text-white text-sm font-semibold rounded-lg";
  const sectionCls = "bg-white border-[1.5px] border-[#E2E8F0] rounded-xl p-5 mb-5";

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-playfair text-2xl md:text-[26px] text-[#1B2B5E] font-bold">Settings</h1>
        <p className="text-[#64748b] text-xs mt-0.5">Manage store configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Store Info */}
        <section className={sectionCls}>
          <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Store Settings</h2>
          <div className="space-y-3">
            <div><label className={labelCls}>Store Name</label><input className={inputCls} value={storeInfo.store_name} onChange={(e) => setStoreInfo((s) => ({ ...s, store_name: e.target.value }))} /></div>
            <div><label className={labelCls}>Store Email</label><input type="email" className={inputCls} value={storeInfo.store_email} onChange={(e) => setStoreInfo((s) => ({ ...s, store_email: e.target.value }))} /></div>
            <div><label className={labelCls}>WhatsApp Number</label><input className={inputCls} value={storeInfo.store_phone} onChange={(e) => setStoreInfo((s) => ({ ...s, store_phone: e.target.value }))} /></div>
            <div><label className={labelCls}>Currency</label><input className={inputCls} value="PKR (Rs.)" readOnly /></div>
          </div>
          <button onClick={() => handleSave("store")} className={`mt-4 ${saved === "store" ? savedBtnCls : saveBtnCls}`}>
            {saved === "store" ? "Saved!" : "Save Store Settings"}
          </button>
        </section>

        {/* Shipping */}
        <section className={sectionCls}>
          <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Shipping Settings</h2>
          <div className="space-y-3">
            <div><label className={labelCls}>Free Shipping Threshold (Rs.)</label><input type="number" className={inputCls} value={shipping.free_shipping_threshold} onChange={(e) => setShipping((s) => ({ ...s, free_shipping_threshold: Number(e.target.value) }))} /></div>
            <div><label className={labelCls}>Standard Shipping Rate (Rs.)</label><input type="number" className={inputCls} value={shipping.default_shipping_fee} onChange={(e) => setShipping((s) => ({ ...s, default_shipping_fee: Number(e.target.value) }))} /></div>
            <div><label className={labelCls}>Estimated Delivery (days)</label><input className={inputCls} value={shipping.estimated_delivery} onChange={(e) => setShipping((s) => ({ ...s, estimated_delivery: e.target.value }))} placeholder="3-5" /></div>
          </div>
          <button onClick={() => handleSave("shipping")} className={`mt-4 ${saved === "shipping" ? savedBtnCls : saveBtnCls}`}>
            {saved === "shipping" ? "Saved!" : "Save Shipping"}
          </button>
        </section>

        {/* Payment Methods */}
        <section className={sectionCls}>
          <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Payment Settings</h2>
          <div className="space-y-3">
            <div><label className={labelCls}>Online Payment Discount %</label><input type="number" min={0} max={50} className={inputCls} value={payment.online_discount_pct} onChange={(e) => setPayment((p) => ({ ...p, online_discount_pct: Number(e.target.value) }))} /></div>
            <div><label className={labelCls}>EasyPaisa Account Number</label><input className={inputCls} value={payment.easypaisa_number} onChange={(e) => setPayment((p) => ({ ...p, easypaisa_number: e.target.value }))} /></div>
            <div><label className={labelCls}>JazzCash Account Number</label><input className={inputCls} value={payment.jazzcash_number} onChange={(e) => setPayment((p) => ({ ...p, jazzcash_number: e.target.value }))} /></div>
            <div><label className={labelCls}>Bank Account (for transfer)</label><textarea className={inputCls + " resize-none h-16"} value={payment.bank_account} onChange={(e) => setPayment((p) => ({ ...p, bank_account: e.target.value }))} placeholder="Bank Name · Account Holder · Account Number" /></div>
            <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
              {([{ key: "cod_enabled" as const, label: "Cash on Delivery" }, { key: "easypaisa_enabled" as const, label: "EasyPaisa" }, { key: "jazzcash_enabled" as const, label: "JazzCash" }, { key: "bank_transfer_enabled" as const, label: "Bank Transfer" }] as { key: keyof typeof payment & string; label: string }[]).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-[#0F172A]">{label}</span>
                  <button onClick={() => setPayment((p) => ({ ...p, [key]: !(p[key as keyof typeof p]) }))} className={`relative w-9 h-5 rounded-full transition-colors ${payment[key as keyof typeof payment] ? "bg-[#059669]" : "bg-[#E2E8F0]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${payment[key as keyof typeof payment] ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => handleSave("payment")} className={`mt-4 ${saved === "payment" ? savedBtnCls : saveBtnCls}`}>
            {saved === "payment" ? "Saved!" : "Save Payment"}
          </button>
        </section>

        {/* Prescription Settings */}
        <section className={sectionCls}>
          <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Prescription Settings</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>SPH Range Min</label><input className={inputCls} value={rx.sph_min} onChange={(e) => setRx((r) => ({ ...r, sph_min: e.target.value }))} /></div>
            <div><label className={labelCls}>SPH Range Max</label><input className={inputCls} value={rx.sph_max} onChange={(e) => setRx((r) => ({ ...r, sph_max: e.target.value }))} /></div>
            <div><label className={labelCls}>CYL Range Min</label><input className={inputCls} value={rx.cyl_min} onChange={(e) => setRx((r) => ({ ...r, cyl_min: e.target.value }))} /></div>
            <div><label className={labelCls}>CYL Range Max</label><input className={inputCls} value={rx.cyl_max} onChange={(e) => setRx((r) => ({ ...r, cyl_max: e.target.value }))} /></div>
            <div><label className={labelCls}>SPH/CYL Step</label><input className={inputCls} value={rx.step} onChange={(e) => setRx((r) => ({ ...r, step: e.target.value }))} /></div>
          </div>
          <button onClick={() => handleSave("rx")} className={`mt-4 ${saved === "rx" ? savedBtnCls : saveBtnCls}`}>
            {saved === "rx" ? "Saved!" : "Save Rx Settings"}
          </button>
        </section>

        {/* Email Settings */}
        <section className={sectionCls}>
          <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Email Settings (Resend)</h2>
          <div className="space-y-3">
            <div><label className={labelCls}>Resend API Key</label><input type="password" className={inputCls} value={email.api_key} onChange={(e) => setEmail((x) => ({ ...x, api_key: e.target.value }))} placeholder="re_…" /></div>
            <div><label className={labelCls}>From Email</label><input className={inputCls} value={email.from_email} onChange={(e) => setEmail((x) => ({ ...x, from_email: e.target.value }))} /></div>
            <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
              {[
                { key: "send_confirmation" as const, label: "Send order confirmation email" },
                { key: "send_status" as const, label: "Send shipping/status update email" },
                { key: "send_abandoned" as const, label: "Send abandoned cart reminder email" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={email[key]} onChange={(e) => setEmail((x) => ({ ...x, [key]: e.target.checked }))} className="accent-[#1B2B5E]" />
                  <span className="text-sm text-[#0F172A]">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={() => handleSave("email")} className={`mt-4 ${saved === "email" ? savedBtnCls : saveBtnCls}`}>
            {saved === "email" ? "Saved!" : "Save Email Settings"}
          </button>
        </section>

        {/* Cloudinary Settings */}
        <section className={sectionCls}>
          <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Cloudinary Settings</h2>
          <div className="space-y-3">
            <div><label className={labelCls}>Cloud Name</label><input className={inputCls} value={cloudinary.cloud_name} onChange={(e) => setCloudinary((c) => ({ ...c, cloud_name: e.target.value }))} placeholder="dhmkzvov4" /></div>
            <div><label className={labelCls}>API Key</label><input type="password" className={inputCls} value={cloudinary.api_key} onChange={(e) => setCloudinary((c) => ({ ...c, api_key: e.target.value }))} /></div>
            <div><label className={labelCls}>API Secret</label><input type="password" className={inputCls} value={cloudinary.api_secret} onChange={(e) => setCloudinary((c) => ({ ...c, api_secret: e.target.value }))} /></div>
          </div>
          <button onClick={() => handleSave("cloudinary")} className={`mt-4 ${saved === "cloudinary" ? savedBtnCls : saveBtnCls}`}>
            {saved === "cloudinary" ? "Saved!" : "Save Cloudinary"}
          </button>
        </section>

        {/* Admin Password */}
        <section className={sectionCls}>
          <h2 className="font-playfair text-[16px] font-bold text-[#1B2B5E] mb-4 pb-3 border-b border-[#F1F5F9]">Change Admin Password</h2>
          <div className="space-y-3">
            <div><label className={labelCls}>Current Password</label><input type="password" className={inputCls} value={adminPassword.current} onChange={(e) => setAdminPassword((p) => ({ ...p, current: e.target.value }))} /></div>
            <div><label className={labelCls}>New Password</label><input type="password" className={inputCls} value={adminPassword.new_password} onChange={(e) => setAdminPassword((p) => ({ ...p, new_password: e.target.value }))} /></div>
            <div><label className={labelCls}>Confirm New Password</label><input type="password" className={inputCls} value={adminPassword.confirm} onChange={(e) => setAdminPassword((p) => ({ ...p, confirm: e.target.value }))} /></div>
          </div>
          <button onClick={() => handleSave("password")} className={`mt-4 ${saved === "password" ? savedBtnCls : saveBtnCls}`}>
            {saved === "password" ? "Saved!" : "Update Password"}
          </button>
        </section>
      </div>
    </div>
  );
}
