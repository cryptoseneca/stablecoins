// Stablecoin pipeline v4 - companies building/launching stablecoin products
// Weight metrics vary by entity type (deposits, volume, mcap, etc.)

export interface PipelineEntry {
  rank: number;
  name: string;
  ticker?: string | null;
  stablecoin_mcap_m?: number | null;
  company_mcap_m?: number | null; // Company/entity market cap or valuation in millions
  weight_m: number;
  weight_type: string;
  category: string;
  type: "incumbent" | "new" | "rumored";
  status: "live" | "launching" | "building" | "reported" | "just launched";
  date?: string;
  domain?: string | null;
  note: string;
}

export const PIPELINE_DATA: PipelineEntry[] = [
  {
    rank: 1,
    name: "Tether",
    ticker: "USDT",
    stablecoin_mcap_m: 187000,
    company_mcap_m: 100000, // Private, estimated from profits
    weight_m: 187000,
    weight_type: "stablecoin_mcap",
    category: "Incumbent Issuer",
    type: "incumbent",
    status: "live",
    domain: "tether.to",
    note: "Dominant player with 60%+ market share. $13B+ profit (2024). 18th largest holder of US Treasuries globally. 400M+ users across 48 blockchains."
  },
  {
    rank: 2,
    name: "Circle",
    ticker: "USDC",
    stablecoin_mcap_m: 72000,
    company_mcap_m: 9000, // IPO valuation
    weight_m: 72000,
    weight_type: "stablecoin_mcap",
    category: "Incumbent Issuer",
    type: "incumbent",
    status: "live",
    domain: "circle.com",
    note: "Filed for NYSE IPO (2024). US institutional standard. Circle Payments Network for B2B settlements. Strong DeFi integrations."
  },
  {
    rank: 3,
    name: "JPMorgan",
    ticker: "JPMD",
    stablecoin_mcap_m: null,
    company_mcap_m: 750000,
    weight_m: 2548000,
    weight_type: "customer_deposits",
    category: "TradFi",
    type: "new",
    status: "live",
    date: "Jun 2025",
    domain: "jpmorgan.com",
    note: "$2.4T+ in deposits. JPM Coin for institutional settlements. Kinexys (formerly Onyx) blockchain division. Even 1% deposit conversion = $24B stablecoin."
  },
  {
    rank: 4,
    name: "Fidelity",
    ticker: "FIDD",
    stablecoin_mcap_m: 0,
    company_mcap_m: 50000, // Private
    weight_m: 300000,
    weight_type: "brokerage_cash",
    category: "TradFi",
    type: "new",
    status: "launching",
    date: "Feb 2026",
    domain: "fidelity.com",
    note: "$4.9T AUM, ~$300B in client cash/money market balances. Testing stablecoin for fund settlements. 46M+ brokerage accounts. Fidelity Digital Assets custody arm."
  },
  {
    rank: 5,
    name: "Barclays",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 50000,
    weight_m: 650000,
    weight_type: "customer_deposits",
    category: "TradFi",
    type: "new",
    status: "building",
    domain: "barclays.com",
    note: "~£500B+ in customer deposits. Exploring blockchain for settlements. Strong UK/EU presence. Signaling interest in stablecoin rails."
  },
  {
    rank: 6,
    name: "BBVA",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 70000,
    weight_m: 450000,
    weight_type: "customer_deposits",
    category: "TradFi",
    type: "new",
    status: "building",
    domain: "bbva.com",
    note: "~€415B in customer deposits. Visa partnership for stablecoin payments. Strong LatAm distribution — key for remittance corridors."
  },
  {
    rank: 7,
    name: "SocGen",
    ticker: "EURCV",
    stablecoin_mcap_m: null,
    company_mcap_m: 30000,
    weight_m: 550000,
    weight_type: "customer_deposits",
    category: "EU Banking",
    type: "new",
    status: "live",
    date: "Aug 2025",
    domain: "societegenerale.com",
    note: "~€500B in deposits. EUR CoinVertible live. Euro-denominated stablecoin. EU monetary sovereignty play."
  },
  {
    rank: 8,
    name: "Visa",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 650000,
    weight_m: 15700000,
    weight_type: "annualized_volume",
    category: "Payments Network",
    type: "new",
    status: "live",
    domain: "visa.com",
    note: "$15.7T annual payment volume (2024). Stablecoin card settlements growing 460% YoY. Partnered with Circle, Solana, and multiple crypto card issuers."
  },
  {
    rank: 9,
    name: "Mastercard",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 500000,
    weight_m: 9000000,
    weight_type: "annualized_volume",
    category: "Payments Network",
    type: "new",
    status: "building",
    domain: "mastercard.com",
    note: "~$9T annual volume. Multi-Token Network for tokenized settlement. More cautious than Visa but building stablecoin infrastructure."
  },
  {
    rank: 10,
    name: "Stripe / Bridge",
    ticker: "USDB",
    stablecoin_mcap_m: null,
    company_mcap_m: 70000, // Private
    weight_m: 1400000,
    weight_type: "annualized_volume",
    category: "Payments Infra",
    type: "new",
    status: "live",
    domain: "stripe.com",
    note: "$1T+ payment volume (2024). Acquired Bridge for $1.1B (largest crypto acquisition). Stablecoin APIs for 100+ countries. Powers SpaceX, Starlink payouts."
  },
  {
    rank: 11,
    name: "PayPal",
    ticker: "PYUSD",
    stablecoin_mcap_m: 850,
    company_mcap_m: 90000,
    weight_m: 35000,
    weight_type: "customer_balances",
    category: "Fintech",
    type: "new",
    status: "live",
    date: "2023",
    domain: "paypal.com",
    note: "~$35B in customer balances held. 434M active accounts. PYUSD at $850M mcap. $1.2B/yr interest earned on customer balances. Stablecoin = rewrapping existing float."
  },
  {
    rank: 12,
    name: "Revolut",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 75000, // Private
    weight_m: 38000,
    weight_type: "customer_deposits",
    category: "Fintech",
    type: "new",
    status: "building",
    domain: "revolut.com",
    note: "$38B total customer balances (2024, +66% YoY). 65M customers. $75B valuation. UK banking license. OCC application in US (Feb 2026). Big stablecoin plans for 2026."
  },
  {
    rank: 13,
    name: "Robinhood",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 50000,
    weight_m: 34200,
    weight_type: "cash_sweep_balances",
    category: "Fintech",
    type: "new",
    status: "live",
    domain: "robinhood.com",
    note: "$34.2B cash sweep balances (Oct 2025). 24M+ funded customers. Global Dollar Network founding partner (USDG). $69B net deposits trailing 12mo."
  },
  {
    rank: 14,
    name: "SoFi",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 15000,
    weight_m: 32900,
    weight_type: "customer_deposits",
    category: "Fintech",
    type: "new",
    status: "building",
    domain: "sofi.com",
    note: "$25B+ deposits. 10M+ members. FDIC-insured bank charter. 90% direct deposit rate. Well-positioned for stablecoin with existing Treasury exposure."
  },
  {
    rank: 15,
    name: "Amazon",
    ticker: null,
    stablecoin_mcap_m: 0,
    company_mcap_m: 2200000,
    weight_m: 700000,
    weight_type: "marketplace_gmv",
    category: "BigTech",
    type: "rumored",
    status: "reported",
    domain: "amazon.com",
    note: "~$700B+ marketplace GMV. Reportedly pursuing stablecoin. Could bypass credit card interchange with direct stablecoin payments — 3% savings for merchants."
  },
  {
    rank: 16,
    name: "Walmart",
    ticker: null,
    stablecoin_mcap_m: 0,
    company_mcap_m: 750000,
    weight_m: 648000,
    weight_type: "annual_revenue",
    category: "BigTech",
    type: "rumored",
    status: "reported",
    domain: "walmart.com",
    note: "$648B annual revenue. Reportedly pursuing stablecoin. Massive merchant network + physical retail could drive consumer adoption."
  },
  {
    rank: 17,
    name: "Meta",
    ticker: null,
    stablecoin_mcap_m: 0,
    company_mcap_m: 1500000,
    weight_m: 100000,
    weight_type: "estimated_potential",
    category: "BigTech",
    type: "rumored",
    status: "reported",
    domain: "meta.com",
    note: "3B+ users across platforms. May re-enter after Diem/Libra failure. No deposits to convert but unmatched distribution. Regulatory environment now friendlier."
  },
  {
    rank: 18,
    name: "World Liberty Financial",
    ticker: "USD1",
    stablecoin_mcap_m: 3400,
    company_mcap_m: null, // Private, early stage
    weight_m: 3400,
    weight_type: "stablecoin_mcap",
    category: "Political / DeFi",
    type: "new",
    status: "live",
    date: "Mar 2025",
    domain: "worldlibertyfinancial.com",
    note: "Trump family-backed DeFi venture. USD1 stablecoin launched Mar 2025. Aave integration. Controversial but rapidly growing. OCC bank charter application pending."
  },
  {
    rank: 19,
    name: "Sky (MakerDAO)",
    ticker: "USDS / DAI",
    stablecoin_mcap_m: 8960,
    company_mcap_m: 2000, // MKR token mcap
    weight_m: 8960,
    weight_type: "stablecoin_mcap",
    category: "DeFi",
    type: "incumbent",
    status: "live",
    domain: "sky.money",
    note: "USDS ($5.6B) + DAI ($3.36B) = $8.96B combined. Oldest decentralized stablecoin. Projecting $611M revenue in 2026 (+81% YoY)."
  },
  {
    rank: 20,
    name: "Ethena",
    ticker: "USDe",
    stablecoin_mcap_m: 5400,
    company_mcap_m: 3000, // ENA token mcap
    weight_m: 5400,
    weight_type: "stablecoin_mcap",
    category: "DeFi",
    type: "new",
    status: "live",
    domain: "ethena.fi",
    note: "$5.4B mcap. Synthetic delta-neutral stablecoin. 4th largest overall. Novel mechanism — captures funding rate spread."
  },
  {
    rank: 21,
    name: "Ripple",
    ticker: "RLUSD",
    stablecoin_mcap_m: 300,
    company_mcap_m: 100000, // XRP mcap
    weight_m: 300,
    weight_type: "stablecoin_mcap",
    category: "Crypto",
    type: "new",
    status: "live",
    date: "Dec 2024",
    domain: "ripple.com",
    note: "$300M+ mcap. XRP Ledger + Ethereum. Cross-border payment DNA. $11B XRP market cap as parent. Growing in LatAm and APAC corridors."
  },
  {
    rank: 22,
    name: "Tether (US Entity)",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: null, // Part of Tether
    weight_m: 1000,
    weight_type: "estimated_potential",
    category: "Issuer",
    type: "new",
    status: "building",
    domain: "tether.to",
    note: "Tether exploring US-regulated entity. Partnered with Cantor Fitzgerald for custody. Seeking to expand US institutional access."
  },
  {
    rank: 23,
    name: "Klarna",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 15000, // Private
    weight_m: 10000,
    weight_type: "customer_balances",
    category: "Fintech",
    type: "new",
    status: "building",
    domain: "klarna.com",
    note: "~$10B est. customer float (BNPL receivables + merchant settlements). 150M+ users. Pre-IPO at $14.7B valuation. Natural stablecoin-settlement candidate."
  },
  {
    rank: 24,
    name: "EU Bank Consortium",
    ticker: "EUR",
    stablecoin_mcap_m: null,
    company_mcap_m: null, // Consortium
    weight_m: 5000000,
    weight_type: "consortium_deposits",
    category: "EU Banking",
    type: "new",
    status: "building",
    domain: null,
    note: "Major EU banks exploring joint EUR stablecoin (reported). Combined deposits €5T+. Euro monetary sovereignty play vs USD stablecoin dominance."
  },
  {
    rank: 25,
    name: "Paxos",
    ticker: "USDP / USDG",
    stablecoin_mcap_m: 500,
    company_mcap_m: 2500, // Private
    weight_m: 2500,
    weight_type: "valuation",
    category: "Infra",
    type: "new",
    status: "live",
    domain: "paxos.com",
    note: "$2.5B valuation. White-label stablecoin issuer for PayPal (PYUSD), Fiserv, Global Dollar Network (USDG). Infrastructure layer — powers others' stablecoins."
  },
  {
    rank: 26,
    name: "Anchorage Digital",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 3000, // Private
    weight_m: 3000,
    weight_type: "valuation",
    category: "Infra",
    type: "new",
    status: "live",
    domain: "anchorage.com",
    note: "$3B+ valuation. First federally chartered crypto bank (OCC). Issues USAT for Tether. Western Union partnership. Custody for institutions."
  },
  {
    rank: 27,
    name: "BVNK",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 1000, // Private
    weight_m: 30000,
    weight_type: "annualized_volume",
    category: "Infra",
    type: "new",
    status: "live",
    domain: "bvnk.com",
    note: "$30B annualized volume. Visa Ventures + Citi Ventures backed. Powers Worldpay, Deel, Flywire. B2B stablecoin payments infra."
  },
  {
    rank: 28,
    name: "Rain",
    ticker: null,
    stablecoin_mcap_m: null,
    company_mcap_m: 500, // Private
    weight_m: 500,
    weight_type: "valuation",
    category: "Infra",
    type: "new",
    status: "live",
    domain: "raincards.com",
    note: "Stablecoin-to-card infrastructure. Enables companies to issue Visa/Mastercard cards funded by stablecoins. Institutional on/off ramp layer."
  }
];

