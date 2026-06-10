import type { CraftPalette } from "@/game/constants/palettes";
import type { GameState } from "@/game/types";
import type { GameFeedbackEvent } from "@/lib/game-feedback";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfettiBurst } from "@/components/confetti-burst";
import { DiceGlPrewarm } from "@/components/dice/dice-gl-prewarm";
import { DiceDisplay } from "@/components/dice-display";
import { DiceRollOverlay } from "@/components/dice-roll-overlay";
import { GameBoard, getBoardCellSize } from "@/components/game-board";
import { GoldDicePanel } from "@/components/gold-dice-panel";
import { QasmLogPanel } from "@/components/qasm-log-panel";
import { QubitSetupBar } from "@/components/qubit-setup-bar";
import { RollButton } from "@/components/roll-button";
import { TurnBanner } from "@/components/turn-banner";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT } from "@/game/constants/theme";
import { darkenColor } from "@/lib/color";

const FELT_TEXTURE = require("@/assets/images/textures/felt-table.jpg");
const WOOD_TEXTURE = require("@/assets/images/textures/wood-planks.jpg");

import { useGameController } from "@/game/hooks/use-game-controller";
import { pickCpuPlacementCell } from "@/game/lib/game-helpers";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useMonetization } from "@/hooks/use-monetization";
import i18n from "@/i18n";
import { dispatchGameFeedback } from "@/lib/feedback";
import { rollGoldDie } from "@/lib/monetization/gold-dice";
import { showInterstitialAd } from "@/lib/monetization/interstitial-ads";
import { isNativeStorePlatform } from "@/lib/monetization/platform";
import { resolveDisplayName } from "@/lib/settings";

function getActiveTurnPlayer(state: GameState): 0 | 1 | null {
  if (state.phase !== "play" || state.gameOver) return null;
  return state.currentPlayer;
}

function isGameInProgress(state: GameState): boolean {
  return (
    state.phase !== "gameover" &&
    (state.phase !== "setup" ||
      state.qubits.length > 0 ||
      state.positions[0] > 1 ||
      state.positions[1] > 1)
  );
}

