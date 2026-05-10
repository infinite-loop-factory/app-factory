import * as Haptics from "expo-haptics";

/**
 * Phase 1 인터랙션 햅틱 wrapper. 플랫폼별 noop 은 expo-haptics 가 처리.
 * 호출부는 fire-and-forget — promise 를 await 하지 않는다.
 */
const swallow = (_e: unknown) => undefined;

export const haptic = {
  light: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(swallow);
  },
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(swallow);
  },
  selection: () => {
    Haptics.selectionAsync().catch(swallow);
  },
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      swallow,
    );
  },
  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      swallow,
    );
  },
};
