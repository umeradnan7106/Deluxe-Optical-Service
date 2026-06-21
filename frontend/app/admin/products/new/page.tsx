import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "New Product" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-playfair text-3xl text-gray-900 font-semibold mb-6">New Product</h1>
      <ProductForm />
    </div>
  );
}
