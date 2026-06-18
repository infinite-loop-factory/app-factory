import { useMemoizedFn } from "ahooks";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  generateDailyPlacements,
  getDailySeed,
  getDailyTheme,
} from "@/game/lib/daily";
import { resolvePresetSeed } from "@/game/lib/game-screen-helpers";
import { normalizeRoomCode, seedFromCode } from "@/game/lib/room";
import { recordDailyCompletion, recordDailyStart } from "@/lib/daily-progress";

type UsePresetModeArgs = {
  startPresetGame: (
    placements: ReturnType<typeof generateDailyPlacements>,
  ) => void;
  /** True once the current game has finished — drives daily completion. */
  gameOver: boolean;
  /** Screen-owned per-board resets (journey, gold dice, ...). */
  onBoardStart: () => void;
};

/**
 * Shared-seed modes (daily challenge, room codes): URL params, board seeding,
 * round/attempt/streak bookkeeping. Same board for everyone, fair dice only.
 */
export function usePresetMode({
  startPresetGame,
  gameOver,
  onBoardStart,
}: UsePresetModeArgs) {
  const { mode, code } = useLocalSearchParams<{
    mode?: string;
    code?: string;
  }>();
  const isDaily = mode === "daily";
  const roomCode =
    mode === "room" && typeof code === "string" && code.length > 0
      ? normalizeRoomCode(code)
      : null;
  const isRoom = roomCode !== null;
  const isPreset = isDaily || isRoom;

  const [dailyAttempts, setDailyAttempts] = useState(1);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [roomRound, setRoomRound] = useState(1);
  const dailyRecordedRef = useRef(false);

  const startPreset = useMemoizedFn(() => {
    onBoardStart();
    dailyRecordedRef.current = false;
    const now = new Date();
    const seed = isRoom ? seedFromCode(roomCode) : getDailySeed(now);
    const orbs = isRoom ? 5 : getDailyTheme(now).orbsPerPlayer;
    startPresetGame(generateDailyPlacements(seed, orbs));
    if (!isRoom) {
      void recordDailyStart(seed).then((progress) => {
        setDailyAttempts(progress.attempts);
      });
    }
  });

  useEffect(() => {
    if (isPreset) startPreset();
  }, [isPreset]);

  useEffect(() => {
    if (!(isDaily && gameOver) || dailyRecordedRef.current) return;
    dailyRecordedRef.current = true;
    const now = new Date();
    void recordDailyCompletion(getDailySeed(now), now).then((progress) => {
      setDailyStreak(progress.streak);
    });
  }, [isDaily, gameOver]);

  const bumpRoomRound = useMemoizedFn(() => {
    setRoomRound((round) => round + 1);
  });

  const presetSeed = resolvePresetSeed({ isDaily, roomCode }, new Date());

  return {
    isDaily,
    isRoom,
    isPreset,
    roomCode,
    roomRound,
    presetSeed,
    dailyAttempts,
    dailyStreak,
    startPreset,
    bumpRoomRound,
  };
}
