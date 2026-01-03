import { DateTime } from "luxon";

export function formatDisplayDate(date: string): string {
  const dt = DateTime.fromISO(date);
  if (!dt.isValid) {
    return date;
  }
  return dt.toFormat("yyyy-MM-dd");
}
