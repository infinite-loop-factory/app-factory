import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("expo-iap", () => {
  throw new Error("Cannot find native module 'ExpoIap'");
});

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
