import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { View } from "react-native";

interface SunProps {
  size: number;
}

export const Sun = ({ size }: SunProps) => {
  // 1. 빛이 엄청나게 퍼지도록 캔버스 크기를 4배로 확장
  const canvasSize = useMemo(() => size * 4, [size]);
  const center = useMemo(() => canvasSize / 2, [canvasSize]);

  // (canvasSize - size) / 2 만큼 이동해야 정중앙
  // 예: size 100, canvas 400 -> (400-100)/2 = 150 -> offset -150
  const offset = useMemo(() => -(canvasSize - size) / 2, [canvasSize, size]);

  const radius = useMemo(() => size / 2, [size]);

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
        <Group blendMode="plus">
          {/* Layer 1: 가장 넓은 대기광 (붉은/주황) - 은은하게 멀리 */}
          <Group>
            <BlurMask blur={12} style="normal" />
            <Circle
              color="#FF4500"
              cx={center}
              cy={center}
              opacity={0.3}
              r={radius * 2.0}
            />
          </Group>

          {/* Layer 2: 중간 광채 (진한 노랑) - 강도 높임 */}
          <Group>
            <BlurMask blur={8} style="normal" />
            <Circle
              color="#FFD700"
              cx={center}
              cy={center}
              opacity={0.5}
              r={radius * 1.5}
            />
          </Group>

          {/* Layer 3: 핵심 발광 (밝은 노랑/흰색) - 여기서 눈부심 발생 */}
          <Group>
            <BlurMask blur={3} style="normal" />
            <Circle
              color="#FFFF00" // 순수 노랑
              cx={center}
              cy={center}
              opacity={0.7} // 투명도 없음, 풀파워
              r={radius * 1.1}
            />
          </Group>
        </Group>

        {/* Layer 5: 태양 본체 (모양 잡아주는 원) */}
        {/* 블렌드 모드 밖에서 선명하게 그립니다 */}
        <Circle cx={center} cy={center} r={radius}>
          <RadialGradient
            c={vec(center, center)}
            colors={["#FFFFFF", "#FFF59D", "#FFEB3B", "#FBC02D"]}
            positions={[0.3, 0.5, 0.8, 1]}
            r={radius}
          />
        </Circle>
      </Canvas>
    </View>
  );
};
