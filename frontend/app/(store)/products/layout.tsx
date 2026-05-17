import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Eyewear",
  description: "Browse 500+ eyeglasses, sunglasses, and prescription frames from Deluxe Opt Service. Free delivery on orders over Rs. 3,000.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
