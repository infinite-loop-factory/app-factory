#!/usr/bin/env node
/**
 * Soundfont-rendered musical assets: win/lose jingles + the BGM loop.
 *
 *     pnpm music:build
 *
 * Composes MIDI in code, renders it with fluidsynth (brew install
 * fluid-synth) through the MIT-licensed MuseScore_General soundfont
 * (auto-downloaded to ~/.cache/soundfonts on first run), then post-processes:
 * mono downmix, silence trim, normalize. The BGM is cut to the exact 16-bar
 * length and resampled to 22.05 kHz so the wav loops seamlessly (mp3/aac
 * padding would add an audible gap at the loop point).
 *
 * Output is committed wav, so neither fluidsynth nor the soundfont is a
 * runtime or CI dependency. Short percussive foley lives in generate-sfx.mts.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "assets",
  "sounds",
);
const SOUNDFONT_URL =
  "https://ftp.osuosl.org/pub/musescore/soundfont/MuseScore_General/MuseScore_General.sf3";
const SOUNDFONT_PATH = join(
  homedir(),
  ".cache",
  "soundfonts",
  "MuseScore_General.sf3",
);
const TPQ = 480;

// --- MIDI assembly ----------------------------------------------------------

interface MidiEvent {
  tick: number;
  order: number;
  data: number[];
}

class Midi {
  private events: MidiEvent[] = [];

  tempo(bpm: number): void {
    const usPerQuarter = Math.round(60_000_000 / bpm);
    this.events.push({
      tick: 0,
      order: 0,
      data: [
        0xff,
        0x51,
        0x03,
        (usPerQuarter >> 16) & 0x7f,
        (usPerQuarter >> 8) & 0xff,
        usPerQuarter & 0xff,
      ],
    });
  }

  program(channel: number, prog: number): void {
    this.events.push({ tick: 0, order: 1, data: [0xc0 | channel, prog] });
  }

  control(channel: number, cc: number, value: number): void {
    this.events.push({ tick: 0, order: 1, data: [0xb0 | channel, cc, value] });
  }

  note(
    tick: number,
    channel: number,
    key: number,
    velocity: number,
    durTicks: number,
  ): void {
    this.events.push({ tick, order: 3, data: [0x90 | channel, key, velocity] });
    this.events.push({
      tick: tick + durTicks,
      order: 2,
      data: [0x80 | channel, key, 0],
    });
  }

  pitchBend(tick: number, channel: number, value: number): void {
    const clamped = Math.max(0, Math.min(16383, Math.round(value)));
    this.events.push({
      tick,
      order: 1,
      data: [0xe0 | channel, clamped & 0x7f, clamped >> 7],
    });
  }

  build(): Buffer {
    const sorted = [...this.events].sort(
      (a, b) => a.tick - b.tick || a.order - b.order,
    );
    const bytes: number[] = [];
    let prevTick = 0;
    for (const event of sorted) {
      pushVlq(bytes, event.tick - prevTick);
      bytes.push(...event.data);
      prevTick = event.tick;
    }
    pushVlq(bytes, 0);
    bytes.push(0xff, 0x2f, 0x00); // end of track

    const header = Buffer.alloc(14);
    header.write("MThd", 0);
    header.writeUInt32BE(6, 4);
    header.writeUInt16BE(0, 8); // format 0
    header.writeUInt16BE(1, 10);
    header.writeUInt16BE(TPQ, 12);

    const trackHeader = Buffer.alloc(8);
    trackHeader.write("MTrk", 0);
    trackHeader.writeUInt32BE(bytes.length, 4);
    return Buffer.concat([header, trackHeader, Buffer.from(bytes)]);
  }
}

function pushVlq(bytes: number[], value: number): void {
  const stack = [value & 0x7f];
  let rest = value >> 7;
  while (rest > 0) {
    stack.push((rest & 0x7f) | 0x80);
    rest >>= 7;
  }
  while (stack.length > 0) bytes.push(stack.pop() as number);
}

// --- compositions -----------------------------------------------------------

const MARIMBA = 12;
const GLOCKENSPIEL = 9;
const MUSIC_BOX = 10;
const PIZZICATO = 45;
const TROMBONE = 57;
const DRUMS = 9; // channel, not program
const MARACAS = 70;
const WOODBLOCK_HI = 76;
const WOODBLOCK_LO = 77;

function composeWin(): Buffer {
  const midi = new Midi();
  midi.tempo(120);
  midi.program(0, MARIMBA);
  midi.program(1, GLOCKENSPIEL);
  midi.control(0, 7, 110);
  midi.control(1, 7, 100);

  // Rising marimba arpeggio C5 E5 G5 C6 on 16ths.
  const arpeggio = [72, 76, 79, 84];
  arpeggio.forEach((key, i) => {
    midi.note(i * 120, 0, key, 95 + i * 5, 240);
  });

  // Triumphant chord: marimba bed + glockenspiel sparkle on top.
  for (const key of [60, 67, 72]) midi.note(480, 0, key, 96, 1440);
  for (const key of [84, 88, 91]) midi.note(480, 1, key, 92, 1440);

  // Echoing high glockenspiel pings.
  midi.note(840, 1, 96, 68, 480);
  midi.note(1200, 1, 100, 56, 480);
  return midi.build();
}

function composeLose(): Buffer {
  const midi = new Midi();
  midi.tempo(120);
  midi.program(0, TROMBONE);
  midi.control(0, 7, 105);

  // Wah - wah - wah...
  midi.note(0, 0, 55, 86, 200);
  midi.note(240, 0, 54, 80, 200);
  midi.note(480, 0, 53, 76, 200);

  // ...woooomp: held note drooping two semitones via pitch bend.
  midi.note(720, 0, 52, 90, 700);
  const bendSteps = 14;
  for (let i = 0; i <= bendSteps; i++) {
    midi.pitchBend(900 + i * 36, 0, 8192 - (8192 * i) / bendSteps);
  }
  midi.pitchBend(1480, 0, 8192);

  // Deflated little woodblock tap to close the joke.
  midi.note(1520, DRUMS, WOODBLOCK_LO, 72, 120);
  return midi.build();
}

const BGM_BPM = 92;
const BGM_BARS = 16;
const BAR_TICKS = TPQ * 4;
const EIGHTH = TPQ / 2;
export const BGM_SECONDS = (BGM_BARS * 4 * 60) / BGM_BPM;

interface Chord {
  bass: number;
  tones: readonly [number, number, number];
}

const CHORDS: Record<string, Chord> = {
  C: { bass: 48, tones: [72, 76, 79] },
  Am: { bass: 45, tones: [69, 72, 76] },
  F: { bass: 41, tones: [65, 69, 72] },
  G: { bass: 43, tones: [67, 71, 74] },
  Em: { bass: 40, tones: [64, 67, 71] },
};

const PROGRESSION = [
  "C",
  "Am",
  "F",
  "G",
  "C",
  "Am",
  "F",
  "G",
  "Em",
  "Am",
  "F",
  "G",
  "C",
  "F",
  "G",
  "G",
] as const;

// Melody patterns: [eighth-slot, chord-tone index (3 = root an octave up), velocity]
type Step = readonly [slot: number, tone: number, velocity: number];
const PATTERN_A: readonly Step[] = [
  [0, 0, 84],
  [2, 1, 66],
  [4, 2, 76],
  [6, 1, 62],
];
const PATTERN_B: readonly Step[] = [
  [0, 2, 80],
  [1, 1, 60],
  [2, 0, 72],
  [4, 1, 64],
  [6, 2, 70],
];
const PATTERN_FILL: readonly Step[] = [
  [0, 0, 82],
  [4, 0, 68],
  [5, 1, 72],
  [6, 2, 78],
  [7, 3, 84],
];

function melodyPattern(bar: number): readonly Step[] {
  if (bar % 4 === 3) return PATTERN_FILL;
  return bar % 2 === 0 ? PATTERN_A : PATTERN_B;
}

function composeBgm(): Buffer {
  const midi = new Midi();
  midi.tempo(BGM_BPM);
  midi.program(0, MARIMBA);
  midi.program(1, PIZZICATO);
  midi.program(2, MUSIC_BOX);
  midi.control(0, 7, 100);
  midi.control(1, 7, 88);
  midi.control(2, 7, 62);

  PROGRESSION.forEach((name, bar) => {
    const chord = CHORDS[name];
    const barStart = bar * BAR_TICKS;

    // Marimba melody.
    for (const [slot, tone, velocity] of melodyPattern(bar)) {
      const key = tone === 3 ? chord.tones[0] + 12 : chord.tones[tone];
      midi.note(barStart + slot * EIGHTH, 0, key, velocity, EIGHTH - 30);
    }

    // Pizzicato bass: root on 1, fifth on 3.
    midi.note(barStart, 1, chord.bass, 74, TPQ);
    midi.note(barStart + 2 * TPQ, 1, chord.bass + 7, 62, TPQ);

    // Music box bell on the first beat of every 4-bar phrase.
    if (bar % 4 === 0) {
      midi.note(barStart, 2, chord.tones[0] + 12, 44, TPQ);
    }

    // Percussion: soft maracas offbeats, woodblock backbeat.
    for (const slot of [1, 3, 5, 7]) {
      midi.note(barStart + slot * EIGHTH, DRUMS, MARACAS, 28, 60);
    }
    for (const slot of [2, 6]) {
      midi.note(barStart + slot * EIGHTH, DRUMS, WOODBLOCK_HI, 36, 60);
    }
    if (bar % 4 === 3) {
      midi.note(barStart + 7 * EIGHTH, DRUMS, WOODBLOCK_LO, 44, 60);
    }
  });

  return midi.build();
}

// --- render + post-process --------------------------------------------------

function ensureSoundfont(): void {
  if (existsSync(SOUNDFONT_PATH)) return;
  mkdirSync(dirname(SOUNDFONT_PATH), { recursive: true });
  log(`downloading soundfont to ${SOUNDFONT_PATH} ...`);
  execFileSync("curl", ["-sL", "-o", SOUNDFONT_PATH, SOUNDFONT_URL], {
    stdio: "inherit",
  });
}

function renderMidi(
  name: string,
  midi: Buffer,
  options: { gain: number; reverb: boolean },
): Float64Array {
  const midiPath = join("/tmp", `snake-ladder-${name}.mid`);
  const wavPath = join("/tmp", `snake-ladder-${name}.wav`);
  writeFileSync(midiPath, midi);
  execFileSync("fluidsynth", [
    "-ni",
    "-R",
    options.reverb ? "1" : "0",
    "-C",
    "0",
    "-g",
    String(options.gain),
    "-r",
    "44100",
    "-F",
    wavPath,
    SOUNDFONT_PATH,
    midiPath,
  ]);
  return readWavMono(wavPath);
}

/** Parse a RIFF PCM-16 wav and downmix to mono float. */
function readWavMono(path: string): Float64Array {
  const buf = readFileSync(path);
  let offset = 12;
  let channels = 1;
  let dataStart = -1;
  let dataLen = 0;
  while (offset + 8 <= buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === "fmt ") channels = buf.readUInt16LE(offset + 10);
    if (id === "data") {
      dataStart = offset + 8;
      dataLen = size;
      break;
    }
    offset += 8 + size + (size % 2);
  }
  if (dataStart < 0) throw new Error(`no data chunk in ${path}`);

  const frames = Math.floor(dataLen / 2 / channels);
  const out = new Float64Array(frames);
  for (let i = 0; i < frames; i++) {
    let acc = 0;
    for (let c = 0; c < channels; c++) {
      acc += buf.readInt16LE(dataStart + (i * channels + c) * 2);
    }
    out[i] = acc / channels / 32768;
  }
  return out;
}

