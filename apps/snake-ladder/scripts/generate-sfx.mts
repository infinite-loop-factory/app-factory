#!/usr/bin/env node
/**
 * Deterministic procedural SFX synthesis for the craft wood-and-felt theme.
 *
 * Regenerate all game sounds (44.1 kHz mono 16-bit wav) into src/assets/sounds:
 *
 *     pnpm sfx:build
 *
 * Every sound uses a fixed per-sound seed, so output is byte-identical between
 * runs. Design constraints baked in:
 *   - hop/ladder/snake are replayed every 90-190 ms during movement, so they
 *     are short ticks/chirps that read as rhythm when restarted.
 *   - roll is the shake+throw only; the per-bounce clacks come from the GL
 *     dice via dice_impact (impact.wav), so the two never double-hit.
 *   - win.wav / lose.wav / bgm.wav are NOT generated here — they are musical
 *     assets soundfont-rendered by generate-music.mts (pnpm music:build).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const TWO_PI = Math.PI * 2;
const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "assets",
  "sounds",
);

/** Seeded PRNG (mulberry32) with Box-Muller normals, for reproducible output. */
class Rng {
  private state: number;
  private spare: number | null = null;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  uniform(lo: number, hi: number): number {
    return lo + (hi - lo) * this.next();
  }

  normal(): number {
    if (this.spare !== null) {
      const value = this.spare;
      this.spare = null;
      return value;
    }
    let u = 0;
    while (u === 0) u = this.next();
    const radius = Math.sqrt(-2 * Math.log(u));
    const theta = TWO_PI * this.next();
    this.spare = radius * Math.sin(theta);
    return radius * Math.cos(theta);
  }

  noise(length: number): Float64Array {
    const out = new Float64Array(length);
    for (let i = 0; i < length; i++) out[i] = this.normal();
    return out;
  }
}

const samples = (durationS: number): number => Math.floor(SR * durationS);

/** RBJ biquad lowpass/highpass, the time-domain stand-in for FFT shaping. */
function biquad(
  x: Float64Array,
  kind: "lowpass" | "highpass",
  fc: number,
  q = Math.SQRT1_2,
): Float64Array {
  const w0 = (TWO_PI * Math.min(fc, SR * 0.45)) / SR;
  const cosW = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  const b1 = kind === "lowpass" ? 1 - cosW : -(1 + cosW);
  const b0 = kind === "lowpass" ? b1 / 2 : (1 + cosW) / 2;
  const b2 = b0;
  const a0 = 1 + alpha;
  const a1 = -2 * cosW;
  const a2 = 1 - alpha;

  const y = new Float64Array(x.length);
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const value = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1;
    x1 = x[i];
    y2 = y1;
    y1 = value;
    y[i] = value;
  }
  return y;
}

function place(
  sig: Float64Array,
  startS: number,
  event: Float64Array,
  amp = 1,
): void {
  const start = Math.floor(startS * SR);
  if (start >= sig.length) return;
  const length = Math.min(event.length, sig.length - start);
  // 10 ms release ramp: events rarely decay to zero exactly at their buffer
  // edge, and a hard step there is an audible broadband click.
  const release = Math.min(length, Math.floor(0.01 * SR));
  for (let i = 0; i < length; i++) {
    const tail = length - 1 - i;
    const fade = tail < release ? tail / release : 1;
    sig[start + i] += amp * event[i] * fade;
  }
}

function applyAttackRamp(x: Float64Array, rampS = 0.0006): Float64Array {
  const k = Math.max(1, Math.floor(rampS * SR));
  for (let i = 0; i < k && i < x.length; i++) x[i] *= i / k;
  return x;
}

function glideSine(
  fCurve: Float64Array,
  harmonic = 1,
  phase = 0,
): Float64Array {
  const out = new Float64Array(fCurve.length);
  let acc = phase;
  for (let i = 0; i < fCurve.length; i++) {
    acc += (TWO_PI * fCurve[i] * harmonic) / SR;
    out[i] = Math.sin(acc);
  }
  return out;
}

function fadeEdges(x: Float64Array, fadeInS = 0.003, fadeOutS = 0.02): void {
  const fi = Math.max(1, Math.floor(fadeInS * SR));
  const fo = Math.max(1, Math.floor(fadeOutS * SR));
  for (let i = 0; i < fi && i < x.length; i++) x[i] *= i / fi;
  for (let i = 0; i < fo && i < x.length; i++) {
    x[x.length - 1 - i] *= i / fo;
  }
}

