"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { adminApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import { generateSlug } from "@/lib/utils";
import { PhotoIcon, ListBulletIcon } from "@heroicons/react/24/outline";

const CATEGORIES = [
  { value: "lens-guide", label: "Lens Guide" },
  { value: "frame-style", label: "Frame Style" },
  { value: "eye-health", label: "Eye Health" },
  { value: "prescription-tips", label: "Prescription Tips" },
];

interface BlogEditorProps {
  blogId?: number;
}

interface AdminBlogData {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  cover_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  excerpt?: string;
  tags?: string[];
  focus_keyword?: string;
}

function TbBtn({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`min-w-[36px] min-h-[36px] px-2 py-1 text-xs rounded ${active ? "bg-[#C9A84C] text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
      {children}
    </button>
  );
}

export default function BlogEditor({ blogId }: BlogEditorProps) {
  const router = useRouter();
  const isEdit = blogId !== undefined;
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("lens-guide");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [slugAuto, setSlugAuto] = useState(!isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [showOnProducts, setShowOnProducts] = useState({ prescription: false, blueCut: false, sunglasses: false });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: { class: "outline-none min-h-[400px] text-gray-900 text-sm leading-relaxed" },
    },
  });

  useEffect(() => {
    if (!isEdit || !blogId) return;
    adminApi.blogs.detail(blogId).then(({ data }) => {
      const b = data as AdminBlogData;
      setTitle(b.title);
      setCategory(b.category);
      setSlug(b.slug);
      setMetaTitle(b.meta_title ?? "");
      setMetaDesc(b.meta_description ?? "");
      setCoverUrl(b.cover_image_url);
      setIsPublished(b.is_published);
      if (b.excerpt) setExcerpt(b.excerpt);
      if (b.tags) setTags(b.tags);
      if (b.focus_keyword) setFocusKeyword(b.focus_keyword);
      setSlugAuto(false);
      if (editor && b.content) editor.commands.setContent(b.content);
    }).catch(() => {});
  }, [isEdit, blogId, editor]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (slugAuto) setSlug(generateSlug(val));
  }

  async function handleCoverFile(file: File) {
    setCoverFile(file);
    setCoverUrl(URL.createObjectURL(file));
  }

  async function save(publish: boolean) {
    if (!title || !editor?.getHTML()) { setError("Title and content are required."); return; }
    setSaving(true);
    setError("");
    try {
      let finalCoverUrl = coverUrl;

      // Upload cover if new file selected
      if (coverFile) {
        const { data } = await adminApi.blogs.uploadCover(coverFile);
        finalCoverUrl = (data as { url: string }).url;
      }

      const payload = {
        title, category, content: editor.getHTML(),
        cover_image_url: finalCoverUrl ?? null,
        meta_title: metaTitle || null,
        meta_description: metaDesc || null,
        is_published: publish,
        excerpt: excerpt || null,
        tags: tags.length ? tags : [],
        focus_keyword: focusKeyword || null,
      };

      if (isEdit && blogId) {
        await adminApi.blogs.update(blogId, payload);
        if (publish && !isPublished) await adminApi.blogs.publish(blogId);
        if (!publish && isPublished) await adminApi.blogs.unpublish(blogId);
      } else {
        await adminApi.blogs.create(payload);
      }
      router.push("/admin/blogs");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full bg-white border border-gray-300 text-gray-900 text-[16px] md:text-sm px-3 py-2 rounded outline-none focus:border-[#C9A84C] transition-colors min-h-[44px]";

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Editor column */}
      <div className="flex-1 min-w-0 w-full space-y-4">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full bg-transparent text-gray-900 text-3xl font-playfair outline-none border-b border-gray-300 pb-3 placeholder-gray-400 focus:border-[#C9A84C] transition-colors"
          placeholder="Blog Title…"
        />

        {/* Cover Image */}
        <div
          className="border-2 border-dashed border-gray-300 rounded overflow-hidden cursor-pointer hover:border-[#C9A84C] transition-colors relative"
          style={{ minHeight: 200 }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleCoverFile(f); }}
        >
          {coverUrl ? (
            <Image src={coverUrl} alt="Cover" fill className="object-cover" sizes="800px" unoptimized={!!coverFile} />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-600">
              <PhotoIcon className="w-8 h-8 mb-2" />
              <p className="text-sm">Click or drag to add cover image</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverFile(f); }} />
        </div>

        {/* Rich Text Editor */}
        <div className="border border-gray-300 rounded overflow-hidden">
          <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
            <TbBtn active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}>B</TbBtn>
            <TbBtn active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}>I</TbBtn>
            <TbBtn active={editor?.isActive("heading", { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>H1</TbBtn>
            <TbBtn active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</TbBtn>
            <TbBtn active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</TbBtn>
            <TbBtn active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
              <ListBulletIcon className="w-3 h-3" />
            </TbBtn>
            <TbBtn active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1.</TbBtn>
            <TbBtn active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>&ldquo;</TbBtn>
          </div>
          <div className="p-4 bg-white prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[400px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Desktop save buttons */}
        <div className="hidden lg:flex gap-3">
          <Button variant="outline" size="md" onClick={() => save(false)} disabled={saving}>
            {saving ? "Saving…" : "Save Draft"}
          </Button>
          <Button variant="primary" size="md" onClick={() => save(true)} disabled={saving}>
            {saving ? "Publishing…" : "Publish"}
          </Button>
          <Button variant="dark" size="md" onClick={() => router.push("/admin/blogs")}>Cancel</Button>
        </div>
      </div>

      {/* Settings sidebar (moves to bottom on mobile) */}
      <div className="w-full lg:w-64 lg:shrink-0 space-y-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">Category</h3>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">URL Slug</h3>
          <input value={slug} onChange={(e) => { setSlugAuto(false); setSlug(e.target.value); }}
            className={inputCls} placeholder="auto-generated" />
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">Excerpt / Summary</h3>
          <p className="text-xs text-gray-400 mb-2">Shown on blog card preview</p>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
            className={inputCls + " !h-20 resize-none"} placeholder="Short summary of this post…" />
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">Tags</h3>
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                e.preventDefault();
                const t = tagInput.trim().toLowerCase().replace(/,$/, "");
                if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
                setTagInput("");
              }
            }}
            className={inputCls} placeholder="blue cut, lens guide… (Enter to add)" />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 bg-[#EEF1FA] text-[#1B2B5E] text-xs font-medium px-2 py-0.5 rounded">
                  {t}
                  <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="opacity-60 hover:opacity-100 leading-none">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">Show on Products</h3>
          <div className="space-y-2">
            {([
              { key: "prescription" as const, label: "Prescription Products" },
              { key: "blueCut" as const, label: "Blue Cut Products" },
              { key: "sunglasses" as const, label: "Sunglasses" },
            ] as { key: keyof typeof showOnProducts; label: string }[]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showOnProducts[key]}
                  onChange={(e) => setShowOnProducts((s) => ({ ...s, [key]: e.target.checked }))}
                  className="accent-[#1B2B5E]" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">SEO</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Focus Keyword</label>
              <input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className={inputCls} placeholder="e.g. blue cut glasses" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-500">Meta Title</label>
                <span className={`text-[10px] font-medium ${metaTitle.length > 60 ? "text-red-500" : "text-gray-400"}`}>{metaTitle.length}/60</span>
              </div>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} placeholder={title || "Blog title"} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-500">Meta Description</label>
                <span className={`text-[10px] font-medium ${metaDesc.length > 160 ? "text-red-500" : "text-gray-400"}`}>{metaDesc.length}/160</span>
              </div>
              <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className={inputCls + " !h-20 resize-none"} placeholder="Short description…" />
            </div>
          </div>
        </div>

        {/* OG / Social Preview */}
        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-3">OG / Social Preview</h3>
          <div className="border border-gray-200 rounded overflow-hidden text-xs">
            {coverUrl && (
              <div className="relative h-24 bg-gray-100">
                <Image src={coverUrl} alt="" fill className="object-cover" sizes="256px" unoptimized={!!coverFile} />
              </div>
            )}
            <div className="p-2 bg-[#F8FAFC]">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">deluxeopt.com</p>
              <p className="font-semibold text-gray-900 line-clamp-1 text-xs">{metaTitle || title || "Blog Title"}</p>
              <p className="text-gray-500 line-clamp-2 mt-0.5 text-[11px]">{metaDesc || "Meta description will appear here."}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
          <h3 className="text-gray-900 font-semibold text-sm mb-2">Status</h3>
          <p className={`text-sm ${isPublished ? "text-green-600" : "text-gray-500"}`}>
            {isPublished ? "Published" : "Draft"}
          </p>
        </div>

        {/* Mobile save buttons (sticky bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 p-4 flex gap-3">
          <Button variant="outline" size="md" onClick={() => save(false)} disabled={saving} fullWidth>
            {saving ? "Saving…" : "Save Draft"}
          </Button>
          <Button variant="primary" size="md" onClick={() => save(true)} disabled={saving} fullWidth>
            {saving ? "Publishing…" : "Publish"}
          </Button>
        </div>
        {/* Bottom padding for sticky bar on mobile */}
        <div className="h-20 lg:hidden" />
      </div>
    </div>
  );
}
