import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import type { WidgetSnapshot } from "@/features/widget/types/widget-snapshot";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerWidgetTaskHandler } from "react-native-android-widget";
import { WIDGET_STORAGE_KEY } from "@/features/widget/apis/widget-bridge";
import { CountryWidget } from "@/features/widget/components/country-widget";
import { EMPTY_SNAPSHOT } from "@/features/widget/types/widget-snapshot";

async function loadSnapshot(): Promise<WidgetSnapshot> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_STORAGE_KEY);
    if (!raw) return EMPTY_SNAPSHOT;
    return JSON.parse(raw) as WidgetSnapshot;
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  if (
    props.widgetAction === "WIDGET_ADDED" ||
    props.widgetAction === "WIDGET_UPDATE" ||
    props.widgetAction === "WIDGET_RESIZED"
  ) {
    const snapshot = await loadSnapshot();
    props.renderWidget(<CountryWidget snapshot={snapshot} />);
  }
}

registerWidgetTaskHandler(widgetTaskHandler);
