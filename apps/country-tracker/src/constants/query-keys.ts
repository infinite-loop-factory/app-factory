// Canonical React Query keys

export const QUERY_KEYS = {
  visitedCountries: (search: string | null = null) =>
    ["visited-countries", search ?? ""] as const,
  allUniqueCountries: (userId: string | null) =>
    ["all-unique-countries", userId ?? ""] as const,
  countryPolygons: (userId: string | null) =>
    ["country-polygons", userId ?? ""] as const,
};
