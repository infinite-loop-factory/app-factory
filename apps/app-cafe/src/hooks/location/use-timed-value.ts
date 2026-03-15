import { useState } from "react";
import {
  type SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type Options<T> = {
  duration?: number;
  throttleMs?: number;
  initial?: T;
};

const isNumber = (v: any) => typeof v === "number" && Number.isFinite(v);
const isObject = (v: any) => v !== null && typeof v === "object";
const isArray = (v: any) => Array.isArray(v);

// ✅ 숫자만 부드럽게 보간, 나머지는 즉시 스위치
function mixValue(a: any, b: any, t: number): any {
  "worklet";

  if (isNumber(a) && isNumber(b)) return a + (b - a) * t;

  if (isArray(a) && isArray(b)) {
    const len = Math.max(a.length, b.length);
    const out = new Array(len);
    for (let i = 0; i < len; i++) out[i] = mixValue(a[i], b[i], t);
    return out;
  }

  if (isObject(a) && isObject(b)) {
    const out: any = {};
    const keys: string[] = [];
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    for (let i = 0; i < aKeys.length; i++) keys.push(aKeys[i]);
    for (let i = 0; i < bKeys.length; i++) {
      const k = bKeys[i];
      if (keys.indexOf(k) === -1) keys.push(k);
    }

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      out[k] = mixValue(a[k], b[k], t);
    }
    return out;
  }

  return t >= 1 ? b : a;
}

export function useTimedValue<T>(source: SharedValue<T>, options?: Options<T>) {
  const {
    duration = 800,
    throttleMs = 120,
    initial = source.value,
  } = options ?? {};

  // ✅ 렌더 중 source.value 읽지 않음
  const [state, setState] = useState<T>(initial);

  const from = useSharedValue<T>(initial);
  const to = useSharedValue<T>(initial);
  const progress = useSharedValue(1);

  const animated = useDerivedValue<T>(() => {
    return mixValue(from.value, to.value, progress.value) as T;
  });

  const lastSent = useSharedValue(0);

  useAnimatedReaction(
    () => source.value,
    (next) => {
      from.value = animated.value; // 현재 보간 중인 값을 출발점으로
      to.value = next;

      progress.value = 0;
      progress.value = withTiming(1, { duration });
    },
    [],
  );

  useAnimatedReaction(
    () => animated.value,
    (v) => {
      const now = Date.now();
      if (throttleMs > 0 && now - lastSent.value < throttleMs) return;
      lastSent.value = now;

      scheduleOnRN(setState, v);
    },
    [],
  );

  return { state, animated };
}
