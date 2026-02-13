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
