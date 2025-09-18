import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";

import { feature } from "topojson-client";
import worldTopo from "@/assets/geodata/world/countries-110m.json";
import { numericToAlpha2 } from "./iso-numeric-to-alpha2";

// Locale is registered in the shim to avoid Metro dynamic requires

export type CountryPolygon = {
  country_code: string;
  coordinates: number[][][]; // list of polygon rings (lon, lat)
};

type CountryFeature = Feature<Geometry, { name?: string }>;

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

// Minimal alpha-3 to alpha-2 map for common cases.
// Extend if your dataset stores alpha-3 codes for more countries.
const ALPHA3_TO_ALPHA2: Record<string, string> = {
  USA: "US",
  GBR: "GB",
  RUS: "RU",
  CHN: "CN",
  AUS: "AU",
  KOR: "KR",
  PRK: "KP",
  DEU: "DE",
  FRA: "FR",
  ITA: "IT",
  ESP: "ES",
  CAN: "CA",
  MEX: "MX",
  JPN: "JP",
  IND: "IN",
  BRA: "BR",
  ARG: "AR",
  ZAF: "ZA",
};

export function normalizeCountryCode(
  code: string | null | undefined,
): string | null {
  if (!code) return null;
  const raw = String(code).trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  // alpha-2
  if (/^[A-Z]{2}$/.test(upper)) return upper;
  // numeric (3-digit)
  if (/^\d{1,3}$/.test(upper)) {
    const mapped = numericToAlpha2(upper);
    return mapped ? mapped.toUpperCase() : null;
  }
  // alpha-3
  if (/^[A-Z]{3}$/.test(upper)) {
    const mapped = ALPHA3_TO_ALPHA2[upper];
    return mapped ? mapped.toUpperCase() : null;
  }
  return null;
}

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
    if (code) {
      return code.toUpperCase();
    }
  }

  const name = properties?.name;
  if (name) {
    const override = NAME_OVERRIDES[name];
    if (override) {
      return override;
    }
    // Fallback: simple heuristic for common names that differ from ISO entry names.
    // For robustness, keep only a few safe mappings here; avoid dynamic locale packages.
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

type WorldTopology = Topology<{
  countries: GeometryCollection<{ name?: string }>;
}>;

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
  COUNTRY_POLYGONS[code] = { country_code: code, coordinates };
}

// Known manual additions for territories not part of ISO standard (optional)
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
