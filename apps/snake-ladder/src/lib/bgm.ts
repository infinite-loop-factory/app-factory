import { type AudioPlayer, createAudioPlayer } from "expo-audio";

// bgm.wav is a seamless 16-bar loop (see scripts/generate-music.mts); keep it
// quiet under the foley layer.
const BGM_VOLUME = 0.32;

let player: AudioPlayer | null = null;

export function startBgm(enabled: boolean): void {
  if (!enabled) {
    stopBgm();
    return;
  }
  try {
    if (!player) {
      player = createAudioPlayer(require("@/assets/sounds/bgm.wav"));
      player.loop = true;
      player.volume = BGM_VOLUME;
    }
    player.play();
  } catch {
    // Web/simulator may fail to load native audio — ignore
  }
}

export function stopBgm(): void {
  try {
    player?.pause();
  } catch {
    // ignore
  }
}
