/**
 * 플로팅 뒤로가기 버튼 컴포넌트
 * 헤더 제거 후 네비게이션을 위한 플로팅 UI
 */

import { ArrowLeft } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";

export type FloatingBackButtonPosition = "top-left" | "top-right";
export type FloatingBackButtonStyle = "dark" | "light" | "primary";

export interface FloatingBackButtonProps {
  onPress: () => void;
  position?: FloatingBackButtonPosition;
  style?: FloatingBackButtonStyle;
  size?: number;
  disabled?: boolean;
}

const positionClasses: Record<FloatingBackButtonPosition, string> = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
};

const styleClasses: Record<FloatingBackButtonStyle, string> = {
  dark: "bg-black/30",
  light: "bg-white/90 border border-gray-300/50",
  primary: "bg-orange-500",
};

const textClasses: Record<FloatingBackButtonStyle, string> = {
  dark: "text-white",
  light: "text-gray-700",
  primary: "text-white",
};

export function FloatingBackButton({
  onPress,
  position = "top-left",
  style = "dark",
  size = 20,
  disabled = false,
}: FloatingBackButtonProps) {
  const baseClasses =
    "absolute z-10 h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm shadow-xl";
  const positionClass = positionClasses[position];
  const styleClass = styleClasses[style];
  const iconColor = textClasses[style].includes("white")
    ? "#ffffff"
    : "#374151";

  const buttonClasses = `${baseClasses} ${positionClass} ${styleClass} ${
    disabled ? "opacity-50" : ""
  }`;

  return (
    <Pressable
      accessibilityLabel="뒤로 가기"
      accessibilityRole="button"
      className={buttonClasses}
      disabled={disabled}
      onPress={onPress}
    >
      <ArrowLeft color={iconColor} size={size} strokeWidth={2.5} />
    </Pressable>
  );
}
