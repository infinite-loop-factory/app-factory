import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  RadialGradient,
  Shadow,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { View } from "react-native";

interface MoonProps {
  size: number;
}

export const Moon = ({ size }: MoonProps) => {
  // 1. 캔버스 크기: 달 크기의 5배 (빛 번짐 공간 충분히 확보)
  const canvasSize = useMemo(() => size * 5, [size]);

  // 2. 캔버스의 중심점
  const center = useMemo(() => canvasSize / 2, [canvasSize]);

  // 3. [핵심 수정] 캔버스 크기가 변해도 항상 중앙에 오게 하는 공식
  // (원래크기 - 캔버스크기) / 2
  const offset = useMemo(() => (size - canvasSize) / 2, [size, canvasSize]);

  const r = useMemo(() => (size / 2) * 0.9, [size]);

  return (
    <View style={{ width: size, height: size }}>
      <Canvas
        style={{
          width: canvasSize,
          height: canvasSize,
          position: "absolute",
          left: offset, // 계산된 오프셋 적용
          top: offset, // 계산된 오프셋 적용
        }}
      >
        {/* === 1. 외부 광원 (Glow) === */}
        <Group blendMode="plus">
          <Group>
            <BlurMask blur={12} style="normal" />
            <Circle
              color="#E1F5FE"
              cx={center}
              cy={center}
              opacity={0.15}
              r={r * 2.0}
            />
          </Group>
          <Group>
            <BlurMask blur={8} style="normal" />
            <Circle
              color="#FFFFFF"
              cx={center}
              cy={center}
              opacity={0.3}
              r={r * 1.5}
            />
          </Group>
          <Group>
            <BlurMask blur={3} style="normal" />
            <Circle
              color="#FFFFFF"
              cx={center}
              cy={center}
              opacity={0.45}
              r={r * 1.1}
            />
          </Group>
        </Group>

        {/* === 2. 달 본체 및 크레이터 === */}
        <Group>
          {/* 달 표면 */}
          <Circle cx={center} cy={center} r={r}>
            <Shadow blur={4} color="rgba(0,0,0,0.25)" dx={-2} dy={2} inner />
            <RadialGradient
              c={vec(center - r * 0.3, center - r * 0.3)}
              colors={["#FFFFFF", "#F5F5F5", "#E0E0E0"]}
              positions={[0, 0.7, 1]}
              r={r * 1.5}
            />
          </Circle>

          {/* 크레이터 */}
          <Group>
            <Circle
              color="#B0BEC5"
              cx={center - r * 0.3}
              cy={center - r * 0.2}
              r={r * 0.3}
            />
            <Circle
              color="#B0BEC5"
              cx={center + r * 0.4}
              cy={center + r * 0.1}
              r={r * 0.22}
            />
            <Circle
              color="#90A4AE"
              cx={center + r * 0.1}
              cy={center - r * 0.5}
              r={r * 0.18}
            />
            <Circle
              color="#B0BEC5"
              cx={center - r * 0.2}
              cy={center + r * 0.4}
              r={r * 0.15}
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
};
