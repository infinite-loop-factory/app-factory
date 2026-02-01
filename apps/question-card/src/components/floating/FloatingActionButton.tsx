/**
 * 플로팅 액션 버튼 (FAB) 컴포넌트
 * 주요 액션을 위한 원형 플로팅 버튼
 */

import type React from "react";

import { Check, RotateCcw } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

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
  icon?: "check" | "reset" | "custom";
  customIcon?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const positionClasses: Record<FloatingActionButtonPosition, string> = {
  "bottom-left": "bottom-24 left-5",
  "bottom-right": "bottom-24 right-5",
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
  sm: 16,
  md: 18,
  lg: 20,
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
  icon = "check",
  customIcon,
  label,
  disabled = false,
  size = "md",
}: FloatingActionButtonProps) {
  const baseClasses =
    "absolute z-10 items-center justify-center rounded-full shadow-xl";
  const positionClass = positionClasses[position];
  const styleClass = styleClasses[style];
  const textClass = textClasses[style];
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizeClasses[size];
  const labelSizeClass = labelSizeClasses[size];

  const buttonClasses = `${baseClasses} ${positionClass} ${styleClass} ${sizeClass} ${
    disabled ? "opacity-50" : ""
  }`;

  // 아이콘 렌더링 함수
  const renderIcon = () => {
    if (icon === "custom" && customIcon) {
      return customIcon;
    }

    const iconColor = textClass.includes("white") ? "#ffffff" : "#374151";

    switch (icon) {
      case "check":
        return <Check color={iconColor} size={iconSize} strokeWidth={2.5} />;
      case "reset":
        return (
          <RotateCcw color={iconColor} size={iconSize} strokeWidth={2.5} />
        );
      default:
        return <Check color={iconColor} size={iconSize} strokeWidth={2.5} />;
    }
  };

  return (
    <Pressable className={buttonClasses} disabled={disabled} onPress={onPress}>
      {label ? (
        <VStack className="items-center" space="xs">
          {renderIcon()}
          <Text
            className={`${textClass} ${labelSizeClass} text-center font-medium`}
          >
            {label}
          </Text>
        </VStack>
      ) : (
        renderIcon()
      )}
    </Pressable>
  );
}