function trimTail(x: Float64Array, keepS: number, sr: number): Float64Array {
  let last = x.length - 1;
  while (last > 0 && Math.abs(x[last]) < 0.001) last--;
  return x.slice(0, Math.min(x.length, last + Math.floor(keepS * sr)));
}

function fadeEdges(
  x: Float64Array,
  sr: number,
  inS = 0.002,
  outS = 0.04,
): void {
  const fi = Math.max(1, Math.floor(inS * sr));
  const fo = Math.max(1, Math.floor(outS * sr));
  for (let i = 0; i < fi && i < x.length; i++) x[i] *= i / fi;
  for (let i = 0; i < fo && i < x.length; i++) x[x.length - 1 - i] *= i / fo;
}

function normalize(x: Float64Array, peak: number): void {
  let max = 0;
  for (const value of x) max = Math.max(max, Math.abs(value));
  if (max === 0) return;
  for (let i = 0; i < x.length; i++) x[i] *= peak / max;
}

function lowpass(x: Float64Array, fc: number, sr: number): Float64Array {
  const w0 = (2 * Math.PI * fc) / sr;
  const cosW = Math.cos(w0);
  const alpha = Math.sin(w0) / Math.SQRT2;
  const b1 = 1 - cosW;
  const b0 = b1 / 2;
  const a0 = 1 + alpha;
  const y = new Float64Array(x.length);
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const value =
      (b0 * x[i] + b1 * x1 + b0 * x2 + 2 * cosW * y1 - (1 - alpha) * y2) / a0;
    x2 = x1;
    x1 = x[i];
    y2 = y1;
    y1 = value;
    y[i] = value;
  }
  return y;
}

