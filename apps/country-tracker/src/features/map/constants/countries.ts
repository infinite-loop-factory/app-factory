export interface CountryLocation {
  country: string;
  country_code: string;
  capital: string;
  latitude: number;
  longitude: number;
}

// * 국가 위치
export const COUNTRY_LOCATIONS: CountryLocation[] = [
  {
    country: "France",
    country_code: "FR",
    capital: "Paris",
    latitude: 46.603354,
    longitude: 1.888334,
  },
  {
    country: "Japan",
    country_code: "JP",
    capital: "Tokyo",
    latitude: 36.204824,
    longitude: 138.252924,
  },
  {
    country: "United States",
    country_code: "US",
    capital: "Washington, D.C.",
    latitude: 37.09024,
    longitude: -95.712891,
  },
  {
    country: "South Korea",
    country_code: "KR",
    capital: "Seoul",
    latitude: 35.907757,
    longitude: 127.766922,
  },
  {
    country: "Germany",
    country_code: "DE",
    capital: "Berlin",
    latitude: 51.165691,
    longitude: 10.451526,
  },
  {
    country: "Thailand",
    country_code: "TH",
    capital: "Bangkok",
    latitude: 15.870032,
    longitude: 100.992541,
  },
  {
    country: "Brazil",
    country_code: "BR",
    capital: "Brasília",
    latitude: -14.235004,
    longitude: -51.92528,
  },
  {
    country: "United Kingdom",
    country_code: "GB",
    capital: "London",
    latitude: 55.378051,
    longitude: -3.435973,
  },
  {
    country: "China",
    country_code: "CN",
    capital: "Beijing",
    latitude: 35.86166,
    longitude: 104.195397,
  },
  {
    country: "Canada",
    country_code: "CA",
    capital: "Ottawa",
    latitude: 56.130366,
    longitude: -106.346771,
  },
  {
    country: "Australia",
    country_code: "AU",
    capital: "Canberra",
    latitude: -25.274398,
    longitude: 133.775136,
  },
  {
    country: "Russia",
    country_code: "RU",
    capital: "Moscow",
    latitude: 61.52401,
    longitude: 105.318756,
  },
  {
    country: "Italy",
    country_code: "IT",
    capital: "Rome",
    latitude: 41.87194,
    longitude: 12.56738,
  },
  {
    country: "Spain",
    country_code: "ES",
    capital: "Madrid",
    latitude: 40.463667,
    longitude: -3.74922,
  },
  {
    country: "Mexico",
    country_code: "MX",
    capital: "Mexico City",
    latitude: 23.634501,
    longitude: -102.552784,
  },
  {
    country: "Netherlands",
    country_code: "NL",
    capital: "Amsterdam",
    latitude: 52.132633,
    longitude: 5.291266,
  },
  {
    country: "South Africa",
    country_code: "ZA",
    capital: "Pretoria",
    latitude: -30.559482,
    longitude: 22.937506,
  },
  {
    country: "Argentina",
    country_code: "AR",
    capital: "Buenos Aires",
    latitude: -38.416097,
    longitude: -63.616672,
  },
  {
    country: "New Zealand",
    country_code: "NZ",
    capital: "Wellington",
    latitude: -40.900557,
    longitude: 174.885971,
  },
];

/**
 * 국가 이름으로 위치 정보 찾기
 */
export function findCountryLocation(
  countryName: string,
): CountryLocation | undefined {
  return COUNTRY_LOCATIONS.find(
    (location) => location.country.toLowerCase() === countryName.toLowerCase(),
  );
}
