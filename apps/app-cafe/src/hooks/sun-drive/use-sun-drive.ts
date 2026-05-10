// sunStore.ts

import {
  cancelAnimation,
  Easing,
  makeMutable,
  type SharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { create } from "zustand";
import {
  DEFAULT_SUN_DRIVER_OPTIONS,
  type RequiredOpts,
  type SunDriverOptions,
} from "@/constants/sun-drive";

export type { SunDriverOptions };

function clamp01(n: number) {
  "worklet";
  return Math.max(0, Math.min(1, n));
}

// JS-thread seeded RNG
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function randRange(rng: () => number, a: number, b: number) {
  return a + (b - a) * rng();
}
function pickMs(rng: () => number, r: [number, number]) {
  return Math.round(randRange(rng, r[0], r[1]));
}

function timing(to: number, ms: number, easing?: (t: number) => number) {
  const duration = Math.max(1, ms);
  if (easing) {
    return withTiming(to, { duration, easing });
  }
  return withTiming(to, { duration });
}
function hold(value: number, ms: number) {
  return timing(value, ms, Easing.linear);
}

function buildSunSequence(opts: RequiredOpts, seed: number) {
  const rng = makeRng(seed);

  const min = clamp01(opts.min);
  const max = clamp01(opts.max);

  const rise = pickMs(rng, opts.riseMs);
  const holdMs_ = pickMs(rng, opts.holdMs);
  const fall = pickMs(rng, opts.fallMs);
  const lowHold = pickMs(rng, opts.lowHoldMs);

  const anims: ReturnType<typeof withTiming>[] = [];

  anims.push(hold(min, lowHold));
  anims.push(timing(max, rise, Easing.inOut(Easing.cubic)));

  const doDip = rng() < opts.dipChance;
  if (!doDip) {
    anims.push(hold(max, holdMs_));
  } else {
    const dipCount = rng() < 0.55 ? 1 : 2;
    const seg = Math.round(holdMs_ / (dipCount + 1));

    for (let i = 0; i < dipCount; i++) {
      anims.push(hold(max, seg));

      const depth = clamp01(randRange(rng, opts.dipDepth[0], opts.dipDepth[1]));
      const dipTo = clamp01(max * (1 - depth));

      anims.push(
        timing(dipTo, pickMs(rng, opts.dipMs), Easing.out(Easing.quad)),
      );
      anims.push(
        timing(max, pickMs(rng, opts.dipRecoverMs), Easing.inOut(Easing.quad)),
      );
    }

    const used = seg * dipCount;
    anims.push(hold(max, Math.max(0, holdMs_ - used)));
  }

  anims.push(timing(min, fall, Easing.inOut(Easing.cubic)));

  if (anims.length === 0) {
    return hold(min, 1000);
  }

  return withSequence(anims[0], ...(anims.slice(1) as any[]));
}

/** ✅ 컴포넌트들이 쓸 "드라이버 타입" */
export interface SunDriver {
  intensity: SharedValue<number>;
  movementX: SharedValue<number>;
}

/** ✅ Zustand state 타입 export (너가 요청한 "스토어 타입 지정") */
export interface SunStoreState extends SunDriver {
  isDark: boolean;
  running: boolean;
  opts: RequiredOpts;

  setDark: (isDark: boolean) => void;
  configure: (patch: SunDriverOptions) => void;

  start: (force?: boolean) => void;
  stop: () => void;
  restart: () => void;
}

export const useSunStore = create<SunStoreState>((set, get) => {
  const intensity = makeMutable(0);
  const movementX = makeMutable(DEFAULT_SUN_DRIVER_OPTIONS.movementRange[0]);

  const applyRun = () => {
    const { opts, isDark } = get();

    cancelAnimation(intensity);
    cancelAnimation(movementX);

    if (isDark) {
      intensity.value = withTiming(0, {
        duration: opts.fadeOutMs,
        easing: Easing.out(Easing.quad),
      });
      set({ running: false });
      return;
    }

    intensity.value = clamp01(opts.min);
    movementX.value = opts.movementRange[0];

    try {
      const seq = withSequence(
        buildSunSequence(opts, opts.seed + 1),
        buildSunSequence(opts, opts.seed + 2),
        buildSunSequence(opts, opts.seed + 3),
      );
      intensity.value = withRepeat(seq, -1, false);
    } catch (e) {
      console.error("Animation error:", e);
    }

    const rngA = makeRng(opts.seed + 99);
    const rngB = makeRng(opts.seed + 199);
    const mvA = pickMs(rngA, opts.movementMs);
    const mvB = pickMs(rngB, opts.movementMs);

    movementX.value = withRepeat(
      withSequence(
        timing(opts.movementRange[1], mvA, Easing.inOut(Easing.linear)),
        timing(opts.movementRange[0], mvB, Easing.inOut(Easing.linear)),
      ),
      -1,
      false,
    );

    set({ running: true });
  };

  return {
    intensity,
    movementX,

    isDark: false,
    running: false,
    opts: DEFAULT_SUN_DRIVER_OPTIONS,

    setDark: (isDark) => {
      set({ isDark });
      applyRun();
    },

    configure: (patch) => {
      set({ opts: { ...get().opts, ...(patch ?? {}) } });
      applyRun();
    },

    start: (force = false) => {
      const { running } = get();
      if (running && !force) return;
      applyRun();
    },

    stop: () => {
      cancelAnimation(intensity);
      cancelAnimation(movementX);
      set({ running: false });
    },

    restart: () => applyRun(),
  };
});