function normalize(x: Float64Array, peak: number): void {
  let max = 0;
  for (const value of x) max = Math.max(max, Math.abs(value));
  if (max === 0) return;
  const scale = peak / max;
  for (let i = 0; i < x.length; i++) x[i] *= scale;
}

function writeWav(name: string, sig: Float64Array, peak: number): number {
  fadeEdges(sig);
  normalize(sig, peak);

  const pcm = Buffer.alloc(sig.length * 2);
  for (let i = 0; i < sig.length; i++) {
    const clamped = Math.max(-1, Math.min(1, sig[i]));
    pcm.writeInt16LE(Math.round(clamped * 32767), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, name), Buffer.concat([header, pcm]));
  return sig.length / SR;
}

// --- instruments -----------------------------------------------------------

type Mode = readonly [freq: number, gain: number, decayScale: number];

interface ClackOptions {
  duration?: number;
  modes?: readonly Mode[];
  bodyDecay?: number;
  brightness?: number;
  thudHz?: number;
  thudAmp?: number;
  thudDecay?: number;
}

const CLACK_DEFAULT_MODES: readonly Mode[] = [
  [310, 0.45, 1.2],
  [540, 0.55, 0.95],
  [870, 0.38, 0.75],
  [1320, 0.25, 0.55],
  [2250, 0.14, 0.35],
];

/** Dry boxy wooden hit: sharp noise attack + short body modes + felt thud. */
function woodClack(rng: Rng, options: ClackOptions = {}): Float64Array {
  const {
    duration = 0.16,
    modes = CLACK_DEFAULT_MODES,
    bodyDecay = 0.045,
    brightness = 1,
    thudHz = 155,
    thudAmp = 0.22,
    thudDecay = 0.032,
  } = options;

  const length = samples(duration);
  const out = new Float64Array(length);

  const attackLen = Math.min(length, samples(0.006));
  const attack = biquad(rng.noise(attackLen), "highpass", 1400);
  for (let i = 0; i < attackLen; i++) {
    out[i] += 0.28 * brightness * attack[i] * Math.exp(-i / SR / 0.0022);
  }

  for (const [baseFreq, baseGain, decayScale] of modes) {
    const freq = baseFreq * rng.uniform(0.96, 1.04);
    const gain = baseGain * (freq > 1000 ? brightness : 1);
    const phase = rng.uniform(0, TWO_PI);
    const decay = bodyDecay * decayScale;
    for (let i = 0; i < length; i++) {
      const t = i / SR;
      out[i] +=
        gain * Math.sin(TWO_PI * freq * t + phase) * Math.exp(-t / decay);
    }
  }

  const thudPhase = rng.uniform(0, TWO_PI);
  for (let i = 0; i < length; i++) {
    const t = i / SR;
    out[i] +=
      thudAmp *
      Math.sin(TWO_PI * thudHz * t + thudPhase) *
      Math.exp(-t / thudDecay);
  }

  return applyAttackRamp(out);
}

type Partial = readonly [ratio: number, gain: number, decay: number];

/** Tuned mallet bar (marimba/glockenspiel flavored by partial set). */
function barNote(
  rng: Rng,
  freq: number,
  duration: number,
  partials: readonly Partial[],
  strikeAmp = 0.18,
): Float64Array {
  const length = samples(duration);
  const out = new Float64Array(length);

  for (const [ratio, gain, decay] of partials) {
    const phase = rng.uniform(0, TWO_PI);
    for (let i = 0; i < length; i++) {
      const t = i / SR;
      out[i] +=
        gain *
        Math.sin(TWO_PI * freq * ratio * t + phase) *
        Math.exp(-t / decay);
    }
  }

  const strikeLen = Math.min(length, samples(0.006));
  const strike = biquad(rng.noise(strikeLen), "lowpass", 3200);
  for (let i = 0; i < strikeLen; i++) {
    out[i] += strikeAmp * strike[i] * Math.exp(-i / SR / 0.002);
  }

  return applyAttackRamp(out);
}

function svfBandpass(
  input: Float64Array,
  fCurve: Float64Array,
  q: number,
): Float64Array {
  const out = new Float64Array(input.length);
  const qInv = 1 / q;
  let low = 0;
  let band = 0;
  for (let i = 0; i < input.length; i++) {
    const g = 2 * Math.sin((Math.PI * Math.min(fCurve[i], SR * 0.45)) / SR);
    low += g * band;
    const high = input[i] - low - qInv * band;
    band += g * high;
    out[i] = band;
  }
  return out;
}

