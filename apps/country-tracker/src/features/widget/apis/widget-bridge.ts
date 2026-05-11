import type { WidgetSnapshot } from "@/features/widget/types/widget-snapshot";

import { ExtensionStorage } from "@bacons/apple-targets/build/ExtensionStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { EMPTY_SNAPSHOT } from "@/features/widget/types/widget-snapshot";

export const WIDGET_APP_GROUP = "group.com.gracefullight.countrytracker";
export const WIDGET_STORAGE_KEY = "widget:snapshot";
export const WIDGET_IOS_SNAPSHOT_KEY = "snapshot";
export const ANDROID_WIDGET_NAME = "CountryWidget";

/**
 * Sync widget data across platforms.
 * - Always writes to AsyncStorage (fallback + Android task handler)
 * - iOS: writes to App Group via ExtensionStorage and reloads the widget
 * - Android: calls requestWidgetUpdate with CountryWidget component
 * - web: no-op
 */
export async function syncWidget(snapshot: WidgetSnapshot): Promise<void> {
  // 1. 항상 AsyncStorage 저장 (fallback + Android task handler용)
  await AsyncStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(snapshot));

  if (Platform.OS === "ios") {
    try {
      const storage = new ExtensionStorage(WIDGET_APP_GROUP);
      storage.set(WIDGET_IOS_SNAPSHOT_KEY, JSON.stringify(snapshot));
      ExtensionStorage.reloadWidget(ANDROID_WIDGET_NAME);
    } catch {
      // ExtensionStorage native module not available — data persisted to AsyncStorage
    }
  } else if (Platform.OS === "android") {
    try {
      const { requestWidgetUpdate } = await import(
        "react-native-android-widget"
      );
      const CountryWidgetModule = await import(
        "@/features/widget/components/country-widget"
      );
      const CountryWidget =
        CountryWidgetModule.default ?? CountryWidgetModule.CountryWidget;
      await requestWidgetUpdate({
        widgetName: ANDROID_WIDGET_NAME,
        renderWidget: () => CountryWidget({ snapshot }),
        widgetNotFound: () => {
          // no widget on home screen — skip
        },
      });
    } catch {
      // CountryWidget component not yet available or requestWidgetUpdate failed — best-effort
    }
  }
  // web: no-op
}

/**
 * Read the cached widget snapshot from AsyncStorage.
 * Returns EMPTY_SNAPSHOT on missing or parse failure.
 */
export async function readSnapshot(): Promise<WidgetSnapshot> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
    if (!raw) return EMPTY_SNAPSHOT;
    return JSON.parse(raw) as WidgetSnapshot;
  } catch {
    return EMPTY_SNAPSHOT;
  }
}
