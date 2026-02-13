import type { ReactNode } from "react";

import { View } from "react-native";

interface ElevatedCardProps {
  children: ReactNode;
  className?: string;
}

export function ElevatedCard({ children, className = "" }: ElevatedCardProps) {
  return (
    <View
      className={`bg-white rounded-3xl p-6 shadow-xl ${className}`}
      style={{
        // RN shadow props for consistent cross-platform shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {children}
    </View>
  );
}
