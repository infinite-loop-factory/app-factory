import * as Haptics from "expo-haptics";

export type HapticEvent =
  | "selection"
  | "roll"
  | "hop"
  | "collapse"
  | "ladder"
  | "snake"
  | "tunnel"
  | "win"
  | "lose";

export async function playGameHaptic(
  event: HapticEvent,
  enabled: boolean,
): Promise<void> {
  if (!enabled) return;

  switch (event) {
    case "selection":
      await Haptics.selectionAsync();
      break;
    case "roll":
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case "hop":
      await Haptics.selectionAsync();
      break;
    case "collapse":
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case "ladder":
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case "snake":
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
      break;
    case "tunnel":
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case "win":
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case "lose":
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
  }
}
