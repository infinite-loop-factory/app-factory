import { describe, expect, it } from "@jest/globals";
import { requestTrackingPermissionIfNeeded } from "@/lib/monetization/att";

describe("att", () => {
  it("no-ops in E2E mode without calling native module", async () => {
    const previous = process.env.EXPO_PUBLIC_E2E;
    process.env.EXPO_PUBLIC_E2E = "1";
    await expect(requestTrackingPermissionIfNeeded()).resolves.toBeUndefined();
    process.env.EXPO_PUBLIC_E2E = previous;
  });
});
