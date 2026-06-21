import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-playfair text-[120px] leading-none text-[#C9A84C] font-bold opacity-20 select-none">
          404
        </p>
        <h1 className="font-playfair text-4xl text-[#1B2B5E] font-bold mb-3 -mt-6">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">Back to Home</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
