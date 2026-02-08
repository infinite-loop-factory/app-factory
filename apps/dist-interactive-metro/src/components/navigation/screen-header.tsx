"use client";

import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenHeaderProps {
  title: string
  /** Optional: custom back handler. Defaults to router.back() */
  onBack?: () => void
}

/**
 * 모바일 플로우용 공통 헤더. 첫 화면을 제외한 모든 씬에서 사용.
 * 뒤로가기 버튼 + 제목. 상단 safe area(상태바/노치)를 반영합니다.
 */
export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const handleBack = onBack ?? (() => router.back());

  return (
    <View
      className="border-b border-outline-200 bg-background-0"
      style={{ paddingTop: insets.top }}
    >
      <View className="min-h-[56px] flex-row items-center px-4">
        <Pressable
          onPress={handleBack}
          className="-ml-2 mr-2 min-h-[44px] min-w-[44px] items-center justify-center"
          accessibilityLabel="뒤로"
          accessibilityRole="button"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft size={28} className="text-typography-900" />
        </Pressable>
        <Text
          className="flex-1 text-lg font-semibold text-typography-900"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
