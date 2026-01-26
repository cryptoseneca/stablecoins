"use client";

// T-Bill market data (manually curated)
const CURRENT_SHARE = 2.25;
const HISTORICAL = [
  { label: "Jun 2024", value: 1.6 },
  { label: "Jun 2025", value: 2.25 },
];
const PROJECTION = "5-8% (if $2T stablecoin market materializes)";

const COMPARISONS = [
  { holder: "Money Market Funds", share: "~35%" },
  { holder: "Foreign Official", share: "~15%" },
  { holder: "Banks", share: "~8%" },
  { holder: "Stablecoins", share: `${CURRENT_SHARE}%`, highlight: true },
  { holder: "Households (direct)", share: "~3%" },
];

export function TBillShare() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-sm text-muted uppercase tracking-wide mb-4">
        Stablecoin Share of T-Bill Market
      </p>

      <div className="mb-4">
        <span className="text-4xl font-semibold">{CURRENT_SHARE}%</span>
        <div className="mt-2 h-3 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full"
            style={{ width: `${Math.min(CURRENT_SHARE * 3, 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-1 text-sm font-mono text-muted mb-6">
        {HISTORICAL.map((h) => (
          <p key={h.label}>
            {h.label}: {h.value}%
          </p>
        ))}
        <p>Projected 2028: {PROJECTION}</p>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium mb-3">Add context with comparisons:</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted">
            <span>Holder</span>
            <span>T-Bill Share</span>
          </div>
          {COMPARISONS.map((c) => (
            <div
              key={c.holder}
              className={`flex justify-between text-sm ${
                c.highlight ? "font-semibold" : ""
              }`}
            >
              <span>{c.holder}</span>
              <span>{c.share}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted mt-6 pt-4 border-t border-border">
        T-Bill market ~$6.2T outstanding. Stablecoin holdings from issuer attestations.
      </p>
    </div>
  );
}
