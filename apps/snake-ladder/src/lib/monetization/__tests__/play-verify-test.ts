import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { verifyAndroidPurchaseOnServer } from "@/lib/monetization/play-verify";

describe("verifyAndroidPurchaseOnServer", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  it("passes when no server URL is configured", async () => {
    delete process.env.EXPO_PUBLIC_PLAY_VERIFY_URL;
    await expect(
      verifyAndroidPurchaseOnServer(
        "token",
        "snake_ladder_gold_10",
        "com.example",
      ),
    ).resolves.toBe(true);
  });

  it("posts to the verify endpoint when configured", async () => {
    process.env.EXPO_PUBLIC_PLAY_VERIFY_URL = "https://example.com/verify";
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true }),
    } as Response);

    await expect(
      verifyAndroidPurchaseOnServer(
        "token-1",
        "snake_ladder_gold_10",
        "com.example",
      ),
    ).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/verify",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
