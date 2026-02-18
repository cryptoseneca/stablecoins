import {
  TREASURY_HOLDINGS,
  getTotalTreasuryHoldings,
  getStablecoinRank,
} from "@/data/treasury-holdings";

export const metadata = {
  title: "US Treasury Holdings by Stablecoin Issuers | fiat.markets",
  description:
    "Detailed breakdown of US Treasury securities held by major stablecoin issuers, with links to attestation reports.",
};

function formatBillions(value: number): string {
  if (value === 0) return "$0";
  if (value < 1) return `$${(value * 1000).toFixed(0)}M`;
  return `$${value.toFixed(1)}B`;
}

export default function TreasuryPage() {
  const total = getTotalTreasuryHoldings();
  const rank = getStablecoinRank();
  const sorted = [...TREASURY_HOLDINGS].sort(
    (a, b) => b.treasuryHoldings - a.treasuryHoldings
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src="/logo.svg" alt="fiat.markets logo" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold">fiat.markets</h1>
              <p className="text-sm text-muted">
                macro analysis through the 4Fs framework
              </p>
            </div>
          </a>
          <a href="/" className="text-sm text-muted hover:text-foreground">
            &larr; Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-1">
            US Treasury Holdings by Stablecoin Issuers
          </h2>
          <p className="text-muted">
            {formatBillions(total)} combined &middot; #{rank} largest holder
            globally
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted text-xs uppercase tracking-wide">
                <th className="pb-3 pr-4">Issuer</th>
                <th className="pb-3 pr-4">Symbol</th>
                <th className="pb-3 pr-4 text-right">Treasury Holdings</th>
                <th className="pb-3 pr-4 text-right">Total Reserves</th>
                <th className="pb-3 pr-4 text-right">% in Treasuries</th>
                <th className="pb-3 pr-4 text-right">Share</th>
                <th className="pb-3">Attestation</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((holding) => {
                const share = (holding.treasuryHoldings / total) * 100;
                return (
                  <tr
                    key={holding.symbol}
                    className="border-b border-border/50"
                  >
                    <td className="py-3 pr-4 font-medium">{holding.name}</td>
                    <td className="py-3 pr-4 text-muted">{holding.symbol}</td>
                    <td className="py-3 pr-4 text-right">
                      {formatBillions(holding.treasuryHoldings)}
                    </td>
                    <td className="py-3 pr-4 text-right text-muted">
                      {formatBillions(holding.totalReserves)}
                    </td>
                    <td className="py-3 pr-4 text-right text-muted">
                      {holding.treasuryPercent}%
                    </td>
                    <td className="py-3 pr-4 text-right text-muted">
                      {share < 0.1 ? "<0.1" : share.toFixed(1)}%
                    </td>
                    <td className="py-3">
                      <a
                        href={holding.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-green hover:underline"
                      >
                        View report &rarr;
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-border font-medium">
                <td className="pt-3 pr-4">Total</td>
                <td className="pt-3 pr-4"></td>
                <td className="pt-3 pr-4 text-right">
                  {formatBillions(total)}
                </td>
                <td className="pt-3 pr-4 text-right text-muted">
                  {formatBillions(
                    TREASURY_HOLDINGS.reduce(
                      (sum, h) => sum + h.totalReserves,
                      0
                    )
                  )}
                </td>
                <td className="pt-3 pr-4"></td>
                <td className="pt-3 pr-4 text-right">100%</td>
                <td className="pt-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="text-xs text-muted mt-6">
          Data sourced from individual issuer attestation and transparency
          reports. Holdings figures are approximate and based on the most recent
          available disclosures. Last attestation dates vary by issuer.
        </p>
      </main>
    </div>
  );
}
