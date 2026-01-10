import { Moon, Sun } from "lucide-react-native";
import { Toggle } from "@/components/ui/toggle";
import { useThemeStore } from "@/hooks/use-theme";

export function ThemeSwitch() {
  const { mode, toggleMode } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <Toggle
      backgroundColor={
        mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
      }
      isActive={isDark}
      leftContent={
        <Sun
          color={mode === "dark" ? "#FF8C00" : "#F59E0B"}
          size={14}
          strokeWidth={2.5}
        />
      }
      onPress={toggleMode}
      rightContent={<Moon color="#B6A700" size={14} strokeWidth={2.5} />}
    />
  );
}
