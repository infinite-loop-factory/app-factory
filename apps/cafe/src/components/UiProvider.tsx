import { useColorSchemaStore } from "@/features/shared/store/colorScheme.store";
import type { ReactNode } from "react";
import { GluestackUIProvider } from "./ui/gluestack-ui-provider";

export default function UiProvider({ children }: { children: ReactNode }) {
  const { colorScheme } = useColorSchemaStore();

  // const token = useColorToken({
  //   background: true,
  //   primary: true,
  //   typography: true,
  //   outline: true,
  //   error: true,
  // });

  // const Theme = {
  //   dark: true,
  //   colors: {
  //     primary: token.primary,
  //     background: token.background,
  //     card: token.background,
  //     text: token.typography,
  //     border: token.outline,
  //     notification: token.error,
  //   },
  // };

  return (
    <GluestackUIProvider mode={colorScheme}>{children}</GluestackUIProvider>
  );
}
