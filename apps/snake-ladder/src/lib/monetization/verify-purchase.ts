import type {
  Purchase,
  VerifyPurchaseProps,
  VerifyPurchaseResult,
} from "expo-iap";

import { Platform } from "react-native";
import { ANDROID_PACKAGE } from "@/lib/monetization/constants";
import { verifyAndroidPurchaseOnServer } from "@/lib/monetization/play-verify";

type VerifyPurchaseFn = (
  props: VerifyPurchaseProps,
) => Promise<VerifyPurchaseResult>;

function isIosValid(result: VerifyPurchaseResult): boolean {
  return "isValid" in result && result.isValid === true;
}

/** Client-side receipt check before granting entitlements (iOS StoreKit; Android token presence). */
export async function verifyStorePurchase(
  purchase: Purchase,
  verifyPurchase: VerifyPurchaseFn,
): Promise<boolean> {
  const productId = purchase.productId;
  if (!productId) return false;

  if (Platform.OS === "ios") {
    try {
      const result = await verifyPurchase({ apple: { sku: productId } });
      return isIosValid(result);
    } catch {
      return false;
    }
  }

  if (Platform.OS === "android") {
    const token = purchase.purchaseToken;
    if (!token) return false;
    if (!process.env.EXPO_PUBLIC_PLAY_VERIFY_URL) {
      // Client gate when no backend is provisioned (Billing Library + finishTransaction).
      return true;
    }
    return verifyAndroidPurchaseOnServer(token, productId, ANDROID_PACKAGE);
  }

  return false;
}
