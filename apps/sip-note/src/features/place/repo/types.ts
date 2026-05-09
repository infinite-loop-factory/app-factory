import type { PlaceCategory } from "@/db/schema";

export type { PlaceCategory };

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
  region: string | null;
  isWishlist: boolean;
  visitCount: number;
  createdAt: number;
  updatedAt: number;
};

export type PlaceInput = {
  name: string;
  category?: PlaceCategory | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  isWishlist?: boolean;
};

export type PlaceBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export type PlaceFilter = {
  category?: PlaceCategory;
  isWishlist?: boolean;
  query?: string;
  bounds?: PlaceBounds;
};

export type StatsFilter = {
  category?: PlaceCategory;
  isWishlist?: boolean;
  includeUnknown?: boolean;
};

export type CityVisitStat = {
  city: string | null;
  placeCount: number;
  visitCount: number;
  noteCount: number;
};

export type RegionVisitStat = {
  region: string | null;
  placeCount: number;
  visitCount: number;
  noteCount: number;
};

export type PlaceVisitStat = {
  id: string;
  name: string;
  category: PlaceCategory | null;
  city: string | null;
  region: string | null;
  visitCount: number;
  noteCount: number;
};

export type VisitTotals = {
  totalCities: number;
  totalRegions: number;
  totalPlaces: number;
  totalVisits: number;
  totalNotes: number;
};
