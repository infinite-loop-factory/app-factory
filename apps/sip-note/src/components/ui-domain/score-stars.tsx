import { View } from "react-native";
import { GlassVessel } from "./glass-vessel";

export type ScoreStarsProps = {
  score: number;
  size?: number;
};

export function ScoreStars({ score, size = 14 }: ScoreStarsProps) {
  const clamped = Math.max(0, Math.min(5, score));

  return (
    <View className="flex-row gap-1">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, clamped - i));
        return <GlassVessel animate={false} fill={fill} key={i} size={size} />;
      })}
    </View>
  );
}
