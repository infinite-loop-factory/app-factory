import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

export async function openLanguageSetting() {
  if (Platform.OS === "web") {
    return false;
  }

  try {
    if (Platform.OS === "android") {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.LOCALE_SETTINGS,
      );
    } else {
      await Linking.openSettings();
    }

    return true;
  } catch (_error) {
    return false;
  }
}
