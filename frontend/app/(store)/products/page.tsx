import { Suspense } from "react";
import ProductsContent from "./_Content";

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
