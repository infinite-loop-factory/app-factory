import type { CountryItem } from "@/features/home/types/country";
import supabase from "@/libs/supabase";
import { getCountryByLatLng } from "@/utils/reverse-geo";
import { DateTime } from "luxon";

function countryCodeToFlagEmoji(countryCode: string): string {
  if (!countryCode) return "🏳️";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export async function fetchVisitedCountries(
  userId: string,
): Promise<CountryItem[]> {
  // 1. 위치 데이터 fetch
  const { data: locations, error } = await supabase
    .from("locations")
    .select("latitude,longitude,timestamp")
    .eq("user_id", userId);
  if (error || !locations) return [];
  // 2. 국가별로 마지막 방문일 추출 (reverse geocode 병렬 처리)
  const countryMap = new Map<
    string,
    { lastVisitDate: string; countryCode: string }
  >();
  await Promise.all(
    (
      locations as { latitude: number; longitude: number; timestamp: string }[]
    ).map(async (loc) => {
      const { country, countryCode } = await getCountryByLatLng(
        loc.latitude,
        loc.longitude,
      );
      const prev = countryMap.get(country);
      if (
        !prev ||
        DateTime.fromISO(loc.timestamp) > DateTime.fromISO(prev.lastVisitDate)
      ) {
        countryMap.set(country, { lastVisitDate: loc.timestamp, countryCode });
      }
    }),
  );
  // 3. CountryItem[] 생성
  const items: CountryItem[] = Array.from(countryMap.entries()).map(
    ([country, { lastVisitDate, countryCode }]) => ({
      id: `${country}-${lastVisitDate}`,
      country,
      flag: countryCodeToFlagEmoji(countryCode),
      lastVisitDate,
    }),
  );
  return items;
}
