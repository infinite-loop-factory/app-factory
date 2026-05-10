export interface SunDriverOptions {
  min?: number;
  max?: number;

  riseMs?: [number, number];
  holdMs?: [number, number];
  fallMs?: [number, number];
  lowHoldMs?: [number, number];

  dipChance?: number;
  dipDepth?: [number, number];
  dipMs?: [number, number];
  dipRecoverMs?: [number, number];

  movementRange?: [number, number];
  movementMs?: [number, number];

  fadeOutMs?: number;
  seed?: number;
}

export type RequiredOpts = Required<SunDriverOptions>;

export const DEFAULT_SUN_DRIVER_OPTIONS: RequiredOpts = {
  min: 0,
  max: 1,

  riseMs: [9000, 16000],
  holdMs: [6000, 12000],
  fallMs: [10000, 18000],
  lowHoldMs: [5000, 12000],

  dipChance: 0.75,
  dipDepth: [0.2, 0.55],
  dipMs: [300, 1300],
  dipRecoverMs: [800, 2200],

  movementRange: [-20, 25],
  movementMs: [25000, 52000],

  fadeOutMs: 500,
  seed: 777,
};
