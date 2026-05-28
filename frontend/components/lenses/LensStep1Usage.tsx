"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { LensOption } from "@/types";

interface LensStep1UsageProps {
  lensTypes: LensOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const PROGRESSIVE_SUB = [
  { id: "premium", label: "Premium Progressive" },
  { id: "standard", label: "Standard Progressive" },
  { id: "mid", label: "Mid-Range Progressive" },
  { id: "near", label: "Near Vision" },
];

export default function LensStep1Usage({ lensTypes, selectedId, onSelect }: LensStep1UsageProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-['Cormorant_Garamond'] text-[22px] text-[#1a1a1a] font-semibold mb-1">
        How will you use your glasses?
      </h3>
      <p className="text-[#6b7280] text-sm mb-4">
        Choose how you will use your glasses. This determines the lens type.
      </p>
      {lensTypes.map((lens) => {
        const isSelected = selectedId === lens.id;
        const isProgressive = lens.name.toLowerCase().includes("progressive");

        return (
          <div key={lens.id}>
            <button
              onClick={() => onSelect(lens.id)}
              className={cn(
                "w-full text-left rounded-lg border p-4 transition-colors",
                isSelected
                  ? "border-[#E8670A] bg-[#FFF0E6]"
                  : "border-[#e5e7eb] bg-white hover:border-[#E8670A]/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-[44px] h-[44px] rounded bg-gray-100 flex items-center justify-center shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      isSelected ? "border-[#E8670A]" : "border-gray-400"
                    )}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#E8670A]" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[#1a1a1a] font-medium text-[14px]">{lens.name}</p>
                    {lens.description && (
                      <p className="text-[#6b7280] text-[12px] mt-0.5">{lens.description}</p>
                    )}
                  </div>
                </div>
                <span className="text-[#E8670A] text-sm font-medium shrink-0">
                  {lens.price === 0 ? "Free" : `+${formatPrice(lens.price)}`}
                </span>
              </div>
            </button>

            {/* Progressive sub-options */}
            {isSelected && isProgressive && (
              <div className="ml-7 mt-2 space-y-1">
                {PROGRESSIVE_SUB.map((sub) => (
                  <button
                    key={sub.id}
                    className="w-full text-left text-sm px-3 py-2 rounded border border-[#e5e7eb] bg-white text-[#6b7280] hover:text-[#1a1a1a] hover:border-[#E8670A] transition-colors"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Non-Rx option */}
      <button
        onClick={() => onSelect(-1)}
        className={cn(
          "w-full text-left rounded-lg border p-4 transition-colors",
          selectedId === -1
            ? "border-[#E8670A] bg-[#FFF0E6]"
            : "border-[#e5e7eb] bg-white hover:border-[#E8670A]/50"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-[44px] h-[44px] rounded bg-gray-100 flex items-center justify-center shrink-0">
            <div className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
              selectedId === -1 ? "border-[#E8670A]" : "border-gray-400"
            )}>
              {selectedId === -1 && <div className="w-2 h-2 rounded-full bg-[#E8670A]" />}
            </div>
          </div>
          <div>
            <p className="text-[#1a1a1a] font-medium text-[14px]">Non-Prescription (Plano)</p>
            <p className="text-[#6b7280] text-[12px] mt-0.5">Clear lenses with no prescription</p>
          </div>
        </div>
      </button>
    </div>
  );
}
