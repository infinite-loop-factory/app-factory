import type { PropsWithChildren } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { COLORS } from "@/constants/colors";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme = "light" } = useColorScheme();

  return (
    <ThemedView>
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center gap-1.5"
        onPress={() => setIsOpen((value) => !value)}
      >
        <Ionicons
          color={colorScheme === "light" ? COLORS.light.icon : COLORS.dark.icon}
          name={isOpen ? "chevron-down" : "chevron-forward-outline"}
          size={18}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView className="mt-1.5 ml-6">{children}</ThemedView>}
    </ThemedView>
  );
}
