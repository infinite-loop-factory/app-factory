import type { GameFeedbackEvent } from "@/lib/game-feedback";

import { MaterialIcons } from "@expo/vector-icons";
import { useMemoizedFn } from "ahooks";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
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
import { BoardFx } from "@/components/board-fx";
import { ConfettiBurst } from "@/components/confetti-burst";
import { DiceGlPrewarm } from "@/components/dice/dice-gl-prewarm";
import { DiceDisplay } from "@/components/dice-display";
import { DiceRollOverlay } from "@/components/dice-roll-overlay";
import { GameBoard, getBoardCellSize } from "@/components/game-board";
import { GoldDiceControls } from "@/components/gold-dice-controls";
import { PlayerBadge } from "@/components/player-badge";
import { QasmLogPanel } from "@/components/qasm-log-panel";
import { QubitSetupBar } from "@/components/qubit-setup-bar";
import { RollButton } from "@/components/roll-button";
import { TurnBanner } from "@/components/turn-banner";
import { WoodPanel } from "@/components/ui/wood-panel";
import { VictoryOverlay } from "@/components/victory-overlay";
import { GAME_FONT } from "@/game/constants/theme";
import { darkenColor } from "@/lib/color";

const FELT_TEXTURE = require("@/assets/images/textures/felt-table.jpg");
const WOOD_TEXTURE = require("@/assets/images/textures/wood-planks.jpg");

import { useCpuOpponent } from "@/game/hooks/use-cpu-opponent";
import { useGameController } from "@/game/hooks/use-game-controller";
import { useGameResultRecorder } from "@/game/hooks/use-game-result-recorder";
import { useSlideFx } from "@/game/hooks/use-slide-fx";
import {
  canConfirmPassNow,
  canRollNow,
  getActiveTurnPlayer,
  isGameInProgress,
  resolveStatusMessage,
} from "@/game/lib/game-screen-helpers";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useMonetization } from "@/hooks/use-monetization";
import i18n from "@/i18n";
import { dispatchGameFeedback } from "@/lib/feedback";
import { rollGoldDie } from "@/lib/monetization/gold-dice";
import { showInterstitialAd } from "@/lib/monetization/interstitial-ads";
import { resolveDisplayName } from "@/lib/settings";

export default function GameScreen() {
  const { width } = useWindowDimensions();
  const cellSize = useMemo(() => getBoardCellSize(width), [width]);

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

  const onFeedback = useMemoizedFn((event: GameFeedbackEvent) => {
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
  } = useGameController({ timings, onFeedback });

  const msg = useMemo(
    () => resolveStatusMessage(state.message, opponentName),
    [opponentName, state.message],
  );

  const slideFx = useSlideFx(state);
  const { resetRecorded } = useGameResultRecorder(state, recordGameResult);

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
    reset();
  });

  const startNewGame = useMemoizedFn(() => {
    void beginNewGame();
  });

  const rollDice = useMemoizedFn((charge: number) => {
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

  const goldActive = goldDiceEnabled && monetization.goldDiceCount > 0;
  // The rolling die wears the roller's color: cpu red, player blue/gold.
  const diceVariant = (() => {
    if (state.currentPlayer === 1) return "cpu" as const;
    return goldActive ? ("gold" as const) : ("default" as const);
  })();

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
      <ConfettiBurst active={showConfetti} colors={confettiColors} />
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
                gold={goldActive}
                palette={palette}
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
              />
            ) : null}
          </LinearGradient>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}
