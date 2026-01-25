export const mapQueryKeys = {
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
} as const;
