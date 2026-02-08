import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEY = "defaultHomeTab"

export type DefaultHomeTabId =
  | "routeGuide"
  | "notifications"
  | "favorites"
  | "settings"

const DEFAULT_VALUE: DefaultHomeTabId = "routeGuide"

/** 탭 라우트 경로와 DefaultHomeTabId 매핑 */
export const DEFAULT_HOME_TAB_ROUTES: Record<DefaultHomeTabId, string> = {
  routeGuide: "/(tabs)",
  notifications: "/(tabs)/notifications",
  favorites: "/(tabs)/favorites",
  settings: "/(tabs)/settings",
}

export async function getDefaultHomeTab(): Promise<DefaultHomeTabId> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY)
    if (
      value === "routeGuide" ||
      value === "notifications" ||
      value === "favorites" ||
      value === "settings"
    ) {
      return value
    }
  } catch {
    // ignore
  }
  return DEFAULT_VALUE
}

export async function setDefaultHomeTab(
  tabId: DefaultHomeTabId
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, tabId)
}
