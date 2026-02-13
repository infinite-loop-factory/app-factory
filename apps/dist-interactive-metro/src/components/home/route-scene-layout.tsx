import type { ReactNode } from "react";

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface RouteSceneLayoutProps {
  /** Optional header: title + subtitle. Shown in a stable area to avoid layout jump. */
  title?: string;
  subtitle?: string;
  /** Station row (출발 | 경유 | 도착). Rendered in a stable position. */
  stationBlock: ReactNode;
  /** Main content below the block (selection list, search button, etc.). Uses flex-1 and min-h-0 so it scrolls correctly. */
  children: ReactNode;
}

/**
 * 공통 경로안내 씬 레이아웃.
 * 모든 시나리오(빈 상태, 출발/도착/경유 선택, 검색)에서 동일한 프레임을 유지해
 * 전환 시 레이아웃 점프를 막고, 제목·블록·콘텐츠 영역을 일관되게 배치합니다.
 */
export function RouteSceneLayout({
  title,
  subtitle,
  stationBlock,
  children,
}: RouteSceneLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <View className="min-h-0 flex-1 flex-col">
        {(title != null || subtitle != null) && (
          <View className="shrink-0 px-6 pt-4 pb-2">
            {title != null && (
              <Text
                className="font-semibold text-typography-900 text-xl"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
            {subtitle != null && (
              <Text
                className="mt-1 text-outline-500 text-sm"
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}

        <View className="shrink-0 px-6">{stationBlock}</View>

        <View className="min-h-0 flex-1">{children}</View>
      </View>
    </SafeAreaView>
  );
}