/**
 * Bandpassed white noise with a time-varying center. Two cascaded SVF passes:
 * a single pass has 6 dB/oct skirts and reads as broadband hiss, not a sweep.
 */
function sweptBandpassNoise(
  rng: Rng,
  duration: number,
  fCurve: Float64Array,
  q = 2.2,
): Float64Array {
  const noise = rng.noise(samples(duration));
  const out = svfBandpass(svfBandpass(noise, fCurve, q), fCurve, q);
  normalize(out, 1);
  return out;
}

const linspace = (lo: number, hi: number, n: number): Float64Array => {
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = lo + ((hi - lo) * i) / (n - 1);
  return out;
};

const geomspace = (lo: number, hi: number, n: number): Float64Array => {
  const out = new Float64Array(n);
  const ratio = Math.log(hi / lo);
  for (let i = 0; i < n; i++) out[i] = lo * Math.exp((ratio * i) / (n - 1));
  return out;
};

// --- sounds ----------------------------------------------------------------

function makeSelect(): Float64Array {
  const rng = new Rng(11);
  const sig = new Float64Array(samples(0.12));
  const tick = woodClack(rng, {
    duration: 0.09,
    modes: [
      [900, 0.3, 0.9],
      [1500, 0.55, 0.7],
      [2400, 0.4, 0.5],
      [3600, 0.18, 0.35],
    ],
    bodyDecay: 0.016,
    brightness: 0.9,
    thudHz: 420,
    thudAmp: 0.1,
    thudDecay: 0.012,
  });
  place(sig, 0, tick);
  return sig;
}

function makeHop(): Float64Array {
  const rng = new Rng(22);
  const sig = new Float64Array(samples(0.17));
  const tap = woodClack(rng, {
    duration: 0.14,
    modes: [
      [620, 0.55, 1],
      [980, 0.45, 0.8],
      [1750, 0.25, 0.55],
      [2600, 0.1, 0.4],
    ],
    bodyDecay: 0.026,
    brightness: 0.8,
    thudHz: 210,
    thudAmp: 0.18,
    thudDecay: 0.02,
  });
  place(sig, 0, tap);
  return sig;
}

function makeImpact(): Float64Array {
  const rng = new Rng(33);
  const sig = new Float64Array(samples(0.3));
  const main = woodClack(rng, {
    duration: 0.2,
    modes: [
      [280, 0.55, 1.25],
      [470, 0.6, 1],
      [780, 0.4, 0.75],
      [1200, 0.24, 0.55],
      [2100, 0.12, 0.35],
    ],
    bodyDecay: 0.05,
    brightness: 0.9,
    thudHz: 140,
    thudAmp: 0.34,
    thudDecay: 0.04,
  });
  place(sig, 0, main);
  const micro = woodClack(rng, {
    duration: 0.1,
    modes: [
      [520, 0.5, 0.8],
      [940, 0.4, 0.6],
      [1700, 0.2, 0.4],
    ],
    bodyDecay: 0.02,
    brightness: 0.7,
    thudHz: 180,
    thudAmp: 0.1,
    thudDecay: 0.014,
  });
  place(sig, 0.085, micro, 0.22);
  return sig;
}

/** Hand-shake rattle + throw whoosh; bounces are handled by impact.wav. */
function makeRoll(): Float64Array {
  const rng = new Rng(44);
  const sig = new Float64Array(samples(0.6));

  const mutedClack = (): Float64Array =>
    woodClack(rng, {
      duration: 0.09,
      modes: [
        [340, 0.5, 0.9],
        [560, 0.5, 0.7],
        [920, 0.3, 0.5],
        [1500, 0.12, 0.35],
      ],
      bodyDecay: 0.022,
      brightness: 0.55,
      thudHz: 170,
      thudAmp: 0.16,
      thudDecay: 0.018,
    });

  const rattle: ReadonlyArray<readonly [number, number]> = [
    [0.03, 0.62],
    [0.105, 0.5],
    [0.185, 0.7],
  ];
  for (const [ts, amp] of rattle) place(sig, ts, mutedClack(), amp);

  const whooshDur = 0.34;
  const whoosh = sweptBandpassNoise(
    rng,
    whooshDur,
    linspace(500, 1500, samples(whooshDur)),
    1.4,
  );
  for (let i = 0; i < whoosh.length; i++) {
    whoosh[i] *= Math.sin((Math.PI * i) / whoosh.length) ** 1.6;
  }
  place(sig, 0.235, whoosh, 0.34);
  return sig;
}

