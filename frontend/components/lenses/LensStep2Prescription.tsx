"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ExclamationTriangleIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { uploadApi } from "@/lib/api";
import type { PrescriptionData } from "@/types";
import { cn } from "@/lib/utils";

type Method = "upload" | "manual" | "later";

interface EyeValues {
  sph: string; cyl: string; axis: string; add: string;
}

interface LensStep2Props {
  prescription: PrescriptionData | null;
  onChange: (data: PrescriptionData) => void;
}

const SPH_VALUES = Array.from({ length: 161 }, (_, i) => (-20 + i * 0.25).toFixed(2));
const CYL_VALUES = Array.from({ length: 81 }, (_, i) => (-10 + i * 0.25).toFixed(2));
const AXIS_VALUES = Array.from({ length: 180 }, (_, i) => String(i + 1));
const ADD_VALUES = Array.from({ length: 12 }, (_, i) => (0.75 + i * 0.25).toFixed(2));
const PD_VALUES = Array.from({ length: 25 }, (_, i) => String(52 + i));

const EMPTY_EYE: EyeValues = { sph: "", cyl: "", axis: "", add: "" };

function showWarning(od: EyeValues, os: EyeValues): string | null {
  const sphDiff = Math.abs(Number(od.sph) - Number(os.sph));
  const cylDiff = Math.abs(Number(od.cyl) - Number(os.cyl));
  if (od.sph && os.sph && sphDiff > 3)
    return "Large SPH difference (>3D) detected. Please verify your prescription.";
  if (od.cyl && os.cyl && cylDiff > 2)
    return "Large CYL difference (>2D) detected. Please verify your prescription.";
  return null;
}

