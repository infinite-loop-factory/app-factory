import type { CraftPalette } from "@/game/constants/palettes";
import type { GameState } from "@/game/types";
import type { GameFeedbackEvent } from "@/lib/game-feedback";

import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
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
        className="mx-4 mb-3 rounded-2xl border px-4 py-3"
        style={{ backgroundColor: palette.card, borderColor: palette.border }}
      >
        <Text
          style={{
            color: palette.orbGlow,
            fontWeight: "700",
            textAlign: "center",
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

function TurnStatusRow({
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
    <View className="flex-row items-center gap-2">
      <View
        style={{
          padding: 2,
          borderRadius: 999,
          borderWidth: 1.5,
          borderColor: isActive ? color : "transparent",
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: color,
          }}
        />
      </View>
      <Text
        style={{
          color: isActive ? palette.text : palette.textMuted,
          fontSize: 12,
          fontWeight: isActive ? "700" : "400",
        }}
      >
        {name} · {position}
      </Text>
    </View>
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
      style={{ backgroundColor: palette.background }}
    >
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
              style={{ backgroundColor: palette.card }}
            >
              <MaterialIcons color={palette.text} name="arrow-back" size={22} />
            </Pressable>
          </Link>
          <Text
            className="font-extrabold text-lg"
            style={{ color: palette.text }}
          >
            {i18n.t("game.title")}
          </Text>
          <Pressable
            accessibilityLabel={i18n.t("game.restart")}
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full"
            onPress={() => confirmNewGame(startNewGame)}
            style={{ backgroundColor: palette.card }}
          >
            <MaterialIcons color={palette.text} name="refresh" size={22} />
          </Pressable>
        </View>

        <View className="items-center px-4 pb-3">
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
        </View>

        <View
          className="mx-4 mb-3 rounded-2xl border px-4 py-3"
          style={{ backgroundColor: palette.card, borderColor: palette.border }}
        >
          <Text style={{ color: palette.text, fontWeight: "600" }}>{msg}</Text>
          <View className="mt-2 flex-row items-center gap-3">
            {(
              [
                { player: 0, name: playerName, color: palette.playerYou },
                { player: 1, name: opponentName, color: palette.playerCpu },
              ] as const
            ).map(({ player, name, color }) => (
              <TurnStatusRow
                color={color}
                isActive={getActiveTurnPlayer(state) === player}
                key={`turn-${player}`}
                name={name}
                palette={palette}
                position={state.positions[player]}
              />
            ))}
          </View>
        </View>

        {state.phase === "setup" && state.currentPlayer === 0 ? (
          <View className="px-4 pb-2">
            <Text
              className="mb-2 font-bold text-sm"
              style={{ color: palette.textMuted }}
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

        <View className="flex-row items-center justify-center gap-6 px-4 pb-4">
          {state.isRolling ? (
            <View style={{ width: 72, height: 72 }} />
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
            <Pressable
              accessibilityRole="button"
              className="rounded-2xl px-6 py-4"
              onPress={confirmPass}
              style={{ backgroundColor: palette.ladder }}
              testID="setup-pass-turn"
            >
              <Text
                className="font-extrabold text-base"
                style={{ color: "#fff" }}
              >
                {i18n.t("setup.passTurn")}
              </Text>
            </Pressable>
          ) : null}
          {state.phase === "gameover" ? (
            <Pressable
              accessibilityRole="button"
              className="rounded-2xl px-6 py-4"
              onPress={() => confirmNewGame(startNewGame)}
              style={{ backgroundColor: palette.walnut }}
            >
              <Text
                className="font-extrabold text-base"
                style={{ color: "#fff" }}
              >
                {i18n.t("game.playAgain")}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <QasmLogPanel logs={state.logs} palette={palette} />
      </View>
    </SafeAreaView>
  );
}
