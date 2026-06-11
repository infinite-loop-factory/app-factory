#!/usr/bin/env python3
"""Deterministic procedural SFX synthesis for the craft wood-and-felt theme.

Regenerate all game sounds (44.1 kHz mono 16-bit wav) into src/assets/sounds:

    python3 scripts/generate-sfx.py

Every sound uses a fixed per-sound seed, so output is byte-identical between
runs. Design constraints baked in:
  - hop/ladder/snake are replayed every 90-190 ms during movement, so they are
    short ticks/chirps that read as rhythm when restarted.
  - roll is the shake+throw only; the per-bounce clacks come from the GL dice
    via dice_impact (impact.wav), so the two never double-hit.
"""

from pathlib import Path

import numpy as np
import wave

SR = 44100
OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "sounds"
TWO_PI = 2 * np.pi


def t_axis(duration: float) -> np.ndarray:
    return np.arange(int(SR * duration)) / SR


def fft_shape(x: np.ndarray, gain_fn) -> np.ndarray:
    spec = np.fft.rfft(x)
    freqs = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(spec * gain_fn(freqs), n=len(x))


def lowpass(x: np.ndarray, fc: float, order: int = 2) -> np.ndarray:
    return fft_shape(x, lambda f: 1 / (1 + (f / fc) ** (2 * order)) ** 0.5)


def highpass(x: np.ndarray, fc: float, order: int = 2) -> np.ndarray:
    return fft_shape(
        x,
        lambda f: ((f / fc) ** order / (1 + (f / fc) ** (2 * order)) ** 0.5),
    )


def place(sig: np.ndarray, start_s: float, event: np.ndarray, amp: float = 1.0) -> None:
    start = int(start_s * SR)
    if start >= len(sig):
        return
    length = min(len(event), len(sig) - start)
    sig[start : start + length] += amp * event[:length]


def attack_ramp(length: int, ramp_s: float = 0.0006) -> np.ndarray:
    ramp = np.ones(length)
    k = max(1, int(ramp_s * SR))
    ramp[:k] = np.linspace(0, 1, k)
    return ramp


def glide_sine(f_curve: np.ndarray, harmonic: float = 1.0, phase: float = 0.0) -> np.ndarray:
    return np.sin(TWO_PI * np.cumsum(f_curve * harmonic) / SR + phase)


def fade_edges(sig: np.ndarray, fade_in_s: float = 0.003, fade_out_s: float = 0.02) -> np.ndarray:
    fi = max(1, int(fade_in_s * SR))
    fo = max(1, int(fade_out_s * SR))
    sig[:fi] *= np.linspace(0, 1, fi)
    sig[-fo:] *= np.linspace(1, 0, fo)
    return sig


def normalize(sig: np.ndarray, peak: float) -> np.ndarray:
    m = np.max(np.abs(sig))
    return sig / m * peak if m > 0 else sig


def write_wav(name: str, sig: np.ndarray, peak: float) -> float:
    sig = normalize(fade_edges(sig), peak)
    pcm = np.int16(np.clip(sig, -1, 1) * 32767)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / name
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())
    return len(sig) / SR


# --- instruments -----------------------------------------------------------


def wood_clack(
    rng: np.random.Generator,
    duration: float = 0.16,
    modes=((310, 0.45, 1.20), (540, 0.55, 0.95), (870, 0.38, 0.75), (1320, 0.25, 0.55), (2250, 0.14, 0.35)),
    body_decay: float = 0.045,
    brightness: float = 1.0,
    thud_hz: float = 155.0,
    thud_amp: float = 0.22,
    thud_decay: float = 0.032,
) -> np.ndarray:
    """Dry boxy wooden hit: sharp noise attack + short body modes + felt thud."""
    length = int(duration * SR)
    t = np.arange(length) / SR

    attack_len = min(length, int(0.006 * SR))
    attack = np.zeros(length)
    raw = highpass(rng.normal(0, 1, attack_len), 1400)
    attack[:attack_len] = raw * np.exp(-np.arange(attack_len) / SR / 0.0022)

    body = np.zeros(length)
    for f, gain, decay_scale in modes:
        f = f * rng.uniform(0.96, 1.04)
        gain = gain * (brightness if f > 1000 else 1.0)
        body += gain * np.sin(TWO_PI * f * t + rng.uniform(0, TWO_PI)) * np.exp(
            -t / (body_decay * decay_scale)
        )

    thud = thud_amp * np.sin(TWO_PI * thud_hz * t + rng.uniform(0, TWO_PI)) * np.exp(-t / thud_decay)
    return (0.28 * brightness * attack + body + thud) * attack_ramp(length)