export default function LensStep2Prescription({ prescription, onChange }: LensStep2Props) {
  const [method, setMethod] = useState<Method>(prescription?.method as Method || "upload");
  const [od, setOd] = useState<EyeValues>(EMPTY_EYE);
  const [os, setOs] = useState<EyeValues>(EMPTY_EYE);
  const [pd, setPd] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(prescription?.prescription_url || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const warning = method === "manual" ? showWarning(od, os) : null;

  async function handleFileUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const { data } = await uploadApi.prescription(file);
      setUploadUrl(data.url);
      onChange({ method: "upload", prescription_url: data.url });
    } catch {
      setUploadError("Upload failed. Please try again or use a different file.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }

  function buildManualData(): PrescriptionData {
    return {
      method: "manual",
      right_sph: Number(od.sph) || undefined,
      right_cyl: Number(od.cyl) || undefined,
      right_axis: Number(od.axis) || undefined,
      right_add: Number(od.add) || undefined,
      left_sph: Number(os.sph) || undefined,
      left_cyl: Number(os.cyl) || undefined,
      left_axis: Number(os.axis) || undefined,
      left_add: Number(os.add) || undefined,
      pd: Number(pd) || undefined,
    };
  }

  const Select = ({ value, options, onChange: onC, placeholder }: {
    value: string; options: string[]; onChange: (v: string) => void; placeholder: string;
  }) => (
    <select
      value={value}
      onChange={(e) => onC(e.target.value)}
      className="w-full bg-white border border-[#e5e7eb] text-[#1a1a1a] text-xs px-2 py-1.5 rounded"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div className="space-y-4">
      {/* Method selector */}
      <div className="grid grid-cols-2 gap-3">
        {(["upload", "manual"] as Method[]).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={cn(
              "rounded-lg border p-4 text-left transition-colors",
              method === m
                ? "border-[#E8670A] bg-[#FFF0E6]"
                : "border-[#e5e7eb] bg-white hover:border-[#E8670A]/40"
            )}
          >
            <p className="text-[#1a1a1a] font-medium text-sm">{m === "upload" ? "Upload a Photo" : "Fill it out myself"}</p>
            <p className="text-[#6b7280] text-xs mt-0.5">
              {m === "upload" ? "Upload image or PDF" : "Fill in SPH, CYL, Axis"}
            </p>
          </button>
        ))}
      </div>

      {/* Upload */}
      {method === "upload" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            dragOver ? "border-[#E8670A] bg-[#FFF0E6]" : "border-[#e5e7eb] bg-[#f9fafb] hover:border-[#E8670A]/50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ""; }}
          />
          {uploading ? (
            <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-8 h-8 border-2 border-[#E8670A] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[#6b7280] text-sm">Uploading…</p>
            </div>
          ) : uploadUrl ? (
            <div className="flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <Image src={uploadUrl} alt="Prescription preview" width={120} height={90} className="rounded border border-[#e5e7eb] object-contain" />
              <p className="text-green-600 text-sm font-medium">Uploaded successfully</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="inline-flex items-center px-3 py-1.5 rounded border border-[#e5e7eb] text-xs text-[#6b7280] hover:text-[#1a1a1a] hover:border-gray-400 cursor-pointer transition-colors bg-white"
              >
                Replace photo
              </button>
            </div>
          ) : (
            <div onClick={(e) => e.stopPropagation()}>
              <CloudArrowUpIcon className="w-10 h-10 text-[#6b7280] mx-auto mb-3" />
              <p className="text-[#1a1a1a] text-sm mb-1">Click to upload or drag & drop</p>
              <p className="text-[#6b7280] text-xs">JPG, PNG, PDF — max 10 MB</p>
              {uploadError && <p className="text-red-500 text-xs mt-2">{uploadError}</p>}
            </div>
          )}
        </div>
      )}

      {/* Manual */}
      {method === "manual" && (
        <div className="space-y-4">
          {warning && (
            <div className="flex items-start gap-2 bg-orange-50 border border-[#E8670A]/30 rounded p-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-[#E8670A] shrink-0 mt-0.5" />
              <p className="text-[#E8670A] text-xs">{warning}</p>
            </div>
          )}

          {[
            { label: "Right Eye (OD)", state: od, set: setOd },
            { label: "Left Eye (OS)", state: os, set: setOs },
          ].map(({ label, state, set }) => (
            <div key={label}>
              <h4 className="text-[#1a1a1a] text-xs font-medium mb-2">{label}</h4>
              <div className="grid grid-cols-4 gap-2">
                <div><p className="text-[#6b7280] text-[10px] mb-1">SPH</p><Select value={state.sph} options={SPH_VALUES} onChange={(v) => { set({ ...state, sph: v }); onChange(buildManualData()); }} placeholder="0.00" /></div>
                <div><p className="text-[#6b7280] text-[10px] mb-1">CYL</p><Select value={state.cyl} options={CYL_VALUES} onChange={(v) => { set({ ...state, cyl: v }); onChange(buildManualData()); }} placeholder="0.00" /></div>
                <div><p className="text-[#6b7280] text-[10px] mb-1">Axis</p><Select value={state.axis} options={AXIS_VALUES} onChange={(v) => { set({ ...state, axis: v }); onChange(buildManualData()); }} placeholder="—" /></div>
                <div><p className="text-[#6b7280] text-[10px] mb-1">ADD</p><Select value={state.add} options={ADD_VALUES} onChange={(v) => { set({ ...state, add: v }); onChange(buildManualData()); }} placeholder="—" /></div>
              </div>
            </div>
          ))}

          <div className="w-40">
            <p className="text-[#6b7280] text-[10px] mb-1">PD (mm)</p>
            <Select value={pd} options={PD_VALUES} onChange={(v) => { setPd(v); onChange(buildManualData()); }} placeholder="—" />
          </div>
        </div>
      )}

      <button
        onClick={() => onChange({ method: "later" })}
        className="text-[#6b7280] hover:text-[#E8670A] text-sm underline"
      >
        Skip — I&apos;ll provide prescription via WhatsApp
      </button>
    </div>
  );
}
