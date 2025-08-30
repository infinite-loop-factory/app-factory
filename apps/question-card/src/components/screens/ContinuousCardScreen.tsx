/**
 * 연속 카드 화면
 * 질문 카드를 스와이프로 넘기며 진행
 * 모드 1, 2, 3에서 사용
 */

import type { Question } from "@/types";

import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  layout,
  neutralColors,
  spacing,
  typography,
} from "@/constants/designSystem";
import { useAppState } from "@/context/AppContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;

export default function ContinuousCardScreen() {
  const router = useRouter();
  const { filteredQuestions } = useAppState();

  // 현재 질문 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [_isCompleted, setIsCompleted] = useState(false);

  // 애니메이션 상태
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // 컴포넌트 마운트시 질문 데이터 설정
  useEffect(() => {
    if (filteredQuestions.questions.length > 0) {
      setQuestions(filteredQuestions.questions);
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
            setCurrentIndex(0);
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

  // 현재 질문
  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? (currentIndex + 1) / questions.length : 0;

  // 다음 질문으로 이동
  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetCardPosition();
    } else {
      setIsCompleted(true);
      showCompletionAlert();
    }
  }, [currentIndex, questions.length, resetCardPosition, showCompletionAlert]);

  // 이전 질문으로 이동
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetCardPosition();
    }
  }, [currentIndex, resetCardPosition]);

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

  // 로딩 상태
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>질문을 준비하고 있습니다...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={showCompletionAlert}
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* 카드 영역 */}
      <View style={styles.cardContainer}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={[styles.card, cardAnimatedStyle]}>
            {/* 카테고리 정보 */}
            <View style={styles.cardHeader}>
              <Text style={styles.categoryName}>
                {currentQuestion?.categoryName}
              </Text>
              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor: getDifficultyColor(
                      currentQuestion?.difficulty,
                    ),
                  },
                ]}
              >
                <Text style={styles.difficultyText}>
                  {getDifficultyLabel(currentQuestion?.difficulty)}
                </Text>
              </View>
            </View>

            {/* 질문 내용 */}
            <View style={styles.cardContent}>
              <Text style={styles.questionText}>
                {currentQuestion?.content}
              </Text>
            </View>

            {/* 힌트 텍스트 */}
            <View style={styles.cardFooter}>
              <Text style={styles.hintText}>← 이전 질문 | 다음 질문 →</Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>

      {/* 하단 버튼들 */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={currentIndex === 0}
          onPress={goToPrevious}
          style={[
            styles.controlButton,
            currentIndex === 0 && styles.controlButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.controlButtonText,
              currentIndex === 0 && styles.controlButtonTextDisabled,
            ]}
          >
            이전
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={goToNext}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>
            {currentIndex === questions.length - 1 ? "완료" : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 난이도 색상 반환
function getDifficultyColor(difficulty?: string): string {
  switch (difficulty) {
    case "easy":
      return "#2ECC71";
    case "medium":
      return "#F39C12";
    case "hard":
      return "#E74C3C";
    default:
      return neutralColors[400];
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: typography.fontSize.lg,
    color: neutralColors[600],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: neutralColors[200],
  },
  backButton: {
    flex: 1,
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    color: "#3b82f6",
    fontWeight: typography.fontWeight.medium,
  },
  progressContainer: {
    flex: 2,
    alignItems: "center",
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: neutralColors[600],
    marginBottom: spacing.xs,
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: neutralColors[200],
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  menuButton: {
    flex: 1,
    alignItems: "flex-end",
  },
  menuButtonText: {
    fontSize: 18,
    color: neutralColors[600],
    fontWeight: typography.fontWeight.bold,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: layout.screenPadding,
  },
  card: {
    width: SCREEN_WIDTH - layout.screenPadding * 2,
    height: CARD_HEIGHT,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: layout.cardPadding * 1.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: neutralColors[100],
  },
  categoryName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: neutralColors[700],
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: typography.fontSize.sm,
    color: "#ffffff",
    fontWeight: typography.fontWeight.medium,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    color: neutralColors[800],
    textAlign: "center",
    lineHeight: typography.fontSize.xl * typography.lineHeight.relaxed,
  },
  cardFooter: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: neutralColors[100],
  },
  hintText: {
    fontSize: typography.fontSize.sm,
    color: neutralColors[500],
    textAlign: "center",
  },
  bottomControls: {
    flexDirection: "row",
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: neutralColors[200],
    gap: spacing.md,
  },
  controlButton: {
    flex: 1,
    height: layout.buttonHeight,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonDisabled: {
    backgroundColor: neutralColors[300],
  },
  controlButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: "#ffffff",
  },
  controlButtonTextDisabled: {
    color: neutralColors[500],
  },
});
