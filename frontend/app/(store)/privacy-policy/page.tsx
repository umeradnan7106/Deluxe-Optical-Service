import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Deluxe Opt Service collects, uses, and protects your personal data.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly — name, email address, phone number, shipping address, and prescription details when placing an order. We also collect usage data (pages visited, device type, IP address) to improve our service.",
  },
  {
    title: "How We Use Your Information",
    body: "Your information is used to process orders, send order confirmations and shipping updates, verify prescription details with our optical team, respond to customer support requests, and send promotional emails if you have opted in. We do not sell your personal data to third parties.",
  },
  {
    title: "Prescription Data",
    body: "Prescription details you provide are shared only with our licensed optical team for lens fabrication purposes. We store this data securely and do not share it with any external parties beyond fulfilment requirements.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies to maintain your shopping cart session and authentication state. We use analytics cookies (Google Analytics) to understand how visitors use our site. You may disable cookies in your browser, though some features may not function correctly.",
  },
  {
    title: "Data Security",
    body: "All data is transmitted over HTTPS. Payment information is processed via secure third-party gateways (EasyPaisa, JazzCash, Bank Transfer) and we never store raw card details on our servers.",
  },
  {
    title: "Data Retention",
    body: "Order records and prescription data are retained for 7 years as required by Pakistani commercial law. You may request deletion of your account and associated personal data by contacting us at support@deluxeopt.pk.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, correct, or delete personal data we hold about you. To exercise these rights, email us at support@deluxeopt.pk. We will respond within 14 business days.",
  },
  {
    title: "Contact",
    body: "For privacy-related questions, contact our team at support@deluxeopt.pk or via WhatsApp at +92-300-0000000.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      <section className="bg-[#111111] border-b border-[#2a2a2a] py-16">
        <div className="max-w-[1500px] mx-auto px-6 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl text-white font-semibold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: May 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-white font-semibold text-lg mb-3">{title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
