import type { FavoriteRoute, Station } from "@/types/station";

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "favoriteRoutes";

export async function getFavoriteRoutes(): Promise<FavoriteRoute[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Returns true when the favorite was persisted (or already existed). */
export async function addFavoriteRoute(route: {
  startStation: Station;
  endStation: Station;
  viaStation?: Station;
}): Promise<boolean> {
  try {
    const favorites = await getFavoriteRoutes();

    // Check for duplicates
    const isDuplicate = favorites.some(
      (f) =>
        f.startStation.id === route.startStation.id &&
        f.endStation.id === route.endStation.id &&
        f.viaStation?.id === route.viaStation?.id,
    );
    if (isDuplicate) return true;

    const newRoute: FavoriteRoute = {
      ...route,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      lastSearched: new Date().toISOString(),
    };
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([newRoute, ...favorites]),
    );
    return true;
  } catch {
    return false;
  }
}

/** Returns true when the removal was persisted. */
export async function removeFavoriteRoute(id: string): Promise<boolean> {
  try {
    const favorites = await getFavoriteRoutes();
    const filtered = favorites.filter((r) => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/** Returns true when the favorites store was cleared. */
export async function clearAllFavorites(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function findFavoriteRoute(
  favorites: FavoriteRoute[],
  startId: string,
  endId: string,
  viaId?: string,
): FavoriteRoute | undefined {
  return favorites.find(
    (f) =>
      f.startStation.id === startId &&
      f.endStation.id === endId &&
      f.viaStation?.id === viaId,
  );
}

export function isFavoriteRoute(
  favorites: FavoriteRoute[],
  startId: string,
  endId: string,
  viaId?: string,
): boolean {
  return !!findFavoriteRoute(favorites, startId, endId, viaId);
}
