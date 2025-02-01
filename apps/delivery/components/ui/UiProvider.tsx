import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import WebviewLayout from "@/components/web-layout/WebviewLayout";
import { useColorToken } from "@/features/shared/hooks/useThemeColor";
import { useColorSchemaStore } from "@/features/shared/store/colorScheme.store";
import { ThemeProvider } from "@react-navigation/native";
import type { ReactNode } from "react";

export default function UiProvider({ children }: { children: ReactNode }) {
  const { colorScheme } = useColorSchemaStore();

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
