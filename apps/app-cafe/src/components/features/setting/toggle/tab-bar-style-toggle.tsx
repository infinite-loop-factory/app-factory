import { Clock, Smartphone } from "lucide-react-native";
import { memo } from "react";
import { Toggle } from "@/components/ui/toggle";
import { useThemeStore } from "@/hooks/use-theme";

export const TabBarStyleToggle = memo(function TabBarStyleToggle() {
  const { currentHex, isTabBarModern, toggleTabBarStyle } = useThemeStore();

  const clockColor = currentHex["--color-typography-300"];

  return (
    <Toggle
      backgroundColor={
        currentHex["--color-background-400"]
      }
      isActive={isTabBarModern}
      leftContent={<Smartphone color={currentHex["--color-primary-500"]} size={12} strokeWidth={2.5} />}
      onPress={toggleTabBarStyle}
      rightContent={<Clock color={clockColor} size={12} strokeWidth={2.5} />}
    />
  );
});
