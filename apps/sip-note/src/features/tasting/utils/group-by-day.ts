import type { TastingNote } from "@/features/tasting/repo/types";

export type DayBucket = {
  key: string;
  label: string;
  notes: TastingNote[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (ts: number): number => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const formatLabel = (dayStart: number, todayStart: number): string => {
  const diff = Math.round((todayStart - dayStart) / DAY_MS);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  const d = new Date(dayStart);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

/**
 * Notes (already sorted desc by date) → date-bucketed list.
 * Same day notes preserve their input order.
 */
export function groupByDay(
  notes: TastingNote[],
  now: number = Date.now(),
): DayBucket[] {
  const todayStart = startOfDay(now);
  const buckets = new Map<number, TastingNote[]>();
  for (const n of notes) {
    const dayStart = startOfDay(n.date);
    const arr = buckets.get(dayStart) ?? [];
    arr.push(n);
    buckets.set(dayStart, arr);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([dayStart, dayNotes]) => ({
      key: String(dayStart),
      label: formatLabel(dayStart, todayStart),
      notes: dayNotes,
    }));
}
