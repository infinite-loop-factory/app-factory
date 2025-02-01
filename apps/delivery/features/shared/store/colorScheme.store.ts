import { Appearance } from "react-native";
import { create } from "zustand";

export type ColorSchemeType = "light" | "dark";
type ColorSchemeContextType = {
  colorScheme?: ColorSchemeType;
  toggleColorScheme: () => void;
  setColorScheme: (colorScheme: ColorSchemeType) => void;
};

// 시스템 색상 모드 가져오기
const systemColorScheme =
  (Appearance.getColorScheme() as ColorSchemeType) || "dark";

export const useColorSchemaStore = create<ColorSchemeContextType>((set) => ({
  colorScheme: systemColorScheme,
  setColorScheme: (colorScheme: ColorSchemeType) => set({ colorScheme }),

  toggleColorScheme: () =>
    set(({ colorScheme }) => ({
      colorScheme: colorScheme === "light" ? "dark" : "light",
    })),
}));
