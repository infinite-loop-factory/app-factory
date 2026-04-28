import { View } from "react-native";
import { ClipPath, Defs, Path, Rect, Svg } from "react-native-svg";

type GlassState = "full" | "half" | "empty";

type GlassProps = {
  state: GlassState;
  size: number;
};

function WhiskyGlass({ state, size }: GlassProps) {
  const fillColor =
    state === "empty" ? "transparent" : "rgb(var(--color-brand))";
  const strokeColor =
    state === "empty"
      ? "rgb(var(--color-text-faint))"
      : "rgb(var(--color-brand))";

  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Defs>
        <ClipPath id="half">
          <Rect height={24} width={12} x={0} y={0} />
        </ClipPath>
      </Defs>
      <Path
        d="M6 4h12l-1 14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3L6 4z"
        fill={state === "half" ? "transparent" : fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      {state === "half" && (
        <Path
          clipPath="url(#half)"
          d="M6 4h12l-1 14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3L6 4z"
          fill="rgb(var(--color-brand))"
        />
      )}
    </Svg>
  );
}

export type ScoreStarsProps = {
  score: number;
  size?: number;
};

export function ScoreStars({ score, size = 14 }: ScoreStarsProps) {
  const clamped = Math.max(0, Math.min(5, score));
  const fullCount = Math.floor(clamped);
  const hasHalf = clamped - fullCount >= 0.5;

  return (
    <View className="flex-row gap-1">
      {[0, 1, 2, 3, 4].map((i) => {
        let state: GlassState;
        if (i < fullCount) state = "full";
        else if (i === fullCount && hasHalf) state = "half";
        else state = "empty";
        return <WhiskyGlass key={i} size={size} state={state} />;
      })}
    </View>
  );
}
