"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
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
        Select any optional add-ons for your lenses. You can choose multiple.
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
            <div className="flex items-center gap-3">
              {/* Icon placeholder */}
              <div className="w-[44px] h-[44px] rounded bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 44 44" className="w-7 h-7" fill="none">
                  <circle cx="22" cy="22" r="12" stroke="#E8670A" strokeWidth="1.5" />
                  <circle cx="22" cy="22" r="7" fill="#E8670A" opacity=".12" />
                  {isUV && (
                    <text x="22" y="26" textAnchor="middle" fontSize="7" fill="#E8670A" fontFamily="sans-serif" fontWeight="bold">UV</text>
                  )}
                </svg>
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
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
              {/* Price */}
              <span className="text-[#E8670A] text-sm font-medium shrink-0">
                {addon.price === 0 || isUV ? "Free" : `+${formatPrice(addon.price)}`}
              </span>
              {/* Green checkmark when selected */}
              {isSelected && (
                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
