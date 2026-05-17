"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  EyeIcon,
  SunIcon,
  SparklesIcon,
  ShoppingBagIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { productsApi } from "@/lib/api";

const CATS = [
  { label: "Eyeglasses", href: "/products?category=eyeglasses", params: { category: "eyeglasses" }, Icon: EyeIcon },
  { label: "Sunglasses", href: "/products?category=sunglasses", params: { category: "sunglasses" }, Icon: SunIcon },
  { label: "Contact Lenses", href: "/products?category=contact-lenses", params: { category: "contact-lenses" }, Icon: SparklesIcon },
  { label: "Accessories", href: "/products?category=accessories", params: { category: "accessories" }, Icon: ShoppingBagIcon },
  { label: "Men's Frames", href: "/products?gender=men", params: { gender: "men" }, Icon: UserIcon },
  { label: "Women's Frames", href: "/products?gender=women", params: { gender: "women" }, Icon: UserGroupIcon },
] as const;

export default function CategoryGrid() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all(
      CATS.map(({ label, params }) =>
        productsApi.list({ ...params, per_page: 1 })
          .then((res) => ({ label, total: res.data.total }))
          .catch(() => ({ label, total: 0 }))
      )
    ).then((results) => {
      const map: Record<string, number> = {};
      results.forEach(({ label, total }) => { map[label] = total; });
      setCounts(map);
    });
  }, []);

  return (
    <section className="max-w-[1500px] mx-auto px-6 py-12">
      <div className="mb-6">
        <p className="text-[#E8670A] text-sm font-medium uppercase tracking-widest mb-1">Browse by Category</p>
        <h2 className="font-['Cormorant_Garamond'] text-3xl text-gray-900 font-semibold">Find Your Style</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATS.map(({ label, href, Icon }) => (
          <Link key={label} href={href} className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center gap-3 hover:ring-1 hover:ring-[#E8670A] hover:border-[#E8670A]/40 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#E8670A]/10 flex items-center justify-center group-hover:bg-[#E8670A]/20 transition-colors">
                <Icon className="w-6 h-6 text-[#E8670A]" />
              </div>
              <div>
                <p className="text-gray-900 text-sm font-medium leading-snug">{label}</p>
                {counts[label] !== undefined && (
                  <p className="text-gray-500 text-xs mt-0.5">{counts[label]} styles</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
