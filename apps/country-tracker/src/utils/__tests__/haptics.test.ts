import { describe, expect, it, jest } from "@jest/globals";

jest.mock("react-native", () => ({
  Platform: { OS: "web" },
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn<() => Promise<void>>().mockResolvedValue(),
  notificationAsync: jest.fn<() => Promise<void>>().mockResolvedValue(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Error: "error" },
}));

import { triggerHaptic } from "@/utils/haptics";

describe("triggerHaptic on web platform", () => {
  it("does not throw when called with default style on web", async () => {
    await expect(triggerHaptic()).resolves.toBeUndefined();
  });

  it("completes without error for light style", async () => {
    await expect(triggerHaptic("light")).resolves.toBeUndefined();
  });

  it("completes without error for medium style", async () => {
    await expect(triggerHaptic("medium")).resolves.toBeUndefined();
  });

  it("completes without error for heavy style", async () => {
    await expect(triggerHaptic("heavy")).resolves.toBeUndefined();
  });

  it("completes without error for success style", async () => {
    await expect(triggerHaptic("success")).resolves.toBeUndefined();
  });

  it("completes without error for error style", async () => {
    await expect(triggerHaptic("error")).resolves.toBeUndefined();
  });
});