/** Halve the sample rate with an anti-alias lowpass first. */
function downsampleHalf(x: Float64Array, sr: number): Float64Array {
  const filtered = lowpass(lowpass(x, sr * 0.22, sr), sr * 0.22, sr);
  const out = new Float64Array(Math.floor(x.length / 2));
  for (let i = 0; i < out.length; i++) out[i] = filtered[i * 2];
  return out;
}

function writeWav(name: string, sig: Float64Array, sr: number): void {
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
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sr, 24);
  header.writeUInt32LE(sr * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  writeFileSync(join(OUT_DIR, name), Buffer.concat([header, pcm]));
}

function log(message: string): void {
  // biome-ignore lint/suspicious/noConsole: CLI progress output
  console.log(message);
}

// --- main --------------------------------------------------------------------

ensureSoundfont();

const win = trimTail(
  renderMidi("win", composeWin(), { gain: 0.9, reverb: true }),
  0.25,
  44100,
);
fadeEdges(win, 44100);
normalize(win, 0.9);
writeWav("win.wav", win, 44100);
log(`win.wav   ${(win.length / 44100).toFixed(2)}s`);

const lose = trimTail(
  renderMidi("lose", composeLose(), { gain: 0.9, reverb: true }),
  0.2,
  44100,
);
fadeEdges(lose, 44100);
normalize(lose, 0.8);
writeWav("lose.wav", lose, 44100);
log(`lose.wav  ${(lose.length / 44100).toFixed(2)}s`);

// BGM: cut to the exact 16-bar boundary so the wav loops seamlessly, then
// halve the sample rate to keep the committed asset small.
const bgmFull = renderMidi("bgm", composeBgm(), { gain: 0.7, reverb: false });
const loopSamples = Math.round(BGM_SECONDS * 44100);
const bgmCut = new Float64Array(loopSamples);
bgmCut.set(bgmFull.subarray(0, Math.min(loopSamples, bgmFull.length)));
const bgm = downsampleHalf(bgmCut, 44100);
normalize(bgm, 0.85);
fadeEdges(bgm, 22050, 0.002, 0.005);
writeWav("bgm.wav", bgm, 22050);
log(`bgm.wav   ${(bgm.length / 22050).toFixed(2)}s loop @22.05kHz`);
