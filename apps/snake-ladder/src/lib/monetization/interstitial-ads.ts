import type { InterstitialAd } from "react-native-google-mobile-ads";

import { resolveInterstitialAdUnitId } from "@/lib/monetization/admob";

let interstitial: InterstitialAd | null = null;
let loaded = false;
let adEventType:
  | typeof import("react-native-google-mobile-ads").AdEventType
  | null = null;

function getAdUnitId(): string | null {
  return resolveInterstitialAdUnitId();
}

export async function preloadInterstitialAd(): Promise<void> {
  const adUnitId = getAdUnitId();
  if (!adUnitId) return;

  try {
    const ads = await import("react-native-google-mobile-ads");
    adEventType = ads.AdEventType;
    interstitial?.removeAllListeners();
    const next = ads.InterstitialAd.createForAdRequest(adUnitId);
    next.addAdEventListener(ads.AdEventType.LOADED, () => {
      loaded = true;
    });
    next.addAdEventListener(ads.AdEventType.CLOSED, () => {
      loaded = false;
      void preloadInterstitialAd();
    });
    next.load();
    interstitial = next;
  } catch {
    loaded = false;
    interstitial = null;
  }
}

export function showInterstitialAd(): Promise<boolean> {
  if (!(interstitial && loaded && adEventType)) {
    return Promise.resolve(false);
  }

  const closedType = adEventType.CLOSED;

  return new Promise((resolve) => {
    if (!interstitial) {
      resolve(false);
      return;
    }
    const ad = interstitial;
    const unsubscribe = ad.addAdEventListener(closedType, () => {
      unsubscribe();
      resolve(true);
    });
    try {
      void ad.show();
    } catch {
      unsubscribe();
      resolve(false);
    }
  });
}
