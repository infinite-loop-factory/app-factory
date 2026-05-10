import type { ReactNode } from "react";

import { Pressable, Text, View } from "react-native";

interface EmptyStateProps {
  icon: ReactNode;
  iconBgColor?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  iconBgColor = "bg-gray-100",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View
      className="bg-white rounded-2xl p-12 items-center shadow-sm"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View
        className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${iconBgColor}`}
      >
        {icon}
      </View>
      <Text className="text-lg font-medium text-gray-900 mb-2">{title}</Text>
      <Text className="text-sm text-gray-500 text-center mb-6">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          className="px-6 py-3 bg-blue-600 rounded-xl active:bg-blue-700"
          onPress={onAction}
        >
          <Text className="text-white font-medium">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
