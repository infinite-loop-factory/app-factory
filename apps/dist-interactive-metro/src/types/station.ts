/**
 * Station type for Seoul Metro subway stations
 */
export interface Station {
  id: string;
  name: string;
  line: string;
  lineNumber: string;
  lineColor: string;
  connections?: string[];
  latitude?: number;
  longitude?: number;
}

/**
 * Station with calculated distance from a reference point
 */
export interface NearbyStation {
  station: Station;
  /** Distance in meters */
  distanceM: number;
  /** Estimated walking time in minutes */
  walkingMinutes: number;
}

/**
 * Subway line definition
 */
export interface Line {
  id: string;
  number: string;
  name: string;
  color: string;
}

/**
 * Favorite route saved by the user
 */
export interface FavoriteRoute {
  id: string;
  startStation: Station;
  endStation: Station;
  viaStation?: Station;
  lastSearched: string;
}
