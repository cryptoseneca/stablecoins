"use client";

import { useState, useMemo } from "react";
import { PIPELINE_DATA, formatAum, getTotalAum } from "@/data/stablecoin-pipeline";

const STATUS_COLORS: Record<string, { fill: string; stroke: string }> = {
  live: { fill: "#22c55e", stroke: "#16a34a" },
  launching: { fill: "#3b82f6", stroke: "#2563eb" },
  building: { fill: "#f59e0b", stroke: "#d97706" },
  reported: { fill: "#64748b", stroke: "#475569" },
};

interface BubbleData {
  name: string;
  ticker?: string;
  aum: number;
  category: string;
  status: string;
  note: string;
  radius: number;
  x: number;
  y: number;
}

export function StablecoinPipeline() {
  const [hoveredBubble, setHoveredBubble] = useState<BubbleData | null>(null);

  const totalAum = getTotalAum();
  const liveCount = PIPELINE_DATA.filter((e) => e.status === "live").length;
  const buildingCount = PIPELINE_DATA.filter(
    (e) => e.status === "building" || e.status === "launching"
  ).length;
  const reportedCount = PIPELINE_DATA.filter((e) => e.status === "reported").length;

  const bubbles = useMemo(() => {
    // Prepare bubble data sorted by size (largest first for better packing)
    const sortedData = PIPELINE_DATA
      .filter((entry) => (entry.parentAum || entry.stablecoinMcap || 0) > 0)
      .map((entry) => ({
        name: entry.name,
        ticker: entry.ticker,
        aum: entry.parentAum || entry.stablecoinMcap || 0,
        category: entry.category,
        status: entry.status,
        note: entry.note,
      }))
      .sort((a, b) => b.aum - a.aum);

    // Calculate radii using sqrt scale
    const maxAum = Math.max(...sortedData.map((d) => d.aum));
    const minRadius = 18;
    const maxRadius = 80;

    const bubbleData: BubbleData[] = sortedData.map((d) => ({
      ...d,
      radius: minRadius + (maxRadius - minRadius) * Math.sqrt(d.aum / maxAum),
      x: 0,
      y: 0,
    }));

    // Circle packing with spiral placement
    const width = 800;
    const height = 380;
    const centerX = width / 2;
    const centerY = height / 2;
    const placed: BubbleData[] = [];

    for (const bubble of bubbleData) {
      let bestX = centerX;
      let bestY = centerY;
      let found = false;

      for (let a = 0; a < 360 * 12 && !found; a += 10) {
        const r = (a / 360) * 45;
        const testX = centerX + Math.cos((a * Math.PI) / 180) * r;
        const testY = centerY + Math.sin((a * Math.PI) / 180) * r;

        let collision = false;
        for (const p of placed) {
          const dx = testX - p.x;
          const dy = testY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < bubble.radius + p.radius + 3) {
            collision = true;
            break;
          }
        }

        if (
          !collision &&
          testX - bubble.radius > 5 &&
          testX + bubble.radius < width - 5 &&
          testY - bubble.radius > 5 &&
          testY + bubble.radius < height - 5
        ) {
          bestX = testX;
          bestY = testY;
          found = true;
        }
      }

      bubble.x = bestX;
      bubble.y = bestY;
      placed.push(bubble);
    }

    return bubbleData;
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-4">
        <p className="text-sm text-muted uppercase tracking-wide mb-1">
          Stablecoin Pipeline
        </p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl font-semibold">{formatAum(totalAum)}</span>
          <span className="text-sm text-muted">
            combined AUM entering stablecoins
          </span>
        </div>
        <div className="flex gap-6 mt-3 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            <span className="text-muted">{liveCount} live</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="text-muted">{buildingCount} building</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#64748b]" />
            <span className="text-muted">{reportedCount} rumored</span>
          </span>
        </div>
      </div>

      {/* Bubble visualization */}
      <div className="relative bg-background/50 rounded-lg border border-border/50 overflow-hidden">
        <svg viewBox="0 0 800 380" className="w-full h-auto">
          {bubbles.map((bubble) => {
            const isHovered = hoveredBubble?.name === bubble.name;
            const color = STATUS_COLORS[bubble.status].fill;
            return (
              <g
                key={bubble.name}
                onMouseEnter={() => setHoveredBubble(bubble)}
                onMouseLeave={() => setHoveredBubble(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={bubble.x}
                  cy={bubble.y}
                  r={bubble.radius}
                  fill={color}
                  opacity={isHovered ? 0.95 : 0.75}
                  style={{ transition: "opacity 0.15s ease" }}
                />
                {bubble.radius > 28 && (
                  <>
                    <text
                      x={bubble.x}
                      y={bubble.y - (bubble.radius > 45 ? 6 : 0)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize={Math.min(13, Math.max(9, bubble.radius / 4))}
                      fontWeight={600}
                      style={{ pointerEvents: "none" }}
                    >
                      {bubble.name}
                    </text>
                    {bubble.radius > 45 && (
                      <text
                        x={bubble.x}
                        y={bubble.y + 10}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.75)"
                        fontSize={9}
                        style={{ pointerEvents: "none" }}
                      >
                        {formatAum(bubble.aum)}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredBubble && (
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur border border-border rounded-lg p-3 shadow-xl max-w-xs z-10">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[hoveredBubble.status].fill }}
              />
              <span className="font-semibold">{hoveredBubble.name}</span>
              {hoveredBubble.ticker && (
                <span className="text-muted text-xs">({hoveredBubble.ticker})</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <span className="font-medium">{formatAum(hoveredBubble.aum)}</span>
              <span className="text-muted">·</span>
              <span className="text-muted text-xs">{hoveredBubble.category}</span>
            </div>
            <div className="text-xs text-muted leading-relaxed">{hoveredBubble.note}</div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted mt-3">
        Bubble size represents AUM or market cap. Data from public announcements.
      </p>
    </div>
  );
}
