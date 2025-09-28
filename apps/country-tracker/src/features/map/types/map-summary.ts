export type SupabaseYearRange = {
  startDate?: string | null;
  endDate?: string | null;
  days?: number | null;
};

export type SupabaseYearSummaryRow = {
  country: string | null;
  country_code: string | null;
  total_days: number | null;
  visit_count: number | null;
  latest_visit: string | null;
  ranges: SupabaseYearRange[] | null;
};

export type CountryYearRange = {
  startDate: string;
  endDate: string;
  days: number;
};

export type CountryYearSummary = {
  country: string;
  countryCode: string;
  flag: string;
  totalDays: number;
  visitCount: number;
  latestVisit: string | null;
  ranges: CountryYearRange[];
};
