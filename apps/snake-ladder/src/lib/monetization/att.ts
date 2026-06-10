import { Platform } from "react-native";
import { isE2E } from "@/lib/e2e-seed";

export async function requestTrackingPermissionIfNeeded(): Promise<void> {
  if (isE2E()) return;
  if (Platform.OS !== "ios") return;
  try {
    const { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } =
      await import("expo-tracking-transparency");
    const current = await getTrackingPermissionsAsync();
    if (current.status === "undetermined") {
      await requestTrackingPermissionsAsync();
    }
  } catch {
    // Simulator / missing native module
  }
}