def bar_note(
    rng: np.random.Generator,
    freq: float,
    duration: float,
    partials,
    strike_amp: float = 0.18,
) -> np.ndarray:
    """Tuned mallet bar (marimba/glockenspiel flavored by partial set)."""
    t = t_axis(duration)
    out = np.zeros_like(t)
    for ratio, gain, decay in partials:
        out += gain * np.sin(TWO_PI * freq * ratio * t + rng.uniform(0, TWO_PI)) * np.exp(-t / decay)
    strike_len = min(len(t), int(0.006 * SR))
    strike = lowpass(rng.normal(0, 1, strike_len), 3200)
    out[:strike_len] += strike_amp * strike * np.exp(-np.arange(strike_len) / SR / 0.002)
    return out * attack_ramp(len(t))


def marimba(rng: np.random.Generator, freq: float, decay: float = 0.30) -> np.ndarray:
    partials = ((1.0, 1.0, decay), (3.98, 0.32, decay * 0.45), (9.95, 0.10, decay * 0.22))
    return bar_note(rng, freq, decay * 3.2, partials)


def glockenspiel(rng: np.random.Generator, freq: float, decay: float = 0.55) -> np.ndarray:
    partials = ((1.0, 1.0, decay), (2.76, 0.22, decay * 0.5), (5.40, 0.08, decay * 0.3))
    return bar_note(rng, freq, decay * 2.6, partials, strike_amp=0.10)


def swept_bandpass_noise(
    rng: np.random.Generator, duration: float, f_curve: np.ndarray, q: float = 2.2
) -> np.ndarray:
    """State-variable bandpass over white noise with a time-varying center."""
    n = int(duration * SR)
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    low = band = 0.0
    q_inv = 1.0 / q
    for i in range(n):
        g = 2 * np.sin(np.pi * min(f_curve[i], SR * 0.45) / SR)
        low += g * band
        high = x[i] - low - q_inv * band
        band += g * high
        out[i] = band
    return out


# --- sounds ----------------------------------------------------------------


def make_select() -> np.ndarray:
    rng = np.random.default_rng(11)
    sig = np.zeros(int(0.12 * SR))
    tick = wood_clack(
        rng,
        duration=0.09,
        modes=((900, 0.30, 0.9), (1500, 0.55, 0.7), (2400, 0.40, 0.5), (3600, 0.18, 0.35)),
        body_decay=0.016,
        brightness=0.9,
        thud_hz=420,
        thud_amp=0.10,
        thud_decay=0.012,
    )
    place(sig, 0.0, tick)
    return sig


def make_hop() -> np.ndarray:
    rng = np.random.default_rng(22)
    sig = np.zeros(int(0.17 * SR))
    tap = wood_clack(
        rng,
        duration=0.14,
        modes=((620, 0.55, 1.0), (980, 0.45, 0.8), (1750, 0.25, 0.55), (2600, 0.10, 0.4)),
        body_decay=0.026,
        brightness=0.8,
        thud_hz=210,
        thud_amp=0.18,
        thud_decay=0.020,
    )
    place(sig, 0.0, tap)
    return sig


def make_impact() -> np.ndarray:
    rng = np.random.default_rng(33)
    sig = np.zeros(int(0.30 * SR))
    main = wood_clack(
        rng,
        duration=0.20,
        modes=((280, 0.55, 1.25), (470, 0.60, 1.0), (780, 0.40, 0.75), (1200, 0.24, 0.55), (2100, 0.12, 0.35)),
        body_decay=0.050,
        brightness=0.9,
        thud_hz=140,
        thud_amp=0.34,
        thud_decay=0.040,
    )
    place(sig, 0.0, main)
    micro = wood_clack(
        rng,
        duration=0.10,
        modes=((520, 0.5, 0.8), (940, 0.4, 0.6), (1700, 0.2, 0.4)),
        body_decay=0.020,
        brightness=0.7,
        thud_hz=180,
        thud_amp=0.10,
        thud_decay=0.014,
    )
    place(sig, 0.085, micro, amp=0.22)
    return sig


