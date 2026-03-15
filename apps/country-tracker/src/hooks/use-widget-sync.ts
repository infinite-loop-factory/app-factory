import type { CountryItem } from "@/types/country-item";

import { useEffect } from "react";
import { Platform } from "react-native";
import { buildWidgetData, writeWidgetData } from "@/utils/widget-bridge";

function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return "🏳️";
  return String.fromCodePoint(
    ...code.split("").map((c) => 127397 + c.charCodeAt(0)),
  );
}

export function useWidgetSync(countries: CountryItem[]) {
  useEffect(() => {
    if (Platform.OS !== "ios" || countries.length === 0) return;

    // Deduplicate countries
    const uniqueCountries = new Map<string, CountryItem>();
    for (const c of countries) {
      if (!uniqueCountries.has(c.country_code)) {
        uniqueCountries.set(c.country_code, c);
      }
    }

    // Most recent country = first in sorted list
    const mostRecent = countries[0];

    const data = buildWidgetData({
      countriesVisited: uniqueCountries.size,
      currentCountry: mostRecent?.country,
      currentCountryCode: mostRecent?.country_code,
      recentCountries: [...uniqueCountries.values()].slice(0, 3).map((c) => ({
        country: c.country,
        countryCode: c.country_code,
        flag: getFlagEmoji(c.country_code),
      })),
    });

    writeWidgetData(data).catch((_e) => {
      /* best-effort */
    });
  }, [countries]);
}
