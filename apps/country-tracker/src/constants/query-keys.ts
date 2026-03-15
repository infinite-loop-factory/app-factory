export const queryKeys = {
  location: {
    visitedCountries: (userId?: string | null) =>
      ["location", "visited-countries", userId ?? ""] as const,
    allUniqueCountries: (userId: string | null) =>
      ["location", "unique-countries", userId ?? ""] as const,
  },
  map: {
    visitedCountrySummaries: (params: {
      userId: string | null;
      year: number | string;
      startDate?: string | null;
      endDate?: string | null;
    }) =>
      [
        "map",
        "visited-countries",
        params.userId ?? "",
        params.year,
        params.startDate,
        params.endDate,
      ] as const,
  },
} as const;
