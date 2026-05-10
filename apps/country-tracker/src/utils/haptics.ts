import { Platform } from "react-native";

type HapticStyle = "light" | "medium" | "heavy" | "success" | "error";

export async function triggerHaptic(
  style: HapticStyle = "light",
): Promise<void> {
  if (Platform.OS === "web") return;

  try {
    const Haptics = await import("expo-haptics");

    switch (style) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        break;
      case "error":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch {
    // Silently fail if haptics not available
  }
}
