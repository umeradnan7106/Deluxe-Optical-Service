import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optical Blog",
  description: "Expert lens guides, frame style tips, eye health articles, and prescription advice from the Deluxe Opt Service team.",
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
