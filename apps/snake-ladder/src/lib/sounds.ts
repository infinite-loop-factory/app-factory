import type { GameFeedbackEvent } from "@/lib/game-feedback";

import { type AudioPlayer, createAudioPlayer } from "expo-audio";

type SoundKey = Exclude<
  GameFeedbackEvent["type"],
  "ladder_step" | "snake_step"
>;

const SOUND_SOURCES: Record<SoundKey, number> = {
  selection: require("@/assets/sounds/select.wav"),
  roll: require("@/assets/sounds/roll.wav"),
  // Dedicated die-landing clack, played at strength-scaled volume per bounce.
  dice_impact: require("@/assets/sounds/impact.wav"),
  hop: require("@/assets/sounds/hop.wav"),
  collapse: require("@/assets/sounds/collapse.wav"),
  tunnel: require("@/assets/sounds/tunnel.wav"),
  win: require("@/assets/sounds/win.wav"),
  lose: require("@/assets/sounds/lose.wav"),
};

const SLIDE_SOURCES = {
  ladder: require("@/assets/sounds/ladder.wav"),
  snake: require("@/assets/sounds/snake.wav"),
} as const;

const players = new Map<string, AudioPlayer>();

function getPlayer(key: string, source: number): AudioPlayer {
  const cached = players.get(key);
  if (cached) return cached;
  const player = createAudioPlayer(source);
  players.set(key, player);
  return player;
}

function replay(player: AudioPlayer): void {
  player.seekTo(0);
  player.play();
}

export function playGameSound(
  event: GameFeedbackEvent,
  enabled: boolean,
): void {
  if (!enabled) return;

  try {
    if (event.type === "ladder_step") {
      replay(getPlayer("ladder", SLIDE_SOURCES.ladder));
      return;
    }
    if (event.type === "snake_step") {
      replay(getPlayer("snake", SLIDE_SOURCES.snake));
      return;
    }
    if (event.type === "dice_impact") {
      const player = getPlayer("dice_impact", SOUND_SOURCES.dice_impact);
      player.volume = 0.4 + Math.min(1, Math.max(0, event.strength)) * 0.6;
      replay(player);
      return;
    }
    const source = SOUND_SOURCES[event.type];
    replay(getPlayer(event.type, source));
  } catch {
    // Web/simulator may fail to load native audio — ignore
  }
}
