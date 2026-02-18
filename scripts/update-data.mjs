#!/usr/bin/env node

// Auto-update stablecoin and company market caps from CoinGecko + Yahoo Finance
// Run: node scripts/update-data.mjs

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import YahooFinance from "yahoo-finance2";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// --- Mappings ---

// CoinGecko ID → pipeline entry name
const STABLECOIN_MAP = {
  tether: "Tether",
  "usd-coin": "Circle",
  "paypal-usd": "PayPal",
  "ethena-usde": "Ethena",
  dai: "Sky (MakerDAO)", // combined with USDS
  usds: "Sky (MakerDAO)", // combined with DAI
  "ripple-usd": "Ripple",
  "usd1-wlfi": "World Liberty Financial",
};

// Stock ticker → pipeline entry name
const STOCK_MAP = {
  JPM: "JPMorgan",
  V: "Visa",
  MA: "Mastercard",
  PYPL: "PayPal",
  HOOD: "Robinhood",
  SOFI: "SoFi",
  AMZN: "Amazon",
  WMT: "Walmart",
  META: "Meta",
  BCS: "Barclays",
  BBVA: "BBVA",
};

// --- Fetch stablecoin data from CoinGecko ---

async function fetchStablecoinData() {
  const ids = Object.keys(STABLECOIN_MAP).join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`);
  }

  const coins = await res.json();
  const result = {};

  for (const coin of coins) {
    const name = STABLECOIN_MAP[coin.id];
    if (!name) continue;

    const mcapM = Math.round(coin.market_cap / 1_000_000);

    if (name === "Sky (MakerDAO)") {
      // Combine USDS + DAI
      result[name] = (result[name] || 0) + mcapM;
    } else {
      result[name] = mcapM;
    }
  }

  return result;
}

// --- Fetch stock data from Yahoo Finance ---

async function fetchStockData() {
  const tickers = Object.keys(STOCK_MAP);
  const result = {};
  const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

  for (const ticker of tickers) {
    try {
      const quote = await yahooFinance.quote(ticker);
      if (quote?.marketCap) {
        const name = STOCK_MAP[ticker];
        result[name] = Math.round(quote.marketCap / 1_000_000);
      }
    } catch (err) {
      console.warn(`  Warning: Failed to fetch ${ticker}: ${err.message}`);
    }
  }

  return result;
}

// --- Update pipeline file ---

function updatePipelineFile(stablecoinMcaps, stockMcaps) {
  const filePath = join(ROOT, "src/data/stablecoin-pipeline.ts");
  let content = readFileSync(filePath, "utf-8");
  const changes = [];

  // Split into individual entry blocks
  const entries = content.split(/(?=\s*\{[\s\n]*rank:)/);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    // Extract name from entry
    const nameMatch = entry.match(/name:\s*"([^"]+)"/);
    if (!nameMatch) continue;
    const name = nameMatch[1];

    let updated = entry;

    // Update stablecoin_mcap_m if this entry uses stablecoin_mcap weight type
    if (name in stablecoinMcaps) {
      const newMcap = stablecoinMcaps[name];

      // Update stablecoin_mcap_m
      updated = updated.replace(
        /(stablecoin_mcap_m:\s*)\d+/,
        `$1${newMcap}`
      );

      // Update weight_m if weight_type is stablecoin_mcap
      if (updated.includes('weight_type: "stablecoin_mcap"')) {
        updated = updated.replace(/(weight_m:\s*)\d+/, `$1${newMcap}`);
      }

      if (updated !== entry) {
        const oldMcap = entry.match(/stablecoin_mcap_m:\s*(\d+)/)?.[1];
        changes.push(`${name}: stablecoin mcap ${oldMcap}M -> ${newMcap}M`);
      }
    }

    // Update company_mcap_m from stock data
    if (name in stockMcaps) {
      const newMcap = stockMcaps[name];
      const oldEntry = updated;

      updated = updated.replace(
        /(company_mcap_m:\s*)\d+/,
        `$1${newMcap}`
      );

      if (updated !== oldEntry) {
        const oldMcap = oldEntry.match(/company_mcap_m:\s*(\d+)/)?.[1];
        changes.push(`${name}: company mcap ${oldMcap}M -> ${newMcap}M`);
      }
    }

    entries[i] = updated;
  }

  if (changes.length > 0) {
    content = entries.join("");
    writeFileSync(filePath, content);
  }

  return changes;
}

// --- Update page timestamp ---

function updateTimestamp() {
  const filePath = join(ROOT, "src/app/page.tsx");
  let content = readFileSync(filePath, "utf-8");

  const now = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const dateStr = `${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`;

  const updated = content.replace(
    /\/\/ Data last updated: .+/,
    `// Data last updated: ${dateStr}`
  );

  if (updated !== content) {
    writeFileSync(filePath, updated);
    return true;
  }
  return false;
}

// --- Main ---

async function main() {
  console.log("Fetching stablecoin market caps from CoinGecko...");
  const stablecoinMcaps = await fetchStablecoinData();
  console.log("  Found:", Object.entries(stablecoinMcaps).map(([k, v]) => `${k}: $${v}M`).join(", "));

  console.log("Fetching stock market caps from Yahoo Finance...");
  const stockMcaps = await fetchStockData();
  console.log("  Found:", Object.entries(stockMcaps).map(([k, v]) => `${k}: $${v}M`).join(", "));

  console.log("Updating pipeline file...");
  const changes = updatePipelineFile(stablecoinMcaps, stockMcaps);

  if (changes.length > 0) {
    console.log("Changes:");
    changes.forEach((c) => console.log(`  - ${c}`));
    updateTimestamp();
    console.log("Timestamp updated.");
  } else {
    console.log("No changes detected.");
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
