import type { GameFeedbackEvent } from "@/lib/game-feedback";

import { useMemoizedFn } from "ahooks";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
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
import { GameHeader } from "@/components/game-header";
import { GameHudRow } from "@/components/game-hud-row";
import { GameMessagePlank } from "@/components/game-message-plank";
import { GameSettingsSheet } from "@/components/game-settings-sheet";
import { GoldDiceControls } from "@/components/gold-dice-controls";
import { QasmLogPanel } from "@/components/qasm-log-panel";
import { QubitInspector } from "@/components/qubit-inspector";
import { QubitSetupBar } from "@/components/qubit-setup-bar";
import { ResultCard } from "@/components/result-card";
import { TurnBanner } from "@/components/turn-banner";
import { WoodPanel } from "@/components/ui/wood-panel";
import { VictoryOverlay } from "@/components/victory-overlay";
import { startBgm, stopBgm } from "@/lib/bgm";

const FELT_TEXTURE = require("@/assets/images/textures/felt-table.jpg");
const _WOOD_TEXTURE = require("@/assets/images/textures/wood-planks.jpg");

// react-native-web sizes ImageBackground's inner image to its intrinsic
// 1024px without an explicit 100% — wide viewports showed a bare strip.
const TEXTURE_FILL = { width: "100%", height: "100%" } as const;

import { useCpuOpponent } from "@/game/hooks/use-cpu-opponent";
import { useGameController } from "@/game/hooks/use-game-controller";
import { useGameResultRecorder } from "@/game/hooks/use-game-result-recorder";
import { useGoldRoll } from "@/game/hooks/use-gold-roll";
import { useJourney } from "@/game/hooks/use-journey";
import { usePresetMode } from "@/game/hooks/use-preset-mode";
import { useSlideFx } from "@/game/hooks/use-slide-fx";
import {
  canConfirmPassNow,
  canRollNow,
  getActiveTurnPlayer,
  isGameInProgress,
  isSetbackMessage,
  resolveDiceVariant,
  resolveHeaderTitle,
  resolveShareHeader,
  resolveStatusMessage,
} from "@/game/lib/game-screen-helpers";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useMonetization } from "@/hooks/use-monetization";
import i18n from "@/i18n";
import { dispatchGameFeedback } from "@/lib/feedback";
import { showInterstitialAd } from "@/lib/monetization/interstitial-ads";
import { resolveDisplayName } from "@/lib/settings";
import { buildResultShareMessage } from "@/lib/share";

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
  const [inspectedCell, setInspectedCell] = useState<number | null>(null);
  const [soundSheetOpen, setSoundSheetOpen] = useState(false);
  const inspectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    rollCountRef,
    journeyRef,
    trackFeedback,
    trackSlide,
    trackRoll,
    resetJourney,
  } = useJourney();

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
    trackFeedback(event);
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

  const {
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
  } = usePresetMode({
    startPresetGame,
    gameOver: state.gameOver,
    onBoardStart: () => {
      resetJourney();
      disableGoldDice();
    },
  });

  const {
    goldDiceEnabled,
    goldDesiredFace,
    setGoldDesiredFace,
    pendingForcedRoll,
    throwCharge,
    goldActive,
    rollDice,
    prepareCpuRoll,
    toggleGoldDice,
    disableGoldDice,
  } = useGoldRoll({
    isPreset,
    goldDiceCount: monetization.goldDiceCount,
    consumeGoldDice,
    handleRoll,
    onRollStart: trackRoll,
  });

  useEffect(() => {
    if (slideFx.tick === 0 || slideFx.kind === null) return;
    trackSlide(slideFx.kind);
  }, [slideFx, trackSlide]);

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
    disableGoldDice();
    resetJourney();
    if (isPreset) {
      if (isRoom) bumpRoomRound();
      startPreset();
      return;
    }
    reset();
  });

  const startNewGame = useMemoizedFn(() => {
    void beginNewGame();
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
    onBeforeRoll: prepareCpuRoll,
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
        <GameHeader
          onOpenSettings={() => setSoundSheetOpen(true)}
          onRestart={() => confirmNewGame(startNewGame)}
          palette={palette}
          title={resolveHeaderTitle(
            { isDaily, roomCode, roomRound },
            new Date(),
          )}
        />

        <GameHudRow
          activePlayer={getActiveTurnPlayer(state)}
          opponentName={opponentName}
          palette={palette}
          playerName={playerName}
          positions={state.positions}
        />

        {/* no horizontal padding: board width is governed by getBoardCellSize */}
        <View className="items-center pb-3">
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
                slideFx={slideFx}
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

        <GameMessagePlank message={msg} palette={palette} seed={presetSeed} />

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
            onToggle={toggleGoldDice}
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
      <GameSettingsSheet
        hapticsEnabled={settings.hapticsEnabled}
        musicEnabled={settings.musicEnabled}
        onClose={() => setSoundSheetOpen(false)}
        onUpdate={updateSettings}
        palette={palette}
        soundEnabled={settings.soundEnabled}
        visible={soundSheetOpen}
      />
    </SafeAreaView>
  );
}
