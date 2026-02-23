// Data last updated: Feb 23, 2026
import { SupplyChart } from "@/components/SupplyChart";
import { SupplyTicker } from "@/components/SupplyTicker";
import { NetFlows } from "@/components/NetFlows";
import { TreasuryHoldings } from "@/components/TreasuryHoldings";
import { SovereignComparison } from "@/components/SovereignComparison";
import { TBillShare } from "@/components/TBillShare";
import { StablecoinPipeline } from "@/components/StablecoinPipeline";
import {
  getAllStablecoins,
  getStablecoinHistory,
  getTopStablecoins,
  getStablecoinColor,
} from "@/lib/defillama";

export interface StablecoinMeta {
  id: string;
  symbol: string;
  name: string;
  color: string;
  currentSupply: number;
}

export interface ChartDataPoint {
  date: number;
  [symbol: string]: number;
}

async function getChartData(): Promise<{
  data: ChartDataPoint[];
  stablecoins: StablecoinMeta[];
}> {
  // Fetch all stablecoins
  const { peggedAssets } = await getAllStablecoins();

  // Get top 10 stablecoins by market cap
  const topStablecoins = getTopStablecoins(peggedAssets, 10);

  // Build metadata with colors
  const stablecoinMeta: StablecoinMeta[] = topStablecoins.map((s, i) => ({
    id: s.id,
    symbol: s.symbol,
    name: s.name,
    color: getStablecoinColor(i),
    currentSupply: s.circulating?.peggedUSD ?? 0,
  }));

  // Fetch history for each stablecoin
  const histories = await Promise.all(
    topStablecoins.map((s) => getStablecoinHistory(s.id))
  );

  // Build a map of date -> values
  const dataMap = new Map<number, ChartDataPoint>();

  // Process each stablecoin's history
  histories.forEach((history, index) => {
    const symbol = stablecoinMeta[index].symbol;
    history.tokens?.forEach((point) => {
      const date = point.date;
      const value = point.circulating?.peggedUSD ?? 0;

      if (!dataMap.has(date)) {
        const entry: ChartDataPoint = { date };
        stablecoinMeta.forEach((s) => {
          entry[s.symbol] = 0;
        });
        dataMap.set(date, entry);
      }

      const entry = dataMap.get(date)!;
      entry[symbol] = value;
    });
  });

  // Sort by date and return all data (filtering happens client-side)
  const sorted = Array.from(dataMap.values()).sort((a, b) => a.date - b.date);

  return { data: sorted, stablecoins: stablecoinMeta };
}

export default async function Home() {
  const { data: chartData, stablecoins } = await getChartData();
  const lastUpdated = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Compute 24h supply changes for the ticker
  const tickerItems = stablecoins.map((coin) => {
    const latest = chartData[chartData.length - 1];
    const prev = chartData[chartData.length - 2];
    const currentSupply = latest?.[coin.symbol] ?? 0;
    const prevSupply = prev?.[coin.symbol] ?? 0;
    return {
      symbol: coin.symbol,
      color: coin.color,
      change: currentSupply - prevSupply,
      currentSupply,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Supply ticker */}
      <SupplyTicker items={tickerItems} />

      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="fiat.markets logo" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold">fiat.markets</h1>
              <p className="text-sm text-muted">macro analysis through the 4Fs framework</p>
            </div>
          </a>
          <span className="text-xs text-muted">
            <span className="hidden sm:inline">Updated {lastUpdated}</span>
            <span className="sm:hidden">Updated on {new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" })}</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <SupplyChart data={chartData} stablecoins={stablecoins} />
        <StablecoinPipeline />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetFlows data={chartData} stablecoins={stablecoins} />
          <TreasuryHoldings />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TBillShare />
          <SovereignComparison />
        </div>
      </main>
    </div>
  );
}
