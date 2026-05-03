import type { PlaceCategory } from "@/db/schema";

export type { PlaceCategory };

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
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
