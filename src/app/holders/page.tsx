import {
  SOVEREIGN_COMPARISON,
  getTotalTreasuryHoldings,
} from "@/data/treasury-holdings";

export const metadata = {
  title: "Top Foreign Holders of US Treasuries | fiat.markets",
  description:
    "Ranked comparison of major foreign holders of US Treasury securities, including stablecoin issuers. Data from Treasury TIC reports.",
};

function formatBillions(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}T`;
  return `$${value}B`;
}

export default function HoldersPage() {
  const stablecoinTotal = Math.round(getTotalTreasuryHoldings());

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
  ].sort((a, b) => b.holdings - a.holdings);

  const grandTotal = allHolders.reduce((sum, h) => sum + h.holdings, 0);
  const maxHolding = allHolders[0].holdings;

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
            Top Foreign Holders of US Treasuries
          </h2>
          <p className="text-muted">
            December 2025 TIC data &middot; Released Feb 18, 2026
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted text-xs uppercase tracking-wide">
                <th className="pb-3 pr-4 w-8">#</th>
                <th className="pb-3 pr-4">Holder</th>
                <th className="pb-3 pr-4 text-right">Holdings</th>
                <th className="pb-3 pr-4 text-right">Share</th>
                <th className="pb-3" style={{ minWidth: "200px" }}></th>
              </tr>
            </thead>
            <tbody>
              {allHolders.map((holder, i) => {
                const share = (holder.holdings / grandTotal) * 100;
                const barWidth = (holder.holdings / maxHolding) * 100;
                return (
                  <tr
                    key={holder.name}
                    className={`border-b border-border/50 ${
                      holder.isStablecoin ? "bg-accent-green/5" : ""
                    }`}
                  >
                    <td className="py-3 pr-4 text-muted">{i + 1}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          holder.isStablecoin ? "font-semibold" : "font-medium"
                        }
                      >
                        {holder.name}
                      </span>
                      {holder.isStablecoin && (
                        <span className="ml-2 text-xs bg-accent-green/10 text-accent-green px-1.5 py-0.5 rounded">
                          Combined
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-right font-medium">
                      {formatBillions(holder.holdings)}
                    </td>
                    <td className="py-3 pr-4 text-right text-muted">
                      {share.toFixed(1)}%
                    </td>
                    <td className="py-3">
                      <div className="h-3 bg-border/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            holder.isStablecoin
                              ? "bg-accent-green"
                              : "bg-muted/40"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-4 text-xs text-muted">
          <p>
            Sovereign figures include all US Treasury security types (bills,
            notes, bonds). Stablecoin issuers hold primarily T-Bills — comparing
            bills only, they would rank even higher.
          </p>
          <div className="pt-4 border-t border-border space-y-1">
            <p className="font-medium text-foreground text-sm">Sources</p>
            <p>
              <a
                href="https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Table 5: Major Foreign Holders of Treasury Securities
              </a>{" "}
              — US Department of the Treasury, TIC System
            </p>
            <p>
              <a
                href="https://home.treasury.gov/data/treasury-international-capital-tic-system"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Treasury International Capital (TIC) System
              </a>{" "}
              — Monthly data releases
            </p>
            <p>
              <a
                href="/treasury"
                className="underline hover:text-foreground"
              >
                Stablecoin Treasury Holdings Breakdown
              </a>{" "}
              — Individual issuer attestation data
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
