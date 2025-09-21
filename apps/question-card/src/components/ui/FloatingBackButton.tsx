/**
 * 플로팅 뒤로가기 버튼 컴포넌트
 * 헤더 제거 후 네비게이션을 위한 플로팅 UI
 */

import React from "react";
import { Pressable, Text } from "@/components/ui";

export type FloatingBackButtonPosition = "top-left" | "top-right";
export type FloatingBackButtonStyle = "dark" | "light" | "primary";

export interface FloatingBackButtonProps {
  onPress: () => void;
  position?: FloatingBackButtonPosition;
  style?: FloatingBackButtonStyle;
  icon?: string;
  disabled?: boolean;
}

const positionClasses: Record<FloatingBackButtonPosition, string> = {
  "top-left": "top-12 left-4",
  "top-right": "top-12 right-4",
};

const styleClasses: Record<FloatingBackButtonStyle, string> = {
  dark: "bg-black/20",
  light: "bg-white/80 border border-gray-200",
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
  icon = "←",
  disabled = false,
}: FloatingBackButtonProps) {
  const baseClasses =
    "absolute z-10 h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm shadow-lg";
  const positionClass = positionClasses[position];
  const styleClass = styleClasses[style];
  const textClass = textClasses[style];

  const buttonClasses = `${baseClasses} ${positionClass} ${styleClass} ${
    disabled ? "opacity-50" : ""
  }`;

  return (
    <Pressable className={buttonClasses} disabled={disabled} onPress={onPress}>
      <Text className={`${textClass} text-lg font-medium`}>{icon}</Text>
    </Pressable>
  );
}
