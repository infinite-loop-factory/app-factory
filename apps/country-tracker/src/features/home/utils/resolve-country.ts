import type { GeoCoordinates } from "@/features/home/utils/exif";

import { normalizeCountryCode } from "@/features/map/utils/country-polygons";
import { getCountryByLatLng } from "@/utils/reverse-geo";

export async function resolveCountryFromCoordinates(
  nextCoords: GeoCoordinates,
) {
  const { country, countryCode } = await getCountryByLatLng(
    nextCoords.latitude,
    nextCoords.longitude,
  );
  const normalizedCode = normalizeCountryCode(countryCode) ?? null;
  return {
    normalizedCode,
    country: country ?? undefined,
  } as const;
}
