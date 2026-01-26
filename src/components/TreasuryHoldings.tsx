"use client";

import {
  TREASURY_HOLDINGS,
  getTotalTreasuryHoldings,
  getStablecoinRank,
} from "@/data/treasury-holdings";

function formatBillions(value: number): string {
  return `$${value.toFixed(1)}B`;
}

export function TreasuryHoldings() {
  const total = getTotalTreasuryHoldings();
  const rank = getStablecoinRank();

  // Sort by holdings descending
  const sorted = [...TREASURY_HOLDINGS].sort(
    (a, b) => b.treasuryHoldings - a.treasuryHoldings
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <p className="text-sm text-muted uppercase tracking-wide mb-1">
          US Treasury Holdings by Stablecoin Issuers
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-semibold">{formatBillions(total)}</span>
          <span className="text-sm text-muted">
            #{rank} largest holder globally
          </span>
        </div>
        <p className="text-sm text-muted mt-2">
          Stablecoin issuers collectively hold more US debt than South Korea
        </p>
      </div>

      {/* Stacked bar visualization */}
      <div className="mb-4">
        <div className="flex h-8 rounded overflow-hidden">
          {sorted.map((holding, i) => {
            const width = (holding.treasuryHoldings / total) * 100;
            const colors = ["#26A17B", "#2775CA", "#F5AC37", "#6366f1", "#8b5cf6"];
            return (
              <div
                key={holding.symbol}
                className="relative group"
                style={{
                  width: `${width}%`,
                  backgroundColor: colors[i % colors.length],
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {holding.symbol}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown table */}
      <div className="space-y-2">
        {sorted.map((holding, i) => {
          const colors = ["#26A17B", "#2775CA", "#F5AC37", "#6366f1", "#8b5cf6"];
          const sharePercent = (holding.treasuryHoldings / total) * 100;
          return (
            <div
              key={holding.symbol}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span>{holding.symbol}</span>
                <span className="text-muted text-xs">
                  {holding.treasuryPercent}% of reserves
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted text-xs">
                  {sharePercent.toFixed(0)}%
                </span>
                <span className="font-medium w-16 text-right">
                  {formatBillions(holding.treasuryHoldings)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last updated */}
      <p className="text-xs text-muted mt-4 pt-4 border-t border-border">
        Data from issuer attestations.{" "}
        <a
          href="https://tether.to/transparency/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Tether
        </a>
        {" · "}
        <a
          href="https://www.circle.com/transparency"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Circle
        </a>
      </p>
    </div>
  );
}
