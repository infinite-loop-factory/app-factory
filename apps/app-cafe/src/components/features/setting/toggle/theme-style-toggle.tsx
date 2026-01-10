import { Lightbulb, Sparkles } from "lucide-react-native";
import { memo } from "react";
import { Toggle } from "@/components/ui/toggle";
import { useThemeStore } from "@/hooks/use-theme";

export const ThemeStyleToggle = memo(function ThemeStyleToggle() {
  const { setThemeStyle, mode, themeStyle } = useThemeStore();

  const handleStyleChange = () => {
    const newStyle = themeStyle ? "spotlight" : "stars";
    setThemeStyle(newStyle);
  };

  return (
    <Toggle
      backgroundColor={
        mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
      }
      isActive={themeStyle === "stars"}
      leftContent={<Lightbulb color="#EAB308" size={12} strokeWidth={2.5} />}
      onPress={handleStyleChange}
      rightContent={<Sparkles color="#F59E0B" size={12} strokeWidth={2.5} />}
    />
  );
});
