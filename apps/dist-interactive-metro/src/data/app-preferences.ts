import AsyncStorage from "@react-native-async-storage/async-storage";

/** Tab routes eligible to be the launch screen. */
export const DEFAULT_HOME_TABS = ["index", "search"] as const;
export type DefaultHomeTab = (typeof DEFAULT_HOME_TABS)[number];

const STORAGE_KEY = "@prefs/default_home_tab_v1";
const FALLBACK_TAB: DefaultHomeTab = "index";

function isDefaultHomeTab(value: string | null): value is DefaultHomeTab {
  return (
    value != null && (DEFAULT_HOME_TABS as readonly string[]).includes(value)
  );
}

export async function getDefaultHomeTab(): Promise<DefaultHomeTab> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return isDefaultHomeTab(stored) ? stored : FALLBACK_TAB;
  } catch {
    return FALLBACK_TAB;
  }
}

export async function setDefaultHomeTab(tab: DefaultHomeTab): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, tab);
  } catch {
    // ignore write errors — preference reverts to the default on next launch
  }
}
