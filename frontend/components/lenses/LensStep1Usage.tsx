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
      <p className="text-gray-400 text-sm mb-4">
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
                "w-full text-left rounded border p-4 transition-colors",
                isSelected
                  ? "border-[#E8670A] bg-[#FFF0E6]/5"
                  : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#E8670A]/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                    isSelected ? "border-[#E8670A]" : "border-gray-500"
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#E8670A]" />}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{lens.name}</p>
                    {lens.description && (
                      <p className="text-gray-400 text-xs mt-0.5">{lens.description}</p>
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
                    className="w-full text-left text-sm px-3 py-2 rounded bg-[#2a2a2a] text-gray-300 hover:text-white hover:bg-[#3a3a3a] transition-colors"
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
          "w-full text-left rounded border p-4 transition-colors",
          selectedId === -1
            ? "border-[#E8670A] bg-[#FFF0E6]/5"
            : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#E8670A]/50"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
            selectedId === -1 ? "border-[#E8670A]" : "border-gray-500"
          )}>
            {selectedId === -1 && <div className="w-2 h-2 rounded-full bg-[#E8670A]" />}
          </div>
          <div>
            <p className="text-white font-medium text-sm">Non-Prescription (Plano)</p>
            <p className="text-gray-400 text-xs mt-0.5">Clear lenses with no prescription</p>
          </div>
        </div>
      </button>
    </div>
  );
}
