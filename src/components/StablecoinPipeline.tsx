"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const userScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleImgError = (name: string) => {
    setImgErrors((prev) => new Set(prev).add(name));
  };

  // Auto-scroll effect (pauses when user is scrolling)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isUserScrolling) return;

    let animationId: number;
    const scrollSpeed = 1; // pixels per frame

    const animate = () => {
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
      container.scrollLeft += scrollSpeed;
      animationId = requestAnimationFrame(animate);
    };

    // Small delay before starting auto-scroll
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [isUserScrolling]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsUserScrolling(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = scrollRef.current?.scrollLeft || 0;
    if (userScrollTimeout.current) clearTimeout(userScrollTimeout.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStartX.current;
    scrollRef.current.scrollLeft = scrollStartX.current - dx;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Resume auto-scroll after 3 seconds of inactivity
    userScrollTimeout.current = setTimeout(() => setIsUserScrolling(false), 3000);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      userScrollTimeout.current = setTimeout(() => setIsUserScrolling(false), 3000);
    }
  };

  // Touch/wheel scroll detection
  const handleScroll = () => {
    if (!isDragging) {
      setIsUserScrolling(true);
      if (userScrollTimeout.current) clearTimeout(userScrollTimeout.current);
      userScrollTimeout.current = setTimeout(() => setIsUserScrolling(false), 3000);
    }
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
      <div
        ref={scrollRef}
        className="relative marquee-container overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onScroll={handleScroll}
      >
        <div className="flex gap-14 pl-[12%]">
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
