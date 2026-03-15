import type { VisaLimit } from "@/features/settings/apis/visa-limits";
import type { CountryItem } from "@/types/country-item";

import { getStayDays } from "@/utils/country-region";

export interface VisaStatus {
  countryCode: string;
  usedDays: number;
  maxDays: number;
  alertDaysBefore: number;
  daysRemaining: number;
  status: "safe" | "warning" | "danger";
}

/**
 * Check visa status based on the CURRENT (latest consecutive) stay only.
 * When a user leaves a country, the counter resets for the next visit.
 *
 * Countries list should be sorted by endDate descending (newest first).
 */
export function checkVisaStatus(
  countries: CountryItem[],
  limits: VisaLimit[],
): VisaStatus[] {
  const limitMap = new Map(
    limits.map((l) => [l.country_code.toLowerCase(), l]),
  );

  // Find the latest consecutive stay per country (not cumulative).
  // countries are sorted newest-first, so the first entry per country
  // is the most recent visit.
  const latestStayByCountry = new Map<string, number>();
  for (const c of countries) {
    const code = c.country_code.toLowerCase();
    if (!latestStayByCountry.has(code)) {
      latestStayByCountry.set(code, getStayDays(c));
    }
  }

  const results: VisaStatus[] = [];
  for (const [code, limit] of limitMap) {
    const usedDays = latestStayByCountry.get(code) ?? 0;
    const daysRemaining = limit.max_days - usedDays;

    let status: VisaStatus["status"] = "safe";
    if (daysRemaining <= 0) {
      status = "danger";
    } else if (daysRemaining <= limit.alert_days_before) {
      status = "warning";
    }

    results.push({
      countryCode: code,
      usedDays,
      maxDays: limit.max_days,
      alertDaysBefore: limit.alert_days_before,
      daysRemaining,
      status,
    });
  }

  return results;
}
