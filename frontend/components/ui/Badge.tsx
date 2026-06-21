import { cn } from "@/lib/utils";

type BadgeVariant = "orange" | "dark" | "green" | "red" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  orange: "bg-[#EEF1FA] text-[#1B2B5E]",
  dark: "bg-[#1B2B5E] text-white",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-600",
  gray: "bg-gray-100 text-gray-600",
};

export default function Badge({ variant = "orange", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
