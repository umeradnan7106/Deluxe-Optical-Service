"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { LensOption } from "@/types";
import Badge from "@/components/ui/Badge";

interface LensStep4AddonsProps {
  addons: LensOption[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

export default function LensStep4Addons({ addons, selectedIds, onToggle }: LensStep4AddonsProps) {
  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm mb-4">
        Select any optional add-ons for your lenses. UV400 is included free with all orders.
      </p>
      {addons.map((addon) => {
        const isSelected = selectedIds.includes(addon.id);
        const isUV = addon.name.toLowerCase().includes("uv");
        return (
          <button
            key={addon.id}
            onClick={() => onToggle(addon.id)}
            className={cn(
              "w-full text-left rounded border p-4 transition-colors",
              isSelected
                ? "border-[#E8670A] bg-[#FFF0E6]/5"
                : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#E8670A]/50"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5",
                  isSelected ? "border-[#E8670A] bg-[#E8670A]" : "border-gray-500"
                )}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm">{addon.name}</p>
                    {isUV && <Badge variant="green">Included Free</Badge>}
                  </div>
                  {addon.description && (
                    <p className="text-gray-400 text-xs mt-0.5">{addon.description}</p>
                  )}
                </div>
              </div>
              <span className="text-[#E8670A] text-sm font-medium shrink-0">
                {addon.price === 0 || isUV ? "Free" : `+${formatPrice(addon.price)}`}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
