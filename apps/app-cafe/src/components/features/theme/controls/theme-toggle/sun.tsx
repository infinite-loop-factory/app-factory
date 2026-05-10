import type { ViewStyle } from "react-native";

import { memo } from "react";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Circle, G, Line, Svg } from "react-native-svg";

interface SunProps {
  style?: ViewStyle;
  rotation: SharedValue<number>;
}

export const Sun = memo(function Sun({ style, rotation }: SunProps) {
  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
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
        sunStyle,
        style,
      ]}
    >
      <Svg height={28} viewBox="0 0 100 100" width={28}>
        <G fill="none" stroke="#FF8C00" strokeLinecap="round" strokeWidth="5">
          <Line x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(30 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(60 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(90 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(120 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(150 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(180 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(210 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(240 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(270 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(300 50 50)" x1="50" x2="50" y1="12" y2="16" />
          <Line transform="rotate(330 50 50)" x1="50" x2="50" y1="12" y2="16" />
        </G>
        <Circle cx="50" cy="50" fill="#FF8C00" r="26" />
      </Svg>
    </Animated.View>
  );
});
