import type { GameFeedbackEvent } from "@/lib/game-feedback";

import { type HapticEvent, playGameHaptic } from "@/lib/haptics";
import { playGameSound } from "@/lib/sounds";

function hapticForEvent(event: GameFeedbackEvent): HapticEvent | null {
  switch (event.type) {
    case "selection":
      return "selection";
    case "roll":
      return "roll";
    case "hop":
      return "hop";
    case "collapse":
      return "collapse";
    case "ladder_step":
      return "ladder";
    case "snake_step":
      return "snake";
    case "tunnel":
      return "tunnel";
    case "win":
      return "win";
    case "lose":
      return "lose";
  }
}

export function dispatchGameFeedback(
  event: GameFeedbackEvent,
  options: { hapticsEnabled: boolean; soundEnabled: boolean },
): void {
  const haptic = hapticForEvent(event);
  if (haptic) {
    void playGameHaptic(haptic, options.hapticsEnabled);
  }
  playGameSound(event, options.soundEnabled);
}
