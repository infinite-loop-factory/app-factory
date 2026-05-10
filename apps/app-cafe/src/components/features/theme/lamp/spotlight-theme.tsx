import {
  BlurMask,
  Canvas,
  Group,
  RoundedRect,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { THEME_STYLE_ENUM, useThemeStore } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { CleanGodRays } from "./clean-god-rays";
import { RealisticSpotlight } from "./lamp/realistic-spotlight";
import { SwingingLamp } from "./lamp/swinging-lamp";
import { WindowFrame } from "./window/window-frame";
import { WindowShadow } from "./window-shadow";

export function SpotlightTheme({
  isDark,
  themeStyle,
  lampHeight = 155,
  lampLeft = 245,
}: {
  isDark: boolean;
  themeStyle: string;
  lampHeight?: number;
  lampLeft?: number;
}) {
  const masterRotation = useSharedValue(3);

  const { toggleMode } = useThemeStore();
  const { language } = useTranslation();

  const shouldRender = themeStyle === THEME_STYLE_ENUM.SPOTLIGHT;

  useEffect(() => {
    masterRotation.value = withRepeat(
      withTiming(-3, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [masterRotation]);

  return (
    <View
      className={!shouldRender ? "hidden" : ""}
      pointerEvents="box-none"
      style={styles.container}
    >
      {!isDark && <WindowShadow isDark={isDark} />}

      <WindowFrame isDark={isDark} />
      {!isDark && <CleanGodRays isDark={isDark} />}
      {isDark && (
        <Canvas
          style={{
            position: "absolute",
            top: -16,
            right: -31,
            width: 200,
            height: 200,
            zIndex: -1,
          }}
        >
          <Group transform={[{ translate: [100, 100] }]}>
            <Group>
              <BlurMask blur={10} style="normal" />
              <RoundedRect
                color="rgba(255, 255, 255, 0.15)"
                height={30}
                r={0}
                width={30}
                x={-14}
                y={-17}
              />
            </Group>
          </Group>
        </Canvas>
      )}
      <RealisticSpotlight
        isDark={isDark}
        lampHeight={lampHeight}
        lampLeft={lampLeft}
        language={language}
        rotation={masterRotation}
      />
      <SwingingLamp
        isDark={isDark}
        lampHeight={lampHeight}
        lampLeft={lampLeft}
        language={language}
        onPress={toggleMode}
        rotation={masterRotation}
        showShadow={!isDark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3000,
    overflow: "visible",
    pointerEvents: "box-none",
  },
});
