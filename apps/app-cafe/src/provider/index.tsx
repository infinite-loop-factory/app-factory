import type { ReactNode } from "react";

import DataProvider from "@/provider/data";
import InitProjectProvider from "@/provider/init";
import InteractionProvider from "@/provider/interaction";
import UiProvider from "@/provider/ui";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UiProvider>
      <InteractionProvider>
        <InitProjectProvider />
        <DataProvider>{children}</DataProvider>
      </InteractionProvider>
    </UiProvider>
  );
}
