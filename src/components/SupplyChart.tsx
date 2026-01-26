"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import {
  LEGISLATION_EVENTS,
  type LegislationEvent,
} from "@/data/legislation-events";

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

interface SupplyChartProps {
  data: ChartDataPoint[];
  stablecoins: StablecoinMeta[];
}

type TimeRange = "1M" | "3M" | "6M" | "1Y" | "Max";

const TIME_RANGES: { label: TimeRange; days: number | null }[] = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "Max", days: null },
];

const EVENT_COLOR = "#166534"; // green for legislation

function formatBillions(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(0)}M`;
  }
  return `$${value.toFixed(0)}`;
}

interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
}) {
  if (!active || !payload || !label) return null;

  const sorted = [...payload].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const total = sorted.reduce((sum, p) => sum + (p.value ?? 0), 0);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm text-xs">
      <p className="font-medium mb-2">
        {format(new Date(label * 1000), "MMM d, yyyy")}
      </p>
      {sorted.map((entry) => (
        <div key={entry.dataKey} className="flex justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.dataKey}</span>
          </div>
          <span className="font-medium">{formatBillions(entry.value)}</span>
        </div>
      ))}
      <div className="flex justify-between gap-4 pt-2 mt-2 border-t border-gray-100 font-medium">
        <span>Total</span>
        <span>{formatBillions(total)}</span>
      </div>
    </div>
  );
}


export function SupplyChart({ data, stablecoins }: SupplyChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("Max");

  const filteredData = useMemo(() => {
    const range = TIME_RANGES.find((r) => r.label === timeRange);
    if (!range || range.days === null) return data;

    const cutoff = Date.now() / 1000 - range.days * 24 * 60 * 60;
    return data.filter((d) => d.date >= cutoff);
  }, [data, timeRange]);

  const visibleEvents = useMemo(() => {
    if (!filteredData.length) return [];
    const startDate = filteredData[0].date;
    const endDate = filteredData[filteredData.length - 1].date;
    return LEGISLATION_EVENTS.filter(
      (e) => e.date >= startDate && e.date <= endDate
    );
  }, [filteredData]);

  if (!data || data.length === 0) {
    return (
      <div className="h-75 flex items-center justify-center text-muted">
        Loading chart data...
      </div>
    );
  }

  const calcTotal = (point: ChartDataPoint) =>
    stablecoins.reduce((sum, s) => sum + (point[s.symbol] ?? 0), 0);

  const latestTotal = calcTotal(filteredData[filteredData.length - 1]);
  const firstTotal = calcTotal(filteredData[0]);
  const changePercent =
    firstTotal > 0 ? ((latestTotal - firstTotal) / firstTotal) * 100 : 0;

  const stackedCoins = [...stablecoins].reverse();

  const periodLabel =
    timeRange === "Max"
      ? "all time"
      : timeRange === "1Y"
        ? "YoY"
        : timeRange;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-sm text-muted uppercase tracking-wide mb-1">
            Total Stablecoin Supply
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold">
              {formatBillions(latestTotal)}
            </span>
            {timeRange !== "Max" && (
              <span
                className={`text-sm ${changePercent >= 0 ? "text-accent-green" : "text-accent-red"}`}
              >
                {changePercent >= 0 ? "+" : ""}
                {changePercent.toFixed(1)}% {periodLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1 text-xs">
          {TIME_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => setTimeRange(range.label)}
              className={`px-2.5 py-1 rounded transition-colors ${
                timeRange === range.label
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={filteredData}
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={(ts) => format(new Date(ts * 1000), "MMM yy")}
            tick={{ fontSize: 11, fill: "#737373" }}
            axisLine={false}
            tickLine={false}
            minTickGap={50}
          />
          <YAxis
            tickFormatter={formatBillions}
            tick={{ fontSize: 11, fill: "#737373" }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          {visibleEvents.map((event) => (
            <ReferenceLine
              key={event.date}
              x={event.date}
              stroke={EVENT_COLOR}
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: event.label,
                position: "top",
                fill: EVENT_COLOR,
                fontSize: 10,
                fontWeight: 500,
              }}
            />
          ))}
          {stackedCoins.map((coin) => (
            <Area
              key={coin.symbol}
              type="monotone"
              dataKey={coin.symbol}
              stackId="1"
              stroke="none"
              fill={coin.color}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        {stablecoins.map((coin) => (
          <div key={coin.symbol} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: coin.color }}
            />
            <span className="text-muted">{coin.symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
