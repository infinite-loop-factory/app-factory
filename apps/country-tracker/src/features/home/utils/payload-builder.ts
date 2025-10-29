import type { GeoCoordinates } from "@/features/home/utils/exif";

import { toUtcBoundaryTimestamp } from "@/utils/date-range";

export function filterDuplicateDates(
  rangeDates: string[],
  countryCode: string,
  existingByDate: Map<string, string>,
) {
  return rangeDates.filter((date) => existingByDate.get(date) !== countryCode);
}

export function buildInsertPayload(params: {
  dates: string[];
  referenceCoords: GeoCoordinates;
  userId: string;
  countryCode: string;
  displayCountry: string;
  zoneName: string;
}) {
  const {
    dates,
    referenceCoords,
    userId,
    countryCode,
    displayCountry,
    zoneName,
  } = params;
  return dates.map((date) => ({
    user_id: userId,
    latitude: referenceCoords.latitude,
    longitude: referenceCoords.longitude,
    timestamp: toUtcBoundaryTimestamp(date, zoneName, "start"),
    country: displayCountry,
    country_code: countryCode,
  }));
}
