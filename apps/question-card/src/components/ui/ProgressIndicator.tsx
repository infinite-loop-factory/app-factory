/**
 * 플로팅 진행률 인디케이터 컴포넌트
 * 상단 가장자리에 표시되는 얇은 진행률 바
 */

import React from "react";
import { View } from "react-native";
import { Box } from "@/components/ui/box";

export interface ProgressIndicatorProps {
  progress: number; // 0-100 범위의 진행률
  color?: string;
  backgroundColor?: string;
  height?: number;
  className?: string;
}

export function ProgressIndicator({
  progress,
  color = "#f97316", // orange-500
  backgroundColor = "#e5e7eb", // gray-200
  height = 2,
  className = "",
}: ProgressIndicatorProps) {
  // 진행률을 0-100 범위로 제한
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const containerClasses = `absolute top-0 left-0 right-0 z-10 ${className}`;

  return (
    <Box className={containerClasses} style={{ height }}>
      {/* 배경 */}
      <View className="absolute inset-0" style={{ backgroundColor }} />

      {/* 진행률 바 */}
      <View
        className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
        style={{
          backgroundColor: color,
          width: `${clampedProgress}%`,
        }}
      />
    </Box>
  );
}
