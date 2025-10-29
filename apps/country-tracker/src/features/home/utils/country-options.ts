import { getAllCountryPolygons } from "@/features/map/utils/country-polygons";
import { countryCodeToFlagEmoji } from "@/utils/country-code-to-flag-emoji";

export type CountryOption = {
  code: string;
  label: string;
  flag: string;
};

function buildCountryOptions(): CountryOption[] {
  const unique = new Map<string, CountryOption>();
  const polygons = getAllCountryPolygons();
  for (const polygon of polygons) {
    const code = polygon.country_code?.toUpperCase();
    if (!code || unique.has(code)) continue;
    unique.set(code, {
      code,
      label: polygon.name ?? code,
      flag: countryCodeToFlagEmoji(code),
    });
  }
  return Array.from(unique.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}

export const COUNTRY_OPTIONS = buildCountryOptions();
export const COUNTRY_OPTION_MAP = new Map<string, CountryOption>(
  COUNTRY_OPTIONS.map((option) => [option.code, option]),
);
