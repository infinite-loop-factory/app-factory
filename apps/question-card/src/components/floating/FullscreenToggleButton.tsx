/**
 * 전체화면 토글 버튼 컴포넌트
 * 카드 전체화면 모드 진입/종료용 플로팅 버튼
 * FloatingBackButton 패턴 기반
 */

import { Maximize2, Minimize2 } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";

export interface FullscreenToggleButtonProps {
  /** 전체화면 상태 */
  isFullscreen: boolean;
  /** 토글 버튼 클릭 핸들러 */
  onPress: () => void;
  /** 비활성화 상태 */
  disabled?: boolean;
}

/**
 * 전체화면 토글 플로팅 버튼
 * - 일반 모드: 우측 상단, 반투명 검정 배경, Maximize2 아이콘
 * - 전체화면 모드: 우측 상단, 오렌지 배경, Minimize2 아이콘
 */
export function FullscreenToggleButton({
  isFullscreen,
  onPress,
  disabled = false,
}: FullscreenToggleButtonProps) {
  const iconSize = 20;
  const iconColor = "#ffffff";

  const baseClasses =
    "absolute z-20 h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm shadow-xl";

  // 전체화면 상태에 따른 위치 및 스타일
  const positionClass = isFullscreen ? "top-4 right-4" : "top-2 right-14";
  const styleClass = isFullscreen ? "bg-orange-500" : "bg-black/30";
  const disabledClass = disabled ? "opacity-50" : "";

  const buttonClasses = `${baseClasses} ${positionClass} ${styleClass} ${disabledClass}`;

  return (
    <Pressable
      accessibilityLabel={isFullscreen ? "전체화면 해제" : "전체화면"}
      accessibilityRole="button"
      className={buttonClasses}
      disabled={disabled}
      onPress={onPress}
    >
      {isFullscreen ? (
        <Minimize2 color={iconColor} size={iconSize} strokeWidth={2.5} />
      ) : (
        <Maximize2 color={iconColor} size={iconSize} strokeWidth={2.5} />
      )}
    </Pressable>
  );
}

export default FullscreenToggleButton;
