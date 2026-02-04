"use client";

import { useState } from "react";
import {
  PIPELINE_DATA,
  WEIGHT_TYPE_LABELS,
  formatWeight,
  PipelineEntry,
} from "@/data/stablecoin-pipeline";

const LOGO_TOKEN = "pk_K4kkSlrqQtSH4Vicr3FSeQ";
const CRYPTO_CATEGORIES = ["Incumbent Issuer", "DeFi", "Crypto", "Political / DeFi", "Issuer"];

function getLogoUrl(entry: PipelineEntry) {
  if (entry.ticker && CRYPTO_CATEGORIES.includes(entry.category)) {
    const ticker = entry.ticker.split("/")[0].trim();
    return `https://img.logo.dev/crypto/${ticker}?token=${LOGO_TOKEN}`;
  }
  if (entry.domain) {
    return `https://img.logo.dev/${entry.domain}?token=${LOGO_TOKEN}`;
  }
  return null;
}

export function StablecoinPipeline() {
  const [selectedEntry, setSelectedEntry] = useState<PipelineEntry | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const handleImgError = (name: string) => {
    setImgErrors((prev) => new Set(prev).add(name));
  };

  // Sort by company market cap descending for visual impact
  const sortedData = [...PIPELINE_DATA].sort((a, b) => (b.company_mcap_m || 0) - (a.company_mcap_m || 0));

  // Calculate total company market cap for the header
  const totalCompanyMcap = PIPELINE_DATA.reduce((sum, e) => sum + (e.company_mcap_m || 0), 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-muted uppercase tracking-wide mb-1">
          Stablecoin Pipeline
        </p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl font-semibold">{formatWeight(totalCompanyMcap)}</span>
          <span className="text-sm text-muted">
            combined market cap across {PIPELINE_DATA.length} players building stablecoins
          </span>
        </div>
      </div>

      {/* Floating marquee with edge fade */}
      <div className="relative marquee-container">
        <div className="flex gap-14 animate-marquee hover:[animation-play-state:paused]">
          {[...sortedData, ...sortedData].map((entry, i) => {
            const logoUrl = getLogoUrl(entry);
            const showLogo = logoUrl && !imgErrors.has(entry.name + i);
            const isSelected = selectedEntry?.name === entry.name;

            return (
              <button
                key={`${entry.name}-${i}`}
                onClick={() => setSelectedEntry(isSelected ? null : entry)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className="w-16 h-16 flex items-center justify-center">
                  {showLogo ? (
                    <img
                      src={logoUrl}
                      alt={entry.name}
                      className="w-14 h-14 object-contain"
                      onError={() => handleImgError(entry.name + i)}
                    />
                  ) : (
                    <span className="text-lg font-medium text-muted">
                      {entry.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium truncate max-w-[100px]">
                    {entry.name}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatWeight(entry.weight_m)}
                  </div>
                  <div className="text-xs text-muted">
                    {WEIGHT_TYPE_LABELS[entry.weight_type] || entry.weight_type}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted mt-4 pt-4 border-t border-border">
        Tap any logo for details
      </p>

      {/* Detail panel */}
      {selectedEntry && (
        <div className="mt-4 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {getLogoUrl(selectedEntry) && !imgErrors.has(selectedEntry.name) && (
                <img
                  src={getLogoUrl(selectedEntry)!}
                  alt=""
                  className="w-8 h-8 rounded"
                  onError={() => handleImgError(selectedEntry.name)}
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{selectedEntry.name}</span>
                  {selectedEntry.ticker && (
                    <span className="text-muted text-sm">({selectedEntry.ticker})</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{selectedEntry.category}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedEntry(null)}
              className="text-muted hover:text-foreground text-lg leading-none p-1"
            >
              ×
            </button>
          </div>

          <div className="text-lg font-semibold mb-2">
            {formatWeight(selectedEntry.weight_m)}
            <span className="text-sm text-muted font-normal ml-2">
              {WEIGHT_TYPE_LABELS[selectedEntry.weight_type] || selectedEntry.weight_type}
            </span>
          </div>

          <p className="text-sm text-muted leading-relaxed">{selectedEntry.note}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .marquee-container {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
      `}</style>
    </div>
  );
}