// Weight type labels for display
export const WEIGHT_TYPE_LABELS: Record<string, string> = {
  stablecoin_mcap: "mcap",
  customer_deposits: "deposits",
  customer_balances: "balances",
  cash_sweep_balances: "cash sweep",
  brokerage_cash: "brokerage cash",
  annualized_volume: "volume",
  marketplace_gmv: "GMV",
  annual_revenue: "revenue",
  estimated_potential: "potential",
  consortium_deposits: "deposits",
  valuation: "valuation",
};

// Category colors
export const CATEGORY_COLORS: Record<string, string> = {
  "Incumbent Issuer": "#22c55e",
  "TradFi": "#3b82f6",
  "EU Banking": "#6366f1",
  "Payments Network": "#8b5cf6",
  "Payments Infra": "#a855f7",
  "Fintech": "#ec4899",
  "BigTech": "#f59e0b",
  "Political / DeFi": "#ef4444",
  "DeFi": "#14b8a6",
  "Crypto": "#06b6d4",
  "Issuer": "#22c55e",
  "Infra": "#64748b",
};

export function getTotalWeight(): number {
  return PIPELINE_DATA.reduce((sum, e) => sum + e.weight_m, 0);
}

export function formatWeight(millions: number): string {
  if (millions >= 1000000) {
    return `$${(millions / 1000000).toFixed(1)}T`;
  }
  if (millions >= 1000) {
    return `$${(millions / 1000).toFixed(0)}B`;
  }
  return `$${millions}M`;
}
