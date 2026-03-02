import type { ReactNode } from "react";
import "@/global.css";
import "react-native-reanimated";

import { SunDriverBoot } from "@/hooks/sun-drive/sun-drive.init";
import { GluestackUiProvider } from "@/provider/ui/gluestack-ui.provider.tsx";

export default function UIProviders({ children }: { children: ReactNode }) {
  return (
    <GluestackUiProvider>
      <SunDriverBoot />
      {children}
    </GluestackUiProvider>
  );
}