def make_roll() -> np.ndarray:
    """Hand-shake rattle + throw whoosh; bounces are handled by impact.wav."""
    rng = np.random.default_rng(44)
    sig = np.zeros(int(0.60 * SR))

    def muted_clack() -> np.ndarray:
        return wood_clack(
            rng,
            duration=0.09,
            modes=((340, 0.5, 0.9), (560, 0.5, 0.7), (920, 0.3, 0.5), (1500, 0.12, 0.35)),
            body_decay=0.022,
            brightness=0.55,
            thud_hz=170,
            thud_amp=0.16,
            thud_decay=0.018,
        )

    for ts, amp in ((0.030, 0.62), (0.105, 0.50), (0.185, 0.70)):
        place(sig, ts, muted_clack(), amp=amp)

    whoosh_dur = 0.34
    f_curve = np.linspace(500, 1500, int(whoosh_dur * SR)) ** 1.0
    whoosh = swept_bandpass_noise(rng, whoosh_dur, f_curve, q=1.4)
    whoosh *= np.sin(np.linspace(0, np.pi, len(whoosh))) ** 1.6
    place(sig, 0.235, whoosh, amp=0.26)
    return sig


def make_ladder() -> np.ndarray:
    """Short two-note xylophone up-chirp; restarted per step it reads as climbing."""
    rng = np.random.default_rng(55)
    sig = np.zeros(int(0.30 * SR))
    partials = ((1.0, 1.0, 0.10), (3.0, 0.28, 0.05), (6.3, 0.10, 0.03))
    place(sig, 0.0, bar_note(rng, 740, 0.22, partials), amp=0.8)
    place(sig, 0.07, bar_note(rng, 988, 0.22, partials), amp=1.0)
    return sig


def make_snake() -> np.ndarray:
    """Short descending slide-whistle chirp with a soft hiss bed."""
    rng = np.random.default_rng(66)
    dur = 0.28
    sig = np.zeros(int(dur * SR))

    glide_dur = 0.20
    n = int(glide_dur * SR)
    f_curve = np.geomspace(720, 430, n)
    tone = glide_sine(f_curve) + 0.30 * glide_sine(f_curve, harmonic=2.0)
    tone *= np.exp(-np.arange(n) / SR / 0.085)
    place(sig, 0.0, tone, amp=0.85)

    hiss = highpass(rng.normal(0, 1, int(0.24 * SR)), 3800)
    hiss *= np.exp(-np.arange(len(hiss)) / SR / 0.075)
    place(sig, 0.0, hiss, amp=0.055)
    return sig


def make_collapse() -> np.ndarray:
    """Quantum shimmer: sparkle grains condensing into one soft bell."""
    rng = np.random.default_rng(77)
    dur = 0.95
    sig = np.zeros(int(dur * SR))

    for _ in range(30):
        start = rng.uniform(0.0, 0.42)
        f = rng.uniform(1800, 5200)
        decay = rng.uniform(0.05, 0.16)
        glen = int(min(decay * 4, dur - start) * SR)
        t = np.arange(glen) / SR
        grain = np.sin(TWO_PI * f * t + rng.uniform(0, TWO_PI)) * np.exp(-t / decay)
        density = 0.35 + 1.3 * start
        place(sig, start, grain * attack_ramp(glen, 0.002), amp=0.045 * density)

    bell_partials = ((1.0, 1.0, 0.38), (2.0, 0.30, 0.22), (3.01, 0.14, 0.15))
    place(sig, 0.45, bar_note(rng, 880, 0.48, bell_partials, strike_amp=0.06), amp=0.85)

    t = t_axis(0.5)
    swell = np.sin(TWO_PI * 220 * t) * np.sin(np.linspace(0, np.pi, len(t))) ** 2
    place(sig, 0.40, swell, amp=0.10)
    return sig


