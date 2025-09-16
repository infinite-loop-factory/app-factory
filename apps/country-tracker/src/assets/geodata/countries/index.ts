import type { Geometry } from "geojson";

import countries from "i18n-iso-countries";
import { feature } from "topojson-client";
import worldTopo from "@/assets/geodata/world/countries-110m.json";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export type CountryPolygon = {
  country_code: string;
  coordinates: number[][][]; // list of polygon rings (lon, lat)
};

type TopologyFeature = {
  id?: string | number;
  properties?: { name?: string };
  geometry: Geometry;
};

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

function toIsoCode(featureItem: TopologyFeature): string | null {
  const { id, properties } = featureItem;
  if (id !== undefined) {
    const padded = String(id).padStart(3, "0");
    const code = countries.numericToAlpha2(padded);
    if (code) {
      return code.toUpperCase();
    }
  }

  const name = properties?.name;
  if (name) {
    if (NAME_OVERRIDES[name]) {
      return NAME_OVERRIDES[name];
    }
    const alpha2 = countries.getAlpha2Code(name, "en");
    if (alpha2) {
      return alpha2.toUpperCase();
    }
  }
  return null;
}

const topologyFeatures = feature(worldTopo, worldTopo.objects.countries)
  .features as TopologyFeature[];

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
  if (!code) return null;
  const key = code.toUpperCase();
  return COUNTRY_POLYGONS[key] ?? null;
}

export function hasCountryPolygon(code: string): boolean {
  if (!code) return false;
  const key = code.toUpperCase();
  return Boolean(COUNTRY_POLYGONS[key]);
}
