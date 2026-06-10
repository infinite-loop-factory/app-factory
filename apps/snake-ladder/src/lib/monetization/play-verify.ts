import { readPublicEnv } from "@/lib/public-env";

/**
 * Optional Google Play server-side receipt verification.
 * Set EXPO_PUBLIC_PLAY_VERIFY_URL to a backend that accepts
 * `{ purchaseToken, productId, packageName }` and returns `{ valid: boolean }`.
 */
function playVerifyEndpoint(): string | undefined {
  return readPublicEnv("PLAY_VERIFY_URL");
}

export async function verifyAndroidPurchaseOnServer(
  purchaseToken: string,
  productId: string,
  packageName: string,
): Promise<boolean> {
  const endpoint = playVerifyEndpoint();
  if (!endpoint) return true;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseToken, productId, packageName }),
    });
    if (!response.ok) return false;
    const payload = (await response.json()) as { valid?: boolean };
    return payload.valid === true;
  } catch {
    return false;
  }
}
