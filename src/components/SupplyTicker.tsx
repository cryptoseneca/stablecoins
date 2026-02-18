"use client";

import { useEffect, useRef } from "react";

interface TickerItem {
  symbol: string;
  color: string;
  change: number;
  currentSupply: number;
}

interface SupplyTickerProps {
  items: TickerItem[];
}

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function formatSupply(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value.toFixed(0)}`;
}

function TickerContent({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((item) => {
        const isPositive = item.change >= 0;
        const pctChange =
          item.currentSupply - item.change !== 0
            ? (item.change / (item.currentSupply - item.change)) * 100
            : 0;

        return (
          <span key={item.symbol} className="inline-flex items-center gap-1.5 mx-4">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium">{item.symbol}</span>
            <span className="text-muted">{formatSupply(item.currentSupply)}</span>
            <span className={isPositive ? "text-accent-green" : "text-accent-red"}>
              {isPositive ? "+" : ""}
              {formatCompact(item.change)}
            </span>
            <span
              className={`text-[10px] ${isPositive ? "text-accent-green" : "text-accent-red"}`}
            >
              ({isPositive ? "+" : ""}
              {pctChange.toFixed(2)}%)
            </span>
          </span>
        );
      })}
    </>
  );
}

export function SupplyTicker({ items }: SupplyTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let pos = 0;
    const speed = 0.5; // px per frame

    function step() {
      pos += speed;
      // Reset when we've scrolled through the first copy
      const halfWidth = el!.scrollWidth / 2;
      if (pos >= halfWidth) pos = 0;
      el!.style.transform = `translateX(-${pos}px)`;
      animationId = requestAnimationFrame(step);
    }

    animationId = requestAnimationFrame(step);

    const handleEnter = () => cancelAnimationFrame(animationId);
    const handleLeave = () => {
      animationId = requestAnimationFrame(step);
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div className="border-b border-border bg-card overflow-hidden">
      <div className="py-1.5 text-xs whitespace-nowrap">
        <div ref={scrollRef} className="inline-flex">
          {/* Duplicate content for seamless looping */}
          <TickerContent items={items} />
          <TickerContent items={items} />
        </div>
      </div>
    </div>
  );
}
