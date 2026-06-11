import { Text } from "react-native";
import { ScreenShell } from "@/components/ui/screen-shell";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT } from "@/game/constants/theme";
import { useAppSettings } from "@/hooks/use-app-settings";
import i18n from "@/i18n";
import { isIapAvailable } from "@/lib/monetization/iap-availability";

/**
 * Route guard: the real shop imports expo-iap at module scope, which throws
 * when the native module is absent (stale dev client, Expo Go, web). Only
 * evaluate that module when the probe succeeds.
 */
export default function ShopRoute() {
  if (isIapAvailable()) {
    // Deferred evaluation on purpose — see docblock.
    const ShopStoreScreen = require("@/components/shop-store-screen")
      .default as () => JSX.Element;
    return <ShopStoreScreen />;
  }
  return <ShopUnavailable />;
}

function ShopUnavailable() {
  const { palette } = useAppSettings();
  return (
    <ScreenShell title={i18n.t("shop.title")}>
      <WoodPanel contentStyle={{ padding: 18 }} palette={palette}>
        <Text
          style={{
            color: palette.cream,
            fontSize: 17,
            fontFamily: GAME_FONT,
            textAlign: "center",
          }}
        >
          {i18n.t("shop.unavailable")}
        </Text>
      </WoodPanel>
    </ScreenShell>
  );
}
