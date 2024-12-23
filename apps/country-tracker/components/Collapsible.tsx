import type { PropsWithChildren } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { themeAtom } from "@/atoms/theme.atom";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/ui/text";
import { COLORS } from "@/constants/colors";
import { useAtomValue } from "jotai";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const savedTheme = useAtomValue(themeAtom);

  return (
    <ThemedView>
      <TouchableOpacity
        className="flex-row items-center gap-1.5"
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isOpen ? "chevron-down" : "chevron-forward-outline"}
          size={18}
          color={savedTheme === "light" ? COLORS.light.icon : COLORS.dark.icon}
        />
        <Text bold>{title}</Text>
      </TouchableOpacity>
      {isOpen && <ThemedView className="mt-1.5 ml-6">{children}</ThemedView>}
    </ThemedView>
  );
}
