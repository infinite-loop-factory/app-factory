/**
 * Web stub — react-native-google-mobile-ads is native-only and breaks the web
 * bundle even behind a dynamic import (Metro resolves it statically).
 */
export function preloadRewardedAd(): Promise<void> {
  return Promise.resolve();
}

export function showRewardedAd(): Promise<boolean> {
  return Promise.resolve(false);
}
