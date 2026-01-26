"use client";

import { useState } from "react";

interface StablecoinMeta {
  id: string;
  symbol: string;
  name: string;
  color: string;
  currentSupply: number;
}

interface ChartDataPoint {
  date: number;
  [symbol: string]: number;
}

interface NetFlowsProps {
  data: ChartDataPoint[];
  stablecoins: StablecoinMeta[];
}

type Period = "7d" | "30d" | "90d";

const PERIODS: { label: Period; days: number }[] = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function formatBillions(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  if (Math.abs(value) >= 1e9) {
    return `${sign}$${(value / 1e9).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `${sign}$${(value / 1e6).toFixed(0)}M`;
  }
  return `${sign}$${value.toFixed(0)}`;
}

function getDataPointNDaysAgo(
  data: ChartDataPoint[],
  days: number
): ChartDataPoint | null {
  const cutoff = Date.now() / 1000 - days * 24 * 60 * 60;
  // Find closest data point to cutoff
  let closest: ChartDataPoint | null = null;
  let closestDiff = Infinity;

  for (const point of data) {
    const diff = Math.abs(point.date - cutoff);
    if (diff < closestDiff) {
      closestDiff = diff;
      closest = point;
    }
  }

  return closest;
}

export function NetFlows({ data, stablecoins }: NetFlowsProps) {
  const [period, setPeriod] = useState<Period>("30d");

  if (!data || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted">Loading flow data...</p>
      </div>
    );
  }

  const currentData = data[data.length - 1];
  const periodConfig = PERIODS.find((p) => p.label === period)!;
  const pastData = getDataPointNDaysAgo(data, periodConfig.days);

  if (!pastData) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-muted">Insufficient data for {period} flows</p>
      </div>
    );
  }

  // Calculate flows per stablecoin
  const flows = stablecoins.map((coin) => {
    const current = currentData[coin.symbol] ?? 0;
    const past = pastData[coin.symbol] ?? 0;
    const flow = current - past;
    return {
      ...coin,
      flow,
      current,
      past,
    };
  });

  // Total flow
  const totalFlow = flows.reduce((sum, f) => sum + f.flow, 0);

  // Sort by absolute flow (biggest movers first)
  const sortedFlows = [...flows].sort(
    (a, b) => Math.abs(b.flow) - Math.abs(a.flow)
  );

  // Find max absolute flow for bar scaling
  const maxAbsFlow = Math.max(...flows.map((f) => Math.abs(f.flow)));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-sm text-muted uppercase tracking-wide mb-1">
            Net Stablecoin Flows
          </p>
          <div className="flex items-baseline gap-3">
            <span
              className={`text-4xl font-semibold ${totalFlow >= 0 ? "text-accent-green" : "text-accent-red"}`}
            >
              {formatBillions(totalFlow)}
            </span>
            <span className="text-sm text-muted">{period}</span>
          </div>
          <p className="text-sm text-muted mt-1">
            {totalFlow >= 0 ? "Net inflows" : "Net outflows"} across top
            stablecoins
          </p>
        </div>

        <div className="flex gap-1 text-xs">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPeriod(p.label)}
              className={`px-2.5 py-1 rounded transition-colors ${
                period === p.label
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flow bars */}
      <div className="space-y-3 mt-6">
        {sortedFlows.map((coin) => {
          const widthPercent =
            maxAbsFlow > 0 ? (Math.abs(coin.flow) / maxAbsFlow) * 100 : 0;
          const isPositive = coin.flow >= 0;

          return (
            <div key={coin.symbol} className="flex items-center gap-3">
              <div className="w-12 flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: coin.color }}
                />
                <span className="text-sm">{coin.symbol}</span>
              </div>

              <div className="flex-1 flex items-center">
                {/* Negative side */}
                <div className="flex-1 flex justify-end">
                  {!isPositive && (
                    <div
                      className="h-4 rounded-l bg-accent-red/70"
                      style={{ width: `${widthPercent}%` }}
                    />
                  )}
                </div>

                {/* Center line */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* Positive side */}
                <div className="flex-1">
                  {isPositive && (
                    <div
                      className="h-4 rounded-r bg-accent-green/70"
                      style={{ width: `${widthPercent}%` }}
                    />
                  )}
                </div>
              </div>

              <span
                className={`w-20 text-right text-sm font-medium ${
                  isPositive ? "text-accent-green" : "text-accent-red"
                }`}
              >
                {formatBillions(coin.flow)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted mt-6 pt-4 border-t border-border">
        Calculated from supply changes. Positive = minting/inflows, Negative =
        burning/outflows.
      </p>
    </div>
  );
}
