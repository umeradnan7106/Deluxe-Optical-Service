"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogsApi } from "@/lib/api";
import type { Blog } from "@/types";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "lens-guide", label: "Lens Guide" },
  { value: "frame-style", label: "Frame Style" },
  { value: "eye-health", label: "Eye Health" },
  { value: "prescription-tips", label: "Prescription Tips" },
];

const CAT_BADGE: Record<string, "orange" | "gray"> = {
  "lens-guide": "orange", "frame-style": "gray", "eye-health": "gray", "prescription-tips": "gray",
};

export default function BlogsPage() {
  const [category, setCategory] = useState("all");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    blogsApi.list({ category: category === "all" ? undefined : category, page }).then(({ data }) => {
      const d = data as { items: Blog[]; total: number };
      setBlogs(d.items);
      setTotal(d.total);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [category, page]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Hero */}
      <div className="text-center mb-8 md:mb-10">
        <p className="text-[#C9A84C] text-[11px] font-semibold uppercase tracking-[.14em] mb-2">Our Blog</p>
        <h1 className="font-playfair text-3xl md:text-5xl text-[#1B2B5E] font-bold mb-3">Optical Blog</h1>
        <p className="text-[#64748b] text-base md:text-lg max-w-xl mx-auto">Expert insights on lenses, frames, eye health, and more.</p>
      </div>

      {/* Category pills — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none justify-start md:justify-center mb-6 md:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {CATEGORIES.map(({ value, label }) => (
          <button key={value} onClick={() => { setCategory(value); setPage(1); }}
            className={`shrink-0 px-5 py-2 rounded-full text-sm transition-colors border ${category === value ? "bg-[#1B2B5E] text-white border-[#1B2B5E]" : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1B2B5E] hover:text-[#1B2B5E]"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Blog grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {loading ? Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-video bg-[#EEF1FA]" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-[#EEF1FA] rounded w-1/3" />
              <div className="h-5 bg-[#EEF1FA] rounded" />
              <div className="h-4 bg-[#EEF1FA] rounded w-2/3" />
            </div>
          </div>
        )) : blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group bg-white border border-[#e2e8f0] rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-[#1B2B5E]/20">
            <div className="aspect-video relative bg-[#EEF1FA]">
              {blog.cover_image_url ? (
                <Image src={blog.cover_image_url} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="400px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#64748b] text-sm">No cover image</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={CAT_BADGE[blog.category] ?? "gray"}>{blog.category.replace(/-/g, " ")}</Badge>
                <span className="text-[#64748b] text-xs">{(blog as unknown as { read_time_minutes: number }).read_time_minutes ?? 3} min read</span>
              </div>
              <h2 className="text-[#1B2B5E] font-semibold group-hover:text-[#C9A84C] transition-colors line-clamp-2 mb-2">{blog.title}</h2>
              <p className="text-[#64748b] text-xs">{formatDate(blog.created_at as unknown as string)}</p>
            </div>
          </Link>
        ))}
      </div>

      {blogs.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-16">No blog posts yet.</p>
      )}

      {total > blogs.length && (
        <div className="text-center mt-8">
          <button onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 bg-[#1B2B5E] hover:bg-[#243570] text-white rounded-lg transition-colors text-sm">
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
