export const locationQueryKeys = {
  visitedCountries: (search: string | null = null) =>
    ["location", "visited-countries", search ?? ""] as const,
  allUniqueCountries: (userId: string | null) =>
    ["location", "unique-countries", userId ?? ""] as const,
} as const;
