export const mapQueryKeys = {
  visitedCountrySummaries: (params: {
    userId: string | null;
    year: number | string;
  }) => ["map", "visited-countries", params.userId ?? "", params.year] as const,
} as const;
