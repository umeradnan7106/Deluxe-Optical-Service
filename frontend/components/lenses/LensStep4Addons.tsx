"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { LensOption } from "@/types";

interface LensStep4AddonsProps {
  addons: LensOption[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

export default function LensStep4Addons({ addons, selectedIds, onToggle }: LensStep4AddonsProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-['Cormorant_Garamond'] text-[22px] text-[#1a1a1a] font-semibold mb-1">
        Optional Add-Ons
      </h3>
      <p className="text-[#6b7280] text-sm mb-4">
        Select any optional add-ons for your lenses. UV400 protection is included free with all orders.
      </p>
      {addons.map((addon) => {
        const isSelected = selectedIds.includes(addon.id);
        const isUV = addon.name.toLowerCase().includes("uv");
        return (
          <button
            key={addon.id}
            onClick={() => onToggle(addon.id)}
            className={cn(
              "w-full text-left rounded-lg border p-4 transition-colors",
              isSelected
                ? "border-[#E8670A] bg-[#FFF0E6]"
                : "border-[#e5e7eb] bg-white hover:border-[#E8670A]/50"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-[44px] h-[44px] rounded bg-gray-100 flex items-center justify-center shrink-0">
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center",
                    isSelected ? "border-[#E8670A] bg-[#E8670A]" : "border-gray-400"
                  )}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[#1a1a1a] font-medium text-[14px]">{addon.name}</p>
                    {isUV && (
                      <span className="bg-green-100 text-green-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        Included Free
                      </span>
                    )}
                  </div>
                  {addon.description && (
                    <p className="text-[#6b7280] text-[12px] mt-0.5">{addon.description}</p>
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