def make_tunnel() -> np.ndarray:
    """Airy portal whoosh, center bends down then up."""
    rng = np.random.default_rng(88)
    dur = 0.72
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    f_curve = 900 - 520 * np.sin(np.pi * x) + 500 * x
    body = swept_bandpass_noise(rng, dur, f_curve, q=2.0)
    body *= np.sin(np.pi * x) ** 1.2

    sub_curve = np.geomspace(180, 95, n)
    sub = glide_sine(sub_curve) * np.sin(np.pi * x) ** 2
    return body * 1.0 + sub * 0.16


def make_win() -> np.ndarray:
    """Marimba arpeggio into a bright glockenspiel chord with sparkle echoes."""
    rng = np.random.default_rng(99)
    sig = np.zeros(int(2.20 * SR))

    arpeggio = ((523.25, 0.00), (659.25, 0.09), (783.99, 0.18), (1046.5, 0.27))
    for f, ts in arpeggio:
        place(sig, ts, marimba(rng, f, decay=0.26), amp=0.75)

    chord_marimba = (523.25, 783.99)
    chord_glock = (1046.5, 1318.5, 1568.0)
    for f in chord_marimba:
        place(sig, 0.42, marimba(rng, f, decay=0.55), amp=0.55)
    for f in chord_glock:
        place(sig, 0.42, glockenspiel(rng, f, decay=0.70), amp=0.45)

    for f, ts, amp in ((2093.0, 0.62, 0.16), (2637.0, 0.80, 0.12), (3136.0, 1.00, 0.09)):
        place(sig, ts, glockenspiel(rng, f, decay=0.45), amp=amp)
    return sig


def make_lose() -> np.ndarray:
    """Comedic wah-wah-womp: four descending soft-brass notes, last one droops."""
    rng = np.random.default_rng(110)
    sig = np.zeros(int(1.50 * SR))

    def womp(freq: float, duration: float, droop: float = 0.0) -> np.ndarray:
        n = int(duration * SR)
        t = np.arange(n) / SR
        f_curve = freq * (2.0 ** (np.linspace(0, droop, n) / 12.0))
        cutoff = 320 + 900 * np.exp(-t / 0.07)
        out = np.zeros(n)
        for h in range(1, 11):
            gain = (1.0 / h) / (1 + (h * freq / cutoff) ** 4)
            out += gain * glide_sine(f_curve, harmonic=float(h), phase=rng.uniform(0, TWO_PI))
        env = np.minimum(t / 0.018, 1.0) * np.exp(-t / (duration * 0.55))
        return out * env

    notes = ((196.0, 0.00, 0.26, 0.0), (185.0, 0.26, 0.26, 0.0), (174.6, 0.52, 0.26, 0.0))
    for f, ts, d, droop in notes:
        place(sig, ts, womp(f, d, droop), amp=0.75)
    place(sig, 0.78, womp(164.8, 0.62, droop=-3.0), amp=0.85)

    tap = wood_clack(
        rng,
        duration=0.10,
        modes=((480, 0.5, 0.9), (860, 0.35, 0.6), (1500, 0.15, 0.4)),
        body_decay=0.020,
        brightness=0.6,
        thud_hz=190,
        thud_amp=0.15,
        thud_decay=0.016,
    )
    place(sig, 1.36, tap, amp=0.35)
    return sig


SOUNDS = {
    "select.wav": (make_select, 0.50),
    "hop.wav": (make_hop, 0.60),
    "impact.wav": (make_impact, 0.88),
    "roll.wav": (make_roll, 0.80),
    "ladder.wav": (make_ladder, 0.70),
    "snake.wav": (make_snake, 0.70),
    "collapse.wav": (make_collapse, 0.72),
    "tunnel.wav": (make_tunnel, 0.62),
    "win.wav": (make_win, 0.90),
    "lose.wav": (make_lose, 0.75),
}


def main() -> None:
    for name, (builder, peak) in SOUNDS.items():
        duration = write_wav(name, builder(), peak)
        print(f"{name:14s} {duration:5.2f}s  peak {peak:.2f}")


if __name__ == "__main__":
    main()
