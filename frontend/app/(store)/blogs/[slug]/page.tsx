"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { blogsApi } from "@/lib/api";
import type { Blog } from "@/types";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

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

  if (loading) return <div className="flex items-center justify-center min-h-[50vh] text-gray-400">Loading…</div>;
  if (!blog) return <div className="flex items-center justify-center min-h-[50vh] text-gray-400">Blog post not found</div>;

  const readTime = (blog as unknown as { read_time_minutes: number }).read_time_minutes ?? 3;

  return (
    <div>
      {/* Cover Image */}
      {blog.cover_image_url && (
        <div className="relative h-[400px] w-full">
          <Image src={blog.cover_image_url} alt={blog.title} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="orange">{blog.category.replace(/-/g, " ")}</Badge>
          <span className="text-gray-500 text-sm">{readTime} min read</span>
          <span className="text-gray-600 text-sm">{formatDate(blog.created_at as unknown as string)}</span>
        </div>

        {/* Title */}
        <h1 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold leading-tight mb-8">
          {blog.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-invert prose-sm max-w-none prose-headings:font-['Cormorant_Garamond'] prose-h1:text-3xl prose-h2:text-2xl prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-[#E8670A] prose-strong:text-white prose-blockquote:border-[#E8670A] prose-blockquote:text-gray-400"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-[#2a2a2a]">
          <Link href="/blogs" className="text-[#E8670A] text-sm hover:underline">← Back to Blog</Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="max-w-[1500px] mx-auto px-6 py-10 border-t border-[#2a2a2a]">
          <h2 className="font-['Cormorant_Garamond'] text-2xl text-white font-semibold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.id} href={`/blogs/${r.slug}`} className="group bg-[#1a1a1a] rounded overflow-hidden hover:bg-[#222] transition-colors">
                {r.cover_image_url && (
                  <div className="aspect-video relative">
                    <Image src={r.cover_image_url} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="400px" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-white text-sm font-medium group-hover:text-[#E8670A] transition-colors line-clamp-2">{r.title}</h3>
                  <p className="text-gray-500 text-xs mt-2">{formatDate(r.created_at as unknown as string)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
