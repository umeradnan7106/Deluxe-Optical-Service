import { cn } from "@/lib/utils";

interface PlaceholderProps {
  className?: string;
  label?: string;
}

export default function Placeholder({ className, label }: PlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-[#1a1a1a] text-gray-500 text-sm",
        className
      )}
    >
      {label ?? "No image"}
    </div>
  );
}
