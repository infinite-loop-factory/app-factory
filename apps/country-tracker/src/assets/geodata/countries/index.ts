// Static mapping for country polygon JSON modules.
// Metro requires static paths; dynamic import/require with variables is unsupported.
// Add entries like:
//   US: require('@/assets/geodata/countries/US.json'),
//   KR: require('@/assets/geodata/countries/KR.json'),
// Ensure files exist under this directory.

export type CountryPolygon = unknown; // Shape depends on your GeoJSON structure

const COUNTRY_POLYGONS: Record<string, CountryPolygon> = {
  // Populate with actual country code -> JSON module mappings.
  // Example:
  // US: require("@/assets/geodata/countries/US.json"),
  // KR: require("@/assets/geodata/countries/KR.json"),
};

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
