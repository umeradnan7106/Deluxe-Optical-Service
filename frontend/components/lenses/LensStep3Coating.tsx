"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { LensOption } from "@/types";

interface LensStep3CoatingProps {
  coatings: LensOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function LensStep3Coating({ coatings, selectedId, onSelect }: LensStep3CoatingProps) {
  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm mb-4">
        Choose a lens coating. Standard Clear is included at no extra cost.
      </p>
      {coatings.map((coating) => {
        const isSelected = selectedId === coating.id;
        return (
          <button
            key={coating.id}
            onClick={() => onSelect(coating.id)}
            className={cn(
              "w-full text-left rounded border p-4 transition-colors",
              isSelected
                ? "border-[#C9A84C] bg-[#EEF1FA]/5"
                : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#C9A84C]/50"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                  isSelected ? "border-[#C9A84C]" : "border-gray-500"
                )}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{coating.name}</p>
                  {coating.description && (
                    <p className="text-gray-400 text-xs mt-0.5">{coating.description}</p>
                  )}
                </div>
              </div>
              <span className="text-[#C9A84C] text-sm font-medium shrink-0">
                {coating.price === 0 ? "Free" : `+${formatPrice(coating.price)}`}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
