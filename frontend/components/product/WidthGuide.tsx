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

function FrontDiagram({ lensWidthMm, bridgeMm }: { lensWidthMm?: number | null; bridgeMm?: number | null }) {
  return (
    <svg viewBox="0 0 280 140" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px]">
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
      <line x1="18" y1="26" x2="110" y2="26" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="18" y1="22" x2="18" y2="30" stroke="#C9A84C" strokeWidth="1.5" />
      <line x1="110" y1="22" x2="110" y2="30" stroke="#C9A84C" strokeWidth="1.5" />
      <text x="64" y="20" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">
        {lensWidthMm ? `${lensWidthMm}mm` : "lens width"}
      </text>

      {/* Bridge annotation */}
      <line x1="110" y1="26" x2="170" y2="26" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="170" y1="22" x2="170" y2="30" stroke="#C9A84C" strokeWidth="1.5" />
      <text x="140" y="20" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">
        {bridgeMm ? `${bridgeMm}mm` : "bridge"}
      </text>
    </svg>
  );
}

function SideDiagram({ templeMm }: { templeMm?: number | null }) {
  return (
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[180px]">
      {/* Front piece */}
      <rect x="8" y="20" width="40" height="50" rx="8" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Temple arm going back */}
      <path d="M8 36 Q4 36 2 44 L2 80 Q2 86 8 86 L120 86 Q128 86 128 78" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Temple length annotation */}
      <line x1="8" y1="96" x2="128" y2="96" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="8" y1="92" x2="8" y2="100" stroke="#C9A84C" strokeWidth="1.5" />
      <line x1="128" y1="92" x2="128" y2="100" stroke="#C9A84C" strokeWidth="1.5" />
      <text x="68" y="108" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="sans-serif">
        {templeMm ? `${templeMm}mm temple` : "temple length"}
      </text>
    </svg>
  );
}

export default function WidthGuide({
  sizeLabel,
  colorName,
  material,
  frameShape,
  rimType,
  frameWidthMm,
  lensWidthMm,
  bridgeMm,
  templeMm,
  lensHeightMm,
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
  const hasMeasurements = lensWidthMm || bridgeMm || templeMm || frameWidthMm || lensHeightMm;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 mt-3">
      <h3 className="text-[#1a1a1a] text-[14px] font-medium mb-4">Frame Size Guide</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
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

          {hasMeasurements && (
            <div className="pt-3 mt-1 border-t border-[#e5e7eb] space-y-1 text-[12px]">
              {lensWidthMm && <p className="text-[#6b7280]">Lens Width: <span className="text-[#1a1a1a] font-medium">{lensWidthMm}mm</span></p>}
              {bridgeMm && <p className="text-[#6b7280]">Bridge: <span className="text-[#1a1a1a] font-medium">{bridgeMm}mm</span></p>}
              {templeMm && <p className="text-[#6b7280]">Temple: <span className="text-[#1a1a1a] font-medium">{templeMm}mm</span></p>}
              {frameWidthMm && <p className="text-[#6b7280]">Frame Width: <span className="text-[#1a1a1a] font-medium">{frameWidthMm}mm</span></p>}
              {lensHeightMm && <p className="text-[#6b7280]">Lens Height: <span className="text-[#1a1a1a] font-medium">{lensHeightMm}mm</span></p>}
            </div>
          )}
        </div>

        {/* Right: front-view SVG with mm values */}
        <div className="flex flex-col items-center gap-3">
          <FrontDiagram lensWidthMm={lensWidthMm} bridgeMm={bridgeMm} />
        </div>
      </div>

      {/* Side view diagram */}
      {templeMm && (
        <div className="flex justify-center pt-2 border-t border-[#e5e7eb]">
          <SideDiagram templeMm={templeMm} />
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[#e5e7eb]">
        <Link href="/shipping-returns" className="text-[#C9A84C] text-xs hover:underline">
          Not sure about your size? Size Guide &rsaquo;
        </Link>
      </div>
    </div>
  );
}