/** Short two-note xylophone up-chirp; restarted per step it reads as climbing. */
function makeLadder(): Float64Array {
  const rng = new Rng(55);
  const sig = new Float64Array(samples(0.3));
  const partials: readonly Partial[] = [
    [1, 1, 0.1],
    [3, 0.28, 0.05],
    [6.3, 0.1, 0.03],
  ];
  place(sig, 0, barNote(rng, 740, 0.22, partials), 0.8);
  place(sig, 0.07, barNote(rng, 988, 0.22, partials), 1);
  return sig;
}

/** Short descending slide-whistle chirp with a soft hiss bed. */
function makeSnake(): Float64Array {
  const rng = new Rng(66);
  const sig = new Float64Array(samples(0.28));

  const glideLen = samples(0.2);
  const fCurve = geomspace(720, 430, glideLen);
  const tone = glideSine(fCurve);
  const octave = glideSine(fCurve, 2);
  for (let i = 0; i < glideLen; i++) {
    tone[i] = (tone[i] + 0.3 * octave[i]) * Math.exp(-i / SR / 0.085);
  }
  place(sig, 0, tone, 0.85);

  const hiss = biquad(rng.noise(samples(0.24)), "highpass", 3800);
  for (let i = 0; i < hiss.length; i++) hiss[i] *= Math.exp(-i / SR / 0.075);
  place(sig, 0, hiss, 0.028);
  return sig;
}

/** Quantum shimmer: sparkle grains condensing into one soft bell. */
function makeCollapse(): Float64Array {
  const rng = new Rng(77);
  const duration = 0.95;
  const sig = new Float64Array(samples(duration));

  for (let grainIdx = 0; grainIdx < 30; grainIdx++) {
    const start = rng.uniform(0, 0.42);
    const freq = rng.uniform(1800, 5200);
    const decay = rng.uniform(0.05, 0.16);
    const glen = samples(Math.min(decay * 4, duration - start));
    const phase = rng.uniform(0, TWO_PI);
    const grain = new Float64Array(glen);
    for (let i = 0; i < glen; i++) {
      const t = i / SR;
      grain[i] = Math.sin(TWO_PI * freq * t + phase) * Math.exp(-t / decay);
    }
    applyAttackRamp(grain, 0.002);
    place(sig, start, grain, 0.045 * (0.35 + 1.3 * start));
  }

  const bellPartials: readonly Partial[] = [
    [1, 1, 0.38],
    [2, 0.3, 0.22],
    [3.01, 0.14, 0.15],
  ];
  place(sig, 0.45, barNote(rng, 880, 0.48, bellPartials, 0.06), 0.85);

  const swellLen = samples(0.5);
  const swell = new Float64Array(swellLen);
  for (let i = 0; i < swellLen; i++) {
    swell[i] =
      Math.sin((TWO_PI * 220 * i) / SR) *
      Math.sin((Math.PI * i) / swellLen) ** 2;
  }
  place(sig, 0.4, swell, 0.1);
  return sig;
}

/** Airy portal whoosh, center bends down then up. */
function makeTunnel(): Float64Array {
  const rng = new Rng(88);
  const duration = 0.72;
  const n = samples(duration);

  const fCurve = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1);
    fCurve[i] = 900 - 520 * Math.sin(Math.PI * x) + 500 * x;
  }
  const body = sweptBandpassNoise(rng, duration, fCurve, 3);

  const subCurve = geomspace(180, 95, n);
  const sub = glideSine(subCurve);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1);
    const swell = Math.sin(Math.PI * x);
    out[i] = body[i] * swell ** 1.2 + 0.16 * sub[i] * swell ** 2;
  }
  return out;
}

const SOUNDS: ReadonlyArray<readonly [string, () => Float64Array, number]> = [
  ["select.wav", makeSelect, 0.5],
  ["hop.wav", makeHop, 0.6],
  ["impact.wav", makeImpact, 0.88],
  ["roll.wav", makeRoll, 0.8],
  ["ladder.wav", makeLadder, 0.7],
  ["snake.wav", makeSnake, 0.7],
  ["collapse.wav", makeCollapse, 0.72],
  ["tunnel.wav", makeTunnel, 0.62],
];

for (const [name, builder, peak] of SOUNDS) {
  const duration = writeWav(name, builder(), peak);
  // biome-ignore lint/suspicious/noConsole: CLI progress output
  console.log(`${name.padEnd(14)} ${duration.toFixed(2)}s  peak ${peak}`);
}
