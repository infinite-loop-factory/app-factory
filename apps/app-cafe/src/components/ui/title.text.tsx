import type { TranslationKey } from "@/i18n";

import { cn } from "@gluestack-ui/utils";
import { View, type ViewProps } from "react-native";
import {
  type DerivedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ui/themed-text";
import { themeConfig, useThemeStore } from "@/hooks/use-theme";

// === [수정됨] 3D 두께감 형성 ===
// Light Mode: 잔상(Ghost) 대신 불투명한 색(#D1CAC3)을 쌓아서 '글자 옆면'을 만듦
// Dark Mode: 어두운 배경에 묻히도록 깊이감만 줌
const LAYER_CONFIG = [
  // 1단계: 1.0은 너무 딱딱하니 0.9로 시작 (형체는 뚜렷함)
  {
    dark: { x: 1, y: 1, color: "#000000", opacity: 0.8 },
    // light: { x: 0.7, y: 0.7, color: "#D1CAC3", opacity: 0.5 },
    light: { x: 0.7, y: 0.7, color: "#D1CAC3", opacity: 0 },
  },
  // 2단계: 급격히 흐려지지 않고 0.75 유지 (두께감 유지)
  {
    dark: { x: 2, y: 2, color: "#000000", opacity: 0.6 },
    // light: { x: 1.4, y: 1.4, color: "#D1CAC3", opacity: 0.4 },
    light: { x: 1.4, y: 1.4, color: "#D1CAC3", opacity: 0 },
  },
  // 3단계: 끝부분도 어느 정도 힘이 있음 (0.6)
  {
    dark: { x: 3, y: 3, color: "#000000", opacity: 0.4 },
    // light: { x: 2, y: 2, color: "#80766C", opacity: 0.2 },
    light: { x: 2, y: 2, color: "#80766C", opacity: 0 },
  },
  // 4단계: 그림자 (분리감 형성)
  {
    dark: { x: 4, y: 4, color: "#000000", opacity: 0.2 },
    light: { x: 3.5, y: 3.5, color: "#80766C", opacity: 0.0 },
  },
];
type ThreeDTextProps = ViewProps & {
  children?: string;
  translationKey?: TranslationKey;
  className?: string;
  titleColor?: string;
  enableTransition?: boolean;
};

export const TitleText = ({
  children,
  className,
  titleColor,
  style,
  enableTransition = false,
  ...props
}: ThreeDTextProps) => {
  const { mode } = useThemeStore();
  const isDark = mode === "dark";

  if (!titleColor) {
    titleColor = themeConfig.getHex(mode, "--color-title-primary");
  }

  const progress = useDerivedValue(() => {
    return withTiming(isDark ? 1 : 0, {
      duration: enableTransition ? 1000 : 0,
    });
  }, [isDark, enableTransition]);

  const textClassName = cn("font-extrabold text-2xl", className);

  return (
    <View style={[{ position: "relative" }, style]} {...props}>
      {LAYER_CONFIG.map((config, index) => {
        return (
          <ShadowLayer
            className={textClassName}
            config={config}
            key={String(index)}
            progress={progress}
          >
            {children}
          </ShadowLayer>
        );
      })}

      {/* 메인 텍스트 (맨 위) */}
      <ThemedText
        className={textClassName}
        numberOfLines={1}
        style={titleColor ? { color: titleColor } : undefined}
      >
        {children}
      </ThemedText>
    </View>
  );
};

// 개별 레이어 컴포넌트
const ShadowLayer = ({
  progress,
  config,
  children,
  className,
}: {
  progress: DerivedValue<0 | 1>;
  config: (typeof LAYER_CONFIG)[0];
  children?: string;
  className?: string;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: interpolate(
        progress.value,
        [0, 1],
        [config.light.x, config.dark.x],
      ),
      top: interpolate(progress.value, [0, 1], [config.light.y, config.dark.y]),
      opacity: interpolate(
        progress.value,
        [0, 1],
        [config.light.opacity, config.dark.opacity],
      ),
      // 텍스트 색상도 보간 (light 모드에서 입체면 색상 -> dark 모드 그림자 색상)
      color: interpolateColor(
        progress.value,
        [0, 1],
        [config.light.color, config.dark.color],
      ),
    };
  });

  return (
    <ThemedText
      accessibilityElementsHidden={true}
      className={cn("-z-10 absolute select-none", className)}
      importantForAccessibility="no-hide-descendants"
      numberOfLines={1}
      style={animatedStyle}
    >
      {children}
    </ThemedText>
  );
};
