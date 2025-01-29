import type { CountryItem } from "@/features/home/types/country";

import { orderBy } from "es-toolkit";

export const COUNTRIES: CountryItem[] = orderBy(
  [
    {
      id: "1",
      country: "France",
      flag: "🇫🇷",
      lastVisitDate: "2023-01-15T10:00:00+01:00",
    },
    {
      id: "2",
      country: "Japan",
      flag: "🇯🇵",
      lastVisitDate: "2022-12-05T09:00:00+09:00",
    },
    {
      id: "3",
      country: "United States",
      flag: "🇺🇸",
      lastVisitDate: "2023-06-10T12:00:00-04:00",
    },
    {
      id: "4",
      country: "South Korea",
      flag: "🇰🇷",
      lastVisitDate: "2024-03-20T14:00:00+09:00",
    },
    {
      id: "5",
      country: "Germany",
      flag: "🇩🇪",
      lastVisitDate: "2023-11-25T08:00:00+01:00",
    },
    {
      id: "6",
      country: "Thailand",
      flag: "🇹🇭",
      lastVisitDate: "2024-06-10T08:00:00+07:00",
    },
    {
      id: "7",
      country: "Thailand",
      flag: "🇹🇭",
      lastVisitDate: "2023-08-15T08:30:00+07:00",
    },
    {
      id: "8",
      country: "Thailand",
      flag: "🇹🇭",
      lastVisitDate: "2022-12-20T09:00:00+07:00",
    },
    {
      id: "9",
      country: "Brazil",
      flag: "🇧🇷",
      lastVisitDate: "2022-08-22T15:00:00-03:00",
    },
    {
      id: "10",
      country: "United Kingdom",
      flag: "🇬🇧",
      lastVisitDate: "2023-07-19T10:00:00+01:00",
    },
    {
      id: "11",
      country: "China",
      flag: "🇨🇳",
      lastVisitDate: "2021-11-11T12:00:00+08:00",
    },
    {
      id: "12",
      country: "Canada",
      flag: "🇨🇦",
      lastVisitDate: "2020-05-30T09:00:00-07:00",
    },
    {
      id: "13",
      country: "Australia",
      flag: "🇦🇺",
      lastVisitDate: "2024-01-25T16:00:00+11:00",
    },
    {
      id: "14",
      country: "Russia",
      flag: "🇷🇺",
      lastVisitDate: "2023-12-15T14:00:00+03:00",
    },
    {
      id: "15",
      country: "Italy",
      flag: "🇮🇹",
      lastVisitDate: "2023-09-12T09:00:00+02:00",
    },
    {
      id: "16",
      country: "Spain",
      flag: "🇪🇸",
      lastVisitDate: "2022-03-09T10:00:00+01:00",
    },
    {
      id: "17",
      country: "Mexico",
      flag: "🇲🇽",
      lastVisitDate: "2021-07-21T08:00:00-05:00",
    },
    {
      id: "18",
      country: "Netherlands",
      flag: "🇳🇱",
      lastVisitDate: "2023-04-18T11:00:00+02:00",
    },
    {
      id: "19",
      country: "South Africa",
      flag: "🇿🇦",
      lastVisitDate: "2020-02-02T13:00:00+02:00",
    },
    {
      id: "20",
      country: "Argentina",
      flag: "🇦🇷",
      lastVisitDate: "2021-10-10T14:00:00-03:00",
    },
    {
      id: "21",
      country: "New Zealand",
      flag: "🇳🇿",
      lastVisitDate: "2022-12-12T15:00:00+13:00",
    },
  ],
  ["lastVisitDate"],
  ["desc"],
);
