import { memo } from "react";
import { Image, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface MoonProps {
  style?: ViewStyle;
  isDark: boolean;
}

export const Moon = memo(function Moon({ style, isDark }: MoonProps) {
  const moonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDark ? 1 : 0, {
      duration: 650,
      easing: Easing.out(Easing.ease),
    }),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: -32,
          left: -32,
          width: 64,
          height: 64,
          alignItems: "center",
          justifyContent: "center",
        },
        moonStyle,
        style,
      ]}
    >
      <Image
        resizeMode="contain"
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/581/581601.png",
        }}
        style={{
          width: 22,
          height: 22,
        }}
      />
    </Animated.View>
  );
});
