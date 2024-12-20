import { useCustomColorScheme } from "@/components/ui/ColorSchemeProvider";
import { Cloud, Moon, Star, Sun } from "lucide-react-native";
import { Pressable, View } from "react-native";

export default function DarkModeToggle() {
  const { toggleColorScheme, colorScheme } = useCustomColorScheme();
  const darkMode = colorScheme === "dark";

  return (
    <Pressable
      onPress={toggleColorScheme}
      className={`relative h-12 w-24 rounded-full p-2 transition-colors duration-500 ease-in-out ${
        darkMode ? "bg-indigo-900" : "bg-blue-300"
      }`}
    >
      {/* 아이콘 컨테이너 */}
      <View className="absolute inset-0 flex-row items-center justify-between px-2">
        <Cloud
          className={`h-4 w-4 text-white transition-opacity duration-500 ${
            darkMode ? "opacity-0" : "opacity-100"
          }`}
        />
        <Star
          className={`h-4 w-4 text-yellow-200 transition-opacity duration-500 ${
            darkMode ? "opacity-100" : "opacity-0"
          }`}
        />
      </View>

      {/* 토글 버튼 */}
      <View
        className={`flex h-8 w-8 transform items-center justify-center rounded-full shadow-lg transition-all duration-500 ease-in-out ${
          darkMode ? "translate-x-12 bg-indigo-700" : "translate-x-0 bg-white"
        }`}
      >
        {darkMode ? (
          <Moon className="h-5 w-5 text-yellow-300" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-500" />
        )}
      </View>
    </Pressable>
  );
}
