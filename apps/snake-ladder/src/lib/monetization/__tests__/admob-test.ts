import { afterEach, describe, expect, it } from "@jest/globals";
import {
  isUsingTestAdUnits,
  resolveAdMobAppIds,
  resolveInterstitialAdUnitId,
} from "@/lib/monetization/admob";

describe("admob config", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
    delete process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL;
    delete process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL;
  });

  it("falls back to Google sample app IDs", () => {
    delete process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID;
    delete process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID;
    delete process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL;
    const ids = resolveAdMobAppIds();
    expect(ids.ios).toContain("ca-app-pub-");
    expect(ids.android).toContain("ca-app-pub-");
  });

  it("uses env interstitial IDs when provided", () => {
    process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL =
      "ca-app-pub-test/interstitial";
    expect(resolveInterstitialAdUnitId()).toBe("ca-app-pub-test/interstitial");
    expect(isUsingTestAdUnits()).toBe(false);
  });
});
