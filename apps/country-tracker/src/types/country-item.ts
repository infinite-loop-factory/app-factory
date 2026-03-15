export type CountryItem = {
  id: string;
  flag: string;
  country: string;
  endDate: string;
  stayDays: number;
  country_code: string;
  startDate: string;
  dateSet: string[];
  // Aggregate fields (computed client-side)
  visitCount?: number;
  totalStayDays?: number;
};
