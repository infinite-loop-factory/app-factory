/**
 * Fullscreen Mode Hook
 * 전체화면 카드 모드 상태 및 애니메이션 관리
 * 카드 90도 회전 + 확대로 가로 방향 전체화면 효과 구현
 * Reanimated 3 기반
 */

import { useCallback, useState } from "react";
import { StatusBar, useWindowDimensions, type ViewStyle } from "react-native";
import {
  type AnimatedStyle,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ANIMATION_DURATION = 400;
const FULLSCREEN_EASING = Easing.bezier(0.4, 0, 0.2, 1);

export interface UseFullscreenModeOptions {
  /** 카드 너비 (기본값: 화면 너비 - 40) */
  cardWidth?: number;
  /** 전체화면 진입 시 콜백 */
  onEnter?: () => void;
  /** 전체화면 복귀 시 콜백 */
  onExit?: () => void;
}

export interface UseFullscreenModeReturn {
  /** 전체화면 상태 */
  isFullscreen: boolean;
  /** 전체화면 토글 */
  toggleFullscreen: () => void;
  /** 전체화면 진입 */
  enterFullscreen: () => void;
  /** 전체화면 종료 */
  exitFullscreen: () => void;
  /** 전체화면 컨테이너 애니메이션 스타일 */
  fullscreenAnimatedStyle: AnimatedStyle<ViewStyle>;
  /** 제스처 좌표 변환 (90도 회전 시 X↔Y 스왑) */
  transformGestureCoordinates: (
    gestureX: number,
    gestureY: number,
  ) => { x: number; y: number };
}

/**
 * 전체화면 모드 훅
 * - 90도 회전 + 확대 애니메이션
 * - StatusBar 숨김/표시
 * - 제스처 좌표 변환 (회전 상태에서 스와이프 방향 보정)
 */
export function useFullscreenMode(
  options: UseFullscreenModeOptions = {},
): UseFullscreenModeReturn {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { cardWidth = screenWidth - 40, onEnter, onExit } = options;

  const [isFullscreen, setIsFullscreen] = useState(false);

  // 애니메이션 공유 값
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  /**
   * 전체화면 scale 계산
   * 90도 회전 시 카드가 화면을 최대한 채우도록
   */
  const calculateFullscreenScale = useCallback(() => {
    // 회전 후 카드의 "높이"가 화면 너비가 되므로
    // 화면 높이의 90%를 카드 너비로 채움
    const availableHeight = screenHeight * 0.88;
    const targetScale = availableHeight / cardWidth;

    // 너무 큰 확대 방지 (최대 1.5배)
    return Math.min(targetScale, 1.5);
  }, [cardWidth, screenHeight]);

  /**
   * 전체화면 진입
   */
  const enterFullscreen = useCallback(() => {
    const targetScale = calculateFullscreenScale();

    // StatusBar 숨김
    StatusBar.setHidden(true, "slide");

    // 90도 회전 + 확대 애니메이션
    rotation.value = withTiming(90, {
      duration: ANIMATION_DURATION,
      easing: FULLSCREEN_EASING,
    });
    scale.value = withTiming(
      targetScale,
      { duration: ANIMATION_DURATION, easing: FULLSCREEN_EASING },
      (finished) => {
        if (finished) {
          runOnJS(setIsFullscreen)(true);
          if (onEnter) runOnJS(onEnter)();
        }
      },
    );
  }, [rotation, scale, calculateFullscreenScale, onEnter]);

  /**
   * 전체화면 종료
   */
  const exitFullscreen = useCallback(() => {
    // StatusBar 표시
    StatusBar.setHidden(false, "slide");

    // 원래 상태로 복귀 애니메이션
    rotation.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: FULLSCREEN_EASING,
    });
    scale.value = withTiming(
      1,
      { duration: ANIMATION_DURATION, easing: FULLSCREEN_EASING },
      (finished) => {
        if (finished) {
          runOnJS(setIsFullscreen)(false);
          if (onExit) runOnJS(onExit)();
        }
      },
    );
  }, [rotation, scale, onExit]);

  /**
   * 전체화면 토글
   */
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  /**
   * 전체화면 컨테이너 애니메이션 스타일
   * - 90도 회전
   * - 확대
   */
  const fullscreenAnimatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    }),
  );

  /**
   * 제스처 좌표 변환
   * 90도 회전 시 사용자의 "가로 스와이프"가 실제로는 Y축 움직임이 됨
   * 이를 보정하여 자연스러운 스와이프 경험 제공
   */
  const transformGestureCoordinates = useCallback(
    (gestureX: number, gestureY: number): { x: number; y: number } => {
      if (!isFullscreen) {
        return { x: gestureX, y: gestureY };
      }

      // 90도 시계방향 회전 시:
      // 사용자가 보는 "오른쪽"으로 스와이프 → 실제 gestureY 양수
      // 사용자가 보는 "왼쪽"으로 스와이프 → 실제 gestureY 음수
      return { x: gestureY, y: -gestureX };
    },
    [isFullscreen],
  );

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    fullscreenAnimatedStyle,
    transformGestureCoordinates,
  };
}

export default useFullscreenMode;
