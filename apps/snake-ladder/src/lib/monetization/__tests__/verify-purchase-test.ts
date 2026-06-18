import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { verifyStorePurchase } from "@/lib/monetization/verify-purchase";

describe("verifyStorePurchase", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("requires a product id", async () => {
    await expect(
      verifyStorePurchase(
        { productId: null } as never,
        async () => ({}) as never,
      ),
    ).resolves.toBe(false);
  });
});
