import type { MonetizationState } from "@/lib/monetization/state";

import { Platform } from "react-native";
import {
  AD_COOLDOWN_MS,
  AD_GAMES_INTERVAL,
} from "@/lib/monetization/constants";

export function shouldShowInterstitial(
  state: MonetizationState,
  /** Games started this app session — never interrupt the very first one. */
  sessionGamesPlayed: number = Number.POSITIVE_INFINITY,
): boolean {
  if (state.adRemovalPurchased) return false;
  if (sessionGamesPlayed < 2) return false;
  if (state.gamesSinceLastAd < AD_GAMES_INTERVAL) return false;
  if (
    state.lastAdShownAt > 0 &&
    Date.now() - state.lastAdShownAt < AD_COOLDOWN_MS
  ) {
    return false;
  }
  return Platform.OS === "ios" || Platform.OS === "android";
}

export function afterInterstitialShown(
  state: MonetizationState,
): MonetizationState {
  return {
    ...state,
    gamesSinceLastAd: 0,
    lastAdShownAt: Date.now(),
  };
}

export function afterNewGameStarted(
  state: MonetizationState,
): MonetizationState {
  return {
    ...state,
    gamesSinceLastAd: state.gamesSinceLastAd + 1,
  };
}
