import { create } from "zustand";

export type ColorSchemeType = "light" | "dark";
type ColorSchemeContextType = {
  colorScheme: ColorSchemeType;
  toggleColorScheme: () => void;
};

export const useColorSchemaStore = create<ColorSchemeContextType>((set) => ({
  colorScheme: "light",
  toggleColorScheme: () =>
    set(({ colorScheme }) => ({
      colorScheme: colorScheme === "light" ? "dark" : "light",
    })),
}));
