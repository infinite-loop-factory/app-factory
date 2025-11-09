import type { CountryItem } from "@/types/country-item";

import { DateTime } from "luxon";
import { normalizeCountryCode } from "@/features/map/utils/normalize-country-code";
import { countryCodeToFlagEmoji } from "@/utils/country-code-to-flag-emoji";
import { formatIsoDate } from "@/utils/format-date";

export type LocationRecord = {
  country: string;
  country_code: string;
  timestamp: string;
};

export type GroupedCountryDatesEntry = {
  country: string;
  countryCode: string;
  dates: string[];
};

export type GroupedCountryDates = Map<string, GroupedCountryDatesEntry>;

type CountryKeyMeta = {
  key: string;
  country: string;
  countryCode: string;
};

function resolveCountryKeyMeta(loc: LocationRecord): CountryKeyMeta {
  const normalizedCode = normalizeCountryCode(loc.country_code) ?? "";
  const trimmedName = loc.country?.trim() ?? "";
  const rawCode = loc.country_code?.trim() ?? "";
  const countryCode = normalizedCode || rawCode;
  const fallbackKey = trimmedName ? trimmedName.toLowerCase() : "unknown";

  return {
    key: normalizedCode || fallbackKey,
    country: trimmedName,
    countryCode,
  };
}

export function groupDatesByCountry(
  locations: LocationRecord[],
  zone: string,
): GroupedCountryDates {
  const countryDateMap: GroupedCountryDates = new Map();

  for (const loc of locations) {
    const date = formatIsoDate(loc.timestamp, { zone, fallback: null });
    if (!date) continue;

    const meta = resolveCountryKeyMeta(loc);
    const entry = countryDateMap.get(meta.key);

    if (!entry) {
      countryDateMap.set(meta.key, {
        country: meta.country,
        countryCode: meta.countryCode,
        dates: [date],
      });
      continue;
    }

    entry.dates.push(date);

    if (!entry.countryCode && meta.countryCode) {
      entry.countryCode = meta.countryCode;
    }

    if (!entry.country && meta.country) {
      entry.country = meta.country;
    }
  }

  return countryDateMap;
}

export function makeCountryItemGroup(
  country: string,
  countryCode: string,
  group: string[],
): CountryItem | null {
  if (group.length === 0) return null;
  const start = group[0] ?? "";
  const end = group[group.length - 1] ?? "";
  const normalizedCode = normalizeCountryCode(countryCode) ?? countryCode;
  const trimmedCountry = country?.trim() ?? "";
  const isPlaceholderName = trimmedCountry.length === 0;
  const displayCountry = isPlaceholderName
    ? normalizedCode || "Unknown"
    : trimmedCountry;

  return {
    id: `${displayCountry}-${start}-${end}`,
    country: displayCountry,
    country_code: normalizedCode,
    flag: countryCodeToFlagEmoji(normalizedCode),
    startDate: start,
    endDate: end,
    stayDays: group.length,
    dateSet: [...group],
  };
}

export function groupConsecutiveDatesToItems(
  country: string,
  countryCode: string,
  dates: string[],
): CountryItem[] {
  const sortedDates = Array.from(new Set(dates)).sort();
  const items: CountryItem[] = [];

  let group: string[] = [];
  let prevDate: string | null = null;

  for (const date of sortedDates) {
    if (!prevDate) {
      group = [date];
    } else {
      const prev = DateTime.fromISO(prevDate);
      const curr = DateTime.fromISO(date);
      if (prev.isValid && curr.isValid && curr.diff(prev, "days").days === 1) {
        group.push(date);
      } else {
        const item = makeCountryItemGroup(country, countryCode, group);
        if (item) items.push(item);
        group = [date];
      }
    }

    prevDate = date;
  }

  const item = makeCountryItemGroup(country, countryCode, group);
  if (item) items.push(item);

  return items;
}

export function buildCountryItemsFromLocations(
  locations: LocationRecord[],
  zone: string,
): CountryItem[] {
  const groups = groupDatesByCountry(locations, zone);
  const items: CountryItem[] = [];

  for (const { country, countryCode, dates } of groups.values()) {
    items.push(...groupConsecutiveDatesToItems(country, countryCode, dates));
  }

  items.sort((a, b) => b.endDate.localeCompare(a.endDate));
  return items;
}
