import type { Station } from "@/types/station";

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "recentStations";
const MAX_RECENT = 10;

export async function getRecentStations(): Promise<Station[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addRecentStation(station: Station): Promise<void> {
  try {
    const recent = await getRecentStations();
    const filtered = recent.filter((s) => s.id !== station.id);
    const updated = [station, ...filtered].slice(0, MAX_RECENT);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore write errors
  }
}

export async function clearRecentStations(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
