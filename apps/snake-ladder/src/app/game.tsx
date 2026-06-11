import type { GameFeedbackEvent } from "@/lib/game-feedback";

import { MaterialIcons } from "@expo/vector-icons";
import { useMemoizedFn } from "ahooks";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BoardFx } from "@/components/board-fx";
import { ConfettiBurstGl } from "@/components/confetti-burst-gl";
import { DiceGlPrewarm } from "@/components/dice/dice-gl-prewarm";
import { DiceRollOverlay } from "@/components/dice-roll-overlay";
import { GameBoard, getBoardCellSize } from "@/components/game-board";
import { GameDock } from "@/components/game-dock";
import { GoldDiceControls } from "@/components/gold-dice-controls";
import { PlayerBadge } from "@/components/player-badge";
import { QasmLogPanel } from "@/components/qasm-log-panel";
import { QubitInspector } from "@/components/qubit-inspector";
import { QubitSetupBar } from "@/components/qubit-setup-bar";
import { ResultCard } from "@/components/result-card";
import { TurnBanner } from "@/components/turn-banner";
import { WoodPanel } from "@/components/ui/wood-panel";
import { VictoryOverlay } from "@/components/victory-overlay";
import { GAME_FONT } from "@/game/constants/theme";
import { startBgm, stopBgm } from "@/lib/bgm";

const FELT_TEXTURE = require("@/assets/images/textures/felt-table.jpg");
const _WOOD_TEXTURE = require("@/assets/images/textures/wood-planks.jpg");

// react-native-web sizes ImageBackground's inner image to its intrinsic
// 1024px without an explicit 100% — wide viewports showed a bare strip.
const TEXTURE_FILL = { width: "100%", height: "100%" } as const;

