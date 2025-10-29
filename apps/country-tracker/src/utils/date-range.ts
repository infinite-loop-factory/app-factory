import { DateTime } from "luxon";

export type DateBoundary = "start" | "end";

export function buildIsoDateRange(start: string, end: string): string[] {
  const startDt = DateTime.fromISO(start);
  const endDt = DateTime.fromISO(end);
  if (!(startDt.isValid && endDt.isValid)) return [];
  const dates: string[] = [];
  let cursor = startDt.startOf("day");
  const last = endDt.startOf("day");
  while (cursor <= last) {
    const iso = cursor.toISODate();
    if (iso) {
      dates.push(iso);
    }
    cursor = cursor.plus({ days: 1 });
  }
  return dates;
}

export function isInvalidIsoRange(start: string, end: string): boolean {
  const startDt = DateTime.fromISO(start);
  const endDt = DateTime.fromISO(end);
  if (!(startDt.isValid && endDt.isValid)) return true;
  return endDt.diff(startDt, "days").days < 0;
}

export function countInclusiveDays(start: string, end: string): number {
  if (isInvalidIsoRange(start, end)) {
    return 0;
  }
  const startDt = DateTime.fromISO(start).startOf("day");
  const endDt = DateTime.fromISO(end).startOf("day");
  return Math.floor(endDt.diff(startDt, "days").days) + 1;
}

export function toUtcBoundaryTimestamp(
  date: string,
  zone: string,
  boundary: DateBoundary = "start",
): string {
  const base = DateTime.fromISO(date, { zone });
  if (!base.isValid) {
    return new Date().toISOString();
  }
  const localized =
    boundary === "start" ? base.startOf("day") : base.endOf("day");
  return localized.setZone("utc").toISO() ?? new Date().toISOString();
}
