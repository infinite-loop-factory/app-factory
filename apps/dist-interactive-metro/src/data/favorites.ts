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

export async function addFavoriteRoute(route: {
  startStation: Station;
  endStation: Station;
  viaStation?: Station;
}): Promise<void> {
  try {
    const favorites = await getFavoriteRoutes();
    const newRoute: FavoriteRoute = {
      ...route,
      id: `${Date.now()}-${Math.random()}`,
      lastSearched: new Date().toISOString(),
    };
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([newRoute, ...favorites]),
    );
  } catch {
    // ignore write errors
  }
}

export async function removeFavoriteRoute(id: string): Promise<void> {
  try {
    const favorites = await getFavoriteRoutes();
    const filtered = favorites.filter((r) => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

export async function clearAllFavorites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isFavoriteRoute(
  favorites: FavoriteRoute[],
  startId: string,
  endId: string,
  viaId?: string,
): boolean {
  return favorites.some(
    (f) =>
      f.startStation.id === startId &&
      f.endStation.id === endId &&
      f.viaStation?.id === viaId,
  );
}
