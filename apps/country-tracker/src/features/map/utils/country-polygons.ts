import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { CountryPolygon } from "@/features/map/types/country-polygon";

import { feature } from "topojson-client";
import worldTopo from "@/assets/geodata/world/countries-110m.json";
import { numericToAlpha2 } from "@/features/map/utils/iso-numeric-to-alpha2";
import { normalizeCountryCode } from "@/features/map/utils/normalize-country-code";

const NAME_OVERRIDES: Record<string, string> = {
  "W. Sahara": "EH",
  "Dem. Rep. Congo": "CD",
  "Dominican Rep.": "DO",
  "Falkland Is.": "FK",
  "Fr. S. Antarctic Lands": "TF",
  "Central African Rep.": "CF",
  "Eq. Guinea": "GQ",
  Laos: "LA",
  Syria: "SY",
  Moldova: "MD",
  "Solomon Is.": "SB",
  Brunei: "BN",
  "Bosnia and Herz.": "BA",
  Macedonia: "MK",
  "S. Sudan": "SS",
};

// Re-export for backwards compatibility
export { normalizeCountryCode };

type CountryFeature = Feature<Geometry, { name?: string }>;

type WorldTopology = Topology<{
  countries: GeometryCollection<{ name?: string }>;
}>;

function normalizeGeometry(geometry: Geometry): number[][][] {
  if (geometry.type === "Polygon") {
    return (geometry.coordinates as number[][][]).map((ring) => ring.slice());
  }
  if (geometry.type === "MultiPolygon") {
    const coords = geometry.coordinates as number[][][][];
    return coords.flatMap((polygon) => polygon.map((ring) => ring.slice()));
  }
  return [];
}

function toIsoCode(featureItem: CountryFeature): string | null {
  const { id, properties } = featureItem;
  if (id !== undefined) {
    const padded = String(id).padStart(3, "0");
    const code = numericToAlpha2(padded);
    if (code) return code.toUpperCase();
  }

  const name = properties?.name;
  if (name) {
    const override = NAME_OVERRIDES[name];
    if (override) return override;
    const COMMON_NAME_MAP: Record<string, string> = {
      "United States": "US",
      "United Kingdom": "GB",
      Russia: "RU",
      "South Korea": "KR",
      "North Korea": "KP",
      Iran: "IR",
      Syria: "SY",
      Laos: "LA",
      "Czech Republic": "CZ",
      Bolivia: "BO",
      Venezuela: "VE",
      Tanzania: "TZ",
      Macedonia: "MK",
    };
    const byCommon = COMMON_NAME_MAP[name];
    if (byCommon) return byCommon;
  }
  return null;
}

const worldTopology = worldTopo as unknown as WorldTopology;
const countriesCollection = feature(
  worldTopology,
  worldTopology.objects.countries,
) as FeatureCollection<Geometry, { name?: string }>;

const topologyFeatures: CountryFeature[] = countriesCollection.features ?? [];
const COUNTRY_POLYGONS: Record<string, CountryPolygon> = {};

for (const item of topologyFeatures) {
  const code = toIsoCode(item);
  if (!code) continue;
  const coordinates = normalizeGeometry(item.geometry).filter(
    (ring) => ring.length >= 4,
  );
  if (!coordinates.length) continue;
  COUNTRY_POLYGONS[code] = {
    country_code: code,
    coordinates,
    name: item.properties?.name ?? null,
  };
}

const MANUAL_CODES: Record<string, CountryPolygon> = {
  // Northern Cyprus and Somaliland share ISO codes with parent countries; skip to avoid duplicates.
};

Object.assign(COUNTRY_POLYGONS, MANUAL_CODES);

export function getCountryPolygon(code: string): CountryPolygon | null {
  const key = normalizeCountryCode(code);
  if (!key) return null;
  return COUNTRY_POLYGONS[key] ?? null;
}

export function hasCountryPolygon(code: string): boolean {
  const key = normalizeCountryCode(code);
  if (!key) return false;
  return Boolean(COUNTRY_POLYGONS[key]);
}

export function getAllCountryPolygons(): CountryPolygon[] {
  return Object.values(COUNTRY_POLYGONS);
}
