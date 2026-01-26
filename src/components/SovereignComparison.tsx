"use client";

import {
  SOVEREIGN_COMPARISON,
  getTotalTreasuryHoldings,
} from "@/data/treasury-holdings";

function formatBillions(value: number): string {
  return `$${value}B`;
}

export function SovereignComparison() {
  const stablecoinTotal = getTotalTreasuryHoldings();

  // Insert stablecoins into the sovereign list
  const allHolders = [
    ...SOVEREIGN_COMPARISON.map((s) => ({
      name: s.name,
      holdings: s.holdings,
      isStablecoin: false,
    })),
    {
      name: "Stablecoin Issuers",
      holdings: stablecoinTotal,
      isStablecoin: true,
    },
  ]
    .sort((a, b) => b.holdings - a.holdings)
    .slice(0, 20);

  const stablecoinRank = allHolders.findIndex((h) => h.isStablecoin) + 1;
  const maxHolding = allHolders[0].holdings;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <p className="text-sm text-muted uppercase tracking-wide mb-1">
          Top Holders of US Treasuries
        </p>
        <p className="text-2xl font-semibold">
          Stablecoin issuers rank{" "}
          <span className="text-accent-green">#{stablecoinRank}</span> globally
        </p>
        <p className="text-sm text-muted mt-2 max-w-xl">
          Stablecoins aren&apos;t just a crypto thing—they&apos;re becoming part of the
          sovereign debt absorption infrastructure. That&apos;s the fiscal dominance
          story in one chart.
        </p>
      </div>

      <div className="space-y-2">
        {allHolders.map((holder, index) => {
          const widthPercent = (holder.holdings / maxHolding) * 100;
          return (
            <div key={holder.name} className="flex items-center gap-3">
              <span className="text-xs text-muted w-6 text-right">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`text-sm ${
                      holder.isStablecoin ? "font-semibold" : ""
                    }`}
                  >
                    {holder.name}
                    {holder.isStablecoin && (
                      <span className="ml-2 text-xs bg-accent-green/10 text-accent-green px-1.5 py-0.5 rounded">
                        Combined
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-muted">
                    {formatBillions(holder.holdings)}
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      holder.isStablecoin ? "bg-accent-green" : "bg-muted/40"
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted mt-6 pt-4 border-t border-border">
        Sovereign figures include all Treasury types (bills, notes, bonds).
        Stablecoins hold primarily T-Bills—comparing bills only, they&apos;d rank
        even higher.
      </p>
    </div>
  );
}
