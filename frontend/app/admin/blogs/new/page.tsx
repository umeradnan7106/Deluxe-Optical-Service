import BlogEditor from "@/components/admin/BlogEditor";

export const metadata = { title: "New Blog Post" };

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-6">New Blog Post</h1>
      <BlogEditor />
    </div>
  );
}
