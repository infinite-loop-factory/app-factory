import { Clock, Smartphone } from "lucide-react-native";
import { memo } from "react";
import { Toggle } from "@/components/ui/toggle";
import { useThemeStore } from "@/hooks/use-theme";

export const TabBarStyleToggle = memo(function TabBarStyleToggle() {
  const { mode, isTabBarModern, toggleTabBarStyle } = useThemeStore();

  return (
    <Toggle
      backgroundColor={
        mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
      }
      isActive={isTabBarModern}
      leftContent={<Smartphone color="#3B82F6" size={12} strokeWidth={2.5} />}
      onPress={toggleTabBarStyle}
      rightContent={<Clock color="#6B7280" size={12} strokeWidth={2.5} />}
    />
  );
});
