import type { NearbyStation, Station } from "@/types/station";

const DEG_TO_RAD = Math.PI / 180;
const EARTH_RADIUS_M = 6_371_000;
/** Average walking speed in m/min (~4.8 km/h) */
const WALKING_SPEED_M_PER_MIN = 80;

/**
 * Calculate the great-circle distance between two points
 * using the Haversine formula.
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) *
      Math.cos(lat2 * DEG_TO_RAD) *
      Math.sin(dLon / 2) ** 2;

  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Format a distance in meters to a human-friendly string.
 * e.g. 350 → "350m", 1200 → "1.2km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Find the N nearest stations from the given coordinates.
 * Only considers stations that have latitude/longitude data.
 */
export function findNearestStations(
  latitude: number,
  longitude: number,
  allStations: Station[],
  count = 3,
): NearbyStation[] {
  const withDistance: NearbyStation[] = [];

  for (const station of allStations) {
    if (station.latitude == null || station.longitude == null) continue;

    const distanceM = haversineDistance(
      latitude,
      longitude,
      station.latitude,
      station.longitude,
    );

    withDistance.push({
      station,
      distanceM,
      walkingMinutes: Math.max(
        1,
        Math.round(distanceM / WALKING_SPEED_M_PER_MIN),
      ),
    });
  }

  withDistance.sort((a, b) => a.distanceM - b.distanceM);

  // Deduplicate by station name — keep only the closest entry per name
  const seen = new Set<string>();
  const deduplicated: NearbyStation[] = [];
  for (const item of withDistance) {
    if (seen.has(item.station.name)) continue;
    seen.add(item.station.name);
    deduplicated.push(item);
    if (deduplicated.length >= count) break;
  }

  return deduplicated;
}
