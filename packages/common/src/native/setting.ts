import type { OpenStorePageParams } from "./setting.types";

import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

export async function openLanguageSetting() {
  if (Platform.OS === "web") {
    return false;
  }

  try {
    if (Platform.OS === "ios") {
      // iOS requires the user to change language from the Settings app manually.
      // Return false so the caller can surface guidance instead of attempting to
      // deep-link, which has been unstable in the dev client.
      return false;
    }
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.LOCALE_SETTINGS,
    );

    return true;
  } catch (_error) {
    return false;
  }
}

export async function openStorePage({
  android = "",
  ios = "",
}: OpenStorePageParams) {
  try {
    // * 웹 환경
    if (Platform.OS === "web") {
      const userAgent = navigator.userAgent || "";
      const isIosWeb = /Safari|iPhone|iPad|iPod/i.test(userAgent);

      if (isIosWeb) {
        // iOS 웹 브라우저 → 앱스토어 웹페이지
        await Linking.openURL(`https://apps.apple.com/app/id${ios}`);
      } else {
        // 그 외(안드로이드/데스크톱 등) → 플레이스토어 웹페이지
        await Linking.openURL(
          `https://play.google.com/store/apps/details?id=${android}`,
        );
      }

      return true;
    }

    // * 모바일 환경
    if (Platform.OS === "ios") {
      // iOS App Store 링크
      // itms-apps://itunes.apple.com/app/id앱ID
      await Linking.openURL(`itms-apps://itunes.apple.com/app/id${ios}`);
    } else {
      // Play 스토어 링크 (market:// or https://)
      await Linking.openURL(`market://details?id=${android}`);
    }

    return true;
  } catch (_error) {
    return false;
  }
}
