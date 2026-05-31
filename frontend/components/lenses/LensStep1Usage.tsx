"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { LensOption } from "@/types";

interface LensStep1UsageProps {
  lensTypes: LensOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const LensIcon = ({ name }: { name: string }) => {
  const lower = name.toLowerCase();
  if (lower.includes("progressive")) {
    return (
      <svg viewBox="0 0 44 44" className="w-7 h-7" fill="none">
        <ellipse cx="22" cy="22" rx="14" ry="10" stroke="#E8670A" strokeWidth="2" />
        <line x1="10" y1="22" x2="34" y2="22" stroke="#E8670A" strokeWidth="1.5" strokeDasharray="3,2" />
        <line x1="10" y1="18" x2="34" y2="18" stroke="#6b7280" strokeWidth="1" strokeDasharray="3,2" opacity=".5" />
        <line x1="10" y1="26" x2="34" y2="26" stroke="#6b7280" strokeWidth="1" strokeDasharray="3,2" opacity=".5" />
      </svg>
    );
  }
  if (lower.includes("bifocal")) {
    return (
      <svg viewBox="0 0 44 44" className="w-7 h-7" fill="none">
        <ellipse cx="22" cy="22" rx="14" ry="10" stroke="#E8670A" strokeWidth="2" />
        <line x1="10" y1="22" x2="34" y2="22" stroke="#E8670A" strokeWidth="1.5" />
      </svg>
    );
  }
  if (lower.includes("sun") || lower.includes("tint")) {
    return (
      <svg viewBox="0 0 44 44" className="w-7 h-7" fill="none">
        <ellipse cx="22" cy="22" rx="14" ry="10" stroke="#E8670A" strokeWidth="2" />
        <ellipse cx="22" cy="22" rx="10" ry="6" fill="#E8670A" opacity=".2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 44 44" className="w-7 h-7" fill="none">
      <ellipse cx="22" cy="22" rx="14" ry="10" stroke="#E8670A" strokeWidth="2" />
      <ellipse cx="22" cy="22" rx="5" ry="5" fill="#E8670A" opacity=".15" />
    </svg>
  );
};

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

        return (
          <button
            key={lens.id}
            onClick={() => onSelect(lens.id)}
            className={cn(
              "w-full text-left rounded-lg border p-4 transition-colors",
              isSelected
                ? "border-[#E8670A] bg-[#FFF0E6]"
                : "border-[#e5e7eb] bg-white hover:border-[#E8670A]/50"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Icon image placeholder */}
              <div className="w-[44px] h-[44px] rounded bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center shrink-0">
                <LensIcon name={lens.name} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[#1a1a1a] font-medium text-[14px]">{lens.name}</p>
                {lens.description && (
                  <p className="text-[#6b7280] text-[12px] mt-0.5">{lens.description}</p>
                )}
              </div>

              {/* Price */}
              <span className="text-[#E8670A] text-sm font-medium shrink-0">
                {lens.price === 0 ? "Free" : `+${formatPrice(lens.price)}`}
              </span>

              {/* Green checkmark when selected */}
              {isSelected && (
                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
              )}
            </div>
          </button>
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
          <div className="w-[44px] h-[44px] rounded bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 44 44" className="w-7 h-7" fill="none">
              <ellipse cx="22" cy="22" rx="14" ry="10" stroke="#6b7280" strokeWidth="2" />
              <text x="22" y="26" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">Plano</text>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#1a1a1a] font-medium text-[14px]">Non-Prescription (Plano)</p>
            <p className="text-[#6b7280] text-[12px] mt-0.5">Clear lenses with no prescription</p>
          </div>
          <span className="text-[#E8670A] text-sm font-medium shrink-0">Free</span>
          {selectedId === -1 && (
            <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
          )}
        </div>
      </button>
    </div>
  );
}
