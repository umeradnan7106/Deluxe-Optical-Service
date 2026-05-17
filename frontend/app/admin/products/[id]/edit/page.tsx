"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold mb-6">Edit Product</h1>
      <ProductForm productId={Number(id)} />
    </div>
  );
}
