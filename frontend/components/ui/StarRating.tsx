import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

export default function StarRating({ rating, max = 5, size = "md", className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        return filled ? (
          <StarIcon key={i} className={cn(sizeClasses[size], "text-[#C9A84C]")} />
        ) : (
          <StarOutlineIcon key={i} className={cn(sizeClasses[size], "text-gray-300")} />
        );
      })}
    </div>
  );
}
