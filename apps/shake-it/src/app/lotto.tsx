import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Accelerometer } from "expo-sensors";
import { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Share, Text, View } from "react-native";
import { LottoDrawingMachine } from "@/components/lotto-drawing-machine";
import { APP_CONFIG } from "@/constants/config";
import {
  formatLottoGames,
  formatLottoNumber,
  generateLottoGames,
  getDisplayNumbers,
  LOTTO_DISCLAIMER,
  LOTTO_GAME_COUNTS,
  LOTTO_PICK_COUNT,
  type LottoDisplayMode,
  type LottoGame,
  type LottoGameCount,
} from "@/utils/lotto";

const C = {
  primary: "#3d6bf5",
  surface: "#F7F8FA",
  border: "#E5E8EB",
  textMain: "#191F28",
  textSub: "#6B7684",
  white: "#FFFFFF",
};

const DRAW_START_DELAY_MS = 520;
const DRAW_STEP_MS = 430;
const ACTION_MESSAGE_DURATION_MS = 2600;
const RESULT_MODAL_DELAY_MS = 420;

type DrawState = "idle" | "drawing" | "result";
type WebNavigatorWithShare = {
  share?: (data: { title?: string; text?: string }) => Promise<void>;
};

const DISPLAY_MODE_OPTIONS: {
  label: string;
  value: LottoDisplayMode;
}[] = [
  { label: "추첨순", value: "drawOrder" },
  { label: "오름차순", value: "sorted" },
];

function isNativeRuntime() {
  return process.env.EXPO_OS !== "web";
}

function getWebNavigator() {
  if (isNativeRuntime()) {
    return null;
  }

  return (
    (globalThis as { navigator?: WebNavigatorWithShare }).navigator ?? null
  );
}

function canUseSystemShare() {
  if (isNativeRuntime()) {
    return true;
  }

  return typeof getWebNavigator()?.share === "function";
}

async function shareLottoResults(message: string) {
  if (isNativeRuntime()) {
    await Share.share({ message });
    return;
  }

  const webNavigator = getWebNavigator();

  if (typeof webNavigator?.share !== "function") {
    throw new Error("System share is not supported.");
  }

  await webNavigator.share({
    text: message,
    title: "로또 추천 번호",
  });
}

