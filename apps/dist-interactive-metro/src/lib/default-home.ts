import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "defaultHomeTab";

const TAB_IDS = [
  "routeGuide",
  "notifications",
  "favorites",
  "settings",
] as const;

export type DefaultHomeTabId = (typeof TAB_IDS)[number];

const DEFAULT_VALUE: DefaultHomeTabId = "routeGuide";

/** Tab route path ↔ DefaultHomeTabId mapping */
export const DEFAULT_HOME_TAB_ROUTES: Record<DefaultHomeTabId, string> = {
  routeGuide: "/(tabs)",
  notifications: "/(tabs)/notifications",
  favorites: "/(tabs)/favorites",
  settings: "/(tabs)/settings",
};

export async function getDefaultHomeTab(): Promise<DefaultHomeTabId> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value != null && (TAB_IDS as readonly string[]).includes(value)) {
      return value as DefaultHomeTabId;
    }
  } catch {
    // ignore read errors
  }
  return DEFAULT_VALUE;
}

export async function setDefaultHomeTab(
  tabId: DefaultHomeTabId,
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, tabId);
  } catch {
    // ignore write errors
  }
}
