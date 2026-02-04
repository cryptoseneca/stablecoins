// Stablecoin pipeline - companies building/launching stablecoin products
// Curated from public announcements, filings, and reports

export interface PipelineEntry {
  name: string;
  ticker?: string;
  logo?: string; // URL or placeholder
  stablecoinMcap?: number; // millions
  parentAum?: number; // millions (market cap or AUM)
  category: string;
  type: "incumbent" | "new" | "rumored";
  status: "live" | "launching" | "building" | "reported";
  date?: string;
  note: string;
}

export const PIPELINE_DATA: PipelineEntry[] = [
  {
    name: "Tether",
    ticker: "USDT",
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
    stablecoinMcap: 187000,
    category: "Incumbent Issuer",
    type: "incumbent",
    status: "live",
    note: "Global dominant, 60%+ market share. 17th largest holder of US Treasuries.",
  },
  {
    name: "Circle",
    ticker: "USDC",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    stablecoinMcap: 72000,
    category: "Incumbent Issuer",
    type: "incumbent",
    status: "live",
    note: "NYSE-listed (CRCL). US institutional standard.",
  },
  {
    name: "Visa",
    logo: "https://logo.clearbit.com/visa.com",
    parentAum: 633000,
    category: "Payments",
    type: "new",
    status: "live",
    note: "Stablecoin-linked card spend $3.5B annualized. USDC settlement live.",
  },
  {
    name: "Mastercard",
    logo: "https://logo.clearbit.com/mastercard.com",
    parentAum: 510000,
    category: "Payments",
    type: "new",
    status: "building",
    note: "Multi-Token Network for tokenized settlement.",
  },
  {
    name: "Fidelity",
    ticker: "FIDD",
    logo: "https://logo.clearbit.com/fidelity.com",
    parentAum: 5800000,
    category: "TradFi",
    type: "new",
    status: "launching",
    date: "Feb 2026",
    note: "Fidelity Digital Dollar on Ethereum. $5.8T AUM.",
  },
  {
    name: "JPMorgan",
    ticker: "JPMD",
    logo: "https://logo.clearbit.com/jpmorgan.com",
    parentAum: 4100000,
    category: "TradFi",
    type: "new",
    status: "live",
    note: "JPMD deposit token on Coinbase Base L2.",
  },
  {
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    parentAum: 2300000,
    category: "BigTech",
    type: "rumored",
    status: "reported",
    note: "Reportedly pursuing stablecoin for payment discounts.",
  },
  {
    name: "Meta",
    logo: "https://logo.clearbit.com/meta.com",
    parentAum: 1600000,
    category: "BigTech",
    type: "rumored",
    status: "reported",
    note: "May re-enter after Diem failure. 3B+ users.",
  },
  {
    name: "Walmart",
    logo: "https://logo.clearbit.com/walmart.com",
    parentAum: 648000,
    category: "BigTech",
    type: "rumored",
    status: "reported",
    note: "Reportedly pursuing stablecoin. Massive merchant network.",
  },
  {
    name: "Stripe",
    ticker: "USDB",
    logo: "https://logo.clearbit.com/stripe.com",
    parentAum: 91000,
    category: "Payments",
    type: "new",
    status: "live",
    note: "Acquired Bridge for $1.1B. Stablecoin accounts in 101 countries.",
  },
  {
    name: "PayPal",
    ticker: "PYUSD",
    logo: "https://logo.clearbit.com/paypal.com",
    stablecoinMcap: 850,
    parentAum: 70000,
    category: "Fintech",
    type: "new",
    status: "live",
    note: "PYUSD via Paxos. Expanding cross-border + LatAm.",
  },
  {
    name: "Robinhood",
    logo: "https://logo.clearbit.com/robinhood.com",
    parentAum: 40000,
    category: "Fintech",
    type: "new",
    status: "live",
    note: "Founding partner of Global Dollar Network (USDG). 24M+ accounts.",
  },
  {
    name: "Revolut",
    logo: "https://logo.clearbit.com/revolut.com",
    parentAum: 45000,
    category: "Fintech",
    type: "new",
    status: "building",
    note: "Big stablecoin plans for 2026. 50M+ customers.",
  },
  {
    name: "Klarna",
    logo: "https://logo.clearbit.com/klarna.com",
    parentAum: 14700,
    category: "Fintech",
    type: "new",
    status: "building",
    note: "Stablecoin plans for 2026. 150M+ users globally.",
  },
  {
    name: "SocGen",
    ticker: "EURCV",
    logo: "https://logo.clearbit.com/societegenerale.com",
    parentAum: 1800000,
    category: "EU Banking",
    type: "new",
    status: "live",
    note: "EUR CoinVertible. Euro stablecoin live.",
  },
  {
    name: "Barclays",
    logo: "https://logo.clearbit.com/barclays.com",
    parentAum: 1500000,
    category: "TradFi",
    type: "new",
    status: "building",
    note: "Invested in Ubyx stablecoin settlement.",
  },
  {
    name: "BBVA",
    logo: "https://logo.clearbit.com/bbva.com",
    parentAum: 60000,
    category: "EU Banking",
    type: "new",
    status: "building",
    note: "Partnering with Visa on stablecoin. Strong LatAm presence.",
  },
  {
    name: "SoFi",
    ticker: "SoFiUSD",
    logo: "https://logo.clearbit.com/sofi.com",
    parentAum: 31000,
    category: "Fintech",
    type: "new",
    status: "live",
    note: "SoFiUSD on Ethereum. 10M+ members.",
  },
  {
    name: "World Liberty",
    ticker: "USD1",
    logo: "https://logo.clearbit.com/worldlibertyfinancial.com",
    stablecoinMcap: 3400,
    category: "Political/DeFi",
    type: "new",
    status: "live",
    note: "Trump family venture. Fastest growing stablecoin.",
  },
  {
    name: "Sky",
    ticker: "USDS",
    logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg",
    stablecoinMcap: 8960,
    category: "DeFi",
    type: "incumbent",
    status: "live",
    note: "USDS + DAI combined. Oldest decentralized stablecoin.",
  },
  {
    name: "Ethena",
    ticker: "USDe",
    logo: "https://cryptologos.cc/logos/ethena-usde-ena-logo.svg",
    stablecoinMcap: 5365,
    category: "DeFi",
    type: "new",
    status: "live",
    note: "Synthetic dollar, delta-neutral. 4th largest stablecoin.",
  },
  {
    name: "Ripple",
    ticker: "RLUSD",
    logo: "https://cryptologos.cc/logos/xrp-xrp-logo.svg",
    stablecoinMcap: 493,
    category: "Crypto",
    type: "new",
    status: "live",
    note: "Cross-border settlement via RippleNet.",
  },
];

// Helper functions
export function getByStatus(status: PipelineEntry["status"]): PipelineEntry[] {
  return PIPELINE_DATA.filter((e) => e.status === status);
}

export function getTotalAum(): number {
  return PIPELINE_DATA.reduce((sum, e) => sum + (e.parentAum || 0), 0);
}

export function formatAum(millions: number): string {
  if (millions >= 1000000) {
    return `$${(millions / 1000000).toFixed(1)}T`;
  }
  return `$${(millions / 1000).toFixed(0)}B`;
}
