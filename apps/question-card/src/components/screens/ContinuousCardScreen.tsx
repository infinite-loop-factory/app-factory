/**
 * 연속 카드 화면
 * 질문 카드를 스와이프로 넘기며 진행
 * 모드 1, 2, 3에서 사용
 * 전체화면 모드: 카드 90도 회전 + 확대로 가로 보기 지원
 */

import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StatusBar, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Reanimated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { getHintTypeLabel } from "@/utils/hintUtils";

export default function ContinuousCardScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const swipeThreshold = screenWidth * 0.3;
  const { filteredQuestions, progress } = useAppState();
  const { goToNextQuestion, goToPreviousQuestion, resetProgress } =
    useAppActions();

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
    cardWidth: screenWidth - 40,
  });

  // Context에서 관리하는 현재 인덱스와 질문 사용
  const currentIndex = progress.currentIndex;
  const currentQuestion = progress.currentQuestion;

  // 애니메이션 상태 (Reanimated 3 shared values)
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  // 카드 위치 리셋
  const resetCardPosition = useCallback(() => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
    scale.value = withSpring(1);
  }, [translateX, translateY, rotate, scale]);

  // 카드 뒤집기 토글
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // 처음부터 다시 시작
  const handleRestartFromBeginning = useCallback(() => {
    completionSheet.hide();
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

  // 스와이프 애니메이션 실행
  // cardAnimatedStyle에서 X↔Y 스왑을 처리하므로, 항상 translateX 사용
  const animateSwipeExit = useCallback(
    (direction: "left" | "right", tx: number, onComplete: () => void) => {
      // 전체화면/일반 모두 translateX 사용 (cardAnimatedStyle에서 좌표 변환)
      const targetX = direction === "right" ? screenWidth : -screenWidth;
      translateX.value = withTiming(targetX, { duration: 250 });
      rotate.value = withTiming(tx > 0 ? 0.3 : -0.3, { duration: 250 });
      scale.value = withTiming(0.8, { duration: 250 }, () => {
        runOnJS(onComplete)();
      });
    },
    [translateX, rotate, scale, screenWidth],
  );

  // 스와이프 제스처 종료 핸들러
  // 전체화면 모드에서는 제스처 좌표를 변환하여 자연스러운 스와이프 유지
  const handleSwipeEnd = useCallback(
    (
      rawTx: number,
      rawTy: number,
      rawVelocityX: number,
      rawVelocityY: number,
    ) => {
      // 전체화면 모드에서는 좌표 변환 적용 (90도 회전 보정)
      const { x: tx } = transformGestureCoordinates(rawTx, rawTy);
      const { x: velocityX } = transformGestureCoordinates(
        rawVelocityX,
        rawVelocityY,
      );

      const shouldSwipeRight = tx > swipeThreshold || velocityX > 500;
      const shouldSwipeLeft = tx < -swipeThreshold || velocityX < -500;

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
      transformGestureCoordinates, swipeThreshold
    ],
  );

  // Gesture API 핸들러
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const {
        translationX: rawTx,
        translationY: rawTy,
        velocityX: rawVelocityX,
        velocityY: rawVelocityY,
      } = event;
      runOnJS(handleSwipeEnd)(rawTx, rawTy, rawVelocityX, rawVelocityY);
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(handleFlip)();
  });

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  // 카드 애니메이션 스타일
  // 전체화면 모드에서는 X↔Y 좌표 스왑 (90도 회전 보정)
  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (isFullscreen) {
      return {
        transform: [
          { translateX: translateY.value },
          { translateY: -translateX.value },
          { rotate: `${interpolate(rotate.value, [-1, 1], [-30, 30])}deg` },
          { scale: scale.value },
        ],
      };
    }
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${interpolate(rotate.value, [-1, 1], [-30, 30])}deg` },
        { scale: scale.value },
      ],
    };
  });

  // 로딩 상태 - filteredQuestions 기준으로 변경
  if (filteredQuestions.totalCount === 0) {
    return (
      <SafeAreaView className="flex-1 bg-orange-50">
        <Box className="flex-1 items-center justify-center">
          <Text className="text-gray-600 text-lg">
            질문을 준비하고 있습니다...
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const RootWrapper = isFullscreen ? Box : SafeAreaView;

  return (
    <RootWrapper className="flex-1 bg-orange-50">
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

          <Box className="flex-[2] items-center">
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
          <GestureDetector gesture={composedGesture}>
            <Reanimated.View
              style={[{ width: screenWidth - 40 }, cardAnimatedStyle]}
            >
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
                            {getDifficultyLabel(currentQuestion?.difficulty)}
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
            </Reanimated.View>
          </GestureDetector>
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
    </RootWrapper>
  );
}
