import {
  BlurMask,
  Canvas,
  Group,
  Path,
  PathOp,
  RadialGradient,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { View } from "react-native";

interface CrescentMoonProps {
  size: number;
}

export const CrescentMoon = ({ size }: CrescentMoonProps) => {
  const canvasSize = useMemo(() => size * 3, [size]);
  const center = useMemo(() => canvasSize / 2, [canvasSize]);
  const offset = useMemo(() => (size - canvasSize) / 2, [size, canvasSize]);

  // [모양] 초승달 Path 수정
  const moonPath = useMemo(() => {
    const r = size / 2;
    const path = Skia.Path.Make();
    // 외곽 원
    path.addCircle(center, center, r * 0.9);

    const innerCircle = Skia.Path.Make();
    innerCircle.addCircle(center - r * 0.5, center, r * 0.85);

    path.op(innerCircle, PathOp.Difference);
    return path;
  }, [center, size]);

  const r = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Canvas
        style={{
          width: canvasSize,
          height: canvasSize,
          position: "absolute",
          left: offset,
          top: offset,
        }}
      >
        <Group
          origin={vec(center, center)}
          transform={[{ rotate: Math.PI / 11 }]}
        >
          {/* === 1. 고밀도 발광 (Neon Intensity) === */}
          <Group blendMode="plus">
            <Group>
              <BlurMask blur={15} style="normal" />
              <Path color="#FFD700" opacity={0.6} path={moonPath} />
            </Group>

            <Group>
              <BlurMask blur={8} style="normal" />
              <Path color="#FFFF00" opacity={0.6} path={moonPath} />
            </Group>

            <Group>
              <BlurMask blur={3} style="normal" />
              <Path color="#FFFFFF" opacity={0.6} path={moonPath} />
            </Group>
          </Group>

          {/* === 2. 달 본체 (Solid) === */}
          <Path path={moonPath}>
            <RadialGradient
              c={vec(center, center)}
              colors={["#FFFFFF", "#FFF9C4", "#FFEE58"]}
              positions={[0, 0.4, 1]}
              r={r * 1.5}
            />
          </Path>
        </Group>
      </Canvas>
    </View>
  );
};
