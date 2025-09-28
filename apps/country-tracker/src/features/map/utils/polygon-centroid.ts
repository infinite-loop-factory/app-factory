import { getCountryPolygon } from "@/features/map/utils/country-polygons";

export function computePolygonCentroid(
  coordinates: number[][][],
): { latitude: number; longitude: number } | null {
  let sumLat = 0;
  let sumLng = 0;
  let total = 0;

  for (const ring of coordinates) {
    for (const point of ring) {
      const [lng, lat] = point;
      if (typeof lat === "number" && typeof lng === "number") {
        sumLat += lat;
        sumLng += lng;
        total += 1;
      }
    }
  }

  if (total === 0) {
    return null;
  }

  return {
    latitude: sumLat / total,
    longitude: sumLng / total,
  };
}

export function getCountryCentroid(
  countryCode: string,
): { latitude: number; longitude: number } | null {
  const polygon = getCountryPolygon(countryCode);
  if (!polygon) return null;
  return computePolygonCentroid(polygon.coordinates);
}
