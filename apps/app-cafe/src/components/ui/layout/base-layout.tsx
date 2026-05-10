import { cn } from "@gluestack-ui/utils";
import { ReactNode } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { TitleText } from "@/components/ui/title.text";
import {
  TAB_BAR_STYLE_ENUM,
  themeConfig,
  useThemeStore,
} from "@/hooks/use-theme";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type AppLayoutProps = {
  isSafeArea?: boolean;
  className?: string;
  children?: ReactNode;
  title?: string | ReactNode;
  rightAction?: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  enableTransition?: boolean;
};

export function BaseLayout({
  isSafeArea = true,
  children,
  className,
  title,
  rightAction,
  scrollable = false,
  contentContainerStyle,
  enableTransition = false,
}: AppLayoutProps) {
  const { mode, tabBarStyle } = useThemeStore();
  const darkBg = themeConfig.getHex("dark", "--color-background-100");
  const lightBg = themeConfig.getHex("light", "--color-background-100");

  const isRetro = tabBarStyle === TAB_BAR_STYLE_ENUM.RETRO;

  const progress = useDerivedValue(() => {
    return withTiming(mode === "dark" ? 1 : 0, {
      duration: enableTransition ? 1000 : 0,
    });
  }, [mode, enableTransition]);

  const animStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value as number,
      [0, 1],
      [lightBg, darkBg],
    );
    return { backgroundColor };
  });

  const Wrapper = isSafeArea ? AnimatedSafeAreaView : Animated.View;
  const safeAreaProps = isSafeArea ? ({ edges: ["top"] } as const) : {};

  const titleElement = title ? (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
      <View className="flex-1">
        {typeof title === "string" ? <TitleText>{title}</TitleText> : title}
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  ) : null;

  if (scrollable) {
    return (
      <Wrapper className={"flex-1"} style={animStyle} {...safeAreaProps}>
        <ScrollView
          className={cn(className)}
          contentContainerStyle={{
            ...contentContainerStyle,
            paddingBottom: isRetro ? 90 : 20,
          }}
        >
          {titleElement}
          {children}
        </ScrollView>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={"flex-1"} style={animStyle} {...safeAreaProps}>
      {titleElement}
      <View
        className={cn("flex-1", className)}
        style={{ paddingBottom: isRetro ? 90 : 0 }}
      >
        {children}
      </View>
    </Wrapper>
  );
}
