"use client";

import { useParams } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-6">Edit Blog Post</h1>
      <BlogEditor blogId={Number(id)} />
    </div>
  );
}
