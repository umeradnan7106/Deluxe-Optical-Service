"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { wishlistApi } from "@/lib/api";
import type { ProductListItem } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistApi.get().then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);

  async function handleRemove(productId: number) {
    await wishlistApi.remove(productId);
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }

  if (loading) return <div className="text-gray-400 py-8 text-center">Loading wishlist…</div>;

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">My Wishlist ({items.length})</h2>
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-4">Your wishlist is empty.</p>
          <Link href="/products"><Button variant="primary">Browse Products</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} wishlisted onWishlistToggle={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