import { useCpuOpponent } from "@/game/hooks/use-cpu-opponent";
import { useGameController } from "@/game/hooks/use-game-controller";
import { useGameResultRecorder } from "@/game/hooks/use-game-result-recorder";
import { useSlideFx } from "@/game/hooks/use-slide-fx";
import {
  generateDailyPlacements,
  getDailySeed,
  getDailyTheme,
} from "@/game/lib/daily";
import {
  canConfirmPassNow,
  canRollNow,
  getActiveTurnPlayer,
  isGameInProgress,
  isSetbackMessage,
  resolveDiceVariant,
  resolveHeaderTitle,
  resolvePresetSeed,
  resolveShareHeader,
  resolveStatusMessage,
} from "@/game/lib/game-screen-helpers";
import { normalizeRoomCode, seedFromCode } from "@/game/lib/room";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useMonetization } from "@/hooks/use-monetization";
import i18n from "@/i18n";
import { recordDailyCompletion, recordDailyStart } from "@/lib/daily-progress";
import { dispatchGameFeedback } from "@/lib/feedback";
import { rollGoldDie } from "@/lib/monetization/gold-dice";
import { showInterstitialAd } from "@/lib/monetization/interstitial-ads";
import { resolveDisplayName } from "@/lib/settings";
import {
  buildResultShareMessage,
  EMPTY_JOURNEY,
  type JourneyCounts,
} from "@/lib/share";

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: screen root composing many independent conditional sections; logic lives in extracted hooks/helpers
export default function GameScreen() {
  const { width } = useWindowDimensions();
  const cellSize = useMemo(() => getBoardCellSize(width), [width]);

  const { settings, timings, palette, recordGameResult, updateSettings } =
    useAppSettings();
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
  const [inspectedCell, setInspectedCell] = useState<number | null>(null);
  const inspectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  // Shared-seed modes: same board for everyone, fair dice only.
  const isPreset = isDaily || isRoom;
  const rollCountRef = useRef(0);
  const journeyRef = useRef<JourneyCounts>({ ...EMPTY_JOURNEY });
  const [dailyAttempts, setDailyAttempts] = useState(1);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [roomRound, setRoomRound] = useState(1);
  const dailyRecordedRef = useRef(false);

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

  useEffect(() => {
    startBgm(settings.musicEnabled);
    return stopBgm;
  }, [settings.musicEnabled]);

  const onFeedback = useMemoizedFn((event: GameFeedbackEvent) => {
    if (event.type === "tunnel") journeyRef.current.tunnels += 1;
    dispatchGameFeedback(event, {
      hapticsEnabled: settings.hapticsEnabled,
      soundEnabled: settings.soundEnabled,
    });
  });

  const {
    state,
    selectQubit,
    placeQubit,
    placeCpuQubit,
    confirmPass,
    handleRoll,
    reset,
    startPresetGame,
  } = useGameController({ timings, onFeedback });

  const msg = useMemo(
    () => resolveStatusMessage(state.message, opponentName),
    [opponentName, state.message],
  );

  const slideFx = useSlideFx(state);
  const { resetRecorded } = useGameResultRecorder(state, recordGameResult);

  const startPreset = useMemoizedFn(() => {
    rollCountRef.current = 0;
    journeyRef.current = { ...EMPTY_JOURNEY };
    dailyRecordedRef.current = false;
    setGoldDiceEnabled(false);
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
    if (!(isDaily && state.gameOver) || dailyRecordedRef.current) return;
    dailyRecordedRef.current = true;
    const now = new Date();
    void recordDailyCompletion(getDailySeed(now), now).then((progress) => {
      setDailyStreak(progress.streak);
    });
  }, [isDaily, state.gameOver]);

  useEffect(() => {
    if (slideFx.tick === 0 || slideFx.kind === null) return;
    if (slideFx.kind === "ladder") journeyRef.current.ladders += 1;
    else journeyRef.current.snakes += 1;
  }, [slideFx]);

  const onCellLongPress = useMemoizedFn((cell: number) => {
    setInspectedCell(cell);
    if (inspectTimerRef.current) clearTimeout(inspectTimerRef.current);
    inspectTimerRef.current = setTimeout(() => setInspectedCell(null), 5200);
  });

  useEffect(
    () => () => {
      if (inspectTimerRef.current) clearTimeout(inspectTimerRef.current);
    },
    [],
  );

  const onCellPress = useMemoizedFn((cell: number) => {
    if (state.phase !== "setup" || state.currentPlayer !== 0) return;
    if (state.selectedConfigIndex === null) return;
    placeQubit(cell);
    onFeedback({ type: "selection" });
  });

  const confirmNewGame = useMemoizedFn((onConfirm: () => void) => {
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
  });

  const beginNewGame = useMemoizedFn(async () => {
    notifyNewGameStarted();
    if (shouldShowInterstitial()) {
      const shown = await showInterstitialAd();
      if (shown) {
        notifyInterstitialShown();
      }
    }
    resetRecorded();
    setGoldDiceEnabled(false);
    rollCountRef.current = 0;
    journeyRef.current = { ...EMPTY_JOURNEY };
    if (isPreset) {
      if (isRoom) setRoomRound((r) => r + 1);
      startPreset();
      return;
    }
    reset();
  });

  const startNewGame = useMemoizedFn(() => {
    void beginNewGame();
  });

  // Gold dice are locked out of shared-seed modes — scores must be fair.
  const goldActive =
    !isPreset && goldDiceEnabled && monetization.goldDiceCount > 0;

  const presetSeed = resolvePresetSeed({ isDaily, roomCode }, new Date());

  const rollDice = useMemoizedFn((charge: number) => {
    rollCountRef.current += 1;
    setThrowCharge(charge);
    if (goldActive) {
      if (!consumeGoldDice(1)) return;
      const forced = rollGoldDie(goldDesiredFace);
      setPendingForcedRoll(forced);
      void handleRoll(forced);
      return;
    }
    setPendingForcedRoll(null);
    void handleRoll();
  });

  const shareResult = useMemoizedFn(() => {
    void Share.share({
      message: buildResultShareMessage({
        header: resolveShareHeader({ isDaily, roomCode }, new Date()),
        won: state.positions[0] >= 100,
        rolls: rollCountRef.current,
        attempts: isDaily ? dailyAttempts : 0,
        streak: isDaily ? dailyStreak : 0,
        journey: journeyRef.current,
      }),
    });
  });

  useCpuOpponent({
    state,
    timings,
    placeCpuQubit,
    confirmPass,
    handleRoll,
    onBeforeRoll: () => {
      setPendingForcedRoll(null);
      setThrowCharge(0.3 + Math.random() * 0.55);
    },
  });

  const canRoll = canRollNow(state);
  const canConfirmPass = canConfirmPassNow(state);

  // Don't upsell right after a setback — reviewers flagged it as a dark pattern.
  const setbackMoment = isSetbackMessage(state.message);

  const diceVariant = resolveDiceVariant(state.currentPlayer, goldActive);

  const showConfetti = state.gameOver && state.positions[0] >= 100;

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
        imageStyle={TEXTURE_FILL}
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
      <DiceGlPrewarm />
      <TurnBanner
        activePlayer={getActiveTurnPlayer(state)}
        opponentName={opponentName}
        palette={palette}
      />
      <View className="relative flex-1">
        <DiceRollOverlay
          charge={throwCharge}
          durationMs={timings.diceRollDurationMs}
          forcedValue={pendingForcedRoll}
          onImpact={(strength) => onFeedback({ type: "dice_impact", strength })}
          rolling={state.isRolling}
          value={state.dice}
          variant={diceVariant}
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
            {resolveHeaderTitle({ isDaily, roomCode, roomRound }, new Date())}
          </Text>
          <View className="flex-row items-center gap-2">
            <Pressable
              accessibilityLabel={i18n.t("game.musicToggle")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full"
              onPress={() =>
                updateSettings({ musicEnabled: !settings.musicEnabled })
              }
              style={{
                backgroundColor: palette.frameWood,
                borderWidth: 1.5,
                borderColor: palette.frameWoodEdge,
                opacity: settings.musicEnabled ? 1 : 0.55,
              }}
              testID="game-music-button"
            >
              <MaterialIcons
                color={palette.cream}
                name={settings.musicEnabled ? "music-note" : "music-off"}
                size={22}
              />
            </Pressable>
            <Pressable
              accessibilityLabel={i18n.t("game.soundToggle")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full"
              onPress={() =>
                updateSettings({ soundEnabled: !settings.soundEnabled })
              }
              style={{
                backgroundColor: palette.frameWood,
                borderWidth: 1.5,
                borderColor: palette.frameWoodEdge,
                opacity: settings.soundEnabled ? 1 : 0.55,
              }}
              testID="game-sound-button"
            >
              <MaterialIcons
                color={palette.cream}
                name={settings.soundEnabled ? "volume-up" : "volume-off"}
                size={22}
              />
            </Pressable>
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
          <BoardFx kind={slideFx.kind} palette={palette} tick={slideFx.tick}>
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
                onCellLongPress={onCellLongPress}
                onCellPress={onCellPress}
                palette={palette}
                selectable={
                  state.phase === "setup" &&
                  state.currentPlayer === 0 &&
                  state.selectedConfigIndex !== null
                }
                state={state}
              />
            </WoodPanel>
            <VictoryOverlay
              visible={state.phase === "gameover" && state.positions[0] >= 100}
            />
            <QubitInspector
              cell={inspectedCell}
              palette={palette}
              qubits={state.qubits}
            />
          </BoardFx>
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
          {presetSeed !== null ? (
            <Text
              style={{
                color: `${palette.creamMuted}cc`,
                fontSize: 10,
                textAlign: "center",
                marginTop: 3,
              }}
              testID="fairness-seed"
            >
              {i18n.t("fairness.seed", { seed: presetSeed })}
            </Text>
          ) : null}
        </WoodPanel>

        {state.phase === "gameover" ? (
          <ResultCard
            attempts={isDaily ? dailyAttempts : 0}
            journey={journeyRef.current}
            palette={palette}
            rolls={rollCountRef.current}
            streak={isDaily ? dailyStreak : 0}
            won={state.positions[0] >= 100}
          />
        ) : null}

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

        {isPreset ? null : (
          <GoldDiceControls
            canRoll={canRoll}
            desiredFace={goldDesiredFace}
            enabled={goldDiceEnabled}
            goldDiceCount={monetization.goldDiceCount}
            onSelectFace={setGoldDesiredFace}
            onToggle={() => setGoldDiceEnabled((v) => !v)}
            palette={palette}
            suppressCta={setbackMoment}
          />
        )}

        <QasmLogPanel logs={state.logs} palette={palette} />

        {/* bottom control dock */}
        <GameDock
          canConfirmPass={canConfirmPass}
          canRoll={canRoll}
          diceValue={state.dice}
          gameOver={state.phase === "gameover"}
          goldActive={goldActive}
          onConfirmPass={confirmPass}
          onPlayAgain={() => confirmNewGame(startNewGame)}
          onRoll={rollDice}
          onShare={shareResult}
          palette={palette}
          rolling={state.isRolling}
        />
      </View>
      <ConfettiBurstGl active={showConfetti} colors={confettiColors} />
    </SafeAreaView>
  );
}
