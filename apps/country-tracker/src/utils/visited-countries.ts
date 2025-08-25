import type { CountryItem } from "@/features/home/types/country";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import { DENYLIST_STORAGE_KEY } from "@/constants/storage-keys";
import supabase from "@/libs/supabase";

function countryCodeToFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function getValidDate(isoString: string, zone: string): string | null {
  const dt = DateTime.fromISO(isoString, { zone });
  return dt.isValid ? dt.toFormat("yyyy-MM-dd") : null;
}

function groupDatesByCountry(
  locations: { country: string; country_code: string; timestamp: string }[],
  zone: string,
) {
  const countryDateMap = new Map<
    string,
    { countryCode: string; dates: string[] }
  >();
  for (const loc of locations) {
    const country = loc.country || "Unknown";
    const countryCode = loc.country_code || "";
    const date = getValidDate(loc.timestamp, zone);
    if (!date) continue;
    if (!countryDateMap.has(country)) {
      countryDateMap.set(country, { countryCode, dates: [date] });
    } else {
      const entry = countryDateMap.get(country);
      if (entry) {
        entry.dates.push(date);
      }
    }
  }
  return countryDateMap;
}

function makeCountryItemGroup(
  country: string,
  countryCode: string,
  group: string[],
): CountryItem | null {
  if (group.length === 0) return null;
  const start = group[0] ?? "";
  const end = group[group.length - 1] ?? "";
  return {
    id: `${country}-${start}-${end}`,
    country,
    country_code: countryCode,
    flag: countryCodeToFlagEmoji(countryCode),
    startDate: start,
    endDate: end,
    stayDays: group.length,
    dateSet: [...group],
  };
}

function groupConsecutiveDatesToItems(
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

export async function fetchVisitedCountries(
  userId: string,
): Promise<CountryItem[]> {
  // Fetch denylisted countries from AsyncStorage
  const denylistJson = await AsyncStorage.getItem(DENYLIST_STORAGE_KEY);
  const denylistedCodes = new Set<string>(
    denylistJson ? JSON.parse(denylistJson) : [],
  );

  const { data: locations, error } = await supabase
    .from("locations")
    .select("latitude,longitude,timestamp,country,country_code")
    .eq("user_id", userId);

  if (error || !locations) {
    return [];
  }

  // Filter out denylisted locations
  const filteredLocations = locations.filter(
    (loc) => !denylistedCodes.has(loc.country_code),
  );

  const currentZone = DateTime.local().zoneName;
  const countryDateMap = groupDatesByCountry(filteredLocations, currentZone);

  let items: CountryItem[] = [];
  for (const [country, { countryCode, dates }] of countryDateMap.entries()) {
    items = items.concat(
      groupConsecutiveDatesToItems(country, countryCode, dates),
    );
  }
  items.sort((a, b) => b.endDate.localeCompare(a.endDate));
  return items;
}
