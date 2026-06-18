import type { CraftPalette } from "@/game/constants/palettes";

import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { GAME_FONT } from "@/game/constants/theme";
import i18n from "@/i18n";

const HOLD_MS = 850;
const OUT_MS = 220;

type TurnBannerProps = {
  /** Player whose turn just started, or null outside the play phase. */
  activePlayer: 0 | 1 | null;
  opponentName: string;
  palette: CraftPalette;
};

/** Pops a "Your turn!" pill over the board whenever the turn changes. */
export function TurnBanner({
  activePlayer,
  opponentName,
  palette,
}: TurnBannerProps) {
  const [shown, setShown] = useState<{ player: 0 | 1; key: number } | null>(
    null,
  );
  const prevPlayerRef = useRef<0 | 1 | null>(null);
  const progress = useSharedValue(0);

  useEffect(() => {
    const prev = prevPlayerRef.current;
    prevPlayerRef.current = activePlayer;
    if (activePlayer === null || activePlayer === prev) return;

    setShown((s) => ({ player: activePlayer, key: (s?.key ?? 0) + 1 }));
    progress.set(0);
    progress.set(
      withSequence(
        withTiming(1, {
          duration: 240,
          easing: Easing.out(Easing.back(1.8)),
        }),
        withDelay(
          HOLD_MS,
          withTiming(0, { duration: OUT_MS, easing: Easing.in(Easing.quad) }),
        ),
      ),
    );
    const timer = setTimeout(() => setShown(null), 240 + HOLD_MS + OUT_MS + 40);
    return () => clearTimeout(timer);
  }, [activePlayer, progress]);

  const style = useAnimatedStyle(() => {
    const t = progress.get();
    return {
      opacity: t,
      transform: [{ translateY: (1 - t) * -14 }, { scale: 0.85 + t * 0.15 }],
    };
  });

  if (!shown) return null;

  const isYou = shown.player === 0;
  const label = isYou
    ? i18n.t("turn.yours")
    : i18n.t("turn.opponent", { name: opponentName });

  return (
    <Animated.View
      key={`turn-${shown.key}`}
      pointerEvents="none"
      style={[
        styles.banner,
        {
          backgroundColor: isYou ? palette.playerYou : palette.playerCpu,
          shadowColor: "#000",
        },
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: "30%",
    alignSelf: "center",
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 999,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 30,
  },
  label: {
    color: "#fff",
    fontSize: 24,
    fontFamily: GAME_FONT,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});
