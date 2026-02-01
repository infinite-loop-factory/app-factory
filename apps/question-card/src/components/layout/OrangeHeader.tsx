/**
 * 오렌지 톤 헤더 컴포넌트
 * 모든 화면에서 일관된 헤더 디자인을 제공
 */

import { Text, View } from "react-native";

export interface OrangeHeaderProps {
  title: string;
  className?: string;
}

export function OrangeHeader({ title, className = "" }: OrangeHeaderProps) {
  return (
    <View className={`border-orange-200 border-b px-5 py-4 ${className}`}>
      <Text className="text-center font-semibold text-gray-900 text-xl">
        {title}
      </Text>
    </View>
  );
}
