"use client";

import { getTotalTreasuryHoldings } from "@/data/treasury-holdings";

// T-Bill market size (outstanding, in billions)
// Source: https://fiscal.treasury.gov/
const T_BILL_MARKET_SIZE = 6200; // ~$6.2T

// Historical stablecoin treasury holdings for YoY comparison (in billions)
const HOLDINGS_ONE_YEAR_AGO = 125; // ~$125B in Jan 2025

// Major T-Bill holders for comparison (% of total market)
const MAJOR_HOLDERS = [
  { name: "Money Market Funds", share: 35, color: "#6366f1" },
  { name: "Foreign Official", share: 15, color: "#8b5cf6" },
  { name: "Banks", share: 8, color: "#a78bfa" },
  { name: "Households", share: 3, color: "#c4b5fd" },
];

export function TBillShare() {
  const totalHoldings = getTotalTreasuryHoldings();
  const sharePercent = (totalHoldings / T_BILL_MARKET_SIZE) * 100;
  const yoyGrowth = ((totalHoldings - HOLDINGS_ONE_YEAR_AGO) / HOLDINGS_ONE_YEAR_AGO) * 100;

  // Add stablecoins to the comparison and sort
  const allHolders = [
    ...MAJOR_HOLDERS,
    { name: "Stablecoins", share: sharePercent, color: "#26A17B" },
  ].sort((a, b) => b.share - a.share);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <p className="text-sm text-muted uppercase tracking-wide mb-1">
          Stablecoin Share of T-Bill Market
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-semibold">{sharePercent.toFixed(1)}%</span>
          <span className="text-sm text-accent-green">
            +{yoyGrowth.toFixed(0)}% YoY
          </span>
        </div>
        <p className="text-sm text-muted mt-2">
          ${totalHoldings.toFixed(0)}B of ${(T_BILL_MARKET_SIZE / 1000).toFixed(1)}T outstanding
        </p>
      </div>

      {/* Comparison breakdown */}
      <div className="space-y-2">
        <p className="text-xs text-muted uppercase tracking-wide mb-2">
          T-Bill Holders by Share
        </p>
        {allHolders.map((holder) => {
          const isStablecoin = holder.name === "Stablecoins";
          return (
            <div
              key={holder.name}
              className={`flex items-center justify-between text-sm ${
                isStablecoin ? "font-medium" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: holder.color }}
                />
                <span>{holder.name}</span>
              </div>
              <span className={isStablecoin ? "" : "text-muted"}>
                {holder.share < 10 ? holder.share.toFixed(1) : `~${Math.round(holder.share)}`}%
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted mt-4 pt-4 border-t border-border">
        T-Bill market ~$6.2T outstanding. Holder shares estimated from{" "}
        <a
          href="https://www.federalreserve.gov/releases/z1/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Federal Reserve
        </a>{" "}
        data.
      </p>
    </div>
  );
}
