import type { RewardedAd } from "react-native-google-mobile-ads";

import { resolveRewardedAdUnitId } from "@/lib/monetization/admob";

let rewarded: RewardedAd | null = null;
let loaded = false;
let adEvents: typeof import("react-native-google-mobile-ads") | null = null;

export async function preloadRewardedAd(): Promise<void> {
  const adUnitId = resolveRewardedAdUnitId();
  if (!adUnitId) return;

  try {
    const ads = await import("react-native-google-mobile-ads");
    adEvents = ads;
    rewarded?.removeAllListeners();
    const next = ads.RewardedAd.createForAdRequest(adUnitId);
    next.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
      loaded = true;
    });
    next.addAdEventListener(ads.AdEventType.CLOSED, () => {
      loaded = false;
      void preloadRewardedAd();
    });
    next.load();
    rewarded = next;
  } catch {
    loaded = false;
    rewarded = null;
  }
}

/** Resolves true only when the user actually earned the reward. */
export function showRewardedAd(): Promise<boolean> {
  if (!(rewarded && loaded && adEvents)) {
    return Promise.resolve(false);
  }

  const ad = rewarded;
  const { AdEventType, RewardedAdEventType } = adEvents;

  return new Promise((resolve) => {
    let earned = false;
    const offEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        earned = true;
      },
    );
    const offClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      offEarned();
      offClosed();
      resolve(earned);
    });
    try {
      void ad.show();
    } catch {
      offEarned();
      offClosed();
      resolve(false);
    }
  });
}
