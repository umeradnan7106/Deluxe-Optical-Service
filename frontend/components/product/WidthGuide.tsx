"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "widths" | "measurements";

interface WidthGuideProps {
  productName: string;
  frameWidthMm?: number | null;
  lensWidthMm?: number | null;
  bridgeMm?: number | null;
  templeMm?: number | null;
  lensHeightMm?: number | null;
}

const SIZE_TABLE = [
  { label: "Narrow", range: "< 130 mm" },
  { label: "Medium", range: "130–140 mm" },
  { label: "Wide", range: "> 140 mm" },
];

function getSizeClass(frameWidth: number | null | undefined): string | null {
  if (!frameWidth) return null;
  if (frameWidth < 130) return "Narrow";
  if (frameWidth <= 140) return "Medium";
  return "Wide";
}

export default function WidthGuide({
  productName,
  frameWidthMm,
  lensWidthMm,
  bridgeMm,
  templeMm,
  lensHeightMm,
}: WidthGuideProps) {
  const [tab, setTab] = useState<Tab>("widths");
  const activeSize = getSizeClass(frameWidthMm);

  return (
    <div className="bg-[#1a1a1a] rounded p-4">
      <h3 className="text-white font-medium text-sm mb-3">
        Width guide for: <span className="text-[#E8670A]">{productName}</span>
      </h3>

      {/* Tabs */}
      <div className="flex border-b border-[#2a2a2a] mb-4">
        {(["widths", "measurements"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px",
              tab === t
                ? "border-[#E8670A] text-[#E8670A]"
                : "border-transparent text-gray-400 hover:text-white"
            )}
          >
            {t === "widths" ? "Frame Widths" : "Other Measurements"}
          </button>
        ))}
      </div>

      {tab === "widths" && (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left pb-2">Size</th>
              <th className="text-left pb-2">Width</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_TABLE.map(({ label, range }) => {
              const isActive = label === activeSize;
              return (
                <tr
                  key={label}
                  className={cn(
                    "border-t border-[#2a2a2a]",
                    isActive && "bg-[#FFF0E6]/5"
                  )}
                >
                  <td className={cn("py-2 font-medium", isActive ? "text-[#E8670A]" : "text-white")}>
                    {label}
                    {isActive && <span className="ml-1 text-[10px] text-[#E8670A]">(This frame)</span>}
                  </td>
                  <td className="py-2 text-gray-300">{range}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {tab === "measurements" && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: "Frame Width", value: frameWidthMm, unit: "mm" },
            { label: "Lens Width", value: lensWidthMm, unit: "mm" },
            { label: "Bridge", value: bridgeMm, unit: "mm" },
            { label: "Temple", value: templeMm, unit: "mm" },
            { label: "Lens Height", value: lensHeightMm, unit: "mm" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="bg-[#2a2a2a] rounded p-2">
              <p className="text-gray-400">{label}</p>
              <p className="text-white font-medium">
                {value != null ? `${value} ${unit}` : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
