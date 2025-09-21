import { Audio, type AVPlaybackSource } from "expo-av";
import { createContext, useContext, useState } from "react";

interface PlayerContextType {
  currentTrack: string | null;
  artist: string | null;
  isPlaying: boolean;
  playTrack: (
    artist: string,
    track: string,
    file: AVPlaybackSource,
  ) => Promise<void>;
  togglePlayPause: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [artist, setArtist] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = async (
    artistName: string,
    trackName: string,
    file: AVPlaybackSource,
  ) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(file);
      setSound(newSound);
      setCurrentTrack(trackName);
      setArtist(artistName);
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (e) {
      console.error("playTrack error", e);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <PlayerContext.Provider
      value={{ currentTrack, artist, isPlaying, playTrack, togglePlayPause }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider");
  return context;
}
