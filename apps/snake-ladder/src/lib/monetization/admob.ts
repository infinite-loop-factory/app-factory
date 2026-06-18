import { Platform } from "react-native";
import { readPublicEnv } from "@/lib/public-env";

const GOOGLE_SAMPLE_APP_IDS = {
  ios: "ca-app-pub-3940256099942544~1458002511",
  android: "ca-app-pub-3940256099942544~3347511713",
} as const;

/** Google sample interstitial IDs (same as react-native-google-mobile-ads TestIds). */
const GOOGLE_TEST_INTERSTITIAL = {
  ios: "ca-app-pub-3940256099942544/1033173712",
  android: "ca-app-pub-3940256099942544/4411468910",
} as const;

/** Google sample rewarded-video IDs. */
const GOOGLE_TEST_REWARDED = {
  ios: "ca-app-pub-3940256099942544/1712485313",
  android: "ca-app-pub-3940256099942544/5224354917",
} as const;

function envOrTest(value: string | undefined, testId: string): string {
  return value && value.length > 0 ? value : testId;
}

/** AdMob app IDs for Expo config plugin (build time). */
export function resolveAdMobAppIds(): { ios: string; android: string } {
  return {
    ios: envOrTest(
      readPublicEnv("ADMOB_IOS_APP_ID"),
      GOOGLE_SAMPLE_APP_IDS.ios,
    ),
    android: envOrTest(
      readPublicEnv("ADMOB_ANDROID_APP_ID"),
      GOOGLE_SAMPLE_APP_IDS.android,
    ),
  };
}

function googleTestInterstitialId(): string {
  if (Platform.OS === "android") {
    return GOOGLE_TEST_INTERSTITIAL.android;
  }
  return GOOGLE_TEST_INTERSTITIAL.ios;
}

/** Interstitial ad unit for the current platform. Falls back to Google test IDs in dev. */
export function resolveInterstitialAdUnitId(): string | null {
  if (Platform.OS === "ios") {
    return envOrTest(
      readPublicEnv("ADMOB_IOS_INTERSTITIAL"),
      googleTestInterstitialId(),
    );
  }
  if (Platform.OS === "android") {
    return envOrTest(
      readPublicEnv("ADMOB_ANDROID_INTERSTITIAL"),
      googleTestInterstitialId(),
    );
  }
  return null;
}

/** Rewarded ad unit for the current platform. Falls back to Google test IDs in dev. */
export function resolveRewardedAdUnitId(): string | null {
  if (Platform.OS === "ios") {
    return envOrTest(
      readPublicEnv("ADMOB_IOS_REWARDED"),
      GOOGLE_TEST_REWARDED.ios,
    );
  }
  if (Platform.OS === "android") {
    return envOrTest(
      readPublicEnv("ADMOB_ANDROID_REWARDED"),
      GOOGLE_TEST_REWARDED.android,
    );
  }
  return null;
}

export function isUsingTestAdUnits(): boolean {
  const id = resolveInterstitialAdUnitId();
  return (
    id === GOOGLE_TEST_INTERSTITIAL.ios ||
    id === GOOGLE_TEST_INTERSTITIAL.android
  );
}
