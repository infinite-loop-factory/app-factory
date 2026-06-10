/** Store product identifiers — configure matching products in App Store Connect / Play Console */
export const IAP_PRODUCT_IDS = {
  goldDice10: "snake_ladder_gold_10",
  goldDice30: "snake_ladder_gold_30",
  goldDice100: "snake_ladder_gold_100",
  adRemoval: "snake_ladder_ad_removal",
} as const;

export type IapProductId =
  (typeof IAP_PRODUCT_IDS)[keyof typeof IAP_PRODUCT_IDS];

export const GOLD_DICE_BY_PRODUCT: Record<string, number> = {
  [IAP_PRODUCT_IDS.goldDice10]: 10,
  [IAP_PRODUCT_IDS.goldDice30]: 30,
  [IAP_PRODUCT_IDS.goldDice100]: 100,
};

export const CONSUMABLE_PRODUCT_IDS = [
  IAP_PRODUCT_IDS.goldDice10,
  IAP_PRODUCT_IDS.goldDice30,
  IAP_PRODUCT_IDS.goldDice100,
] as const;

export const AD_GAMES_INTERVAL = 3;
export const AD_COOLDOWN_MS = 60_000;

import { resolveAdMobAppIds } from "@/lib/monetization/admob";

/** AdMob app IDs — override via EXPO_PUBLIC_ADMOB_*_APP_ID (see .env.example). */
export const ADMOB_APP_IDS = resolveAdMobAppIds();

/** Public URL for App Store / AdMob review (matches web publish baseUrl) */
export const PRIVACY_POLICY_URL =
  "https://infinite-loop-factory.github.io/app-factory/snake-ladder/privacy";

export const ANDROID_PACKAGE = "com.infiniteloopfactory.snakeladder";
export const IOS_BUNDLE_ID = "com.infinite-loop-factory.snake-ladder";