function LottoResultRow({
  displayMode,
  game,
  index,
}: {
  displayMode: LottoDisplayMode;
  game: LottoGame;
  index: number;
}) {
  const displayNumbers = getDisplayNumbers(game.numbers, displayMode);

  return (
    <View
      accessibilityLabel={`${index + 1}게임, 번호 ${displayNumbers.join(", ")}`}
      className="gap-3 rounded-lg border p-4"
      style={{ backgroundColor: C.white, borderColor: C.border }}
    >
      <Text
        className="font-extrabold text-base"
        style={{ color: C.textMain, lineHeight: 22 }}
      >
        {index + 1}게임
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {displayNumbers.map((number) => (
          <View
            className="h-10 w-10 items-center justify-center rounded-full border"
            key={`${game.id}-${number}`}
            style={{
              backgroundColor: C.surface,
              borderColor: C.border,
              borderCurve: "continuous",
            }}
          >
            <Text
              className="font-extrabold text-sm"
              selectable
              style={{ color: C.textMain, fontVariant: ["tabular-nums"] }}
            >
              {formatLottoNumber(number)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function LottoResultsModal({
  actionMessage,
  canShareResults,
  displayMode,
  games,
  onClose,
  onDisplayModeChange,
  onShare,
  visible,
}: {
  actionMessage: string | null;
  canShareResults: boolean;
  displayMode: LottoDisplayMode;
  games: LottoGame[];
  onClose: () => void;
  onDisplayModeChange: (displayMode: LottoDisplayMode) => void;
  onShare: () => void;
  visible: boolean;
}) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-end bg-black/45 px-4 pb-6">
        <Pressable
          accessibilityLabel="결과 닫기"
          className="absolute inset-0"
          onPress={onClose}
        />

        <View
          accessibilityLabel="로또 추천 결과"
          className="max-h-[82%] rounded-[28px] bg-white px-5 pt-5 pb-4"
        >
          <View className="mb-4 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text
                className="font-extrabold text-[22px]"
                style={{ color: C.textMain, lineHeight: 30 }}
              >
                추천 번호
              </Text>
              <Text
                className="mt-1 font-medium text-sm"
                style={{ color: C.textSub, lineHeight: 20 }}
              >
                {games.length}게임 결과를 확인해보세요.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="추천 결과 닫기"
              className="h-9 w-9 items-center justify-center rounded-full"
              onPress={onClose}
              style={{ backgroundColor: C.surface }}
            >
              <MaterialIcons color={C.textSub} name="close" size={20} />
            </Pressable>
          </View>

          <View className="mb-3 flex-row rounded-lg border p-1">
            {DISPLAY_MODE_OPTIONS.map((option) => {
              const isSelected = displayMode === option.value;

              return (
                <Pressable
                  accessibilityLabel={`${option.label} 보기`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className="h-11 flex-1 items-center justify-center rounded-md"
                  key={option.value}
                  onPress={() => {
                    onDisplayModeChange(option.value);
                  }}
                  style={{
                    backgroundColor: isSelected ? C.textMain : "transparent",
                    borderCurve: "continuous",
                  }}
                >
                  <Text
                    className="font-extrabold text-sm"
                    style={{ color: isSelected ? C.white : C.textSub }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView
            className="max-h-[360px]"
            contentContainerStyle={{ gap: 12, paddingBottom: 4 }}
            showsVerticalScrollIndicator={false}
          >
            {games.map((game, index) => (
              <LottoResultRow
                displayMode={displayMode}
                game={game}
                index={index}
                key={game.id}
              />
            ))}
          </ScrollView>

          <Text
            className="mt-4 text-center font-semibold text-sm"
            selectable
            style={{ color: C.textSub, lineHeight: 21 }}
          >
            {LOTTO_DISCLAIMER}
          </Text>

          {actionMessage ? (
            <Text
              accessibilityLiveRegion="polite"
              className="mt-3 text-center font-semibold text-sm"
              style={{ color: C.textSub, lineHeight: 21 }}
            >
              {actionMessage}
            </Text>
          ) : null}

          <View className="mt-4 flex-row gap-3">
            {canShareResults ? (
              <Pressable
                accessibilityLabel="추천 번호 공유"
                accessibilityRole="button"
                className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-lg"
                onPress={onShare}
                style={{
                  backgroundColor: C.primary,
                  borderCurve: "continuous",
                }}
              >
                <MaterialIcons color={C.white} name="ios-share" size={20} />
                <Text className="font-extrabold text-sm text-white">공유</Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityLabel="추천 결과 닫기"
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-lg border"
              onPress={onClose}
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
                borderCurve: "continuous",
              }}
            >
              <Text
                className="font-extrabold text-sm"
                style={{ color: C.textSub }}
              >
                닫기
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function LottoGameCountSettingRow({
  disabled,
  selectedGameCount,
  onPress,
}: {
  disabled: boolean;
  selectedGameCount: LottoGameCount;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`게임 수 선택, 현재 ${selectedGameCount}게임`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className="h-12 flex-row items-center justify-between rounded-lg border px-4"
      disabled={disabled}
      onPress={onPress}
      style={{
        backgroundColor: C.white,
        borderColor: C.border,
        borderCurve: "continuous",
        opacity: disabled ? 0.58 : 1,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: C.surface }}
        >
          <MaterialIcons
            color={C.primary}
            name="confirmation-number"
            size={18}
          />
        </View>
        <Text
          className="font-extrabold text-base"
          style={{ color: C.textMain }}
        >
          게임 수
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Text
          className="font-extrabold text-base"
          style={{ color: disabled ? C.textSub : C.primary }}
        >
          {selectedGameCount}게임
        </Text>
        <MaterialIcons color={C.textSub} name="keyboard-arrow-down" size={22} />
      </View>
    </Pressable>
  );
}

function LottoGameCountPickerModal({
  selectedGameCount,
  visible,
  onClose,
  onSelect,
}: {
  selectedGameCount: LottoGameCount;
  visible: boolean;
  onClose: () => void;
  onSelect: (gameCount: LottoGameCount) => void;
}) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-end bg-black/45 px-4 pb-6">
        <Pressable
          accessibilityLabel="게임 수 선택 닫기"
          className="absolute inset-0"
          onPress={onClose}
        />

        <View className="rounded-[28px] bg-white px-5 pt-5 pb-4">
          <View className="mb-4 flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text
                className="font-extrabold text-[22px]"
                style={{ color: C.textMain, lineHeight: 30 }}
              >
                게임 수
              </Text>
              <Text
                className="mt-1 font-medium text-sm"
                style={{ color: C.textSub, lineHeight: 20 }}
              >
                이번 추첨에서 생성할 번호 묶음을 선택하세요.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="게임 수 선택 닫기"
              className="h-9 w-9 items-center justify-center rounded-full"
              onPress={onClose}
              style={{ backgroundColor: C.surface }}
            >
              <MaterialIcons color={C.textSub} name="close" size={20} />
            </Pressable>
          </View>

          <View className="gap-3">
            {LOTTO_GAME_COUNTS.map((gameCount) => {
              const isSelected = selectedGameCount === gameCount;

              return (
                <Pressable
                  accessibilityLabel={`${gameCount}게임 선택`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className="h-14 flex-row items-center justify-between rounded-lg border px-4"
                  key={gameCount}
                  onPress={() => {
                    onSelect(gameCount);
                  }}
                  style={{
                    backgroundColor: isSelected ? "#EFF4FF" : C.white,
                    borderColor: isSelected ? C.primary : C.border,
                    borderCurve: "continuous",
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons
                      color={isSelected ? C.primary : C.textSub}
                      name="confirmation-number"
                      size={20}
                    />
                    <Text
                      className="font-extrabold text-base"
                      style={{ color: isSelected ? C.primary : C.textMain }}
                    >
                      {gameCount}게임
                    </Text>
                  </View>
                  {isSelected ? (
                    <MaterialIcons
                      color={C.primary}
                      name="check-circle"
                      size={22}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function LottoScreen() {
  const [drawState, setDrawState] = useState<DrawState>("idle");
  const [selectedGameCount, setSelectedGameCount] = useState<LottoGameCount>(1);
  const [displayMode, setDisplayMode] = useState<LottoDisplayMode>("drawOrder");
  const [games, setGames] = useState<LottoGame[]>([]);
  const [visibleNumbers, setVisibleNumbers] = useState<number[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isGameCountPickerVisible, setGameCountPickerVisible] = useState(false);
  const [isResultModalVisible, setResultModalVisible] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const actionMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const resultModalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isDrawingRef = useRef(false);

  const clearDrawingTimers = useCallback(() => {
    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });
    timersRef.current = [];
  }, []);

  const clearActionMessageTimer = useCallback(() => {
    if (actionMessageTimerRef.current) {
      clearTimeout(actionMessageTimerRef.current);
      actionMessageTimerRef.current = null;
    }
  }, []);

  const clearResultModalTimer = useCallback(() => {
    if (resultModalTimerRef.current) {
      clearTimeout(resultModalTimerRef.current);
      resultModalTimerRef.current = null;
    }
  }, []);

  const scheduleResultModal = useCallback(() => {
    clearResultModalTimer();
    resultModalTimerRef.current = setTimeout(() => {
      setResultModalVisible(true);
      resultModalTimerRef.current = null;
    }, RESULT_MODAL_DELAY_MS);
  }, [clearResultModalTimer]);

  const showActionMessage = useCallback(
    (message: string) => {
      clearActionMessageTimer();
      setActionMessage(message);
      actionMessageTimerRef.current = setTimeout(() => {
        setActionMessage(null);
        actionMessageTimerRef.current = null;
      }, ACTION_MESSAGE_DURATION_MS);
    },
    [clearActionMessageTimer],
  );

  const playHaptic = useCallback((isComplete: boolean) => {
    if (!isNativeRuntime()) {
      return;
    }

    const feedback = isComplete
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : Haptics.selectionAsync();

    void feedback.catch(() => {
      // Haptics are a bonus signal; drawing must continue if unavailable.
    });
  }, []);

  const startDraw = useCallback(() => {
    if (isDrawingRef.current) {
      return;
    }

    const nextGames = generateLottoGames(selectedGameCount);
    const firstGame = nextGames[0];

    if (!firstGame) {
      return;
    }

    isDrawingRef.current = true;
    clearDrawingTimers();
    clearResultModalTimer();
    setActionMessage(null);
    setGames(nextGames);
    setGameCountPickerVisible(false);
    setResultModalVisible(false);
    setVisibleNumbers([]);
    setDrawState("drawing");

    firstGame.numbers.forEach((number, index) => {
      const timer = setTimeout(
        () => {
          setVisibleNumbers((currentNumbers) => [...currentNumbers, number]);
          playHaptic(index === LOTTO_PICK_COUNT - 1);

          if (index === LOTTO_PICK_COUNT - 1) {
            isDrawingRef.current = false;
            setDrawState("result");
            scheduleResultModal();
          }
        },
        DRAW_START_DELAY_MS + DRAW_STEP_MS * index,
      );

      timersRef.current.push(timer);
    });
  }, [
    clearDrawingTimers,
    clearResultModalTimer,
    playHaptic,
    scheduleResultModal,
    selectedGameCount,
  ]);

  const handleShare = useCallback(async () => {
    if (isDrawingRef.current || games.length === 0 || !canUseSystemShare()) {
      return;
    }

    try {
      await shareLottoResults(formatLottoGames(games, displayMode));
      showActionMessage("공유 창을 열었어요.");
    } catch {
      showActionMessage("공유를 열 수 없어요. 다시 시도해주세요.");
    }
  }, [displayMode, games, showActionMessage]);

  useEffect(() => {
    return () => {
      isDrawingRef.current = false;
      clearDrawingTimers();
      clearActionMessageTimer();
      clearResultModalTimer();
    };
  }, [clearActionMessageTimer, clearDrawingTimers, clearResultModalTimer]);

  useEffect(() => {
    if (!isNativeRuntime()) {
      return;
    }

    let lastShakeTime = 0;
    Accelerometer.setUpdateInterval(APP_CONFIG.SHAKE_DETECTION_INTERVAL);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (
        acceleration > APP_CONFIG.DEFAULT_SHAKE_THRESHOLD &&
        now - lastShakeTime > APP_CONFIG.SHAKE_COOLDOWN
      ) {
        lastShakeTime = now;
        startDraw();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [startDraw]);

  const isDrawing = drawState === "drawing";
  let buttonLabel = "번호 뽑기";
  if (drawState === "drawing") {
    buttonLabel = "추첨 중...";
  }
  if (drawState === "result") {
    buttonLabel = "다시 뽑기";
  }
  const hasResults = drawState === "result" && games.length > 0;
  const canShareResults = hasResults && !isDrawing && canUseSystemShare();

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        gap: 28,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-2">
        <Text
          className="font-extrabold text-2xl"
          style={{ color: C.textMain, lineHeight: 34 }}
        >
          행운의 번호를 뽑아보세요
        </Text>
        <Text className="font-medium text-base" style={{ color: C.textSub }}>
          1게임부터 5게임까지 한 번에 추천받을 수 있어요.
        </Text>
      </View>

      <LottoGameCountSettingRow
        disabled={isDrawing}
        onPress={() => {
          setGameCountPickerVisible(true);
        }}
        selectedGameCount={selectedGameCount}
      />

      <LottoDrawingMachine isDrawing={isDrawing} numbers={visibleNumbers} />

      <View className="gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isDrawing }}
          className="h-14 flex-row items-center justify-center gap-2 rounded-lg"
          disabled={isDrawing}
          onPress={startDraw}
          style={{
            backgroundColor: isDrawing ? C.border : C.primary,
            borderCurve: "continuous",
            opacity: isDrawing ? 0.75 : 1,
          }}
        >
          <MaterialIcons
            color={C.white}
            name={isDrawing ? "hourglass-top" : "casino"}
            size={22}
          />
          <Text className="font-extrabold text-base text-white">
            {buttonLabel}
          </Text>
        </Pressable>

        <View
          className="rounded-lg border p-4"
          style={{ backgroundColor: C.surface, borderColor: C.border }}
        >
          <Text
            className="text-center font-semibold text-sm"
            style={{ color: C.textSub, lineHeight: 21 }}
          >
            {isNativeRuntime()
              ? "기기를 흔들어도 추첨이 시작돼요."
              : "웹에서는 버튼으로 추첨을 시작할 수 있어요."}
          </Text>
        </View>

        {drawState === "result" ? (
          <Text
            className="text-center font-semibold text-sm"
            selectable
            style={{ color: C.textSub, lineHeight: 21 }}
          >
            {LOTTO_DISCLAIMER}
          </Text>
        ) : null}
      </View>

      {hasResults ? (
        <Pressable
          accessibilityLabel="추천 결과 다시 보기"
          accessibilityRole="button"
          className="h-12 flex-row items-center justify-center gap-2 rounded-lg border"
          onPress={() => {
            setResultModalVisible(true);
          }}
          style={{
            backgroundColor: C.white,
            borderColor: C.border,
            borderCurve: "continuous",
          }}
        >
          <MaterialIcons
            color={C.primary}
            name="confirmation-number"
            size={20}
          />
          <Text className="font-extrabold text-sm" style={{ color: C.primary }}>
            결과 다시 보기
          </Text>
        </Pressable>
      ) : null}

      <LottoResultsModal
        actionMessage={actionMessage}
        canShareResults={canShareResults}
        displayMode={displayMode}
        games={games}
        onClose={() => {
          setResultModalVisible(false);
        }}
        onDisplayModeChange={setDisplayMode}
        onShare={handleShare}
        visible={hasResults && isResultModalVisible}
      />

      <LottoGameCountPickerModal
        onClose={() => {
          setGameCountPickerVisible(false);
        }}
        onSelect={(gameCount) => {
          setSelectedGameCount(gameCount);
          setGameCountPickerVisible(false);
        }}
        selectedGameCount={selectedGameCount}
        visible={isGameCountPickerVisible && !isDrawing}
      />
    </ScrollView>
  );
}
