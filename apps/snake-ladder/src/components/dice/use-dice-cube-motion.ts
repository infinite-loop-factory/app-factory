import { useEffect } from "react";
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  type DiceFaceValue,
  FACE_ROTATIONS,
  settleRotation,
} from "@/components/dice/dice-orientations";

/** Table-top view: strong foreshortening without floating feel. */
export const DICE_PERSPECTIVE = 480;
export const DICE_SETTLE_SPRING = { damping: 14, stiffness: 110, mass: 0.72 };

type DiceMotionOptions = {
  size?: number;
  reducedMotion?: boolean;
  /** Single visible face — settle upright (no cube orientation). */
  singleFace?: boolean;
};

function toFaceValue(value: number | null): DiceFaceValue | null {
  if (value === null || value < 1 || value > 6) return null;
  return value as DiceFaceValue;
}

/** Roll on the floor: bottom-edge pivot, mostly rotateX + slight drift. */
function startGroundRoll(
  rotX: ReturnType<typeof useSharedValue<number>>,
  rotY: ReturnType<typeof useSharedValue<number>>,
  rotZ: ReturnType<typeof useSharedValue<number>>,
  scale: ReturnType<typeof useSharedValue<number>>,
  shadowScale: ReturnType<typeof useSharedValue<number>>,
  translateX: ReturnType<typeof useSharedValue<number>>,
  translateY: ReturnType<typeof useSharedValue<number>>,
  drift: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) {
    rotX.set(
      withRepeat(
        withTiming(360, { duration: 800, easing: Easing.linear }),
        -1,
        false,
      ),
    );
    rotY.set(0);
    rotZ.set(0);
    scale.set(1);
    shadowScale.set(1);
    translateX.set(0);
    translateY.set(0);
    return;
  }

  translateY.set(0);
  scale.set(1);

  rotX.set(
    withRepeat(
      withTiming(360, { duration: 160, easing: Easing.linear }),
      -1,
      false,
    ),
  );
  rotY.set(
    withRepeat(
      withTiming(360, { duration: 280, easing: Easing.linear }),
      -1,
      false,
    ),
  );
  rotZ.set(
    withRepeat(
      withSequence(
        withTiming(10, { duration: 100, easing: Easing.inOut(Easing.sin) }),
        withTiming(-10, { duration: 100, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    ),
  );
  translateX.set(
    withRepeat(
      withSequence(
        withTiming(drift, { duration: 140, easing: Easing.inOut(Easing.sin) }),
        withTiming(-drift, { duration: 160, easing: Easing.inOut(Easing.sin) }),
        withTiming(drift * 0.6, {
          duration: 130,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(-drift * 0.35, {
          duration: 120,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      false,
    ),
  );
  shadowScale.set(
    withRepeat(
      withSequence(
        withTiming(0.78, { duration: 120, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.08, { duration: 120, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    ),
  );
}

export function useDiceCubeMotion(
  value: number | null,
  rolling: boolean,
  options: DiceMotionOptions = {},
) {
  const size = options.size ?? 72;
  const reducedMotion = options.reducedMotion ?? false;
  const singleFace = options.singleFace ?? false;
  const drift = size * 0.22;

  const rotX = useSharedValue(0);
  const rotY = useSharedValue(0);
  const rotZ = useSharedValue(0);
  const scale = useSharedValue(1);
  const shadowScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (rolling) {
      cancelAnimation(rotX);
      cancelAnimation(rotY);
      cancelAnimation(rotZ);
      cancelAnimation(scale);
      cancelAnimation(shadowScale);
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      startGroundRoll(
        rotX,
        rotY,
        rotZ,
        scale,
        shadowScale,
        translateX,
        translateY,
        drift,
        reducedMotion,
      );
      return;
    }

    cancelAnimation(rotX);
    cancelAnimation(rotY);
    cancelAnimation(rotZ);
    cancelAnimation(scale);
    cancelAnimation(shadowScale);
    cancelAnimation(translateX);
    cancelAnimation(translateY);

    const extraSpins = reducedMotion ? 1 : 2;
    translateX.set(withSpring(0, DICE_SETTLE_SPRING));
    translateY.set(
      withSequence(
        withTiming(-size * 0.04, {
          duration: 90,
          easing: Easing.out(Easing.quad),
        }),
        withSpring(0, DICE_SETTLE_SPRING),
      ),
    );
    rotZ.set(
      withSequence(
        withSpring(4, { damping: 6, stiffness: 200 }),
        withSpring(0, DICE_SETTLE_SPRING),
      ),
    );
    scale.set(
      withSequence(
        withSpring(1.04, { damping: 8, stiffness: 260 }),
        withSpring(1, DICE_SETTLE_SPRING),
      ),
    );
    shadowScale.set(withSpring(1, DICE_SETTLE_SPRING));

    if (singleFace || !toFaceValue(value)) {
      rotX.set(withSpring(0, DICE_SETTLE_SPRING));
      rotY.set(withSpring(0, DICE_SETTLE_SPRING));
      return;
    }

    const face = toFaceValue(value) as DiceFaceValue;
    const target = FACE_ROTATIONS[face];
    rotX.set(
      withSpring(
        settleRotation(rotX.get(), target.rotateX, extraSpins),
        DICE_SETTLE_SPRING,
      ),
    );
    rotY.set(
      withSpring(
        settleRotation(rotY.get(), target.rotateY, extraSpins),
        DICE_SETTLE_SPRING,
      ),
    );
  }, [
    drift,
    singleFace,
    reducedMotion,
    rolling,
    rotX,
    rotY,
    rotZ,
    scale,
    shadowScale,
    size,
    translateX,
    translateY,
    value,
  ]);

  return { rotX, rotY, rotZ, scale, shadowScale, translateX, translateY };
}
