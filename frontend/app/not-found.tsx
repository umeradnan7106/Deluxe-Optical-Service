import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-[#0F0F0F] min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-['Cormorant_Garamond'] text-[120px] leading-none text-[#E8670A] font-bold opacity-20 select-none">
          404
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-4xl text-white font-semibold mb-3 -mt-6">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
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
