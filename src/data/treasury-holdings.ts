// Manually curated from attestation reports
// Update this file when new attestations are published

export interface TreasuryHolding {
  symbol: string;
  name: string;
  treasuryHoldings: number; // USD value in billions
  totalReserves: number; // USD value in billions
  treasuryPercent: number;
  lastUpdated: string; // Date of attestation
  source: string; // URL to attestation
}

export const TREASURY_HOLDINGS: TreasuryHolding[] = [
  {
    symbol: "USDT",
    name: "Tether",
    treasuryHoldings: 141,
    totalReserves: 193,
    treasuryPercent: 73,
    lastUpdated: "2025-12-31",
    source: "https://tether.to/transparency/",
  },
  {
    symbol: "USDC",
    name: "Circle",
    treasuryHoldings: 40,
    totalReserves: 70.7,
    treasuryPercent: 57,
    lastUpdated: "2026-02-02",
    source: "https://www.circle.com/transparency",
  },
  {
    symbol: "DAI",
    name: "MakerDAO",
    treasuryHoldings: 2.2,
    totalReserves: 5.3,
    treasuryPercent: 42,
    lastUpdated: "2025-01-01",
    source: "https://makerburn.com/",
  },
  {
    symbol: "FDUSD",
    name: "First Digital",
    treasuryHoldings: 2.5,
    totalReserves: 2.8,
    treasuryPercent: 89,
    lastUpdated: "2025-01-01",
    source: "https://firstdigitallabs.com/",
  },
  {
    symbol: "USDS",
    name: "Sky Dollar",
    treasuryHoldings: 1.8,
    totalReserves: 4.2,
    treasuryPercent: 43,
    lastUpdated: "2025-01-01",
    source: "https://sky.money/",
  },
];

// Reference: Top sovereign holders of US Treasuries (for comparison)
export const SOVEREIGN_COMPARISON = [
  { name: "Japan", holdings: 1100 },
  { name: "China", holdings: 775 },
  { name: "UK", holdings: 750 },
  { name: "Luxembourg", holdings: 400 },
  { name: "Canada", holdings: 350 },
  { name: "Belgium", holdings: 330 },
  { name: "Ireland", holdings: 310 },
  { name: "Switzerland", holdings: 290 },
  { name: "Cayman Islands", holdings: 285 },
  { name: "Taiwan", holdings: 275 },
  { name: "India", holdings: 245 },
  { name: "Hong Kong", holdings: 230 },
  { name: "Brazil", holdings: 225 },
  { name: "Singapore", holdings: 210 },
  { name: "France", holdings: 195 },
  { name: "Saudi Arabia", holdings: 185 },
  // Stablecoins would rank here (~$188B combined)
  { name: "South Korea", holdings: 180 },
  { name: "Germany", holdings: 175 },
  { name: "Norway", holdings: 165 },
  { name: "Mexico", holdings: 95 },
];

export function getTotalTreasuryHoldings(): number {
  return TREASURY_HOLDINGS.reduce((sum, h) => sum + h.treasuryHoldings, 0);
}

export function getStablecoinRank(): number {
  const total = getTotalTreasuryHoldings();
  const rank = SOVEREIGN_COMPARISON.findIndex((s) => s.holdings < total);
  return rank === -1 ? SOVEREIGN_COMPARISON.length + 1 : rank + 1;
}
