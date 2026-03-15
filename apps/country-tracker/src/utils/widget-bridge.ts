import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const WIDGET_DATA_KEY = "widget-data";

export interface WidgetData {
  countriesVisited: number;
  currentCountry: string;
  currentCountryCode: string;
  lastUpdated: string;
  recentCountries: Array<{
    country: string;
    countryCode: string;
    flag: string;
  }>;
}

/**
 * Write widget data to shared storage.
 * On iOS, this writes to App Group UserDefaults (when native module is available).
 * Falls back to AsyncStorage for data persistence regardless.
 */
export async function writeWidgetData(data: WidgetData): Promise<void> {
  // Always persist to AsyncStorage as fallback
  await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(data));

  if (Platform.OS !== "ios") return;

  try {
    // Try to use native module for App Group UserDefaults
    const { NativeModules } = await import("react-native");
    const WidgetModule = NativeModules.CountryTrackerWidget;
    if (WidgetModule?.setWidgetData) {
      await WidgetModule.setWidgetData(JSON.stringify(data));
    }
  } catch {
    // Native module not available yet — data is still in AsyncStorage
  }
}

/**
 * Read cached widget data from AsyncStorage.
 */
export async function readWidgetData(): Promise<WidgetData | null> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Build widget data from current app state.
 */
export function buildWidgetData(params: {
  countriesVisited: number;
  currentCountry?: string;
  currentCountryCode?: string;
  recentCountries?: Array<{
    country: string;
    countryCode: string;
    flag: string;
  }>;
}): WidgetData {
  return {
    countriesVisited: params.countriesVisited,
    currentCountry: params.currentCountry ?? "",
    currentCountryCode: params.currentCountryCode ?? "",
    lastUpdated: new Date().toISOString(),
    recentCountries: params.recentCountries?.slice(0, 3) ?? [],
  };
}
