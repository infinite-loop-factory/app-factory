import type { CountryItem } from "@/features/home/types/country";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import { DENYLIST_STORAGE_KEY } from "@/constants/storage-keys";
import {
  groupConsecutiveDatesToItems,
  groupDatesByCountry,
} from "@/features/map/utils/visited-country-helpers";
import supabase from "@/libs/supabase";

export async function fetchVisitedCountries(
  userId: string,
): Promise<CountryItem[]> {
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

  const filteredLocations = locations.filter(
    (loc) => !denylistedCodes.has(loc.country_code),
  );

  const currentZone = DateTime.local().zoneName;
  const countryDateMap = groupDatesByCountry(filteredLocations, currentZone);

  const items: CountryItem[] = [];
  for (const { country, countryCode, dates } of countryDateMap.values()) {
    items.push(...groupConsecutiveDatesToItems(country, countryCode, dates));
  }

  items.sort((a, b) => b.endDate.localeCompare(a.endDate));
  return items;
}
