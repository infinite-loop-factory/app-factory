/**
 * 연속 카드 화면
 * 질문 카드를 스와이프로 넘기며 진행
 * 모드 1, 2, 3에서 사용
 * 전체화면 모드: 카드 90도 회전 + 확대로 가로 보기 지원
 */

import type { HintType, Question } from "@/types";

import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StatusBar } from "react-native";
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  type TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import Reanimated from "react-native-reanimated";
import { FlipCard } from "@/components/cards";
import {
  FloatingBackButton,
  FullscreenToggleButton,
} from "@/components/floating";
import { CompletionSheet } from "@/components/sheets";
import { Box, Card, Pressable, Progress, Text } from "@/components/ui";
import { useAppActions, useAppState } from "@/context/AppContext";
import { useCompletionSheet } from "@/hooks/useCompletionSheet";
import { useFullscreenMode } from "@/hooks/useFullscreenMode";
import {
  getDifficultyBadgeSolidStyle,
  getDifficultyLabel,
} from "@/utils/difficultyStyles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function ContinuousCardScreen() {
  const router = useRouter();
  const { filteredQuestions, progress } = useAppState();
  const { goToNextQuestion, goToPreviousQuestion, resetProgress } =
    useAppActions();

  // 로컬 상태 (Context 상태 사용으로 대체 예정)
  const [_questions, setQuestions] = useState<Question[]>([]);
  const [_isCompleted, setIsCompleted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false); // 카드 뒤집기 상태

  // Custom hooks
  const completionSheet = useCompletionSheet();

  // 전체화면 모드 훅
  const {
    isFullscreen,
    toggleFullscreen,
    fullscreenAnimatedStyle,
    transformGestureCoordinates,
  } = useFullscreenMode({
    cardWidth: SCREEN_WIDTH - 40,
  });

  // Context에서 관리하는 현재 인덱스와 질문 사용
  const currentIndex = progress.currentIndex;
  const currentQuestion = progress.currentQuestion;

  // 애니메이션 상태
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // 제스처 핸들러 refs (탭 + 스와이프 동시 인식용)
  const panRef = useRef(null);
  const tapRef = useRef(null);

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

  // 카드 뒤집기 토글
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // 탭 제스처 핸들러 (카드 뒤집기 전용)
  const onTapStateChange = useCallback(
    (event: TapGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        handleFlip();
      }
    },
    [handleFlip],
  );

  // 힌트 유형 라벨 반환
  const getHintTypeLabel = useCallback((type: HintType): string => {
    switch (type) {
      case "keyword":
        return "키워드";
      case "example":
        return "예시 답변";
      case "thinking":
        return "생각 포인트";
      case "related":
        return "관련 질문";
      case "situation":
        return "상황 예시";
      default:
        return "힌트";
    }
  }, []);

  // 처음부터 다시 시작
  const handleRestartFromBeginning = useCallback(() => {
    completionSheet.hide();
    setIsCompleted(false);
    resetCardPosition();
    resetProgress();
  }, [completionSheet.hide, resetCardPosition, resetProgress]);

  // 홈으로 이동 (새 설정)
  const handleGoToHome = useCallback(() => {
    completionSheet.hide();
    router.replace("/");
  }, [completionSheet.hide, router]);

  // 진행률 계산
  const progressPercentage =
    filteredQuestions.totalCount > 0
      ? (currentIndex + 1) / filteredQuestions.totalCount
      : 0;

  // 다음 질문으로 이동 (Context Actions 사용)
  const goToNext = useCallback(() => {
    if (progress.canGoForward) {
      setIsFlipped(false); // 카드 뒤집기 상태 리셋
      goToNextQuestion();
      resetCardPosition();
    } else {
      setIsCompleted(true);
      completionSheet.show();
    }
  }, [
    progress.canGoForward,
    goToNextQuestion,
    resetCardPosition,
    completionSheet.show,
  ]);

  // 이전 질문으로 이동 (Context Actions 사용)
  const goToPrevious = useCallback(() => {
    if (progress.canGoBack) {
      setIsFlipped(false); // 카드 뒤집기 상태 리셋
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
  // cardAnimatedStyle에서 X↔Y 스왑을 처리하므로, 항상 translateX 사용
  const animateSwipeExit = useCallback(
    (direction: "left" | "right", tx: number, onComplete: () => void) => {
      // 전체화면/일반 모두 translateX 사용 (cardAnimatedStyle에서 좌표 변환)
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

  // 스와이프 제스처 상태 변화 핸들러 (카드 넘기기 전용)
  // 전체화면 모드에서는 제스처 좌표를 변환하여 자연스러운 스와이프 유지
  const onHandlerStateChange = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      const {
        state,
        translationX: rawTx,
        translationY: rawTy,
        velocityX: rawVelocityX,
        velocityY: rawVelocityY,
      } = event.nativeEvent;

      if (state !== State.END) {
        return;
      }

      // 전체화면 모드에서는 좌표 변환 적용 (90도 회전 보정)
      const { x: tx } = transformGestureCoordinates(rawTx, rawTy);
      const { x: velocityX } = transformGestureCoordinates(
        rawVelocityX,
        rawVelocityY,
      );

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
    },
    [
      currentIndex,
      goToNext,
      goToPrevious,
      resetCardPosition,
      animateSwipeExit,
      transformGestureCoordinates,
    ],
  );

  // 카드 애니메이션 스타일
  // 전체화면 모드에서는 X↔Y 좌표 스왑 (90도 회전 보정)
  const cardAnimatedStyle = isFullscreen
    ? {
        transform: [
          // 전체화면: Y→시각적 X, X→시각적 -Y
          { translateX: translateY },
          { translateY: Animated.multiply(translateX, -1) },
          {
            rotate: rotate.interpolate({
              inputRange: [-1, 1],
              outputRange: ["-30deg", "30deg"],
            }),
          },
          { scale },
        ],
      }
    : {
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
      <Box className="flex-1 bg-orange-50">
        <Box className="flex-1 items-center justify-center">
          <Text className="text-gray-600 text-lg">
            질문을 준비하고 있습니다...
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-orange-50">
      {/* StatusBar: 전체화면 모드가 아닐 때만 표시 */}
      {!isFullscreen && (
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      )}

      {/* 플로팅 뒤로 버튼: 전체화면 모드가 아닐 때만 표시 */}
      {!isFullscreen && <FloatingBackButton onPress={() => router.back()} />}

      {/* 전체화면 토글 버튼 */}
      <FullscreenToggleButton
        isFullscreen={isFullscreen}
        onPress={toggleFullscreen}
      />

      {/* 오렌지 톤 헤더: 전체화면 모드가 아닐 때만 표시 */}
      {!isFullscreen && (
        <Box className="flex-row items-center justify-between border-orange-200 border-b px-5 py-4">
          <Box className="flex-1" />

          <Box className="flex-2 items-center">
            <Text className="mb-1 text-gray-600 text-sm">
              {currentIndex + 1} / {filteredQuestions.totalCount}
            </Text>
            <Progress className="h-1 w-32" value={progressPercentage * 100} />
          </Box>

          <Pressable
            className="flex-1 items-end"
            onPress={completionSheet.show}
          >
            <Text className="font-bold text-gray-600 text-lg">⋯</Text>
          </Pressable>
        </Box>
      )}

      {/* 카드 영역 */}
      <Box
        className={`flex-1 items-center justify-center ${isFullscreen ? "" : "px-5"}`}
      >
        <Reanimated.View style={fullscreenAnimatedStyle}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            ref={panRef}
            simultaneousHandlers={tapRef}
          >
            <Animated.View
              style={[{ width: SCREEN_WIDTH - 40 }, cardAnimatedStyle]}
            >
              <TapGestureHandler
                onHandlerStateChange={onTapStateChange}
                ref={tapRef}
                simultaneousHandlers={panRef}
              >
                <Animated.View>
                  <FlipCard
                    backContent={
                      <Card className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <Box className="space-y-4">
                          {/* 힌트 헤더 */}
                          <Box className="flex-row items-center justify-center border-gray-100 border-b pb-4">
                            <Text className="text-lg">💡</Text>
                            <Text className="ml-2 font-medium text-base text-gray-700">
                              힌트
                            </Text>
                          </Box>

                          {/* 힌트 내용 */}
                          {currentQuestion?.hints &&
                          currentQuestion.hints.length > 0 ? (
                            <>
                              {/* 힌트 1 */}
                              {currentQuestion.hints[0] && (
                                <Box className="border-gray-100 border-b py-3">
                                  <Text className="mb-1 font-medium text-orange-600 text-xs">
                                    {getHintTypeLabel(
                                      currentQuestion.hints[0].type,
                                    )}
                                  </Text>
                                  <Text className="text-base text-gray-800 leading-relaxed">
                                    {currentQuestion.hints[0].content}
                                  </Text>
                                </Box>
                              )}

                              {/* 힌트 2 */}
                              {currentQuestion.hints[1] && (
                                <Box className="py-3">
                                  <Text className="mb-1 font-medium text-blue-600 text-xs">
                                    {getHintTypeLabel(
                                      currentQuestion.hints[1].type,
                                    )}
                                  </Text>
                                  <Text className="text-base text-gray-800 leading-relaxed">
                                    {currentQuestion.hints[1].content}
                                  </Text>
                                </Box>
                              )}
                            </>
                          ) : (
                            <Box className="flex items-center justify-center py-8">
                              <Text className="text-center text-base text-gray-500">
                                이 질문에는 힌트가 없습니다
                              </Text>
                            </Box>
                          )}

                          {/* 되돌리기 안내 */}
                          <Box className="border-gray-100 border-t pt-4">
                            <Text className="text-center text-gray-400 text-sm">
                              다시 터치하면 질문으로 돌아가요
                            </Text>
                          </Box>
                        </Box>
                      </Card>
                    }
                    frontContent={
                      <Card className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <Box className="space-y-6">
                          {/* 카테고리 정보 */}
                          <Box className="flex-row items-center justify-between border-gray-100 border-b pb-4">
                            <Box className="flex-row items-center">
                              <Box className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-gray-50">
                                <Text className="text-base">📝</Text>
                              </Box>
                              <Text className="font-medium text-base text-gray-900">
                                {currentQuestion?.categoryName}
                              </Text>
                            </Box>
                            <Box
                              className={`rounded-full px-3 py-1.5 ${getDifficultyBadgeSolidStyle(currentQuestion?.difficulty)}`}
                            >
                              <Text className="font-medium text-sm text-white">
                                {getDifficultyLabel(
                                  currentQuestion?.difficulty,
                                )}
                              </Text>
                            </Box>
                          </Box>

                          {/* 질문 내용 */}
                          <Box className="flex items-center justify-center py-8">
                            <Text className="text-center font-medium text-gray-900 text-xl leading-relaxed">
                              {currentQuestion?.content}
                            </Text>
                          </Box>

                          {/* 힌트 텍스트 */}
                          <Box className="border-gray-100 border-t pt-4">
                            <Text className="text-center text-gray-400 text-sm">
                              카드를 터치하면 힌트를 볼 수 있어요
                            </Text>
                            <Text className="text-center text-gray-400 text-sm">
                              카드를 옆으로 밀어서 넘길 수도 있어요
                            </Text>
                          </Box>
                        </Box>
                      </Card>
                    }
                    isFlipped={isFlipped}
                    key={currentQuestion?.id}
                  />
                </Animated.View>
              </TapGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </Reanimated.View>
      </Box>

      {/* 하단 버튼들: 전체화면 모드가 아닐 때만 표시 */}
      {!isFullscreen && (
        <Box className="flex-row gap-4 space-x-4 border-gray-200 border-t bg-white px-5 py-4">
          <Pressable
            className={`h-12 flex-1 items-center justify-center rounded-lg border-2 border-gray-200 ${
              !progress.canGoBack ? "opacity-50" : "bg-white"
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
            className="h-12 flex-1 items-center justify-center rounded-lg bg-orange-500"
            onPress={goToNext}
          >
            <Text className="font-medium text-base text-white">
              {!progress.canGoForward ? "완료" : "다음"}
            </Text>
          </Pressable>
        </Box>
      )}

      {/* 완료 BottomSheet */}
      <CompletionSheet
        description="모든 질문을 완료했습니다"
        primaryAction={{
          text: "처음부터 다시",
          onPress: handleRestartFromBeginning,
        }}
        renderBackdrop={completionSheet.renderBackdrop}
        secondaryAction={{
          text: "새 설정으로 시작",
          onPress: handleGoToHome,
        }}
        sheetRef={completionSheet.sheetRef}
        snapPoints={completionSheet.snapPoints}
        title="질문 완료!"
      />
    </Box>
  );
}
