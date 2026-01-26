const BASE_URL = "https://stablecoins.llama.fi";

export interface Stablecoin {
  id: string;
  name: string;
  symbol: string;
  geckoId: string;
  pegType: string;
  pegMechanism: string;
  circulating: {
    peggedUSD: number;
  };
  chains: string[];
}

export interface StablecoinChartData {
  date: number;
  totalCirculatingUSD: {
    peggedUSD: number;
  };
}

export interface StablecoinHistoryData {
  date: number;
  circulating: {
    peggedUSD: number;
  };
}

export interface StablecoinWithHistory extends Stablecoin {
  chainCirculating: Record<string, { current: { peggedUSD: number } }>;
  tokens: StablecoinHistoryData[];
}

export async function getAllStablecoins(): Promise<{
  peggedAssets: Stablecoin[];
}> {
  const res = await fetch(`${BASE_URL}/stablecoins?includePrices=true`);
  if (!res.ok) throw new Error("Failed to fetch stablecoins");
  return res.json();
}

export async function getStablecoinHistory(
  id: string
): Promise<StablecoinWithHistory> {
  const res = await fetch(`${BASE_URL}/stablecoin/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch stablecoin ${id}`);
  return res.json();
}

export async function getStablecoinCharts(): Promise<StablecoinChartData[]> {
  const res = await fetch(`${BASE_URL}/stablecoincharts/all`);
  if (!res.ok) throw new Error("Failed to fetch stablecoin charts");
  return res.json();
}

// Color palette for stablecoins
const COLORS = [
  "#26A17B", // Tether green
  "#2775CA", // USDC blue
  "#F5AC37", // DAI yellow
  "#1a1a1a", // Black
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#84cc16", // Lime
];

export function getStablecoinColor(index: number): string {
  return COLORS[index % COLORS.length];
}

export function getTopStablecoins(
  stablecoins: Stablecoin[],
  count: number = 5
): Stablecoin[] {
  return stablecoins
    .sort((a, b) => (b.circulating?.peggedUSD ?? 0) - (a.circulating?.peggedUSD ?? 0))
    .slice(0, count);
}
