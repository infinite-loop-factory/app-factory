import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("expo-modules-core", () => ({
  requireOptionalNativeModule: () => null,
}));

import {
  isIapAvailable,
  resetIapAvailabilityForTests,
} from "@/lib/monetization/iap-availability";

describe("iap availability", () => {
  beforeEach(() => {
    resetIapAvailabilityForTests();
  });

  it("reports unavailable instead of crashing when the native module is missing", () => {
    expect(isIapAvailable()).toBe(false);
  });

  it("caches the probe result", () => {
    expect(isIapAvailable()).toBe(false);
    expect(isIapAvailable()).toBe(false);
  });
});
