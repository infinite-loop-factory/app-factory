/**
 * 플로팅 메뉴 버튼 컴포넌트
 * 우측 상단에 표시되는 메뉴/설정 버튼
 */

import { MoreHorizontal } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";

export type FloatingMenuButtonPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export type FloatingMenuButtonStyle = "dark" | "light" | "primary";

export interface FloatingMenuButtonProps {
  onPress: () => void;
  position?: FloatingMenuButtonPosition;
  style?: FloatingMenuButtonStyle;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const positionClasses: Record<FloatingMenuButtonPosition, string> = {
  "top-left": "left-4",
  "top-right": "right-4",
  "bottom-left": "bottom-12 left-4",
  "bottom-right": "bottom-12 right-4",
};

const styleClasses: Record<FloatingMenuButtonStyle, string> = {
  dark: "bg-black/20",
  light: "bg-white/80 border border-gray-200",
  primary: "bg-orange-500",
};

const textClasses: Record<FloatingMenuButtonStyle, string> = {
  dark: "text-white",
  light: "text-gray-700",
  primary: "text-white",
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconSizeClasses = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function FloatingMenuButton({
  onPress,
  position = "top-right",
  style = "dark",
  label,
  disabled = false,
  size = "md",
}: FloatingMenuButtonProps) {
  const insets = useSafeAreaInsets();
  const baseClasses =
    "absolute z-10 items-center justify-center backdrop-blur-sm shadow-lg";
  const positionClass = positionClasses[position];
  const styleClass = styleClasses[style];
  const textClass = textClasses[style];
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizeClasses[size];

  // 라벨이 있으면 둥근 모서리 사각형, 없으면 원형
  const shapeClass = label ? "rounded-full px-3" : "rounded-full";

  const buttonClasses = `${baseClasses} ${positionClass} ${styleClass} ${sizeClass} ${shapeClass} ${
    disabled ? "opacity-50" : ""
  }`;

  const iconColor = textClass.includes("white") ? "#ffffff" : "#374151";

  const topStyle = position.startsWith("top-")
    ? { top: insets.top + 8 }
    : undefined;

  return (
    <Pressable
      accessibilityLabel={label || "메뉴"}
      accessibilityRole="button"
      className={buttonClasses}
      disabled={disabled}
      onPress={onPress}
      style={topStyle}
    >
      {label ? (
        <Text className={`${textClass} font-medium text-xs`}>{label}</Text>
      ) : (
        <MoreHorizontal color={iconColor} size={iconSize} strokeWidth={2.5} />
      )}
    </Pressable>
  );
}
