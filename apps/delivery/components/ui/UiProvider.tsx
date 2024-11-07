import { useCustomColorScheme } from "@/components/ui/ColorSchemeProvider";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import WebviewLayout from "@/components/web-layout/WebviewLayout";
import { useColorToken } from "@/hooks/useThemeColor";
import { ThemeProvider } from "@react-navigation/native";
import type { ReactNode } from "react";

export default function UiProvider({ children }: { children: ReactNode }) {
  const { colorScheme } = useCustomColorScheme();

  const token = useColorToken({
    background: true,
    primary: true,
    typography: true,
    outline: true,
    error: true,
  });

  const Theme = {
    dark: true,
    colors: {
      primary: token.primary,
      background: token.background,
      card: token.background,
      text: token.typography,
      border: token.outline,
      notification: token.error,
    },
  };

  return (
    <ThemeProvider value={Theme}>
      <GluestackUIProvider mode={colorScheme}>
        <WebviewLayout>{children}</WebviewLayout>
      </GluestackUIProvider>
    </ThemeProvider>
  );
}
