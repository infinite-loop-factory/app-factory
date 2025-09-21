/**
 * 플로팅 액션 버튼 (FAB) 컴포넌트
 * 주요 액션을 위한 원형 플로팅 버튼
 */

import React from "react";
import { Pressable, Text, VStack } from "@/components/ui";

export type FloatingActionButtonPosition = "bottom-left" | "bottom-right";
export type FloatingActionButtonStyle =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export interface FloatingActionButtonProps {
  onPress: () => void;
  position?: FloatingActionButtonPosition;
  style?: FloatingActionButtonStyle;
  icon?: string;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const positionClasses: Record<FloatingActionButtonPosition, string> = {
  "bottom-left": "bottom-20 left-4",
  "bottom-right": "bottom-20 right-4",
};

const styleClasses: Record<FloatingActionButtonStyle, string> = {
  primary: "bg-orange-500 shadow-orange-200",
  secondary: "bg-gray-500 shadow-gray-200",
  success: "bg-green-500 shadow-green-200",
  warning: "bg-yellow-500 shadow-yellow-200",
  danger: "bg-red-500 shadow-red-200",
};

const textClasses: Record<FloatingActionButtonStyle, string> = {
  primary: "text-white",
  secondary: "text-white",
  success: "text-white",
  warning: "text-white",
  danger: "text-white",
};

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

const iconSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const labelSizeClasses = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
};

export function FloatingActionButton({
  onPress,
  position = "bottom-right",
  style = "primary",
  icon = "✓",
  label,
  disabled = false,
  size = "md",
}: FloatingActionButtonProps) {
  const baseClasses =
    "absolute z-10 items-center justify-center rounded-full shadow-lg";
  const positionClass = positionClasses[position];
  const styleClass = styleClasses[style];
  const textClass = textClasses[style];
  const sizeClass = sizeClasses[size];
  const iconSizeClass = iconSizeClasses[size];
  const labelSizeClass = labelSizeClasses[size];

  const buttonClasses = `${baseClasses} ${positionClass} ${styleClass} ${sizeClass} ${
    disabled ? "opacity-50" : ""
  }`;

  return (
    <Pressable className={buttonClasses} disabled={disabled} onPress={onPress}>
      {label ? (
        <VStack className="items-center" space="xs">
          <Text className={`${textClass} ${iconSizeClass} font-medium`}>
            {icon}
          </Text>
          <Text
            className={`${textClass} ${labelSizeClass} font-medium text-center`}
          >
            {label}
          </Text>
        </VStack>
      ) : (
        <Text className={`${textClass} ${iconSizeClass} font-medium`}>
          {icon}
        </Text>
      )}
    </Pressable>
  );
}
