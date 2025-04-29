export interface CountryLocation {
  country: string;
  latitude: number;
  longitude: number;
}

// * 국가 위치
export const COUNTRY_LOCATIONS: CountryLocation[] = [
  { country: "France", latitude: 46.603354, longitude: 1.888334 },
  { country: "Japan", latitude: 36.204824, longitude: 138.252924 },
  { country: "United States", latitude: 37.09024, longitude: -95.712891 },
  { country: "South Korea", latitude: 35.907757, longitude: 127.766922 },
  { country: "Germany", latitude: 51.165691, longitude: 10.451526 },
  { country: "Thailand", latitude: 15.870032, longitude: 100.992541 },
  { country: "Brazil", latitude: -14.235004, longitude: -51.92528 },
  { country: "United Kingdom", latitude: 55.378051, longitude: -3.435973 },
  { country: "China", latitude: 35.86166, longitude: 104.195397 },
  { country: "Canada", latitude: 56.130366, longitude: -106.346771 },
  { country: "Australia", latitude: -25.274398, longitude: 133.775136 },
  { country: "Russia", latitude: 61.52401, longitude: 105.318756 },
  { country: "Italy", latitude: 41.87194, longitude: 12.56738 },
  { country: "Spain", latitude: 40.463667, longitude: -3.74922 },
  { country: "Mexico", latitude: 23.634501, longitude: -102.552784 },
  { country: "Netherlands", latitude: 52.132633, longitude: 5.291266 },
  { country: "South Africa", latitude: -30.559482, longitude: 22.937506 },
  { country: "Argentina", latitude: -38.416097, longitude: -63.616672 },
  { country: "New Zealand", latitude: -40.900557, longitude: 174.885971 },
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
