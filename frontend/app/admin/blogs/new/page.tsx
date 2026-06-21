import BlogEditor from "@/components/admin/BlogEditor";

export const metadata = { title: "New Blog Post" };

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-playfair text-3xl text-gray-900 font-semibold mb-6">New Blog Post</h1>
      <BlogEditor />
    </div>
  );
}
