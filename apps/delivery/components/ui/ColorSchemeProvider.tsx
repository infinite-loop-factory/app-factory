import { useColorScheme } from "nativewind";
import { type ReactNode, createContext, useContext, useState } from "react";

export type ColorSchemeType = "light" | "dark";
type ColorSchemeContextType = {
  colorScheme: ColorSchemeType;
  toggleColorScheme: () => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined,
);

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme = "dark" } = useColorScheme();

  const [colorCustomScheme, setColorCustomScheme] =
    useState<ColorSchemeType>(colorScheme);

  const toggleColorScheme = () => {
    setColorCustomScheme((prevScheme) =>
      prevScheme === "light" ? "dark" : "light",
    );
  };

  return (
    <ColorSchemeContext.Provider
      value={{ colorScheme: colorCustomScheme, toggleColorScheme }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useCustomColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (!context)
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  return context;
}
