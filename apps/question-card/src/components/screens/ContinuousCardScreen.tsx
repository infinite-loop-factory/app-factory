/**
 * 연속 카드 화면
 * 질문 카드를 스와이프로 넘기며 진행
 * 모드 1, 2, 3에서 사용
 */

import type { Question } from "@/types";

import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, StatusBar } from "react-native";
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import { Box, Card, Pressable, Progress, Text } from "@/components/ui";
import { useAppActions, useAppState } from "@/context/AppContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function ContinuousCardScreen() {
  const router = useRouter();
  const { filteredQuestions, progress } = useAppState();
  const { goToNextQuestion, goToPreviousQuestion } = useAppActions();

  // 로컬 상태 (Context 상태 사용으로 대체 예정)
  const [_questions, setQuestions] = useState<Question[]>([]);
  const [_isCompleted, setIsCompleted] = useState(false);

  // Context에서 관리하는 현재 인덱스와 질문 사용
  const currentIndex = progress.currentIndex;
  const currentQuestion = progress.currentQuestion;

  // 애니메이션 상태
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // 컴포넌트 마운트시 질문 데이터 설정 (null 안전성 추가)
  useEffect(() => {
    const questionsArray = filteredQuestions.questions || [];
    if (questionsArray.length > 0) {
      setQuestions(questionsArray);
    }
  }, [filteredQuestions.questions]);

  // 카드 위치 리셋
  const resetCardPosition = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, translateY, rotate, scale]);

  // 완료 알림 표시
  const showCompletionAlert = useCallback(() => {
    Alert.alert(
      "질문 완료!",
      "모든 질문을 완료했습니다. 어떻게 하시겠습니까?",
      [
        {
          text: "처음부터 다시",
          onPress: () => {
            // 처음으로 리셋 (Context Actions 사용)
            // TODO: Context에서 resetProgress 함수 구현 필요
            setIsCompleted(false);
            resetCardPosition();
          },
        },
        {
          text: "메인으로",
          onPress: () => router.push("/"),
          style: "cancel",
        },
      ],
      { cancelable: false },
    );
  }, [router, resetCardPosition]);

  // 진행률 계산
  const progressPercentage =
    filteredQuestions.totalCount > 0
      ? (currentIndex + 1) / filteredQuestions.totalCount
      : 0;

  // 다음 질문으로 이동 (Context Actions 사용)
  const goToNext = useCallback(() => {
    if (progress.canGoForward) {
      goToNextQuestion();
      resetCardPosition();
    } else {
      setIsCompleted(true);
      showCompletionAlert();
    }
  }, [
    progress.canGoForward,
    goToNextQuestion,
    resetCardPosition,
    showCompletionAlert,
  ]);

  // 이전 질문으로 이동 (Context Actions 사용)
  const goToPrevious = useCallback(() => {
    if (progress.canGoBack) {
      goToPreviousQuestion();
      resetCardPosition();
    }
  }, [progress.canGoBack, goToPreviousQuestion, resetCardPosition]);

  // 제스처 핸들러
  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true },
  );

  // 스와이프 애니메이션 실행
  const animateSwipeExit = useCallback(
    (direction: "left" | "right", tx: number, onComplete: () => void) => {
      const targetX = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: targetX,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: tx > 0 ? 0.3 : -0.3,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(onComplete);
    },
    [translateX, rotate, scale],
  );

  // 제스처 상태 변화 핸들러
  const onHandlerStateChange = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      const { state, translationX: tx, velocityX } = event.nativeEvent;

      if (state !== State.END) {
        return;
      }

      const shouldSwipeRight = tx > SWIPE_THRESHOLD || velocityX > 500;
      const shouldSwipeLeft = tx < -SWIPE_THRESHOLD || velocityX < -500;

      if (shouldSwipeRight) {
        // 오른쪽 스와이프: 다음 질문
        animateSwipeExit("right", tx, goToNext);
      } else if (shouldSwipeLeft && currentIndex > 0) {
        // 왼쪽 스와이프: 이전 질문 (첫 번째 질문이 아닌 경우)
        animateSwipeExit("left", tx, goToPrevious);
      } else {
        // 임계값 미달이거나 첫 번째 질문에서 왼쪽 스와이프: 원래 위치로 복귀
        resetCardPosition();
      }

      // 회전 애니메이션 업데이트
      const rotation = tx / SCREEN_WIDTH;
      Animated.timing(rotate, {
        toValue: rotation * 0.3,
        duration: 100,
        useNativeDriver: true,
      }).start();
    },
    [
      currentIndex,
      goToNext,
      goToPrevious,
      resetCardPosition,
      rotate,
      animateSwipeExit,
    ],
  );

  // 카드 애니메이션 스타일
  const cardAnimatedStyle = {
    transform: [
      { translateX },
      { translateY },
      {
        rotate: rotate.interpolate({
          inputRange: [-1, 1],
          outputRange: ["-30deg", "30deg"],
        }),
      },
      { scale },
    ],
  };

  // 로딩 상태 - filteredQuestions 기준으로 변경
  if (filteredQuestions.totalCount === 0) {
    return (
      <Box className="flex-1 bg-gray-50">
        <Box className="flex-1 items-center justify-center">
          <Text className="text-gray-600 text-lg">
            질문을 준비하고 있습니다...
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-50">
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* 헤더 */}
      <Box className="flex-row items-center justify-between border-gray-200 border-b bg-white px-5 py-4">
        <Pressable
          className="flex-1 justify-start"
          onPress={() => router.back()}
        >
          <Text className="font-medium text-base text-blue-600">← 뒤로</Text>
        </Pressable>

        <Box className="flex-2 items-center">
          <Text className="mb-1 text-gray-600 text-sm">
            {currentIndex + 1} / {filteredQuestions.totalCount}
          </Text>
          <Progress className="h-1 w-32" value={progressPercentage * 100} />
        </Box>

        <Pressable className="flex-1 items-end" onPress={showCompletionAlert}>
          <Text className="font-bold text-gray-600 text-lg">⋯</Text>
        </Pressable>
      </Box>

      {/* 카드 영역 */}
      <Box className="flex-1 items-center justify-center px-5">
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[{ width: SCREEN_WIDTH - 40 }, cardAnimatedStyle]}
          >
            <Card className="rounded-xl bg-white p-6 shadow-lg">
              <Box className="space-y-6">
                {/* 카테고리 정보 */}
                <Box className="flex-row items-center justify-between border-gray-100 border-b pb-4">
                  <Text className="font-medium text-base text-gray-700">
                    {currentQuestion?.categoryName}
                  </Text>
                  <Box
                    className={`rounded-xl px-3 py-1 ${getDifficultyBadgeClass(currentQuestion?.difficulty)}`}
                  >
                    <Text className="font-medium text-sm text-white">
                      {getDifficultyLabel(currentQuestion?.difficulty)}
                    </Text>
                  </Box>
                </Box>

                {/* 질문 내용 */}
                <Box className="flex items-center justify-center py-8">
                  <Text className="text-center font-medium text-gray-800 text-xl leading-relaxed">
                    {currentQuestion?.content}
                  </Text>
                </Box>

                {/* 힌트 텍스트 */}
                <Box className="border-gray-100 border-t pt-4">
                  <Text className="text-center text-gray-500 text-sm">
                    ← 이전 질문 | 다음 질문 →
                  </Text>
                </Box>
              </Box>
            </Card>
          </Animated.View>
        </PanGestureHandler>
      </Box>

      {/* 하단 버튼들 */}
      <Box className="flex-row space-x-4 border-gray-200 border-t bg-white px-5 py-4">
        <Pressable
          className={`h-12 flex-1 items-center justify-center rounded-lg border border-gray-300 ${
            !progress.canGoBack ? "opacity-50" : ""
          }`}
          disabled={!progress.canGoBack}
          onPress={goToPrevious}
        >
          <Text
            className={`font-medium text-base ${
              !progress.canGoBack ? "text-gray-400" : "text-gray-700"
            }`}
          >
            이전
          </Text>
        </Pressable>

        <Pressable
          className="h-12 flex-1 items-center justify-center rounded-lg bg-blue-600"
          onPress={goToNext}
        >
          <Text className="font-medium text-base text-white">
            {!progress.canGoForward ? "완료" : "다음"}
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}

// 난이도 뱃지 클래스 반환
function getDifficultyBadgeClass(difficulty?: string): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "hard":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

// 난이도 라벨 반환
function getDifficultyLabel(difficulty?: string): string {
  switch (difficulty) {
    case "easy":
      return "쉬움";
    case "medium":
      return "보통";
    case "hard":
      return "어려움";
    default:
      return "기본";
  }
}