function GoldDiceControls({
  canRoll,
  goldDiceCount,
  desiredFace,
  enabled,
  onSelectFace,
  onToggle,
  palette,
}: {
  canRoll: boolean;
  goldDiceCount: number;
  desiredFace: number;
  enabled: boolean;
  onSelectFace: (face: number) => void;
  onToggle: () => void;
  palette: CraftPalette;
}) {
  if (!canRoll) return null;

  if (goldDiceCount > 0) {
    return (
      <GoldDicePanel
        balance={goldDiceCount}
        desiredFace={desiredFace}
        enabled={enabled}
        onSelectFace={onSelectFace}
        onToggle={onToggle}
        palette={palette}
      />
    );
  }

  if (!isNativeStorePlatform()) return null;

  return (
    <Link asChild href="/shop">
      <Pressable
        accessibilityLabel={i18n.t("game.shopCta")}
        accessibilityRole="button"
        className="mx-4 mb-3"
        style={{
          backgroundColor: palette.frameWood,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: 1.5,
          borderColor: palette.orbGlow,
          borderBottomWidth: 4,
          borderBottomColor: palette.frameWoodEdge,
        }}
      >
        <Text
          style={{
            color: palette.orbGlow,
            fontWeight: "900",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          {i18n.t("game.shopCta")}
        </Text>
      </Pressable>
    </Link>
  );
}

function resolveStatusMessage(message: string, opponentName: string): string {
  if (!(message.startsWith("setup.") || message.startsWith("play."))) {
    return message;
  }
  if (
    message === "setup.opponentTurn" ||
    message === "play.opponentRoll" ||
    message === "play.opponentWin"
  ) {
    return i18n.t(message, { name: opponentName });
  }
  return i18n.t(message);
}

function PlayerBadge({
  name,
  color,
  position,
  isActive,
  palette,
}: {
  name: string;
  color: string;
  position: number;
  isActive: boolean;
  palette: CraftPalette;
}) {
  return (
    <WoodPanel
      contentStyle={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 7,
      }}
      edge={4}
      palette={palette}
      radius={14}
      style={{
        borderWidth: 2,
        borderColor: isActive ? color : "transparent",
        opacity: isActive ? 1 : 0.8,
        elevation: isActive ? 5 : 2,
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: palette.cream,
        }}
      />
      <View>
        <Text
          numberOfLines={1}
          style={{
            color: palette.creamMuted,
            fontSize: 11,
            fontFamily: GAME_FONT,
            maxWidth: 96,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            color: palette.cream,
            fontSize: 21,
            fontFamily: GAME_FONT,
            lineHeight: 24,
          }}
        >
          {position}
        </Text>
      </View>
    </WoodPanel>
  );
}

export default function GameScreen() {
  const { width } = useWindowDimensions();
  const cellSize = useMemo(() => getBoardCellSize(width), [width]);
  const cpuBusyRef = useRef(false);
  const recordedGameRef = useRef(false);

  const { settings, timings, palette, recordGameResult } = useAppSettings();
  const {
    monetization,
    consumeGoldDice,
    notifyNewGameStarted,
    notifyInterstitialShown,
    shouldShowInterstitial,
  } = useMonetization();
  const [goldDiceEnabled, setGoldDiceEnabled] = useState(false);
  const [goldDesiredFace, setGoldDesiredFace] = useState(6);
  const [pendingForcedRoll, setPendingForcedRoll] = useState<number | null>(
    null,
  );
  const [throwCharge, setThrowCharge] = useState(0.5);

  const playerName = useMemo(
    () =>
      resolveDisplayName(settings.playerNickname, i18n.t("player.defaultName")),
    [settings.playerNickname],
  );

  const opponentName = useMemo(
    () =>
      resolveDisplayName(
        settings.opponentNickname,
        i18n.t("opponent.defaultName"),
      ),
    [settings.opponentNickname],
  );

  const onFeedback = useCallback(
    (event: GameFeedbackEvent) => {
      dispatchGameFeedback(event, {
        hapticsEnabled: settings.hapticsEnabled,
        soundEnabled: settings.soundEnabled,
      });
    },
    [settings.hapticsEnabled, settings.soundEnabled],
  );

  const {
    state,
    selectQubit,
    placeQubit,
    placeCpuQubit,
    confirmPass,
    handleRoll,
    reset,
  } = useGameController({ timings, onFeedback });

  const msg = useMemo(
    () => resolveStatusMessage(state.message, opponentName),
    [opponentName, state.message],
  );

  const onCellPress = useCallback(
    (cell: number) => {
      if (state.phase !== "setup" || state.currentPlayer !== 0) return;
      if (state.selectedConfigIndex === null) return;
      placeQubit(cell);
      onFeedback({ type: "selection" });
    },
    [
      onFeedback,
      placeQubit,
      state.currentPlayer,
      state.phase,
      state.selectedConfigIndex,
    ],
  );

  const confirmNewGame = useCallback(
    (onConfirm: () => void) => {
      if (!isGameInProgress(state)) {
        onConfirm();
        return;
      }

      Alert.alert(i18n.t("game.newGameTitle"), i18n.t("game.newGameMessage"), [
        { text: i18n.t("game.newGameCancel"), style: "cancel" },
        {
          text: i18n.t("game.newGameConfirm"),
          style: "destructive",
          onPress: onConfirm,
        },
      ]);
    },
    [state],
  );

  const beginNewGame = useCallback(async () => {
    notifyNewGameStarted();
    if (shouldShowInterstitial()) {
      const shown = await showInterstitialAd();
      if (shown) {
        notifyInterstitialShown();
      }
    }
    recordedGameRef.current = false;
    setGoldDiceEnabled(false);
    reset();
  }, [
    notifyInterstitialShown,
    notifyNewGameStarted,
    reset,
    shouldShowInterstitial,
  ]);

  const startNewGame = useCallback(() => {
    void beginNewGame();
  }, [beginNewGame]);

  const rollDice = useCallback(
    (charge: number) => {
      setThrowCharge(charge);
      if (goldDiceEnabled && monetization.goldDiceCount > 0) {
        if (!consumeGoldDice(1)) return;
        const forced = rollGoldDie(goldDesiredFace);
        setPendingForcedRoll(forced);
        void handleRoll(forced);
        return;
      }
      setPendingForcedRoll(null);
      void handleRoll();
    },
    [
      consumeGoldDice,
      goldDesiredFace,
      goldDiceEnabled,
      handleRoll,
      monetization.goldDiceCount,
    ],
  );

  useEffect(() => {
    if (state.phase !== "setup" || state.currentPlayer !== 1) return;
    if (cpuBusyRef.current) return;

    const remaining = state.setupRemaining[1];
    if (remaining.length === 0) return;

    cpuBusyRef.current = true;
    const timer = setTimeout(() => {
      const cell = pickCpuPlacementCell(state);
      const picked =
        remaining[Math.floor(Math.random() * remaining.length)] ?? remaining[0];
      const configIndex = picked;
      if (cell !== null && configIndex !== undefined) {
        placeCpuQubit(cell, configIndex);
      }
      cpuBusyRef.current = false;
    }, timings.cpuThinkMs);

    return () => {
      clearTimeout(timer);
      cpuBusyRef.current = false;
    };
  }, [placeCpuQubit, state, timings.cpuThinkMs]);

  useEffect(() => {
    if (state.phase !== "passing" || state.currentPlayer !== 1) return;
    const timer = setTimeout(() => confirmPass(), timings.cpuThinkMs);
    return () => clearTimeout(timer);
  }, [confirmPass, state.currentPlayer, state.phase, timings.cpuThinkMs]);

  useEffect(() => {
    if (state.phase !== "play" || state.currentPlayer !== 1) return;
    if (
      state.isRolling ||
      state.isMoving ||
      state.isCollapsing ||
      state.gameOver
    ) {
      return;
    }
    const timer = setTimeout(() => {
      setPendingForcedRoll(null);
      setThrowCharge(0.3 + Math.random() * 0.55);
      void handleRoll();
    }, timings.cpuThinkMs);
    return () => clearTimeout(timer);
  }, [
    handleRoll,
    state.currentPlayer,
    state.gameOver,
    state.isCollapsing,
    state.isMoving,
    state.isRolling,
    state.phase,
    timings.cpuThinkMs,
  ]);

  useEffect(() => {
    if (!state.gameOver) {
      recordedGameRef.current = false;
      return;
    }
    if (recordedGameRef.current) return;
    recordedGameRef.current = true;
    recordGameResult(state.positions[0] >= 100);
  }, [recordGameResult, state.gameOver, state.positions]);

  const canRoll =
    state.phase === "play" &&
    state.currentPlayer === 0 &&
    !state.isRolling &&
    !state.isMoving &&
    !state.isCollapsing &&
    !state.gameOver;

  const canConfirmPass = state.phase === "passing" && state.currentPlayer === 0;

  const showConfetti =
    state.gameOver && state.positions[0] >= 100 && !settings.reducedMotion;

  const confettiColors = [
    palette.orbGlow,
    palette.ladder,
    palette.playerYou,
    palette.interference,
  ];

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: palette.tableFeltDeep }}
    >
      <ImageBackground
        resizeMode="cover"
        source={FELT_TEXTURE}
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={[
            `${palette.tableFelt}59`,
            `${palette.tableFelt}26`,
            "rgba(0,0,0,0.5)",
          ]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      <ConfettiBurst
        active={showConfetti}
        colors={confettiColors}
        reducedMotion={settings.reducedMotion}
      />
      {settings.reducedMotion ? null : <DiceGlPrewarm />}
      <TurnBanner
        activePlayer={getActiveTurnPlayer(state)}
        opponentName={opponentName}
        palette={palette}
        reducedMotion={settings.reducedMotion}
      />
      <View className="relative flex-1">
        <DiceRollOverlay
          charge={throwCharge}
          durationMs={timings.diceRollDurationMs}
          forcedValue={pendingForcedRoll}
          gold={goldDiceEnabled && monetization.goldDiceCount > 0}
          onImpact={(strength) => onFeedback({ type: "dice_impact", strength })}
          palette={palette}
          reducedMotion={settings.reducedMotion}
          rolling={state.isRolling}
          value={state.dice}
        />
        <View className="flex-row items-center justify-between px-4 py-2">
          <Link asChild href="/">
            <Pressable
              accessibilityLabel={i18n.t("game.back")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: palette.frameWood,
                borderWidth: 1.5,
                borderColor: palette.frameWoodEdge,
              }}
            >
              <MaterialIcons
                color={palette.cream}
                name="arrow-back"
                size={22}
              />
            </Pressable>
          </Link>
          <Text
            style={{
              color: palette.cream,
              fontSize: 22,
              fontFamily: GAME_FONT,
              letterSpacing: 1,
              textShadowColor: "rgba(0,0,0,0.3)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 2,
            }}
          >
            {i18n.t("game.title")}
          </Text>
          <Pressable
            accessibilityLabel={i18n.t("game.restart")}
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full"
            onPress={() => confirmNewGame(startNewGame)}
            style={{
              backgroundColor: palette.frameWood,
              borderWidth: 1.5,
              borderColor: palette.frameWoodEdge,
            }}
          >
            <MaterialIcons color={palette.cream} name="refresh" size={22} />
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between px-4 pb-2">
          <PlayerBadge
            color={palette.playerYou}
            isActive={getActiveTurnPlayer(state) === 0}
            name={playerName}
            palette={palette}
            position={state.positions[0]}
          />
          <Text
            style={{
              color: palette.creamMuted,
              fontSize: 14,
              fontWeight: "900",
              letterSpacing: 2,
            }}
          >
            VS
          </Text>
          <PlayerBadge
            color={palette.playerCpu}
            isActive={getActiveTurnPlayer(state) === 1}
            name={opponentName}
            palette={palette}
            position={state.positions[1]}
          />
        </View>

        <View className="items-center px-4 pb-3">
          <WoodPanel
            contentStyle={{ padding: 8 }}
            edge={6}
            palette={palette}
            radius={22}
            style={{
              shadowOpacity: 0.45,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
          >
            <GameBoard
              cellSize={cellSize}
              onCellPress={onCellPress}
              palette={palette}
              reducedMotion={settings.reducedMotion}
              selectable={
                state.phase === "setup" &&
                state.currentPlayer === 0 &&
                state.selectedConfigIndex !== null
              }
              state={state}
            />
          </WoodPanel>
        </View>

        <WoodPanel
          contentStyle={{ paddingHorizontal: 16, paddingVertical: 9 }}
          edge={4}
          palette={palette}
          radius={12}
          style={{ marginHorizontal: 16, marginBottom: 10 }}
        >
          <Text
            style={{
              color: palette.cream,
              fontFamily: GAME_FONT,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {msg}
          </Text>
        </WoodPanel>

        {state.phase === "setup" && state.currentPlayer === 0 ? (
          <View className="px-4 pb-2">
            <Text
              className="mb-2 font-bold text-sm"
              style={{ color: palette.cream }}
            >
              {i18n.t("setup.pickQubit")}
            </Text>
            <QubitSetupBar
              disabled={state.currentPlayer !== 0}
              onSelect={selectQubit}
              palette={palette}
              remaining={state.setupRemaining[0]}
              selectedIndex={state.selectedConfigIndex}
            />
          </View>
        ) : null}

        <GoldDiceControls
          canRoll={canRoll}
          desiredFace={goldDesiredFace}
          enabled={goldDiceEnabled}
          goldDiceCount={monetization.goldDiceCount}
          onSelectFace={setGoldDesiredFace}
          onToggle={() => setGoldDiceEnabled((v) => !v)}
          palette={palette}
        />

        <QasmLogPanel logs={state.logs} palette={palette} />

        {/* bottom control dock */}
        <ImageBackground
          resizeMode="cover"
          source={WOOD_TEXTURE}
          style={{ marginTop: "auto" }}
        >
          <LinearGradient
            colors={[
              `${palette.frameWood}8c`,
              `${palette.frameWood}b3`,
              `${darkenColor(palette.frameWood, 0.7)}e6`,
            ]}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingTop: 10,
              paddingBottom: 14,
              borderTopWidth: 2,
              borderTopColor: "rgba(255,255,255,0.2)",
            }}
          >
            {state.isRolling ? (
              <View style={{ width: 72, height: 102 }} />
            ) : (
              <DiceDisplay
                gold={goldDiceEnabled && monetization.goldDiceCount > 0}
                palette={palette}
                reducedMotion={settings.reducedMotion}
                rolling={false}
                value={state.dice}
              />
            )}
            {canRoll ? (
              <RollButton
                accessibilityLabel={i18n.t("game.roll")}
                backgroundColor={palette.playerYou}
                label={i18n.t("game.roll")}
                onPress={rollDice}
                pulsing
                reducedMotion={settings.reducedMotion}
                testID="game-roll-button"
              />
            ) : null}
            {canConfirmPass ? (
              <RollButton
                accessibilityLabel={i18n.t("setup.passTurn")}
                backgroundColor={palette.ladder}
                label={i18n.t("setup.passTurn")}
                onPress={() => confirmPass()}
                pulsing
                reducedMotion={settings.reducedMotion}
                testID="setup-pass-turn"
              />
            ) : null}
            {state.phase === "gameover" ? (
              <RollButton
                accessibilityLabel={i18n.t("game.playAgain")}
                backgroundColor={palette.orbGlow}
                label={i18n.t("game.playAgain")}
                onPress={() => confirmNewGame(startNewGame)}
                pulsing
                reducedMotion={settings.reducedMotion}
              />
            ) : null}
          </LinearGradient>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}
