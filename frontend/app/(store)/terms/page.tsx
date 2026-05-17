import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of use for Deluxe Opt Service — Pakistan's premium online eyewear store.",
};

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or placing an order on deluxeopt.pk, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services.",
  },
  {
    title: "Products and Pricing",
    body: "All prices are listed in Pakistani Rupees (PKR) and include applicable taxes. We reserve the right to change prices at any time without prior notice. Product images are for illustration purposes and actual colours may vary slightly due to screen settings.",
  },
  {
    title: "Prescription Orders",
    body: "You are responsible for providing accurate prescription details. Deluxe Opt Service is not liable for incorrect lenses resulting from inaccurate prescriptions submitted by the customer. Our optical team verifies all prescriptions before production, but final responsibility lies with you as the customer.",
  },
  {
    title: "Order Processing",
    body: "Orders are confirmed once payment is received or COD is selected. Prescription orders may require 1–2 additional business days for optical verification. We reserve the right to cancel orders in cases of stock unavailability or payment issues, with a full refund issued.",
  },
  {
    title: "Shipping",
    body: "We deliver Pakistan-wide. Estimated delivery is 3–5 business days for in-stock items and 5–7 business days for prescription orders. Delivery timelines are estimates and not guaranteed. Free delivery applies on orders over Rs. 3,000.",
  },
  {
    title: "Returns and Exchanges",
    body: "We offer a 15-day return policy from the date of delivery for unused, unworn items in original packaging. Custom prescription lenses are non-refundable unless there is a manufacturing defect. To initiate a return, contact us at support@deluxeopt.pk.",
  },
  {
    title: "Intellectual Property",
    body: "All content on this website — including logos, images, copy, and product descriptions — is the property of Deluxe Opt Service and may not be reproduced without written permission.",
  },
  {
    title: "Limitation of Liability",
    body: "Deluxe Opt Service is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability in any dispute is limited to the value of the order in question.",
  },
  {
    title: "Governing Law",
    body: "These terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes shall be subject to the jurisdiction of courts in Lahore, Pakistan.",
  },
  {
    title: "Contact",
    body: "For questions about these terms, contact us at support@deluxeopt.pk or via WhatsApp at +92-300-0000000.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-[#111111] border-b border-[#2a2a2a] py-16">
        <div className="max-w-[1500px] mx-auto px-6 text-center">
          <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl text-white font-semibold mb-4">Terms & Conditions</h1>
          <p className="text-gray-400 text-sm">Last updated: May 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-gray-900 font-semibold text-lg mb-3">{title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
