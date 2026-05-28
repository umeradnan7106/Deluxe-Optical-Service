import Link from "next/link";

interface WidthGuideProps {
  sizeLabel?: string | null;
  colorName?: string | null;
  material?: string | null;
  frameShape?: string | null;
  rimType?: string | null;
  frameWidthMm?: number | null;
  lensWidthMm?: number | null;
  bridgeMm?: number | null;
  templeMm?: number | null;
  lensHeightMm?: number | null;
}

const SPECS = [
  { label: "Size", key: "sizeLabel" },
  { label: "Color", key: "colorName" },
  { label: "Material", key: "material" },
  { label: "Shape", key: "frameShape" },
  { label: "Rim", key: "rimType" },
] as const;

const GlassesDiagramSVG = () => (
  <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px]">
    {/* Left lens */}
    <rect x="18" y="44" width="92" height="68" rx="13" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Right lens */}
    <rect x="170" y="44" width="92" height="68" rx="13" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
    {/* Bridge */}
    <path d="M110 78 Q140 66 170 78" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
    {/* Left temple arm */}
    <line x1="18" y1="64" x2="0" y2="64" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
    {/* Right temple arm */}
    <line x1="262" y1="64" x2="280" y2="64" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />

    {/* Lens width annotation */}
    <line x1="18" y1="28" x2="110" y2="28" stroke="#E8670A" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="18" y1="24" x2="18" y2="32" stroke="#E8670A" strokeWidth="1" />
    <line x1="110" y1="24" x2="110" y2="32" stroke="#E8670A" strokeWidth="1" />
    <text x="64" y="22" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">lens width</text>

    {/* Bridge annotation */}
    <line x1="110" y1="28" x2="170" y2="28" stroke="#E8670A" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="170" y1="24" x2="170" y2="32" stroke="#E8670A" strokeWidth="1" />
    <text x="140" y="22" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">bridge</text>

    {/* Temple annotation */}
    <line x1="262" y1="148" x2="280" y2="148" stroke="#E8670A" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="262" y1="64" x2="262" y2="152" stroke="#E8670A" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="280" y1="64" x2="280" y2="152" stroke="#E8670A" strokeWidth="1" strokeDasharray="3,2" />
    <text x="271" y="158" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">temple</text>
  </svg>
);

export default function WidthGuide({
  sizeLabel,
  colorName,
  material,
  frameShape,
  rimType,
  lensWidthMm,
  bridgeMm,
  templeMm,
}: WidthGuideProps) {
  const specValues: Record<string, string | null | undefined> = {
    sizeLabel: sizeLabel
      ? lensWidthMm
        ? `${sizeLabel} (${lensWidthMm}□${bridgeMm ?? "–"}-${templeMm ?? "–"})`
        : sizeLabel
      : lensWidthMm
      ? `${lensWidthMm}□${bridgeMm ?? "–"}-${templeMm ?? "–"}`
      : null,
    colorName,
    material,
    frameShape,
    rimType,
  };

  const hasAnySpec = Object.values(specValues).some((v) => v != null && v !== "");

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 mt-3">
      <h3 className="text-[#1a1a1a] text-[14px] font-medium mb-4">Frame Size Guide</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Left: spec list */}
        <div className="space-y-2">
          {hasAnySpec ? (
            SPECS.map(({ label, key }) => {
              const val = specValues[key];
              if (!val) return null;
              return (
                <div key={key} className="flex gap-2 text-[13px]">
                  <span className="text-[#6b7280] w-[72px] shrink-0">{label}:</span>
                  <span className="text-[#1a1a1a] font-medium capitalize">{val}</span>
                </div>
              );
            })
          ) : (
            <p className="text-[#6b7280] text-xs">No specifications available</p>
          )}

          {(lensWidthMm || bridgeMm || templeMm) && (
            <div className="pt-2 mt-2 border-t border-[#e5e7eb]">
              <p className="text-[#6b7280] text-[11px]">
                {[lensWidthMm && `${lensWidthMm}mm lens`, bridgeMm && `${bridgeMm}mm bridge`, templeMm && `${templeMm}mm temple`]
                  .filter(Boolean)
                  .join(" | ")}
              </p>
            </div>
          )}
        </div>

        {/* Right: SVG frame diagram */}
        <div className="flex items-center justify-center">
          <GlassesDiagramSVG />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#e5e7eb]">
        <Link href="/shipping-returns" className="text-[#E8670A] text-xs hover:underline">
          Not sure about your size? Size Guide &rsaquo;
        </Link>
      </div>
    </div>
  );
}
