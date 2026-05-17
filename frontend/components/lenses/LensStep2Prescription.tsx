"use client";

import { useState } from "react";
import { ExclamationTriangleIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { uploadApi } from "@/lib/api";
import type { PrescriptionData } from "@/types";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

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
  const [dragOver, setDragOver] = useState(false);

  const warning = method === "manual" ? showWarning(od, os) : null;

  async function handleFileUpload(file: File) {
    setUploading(true);
    try {
      const { data } = await uploadApi.prescription(file);
      setUploadUrl(data.url);
      onChange({ method: "upload", prescription_url: data.url });
    } catch {
      // handle error silently
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
      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] text-white text-xs px-2 py-1.5 rounded"
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
              "rounded border p-4 text-left transition-colors",
              method === m
                ? "border-[#E8670A] bg-[#FFF0E6]/5"
                : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#E8670A]/40"
            )}
          >
            <p className="text-white font-medium text-sm capitalize">{m === "upload" ? "Upload Prescription" : "Enter Manually"}</p>
            <p className="text-gray-400 text-xs mt-0.5">
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
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragOver ? "border-[#E8670A] bg-[#FFF0E6]/5" : "border-[#3a3a3a]"
          )}
        >
          <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          {uploadUrl ? (
            <p className="text-green-400 text-sm">Prescription uploaded successfully</p>
          ) : (
            <>
              <p className="text-gray-300 text-sm mb-1">Drag & drop or click to upload</p>
              <p className="text-gray-500 text-xs">JPG, PNG, PDF — max 10 MB</p>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                id="rx-upload"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
              />
              <label htmlFor="rx-upload">
                <Button variant="outline" size="sm" className="mt-3" as="span">
                  {uploading ? "Uploading…" : "Choose File"}
                </Button>
              </label>
            </>
          )}
        </div>
      )}

      {/* Manual */}
      {method === "manual" && (
        <div className="space-y-4">
          {warning && (
            <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-xs">{warning}</p>
            </div>
          )}

          {[
            { label: "Right Eye (OD)", state: od, set: setOd },
            { label: "Left Eye (OS)", state: os, set: setOs },
          ].map(({ label, state, set }) => (
            <div key={label}>
              <h4 className="text-gray-300 text-xs font-medium mb-2">{label}</h4>
              <div className="grid grid-cols-4 gap-2">
                <div><p className="text-gray-500 text-[10px] mb-1">SPH</p><Select value={state.sph} options={SPH_VALUES} onChange={(v) => { set({ ...state, sph: v }); onChange(buildManualData()); }} placeholder="0.00" /></div>
                <div><p className="text-gray-500 text-[10px] mb-1">CYL</p><Select value={state.cyl} options={CYL_VALUES} onChange={(v) => { set({ ...state, cyl: v }); onChange(buildManualData()); }} placeholder="0.00" /></div>
                <div><p className="text-gray-500 text-[10px] mb-1">Axis</p><Select value={state.axis} options={AXIS_VALUES} onChange={(v) => { set({ ...state, axis: v }); onChange(buildManualData()); }} placeholder="—" /></div>
                <div><p className="text-gray-500 text-[10px] mb-1">ADD</p><Select value={state.add} options={ADD_VALUES} onChange={(v) => { set({ ...state, add: v }); onChange(buildManualData()); }} placeholder="—" /></div>
              </div>
            </div>
          ))}

          <div className="w-40">
            <p className="text-gray-500 text-[10px] mb-1">PD (mm)</p>
            <Select value={pd} options={PD_VALUES} onChange={(v) => { setPd(v); onChange(buildManualData()); }} placeholder="—" />
          </div>
        </div>
      )}

      <button
        onClick={() => onChange({ method: "later" })}
        className="text-gray-400 hover:text-white text-sm underline"
      >
        I&apos;ll enter my prescription later
      </button>
    </div>
  );
}
