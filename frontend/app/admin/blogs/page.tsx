"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface AdminBlog {
  id: number;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await adminApi.blogs.list({});
      setBlogs((data as { items: AdminBlog[] }).items);
      setTotal((data as { total: number }).total);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this blog post?")) return;
    await adminApi.blogs.delete(id);
    load();
  }

  async function handlePublish(blog: AdminBlog) {
    if (blog.is_published) {
      await adminApi.blogs.unpublish(blog.id);
    } else {
      await adminApi.blogs.publish(blog.id);
    }
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold">Blogs</h1>
        <Link href="/admin/blogs/new">
          <Button variant="primary" size="md"><PlusIcon className="w-4 h-4" />New Blog</Button>
        </Link>
      </div>

      <div className="bg-[#1a1a1a] rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-gray-400 text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }, (_, i) => (
              <tr key={i} className="border-b border-[#2a2a2a]">
                {Array.from({ length: 5 }, (_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-[#2a2a2a] rounded animate-pulse" /></td>)}
              </tr>
            )) : blogs.map((b) => (
              <tr key={b.id} className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/30 transition-colors">
                <td className="px-4 py-3 text-white font-medium">{b.title}</td>
                <td className="px-4 py-3 text-gray-300 capitalize text-sm">{b.category.replace(/-/g, " ")}</td>
                <td className="px-4 py-3">
                  <Badge variant={b.is_published ? "green" : "gray"}>{b.is_published ? "Published" : "Draft"}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{b.published_at ? formatDate(b.published_at) : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handlePublish(b)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${b.is_published ? "border-gray-500 text-gray-400 hover:text-white" : "border-green-500 text-green-400 hover:bg-green-500/10"}`}>
                      {b.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <Link href={`/admin/blogs/${b.id}/edit`}>
                      <Button variant="outline" size="sm"><PencilSquareIcon className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(b.id)} className="border-red-500 text-red-400 hover:bg-red-500/10">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-500 text-xs mt-3">{total} blog posts total</p>
    </div>
  );
}
