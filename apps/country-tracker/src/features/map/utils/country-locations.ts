import type {
  CountryLocation,
  CountryLocationEntry,
  CountryMetadataOverride,
} from "@/features/map/types/country-location";

import {
  getAllCountryPolygons,
  getCountryPolygon,
} from "@/features/map/utils/country-polygons";
import { computePolygonCentroid } from "@/features/map/utils/polygon-centroid";

const DEFAULT_CAPITAL = "Unknown";

const COUNTRY_METADATA_OVERRIDES: Record<string, CountryMetadataOverride> = {
  AR: { capital: "Buenos Aires" },
  AU: { capital: "Canberra" },
  BR: { capital: "Brasília" },
  CA: { capital: "Ottawa" },
  CN: { capital: "Beijing" },
  DE: { capital: "Berlin" },
  ES: { capital: "Madrid" },
  FR: { capital: "Paris" },
  GB: {
    capital: "London",
    aliases: ["United Kingdom of Great Britain and Northern Ireland"],
  },
  IT: { capital: "Rome" },
  JP: { capital: "Tokyo" },
  KR: {
    country: "South Korea",
    capital: "Seoul",
    aliases: ["Republic of Korea", "Korea, South"],
  },
  MX: { capital: "Mexico City" },
  NL: { capital: "Amsterdam" },
  NZ: { capital: "Wellington" },
  RU: {
    capital: "Moscow",
    aliases: ["Russian Federation"],
  },
  TH: { capital: "Bangkok" },
  US: {
    country: "United States",
    capital: "Washington, D.C.",
    aliases: ["United States of America", "USA", "U.S.", "U.S.A."],
  },
  ZA: { capital: "Pretoria" },
};

function buildCountryLocations(): CountryLocationEntry[] {
  const polygons = getAllCountryPolygons();
  const entries: CountryLocationEntry[] = [];

  for (const polygon of polygons) {
    const centroid = computePolygonCentroid(polygon.coordinates);
    if (!centroid) continue;

    const code = polygon.country_code.toUpperCase();
    const override = COUNTRY_METADATA_OVERRIDES[code] ?? {};
    const displayName = override.country ?? polygon.name?.trim() ?? code;
    const capital = override.capital ?? DEFAULT_CAPITAL;

    const location: CountryLocation = {
      country: displayName,
      country_code: code,
      capital,
      latitude: centroid.latitude,
      longitude: centroid.longitude,
    };

    const aliasSet = new Set<string>();
    aliasSet.add(displayName);
    if (polygon.name) {
      aliasSet.add(polygon.name);
    }
    override.aliases?.forEach((alias) => {
      aliasSet.add(alias);
    });

    entries.push({ location, aliases: Array.from(aliasSet) });
  }

  entries.sort((a, b) =>
    a.location.country.localeCompare(b.location.country, undefined, {
      sensitivity: "base",
    }),
  );

  return entries;
}

const LOCATION_ENTRIES = buildCountryLocations();

export const COUNTRY_LOCATIONS: CountryLocation[] = LOCATION_ENTRIES.map(
  (entry) => entry.location,
);

const COUNTRY_BY_NAME = new Map<string, CountryLocation>();
const COUNTRY_BY_CODE = new Map<string, CountryLocation>();

for (const { location, aliases } of LOCATION_ENTRIES) {
  COUNTRY_BY_CODE.set(location.country_code.toLowerCase(), location);
  for (const alias of aliases) {
    const normalized = alias.trim().toLowerCase();
    if (!normalized) continue;
    if (!COUNTRY_BY_NAME.has(normalized)) {
      COUNTRY_BY_NAME.set(normalized, location);
    }
  }
}

function buildCountryLocationFromPolygon(
  countryCode: string,
): CountryLocation | undefined {
  const polygon = getCountryPolygon(countryCode);
  if (!polygon) return undefined;

  const centroid = computePolygonCentroid(polygon.coordinates);
  if (!centroid) return undefined;

  const code = polygon.country_code.toUpperCase();
  const override = COUNTRY_METADATA_OVERRIDES[code] ?? {};

  return {
    country: override.country ?? polygon.name?.trim() ?? code,
    country_code: code,
    capital: override.capital ?? DEFAULT_CAPITAL,
    latitude: centroid.latitude,
    longitude: centroid.longitude,
  };
}

export function findCountryLocation(
  countryName: string,
): CountryLocation | undefined {
  const normalized = countryName.trim().toLowerCase();
  if (!normalized) return undefined;

  const directMatch = COUNTRY_BY_NAME.get(normalized);
  if (directMatch) {
    return directMatch;
  }

  if (normalized.length <= 3) {
    return findCountryLocationByCode(countryName);
  }

  return undefined;
}

export function findCountryLocationByCode(
  countryCode: string,
): CountryLocation | undefined {
  const normalized = countryCode.trim().toLowerCase();
  if (!normalized) return undefined;

  const directMatch = COUNTRY_BY_CODE.get(normalized);
  if (directMatch) {
    return directMatch;
  }

  return buildCountryLocationFromPolygon(countryCode);
}
