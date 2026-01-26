// Major stablecoin legislation and regulatory events
// Dates as Unix timestamps (seconds)

export interface LegislationEvent {
  date: number; // Unix timestamp
  label: string;
  description: string;
  type: "legislation" | "regulatory" | "market";
}

export const LEGISLATION_EVENTS: LegislationEvent[] = [
  {
    date: new Date("2025-07-15").getTime() / 1000,
    label: "GENIUS Act Signed",
    description: "GENIUS Act signed into law",
    type: "legislation",
  },
];

export function getEventsInRange(
  startDate: number,
  endDate: number
): LegislationEvent[] {
  return LEGISLATION_EVENTS.filter(
    (e) => e.date >= startDate && e.date <= endDate
  );
}
