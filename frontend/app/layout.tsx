import type { Metadata } from "next";
import "./globals.css";
import AnnounceBar from "@/components/layout/AnnounceBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Deluxe Opt Service — Premium Eyewear Pakistan",
    template: "%s | Deluxe Opt Service",
  },
  description:
    "Buy premium eyeglasses, sunglasses, and prescription frames online in Pakistan. Free delivery on orders over Rs. 3,000.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AnnounceBar />
        <Header />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
