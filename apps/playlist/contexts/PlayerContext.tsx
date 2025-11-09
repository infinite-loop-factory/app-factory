import type { ImageSourcePropType } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio, type AVPlaybackSource } from "expo-av";
import { createContext, useContext, useEffect, useState } from "react";

interface RecentlyPlayedItem {
  artist: string;
  track: string;
  file: AVPlaybackSource;
  image?: ImageSourcePropType;
}

interface PlayerContextType {
  currentTrack: string | null;
  artist: string | null;
  image: ImageSourcePropType | null;
  isPlaying: boolean;
  playTrack: (
    artist: string,
    track: string,
    file: AVPlaybackSource,
    image?: ImageSourcePropType,
  ) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  recentlyPlayed: RecentlyPlayedItem[];
}

const STORAGE_KEY = "recentlyPlayedTracks";

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [artist, setArtist] = useState<string | null>(null);
  const [image, setImage] = useState<ImageSourcePropType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>(
    [],
  );

  // ✅ 앱 시작 시 AsyncStorage에서 최근 재생 목록 불러오기
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecentlyPlayed(JSON.parse(saved));
      }
    })();
  }, []);

  const playTrack = async (
    artistName: string,
    trackName: string,
    file: AVPlaybackSource,
    img?: ImageSourcePropType,
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
      setImage(img ?? null);

      await newSound.playAsync();
      setIsPlaying(true);

      // ✅ 최근 재생 목록 업데이트 + 저장
      setRecentlyPlayed((prev) => {
        const updated = [
          { artist: artistName, track: trackName, file, image: img },
          ...prev.filter((t) => t.track !== trackName),
        ].slice(0, 10);

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        return updated;
      });
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
      value={{
        currentTrack,
        artist,
        image,
        isPlaying,
        playTrack,
        togglePlayPause,
        recentlyPlayed,
      }}
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
