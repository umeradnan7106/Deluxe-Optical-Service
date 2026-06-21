"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { blogsApi } from "@/lib/api";
import type { Blog } from "@/types";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

const CAT_BADGE: Record<string, "orange" | "gray"> = {
  "lens-guide": "orange", "frame-style": "gray", "eye-health": "gray", "prescription-tips": "gray",
};

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blogsApi.detail(slug).then(async ({ data }) => {
      const b = data as Blog;
      setBlog(b);
      const rel = await blogsApi.list({ category: b.category, page: 1 });
      const relBlogs = (rel.data as { items: Blog[] }).items.filter((r) => r.slug !== slug).slice(0, 3);
      setRelated(relBlogs);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center min-h-[50vh] text-[#64748b]">Loading…</div>;
  if (!blog) return <div className="flex items-center justify-center min-h-[50vh] text-[#64748b]">Blog post not found</div>;

  const readTime = (blog as unknown as { read_time_minutes: number }).read_time_minutes ?? 3;

  return (
    <div>
      {/* Cover Image */}
      {blog.cover_image_url && (
        <div className="relative h-[400px] w-full">
          <Image src={blog.cover_image_url} alt={blog.title} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2B5E]/80 via-[#1B2B5E]/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <Badge variant={CAT_BADGE[blog.category] ?? "gray"}>{blog.category.replace(/-/g, " ")}</Badge>
          <span className="text-[#64748b] text-sm">{readTime} min read</span>
          <span className="text-[#64748b] text-sm">{formatDate(blog.created_at as unknown as string)}</span>
        </div>

        {/* Title */}
        <h1 className="font-playfair text-4xl text-[#1B2B5E] font-bold leading-tight mb-8">
          {blog.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-sm max-w-none prose-headings:font-playfair prose-headings:text-[#1B2B5E] prose-h1:text-3xl prose-h2:text-2xl prose-p:text-[#374151] prose-p:leading-relaxed prose-a:text-[#C9A84C] prose-strong:text-[#1B2B5E] prose-blockquote:border-[#C9A84C] prose-blockquote:text-[#64748b]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-[#e2e8f0]">
          <Link href="/blogs" className="text-[#C9A84C] text-sm hover:underline">← Back to Blog</Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="max-w-[1500px] mx-auto px-6 py-10 border-t border-[#e2e8f0]">
          <h2 className="font-playfair text-2xl text-[#1B2B5E] font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.id} href={`/blogs/${r.slug}`} className="group bg-white border border-[#e2e8f0] rounded-xl overflow-hidden hover:shadow-md hover:border-[#1B2B5E]/20 transition-all">
                {r.cover_image_url && (
                  <div className="aspect-video relative">
                    <Image src={r.cover_image_url} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="400px" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-[#1B2B5E] text-sm font-semibold group-hover:text-[#C9A84C] transition-colors line-clamp-2">{r.title}</h3>
                  <p className="text-[#64748b] text-xs mt-2">{formatDate(r.created_at as unknown as string)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
