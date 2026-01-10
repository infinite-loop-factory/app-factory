import {
  BlurMask,
  Canvas,
  Group,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { type SharedValue, useDerivedValue } from "react-native-reanimated";

interface Props {
  isDark: boolean;
  rotation: SharedValue<number>;
  language?: string;
  lampHeight: number;
  lampLeft?: number;
}

// --- 좌표 및 설정 ---
const LAMP_X = 150;
const PIVOT_Y = 0;
const BEAM_LENGTH = 900;

export const RealisticSpotlight = React.memo(function RealisticSpotlight({
  isDark,
  rotation,
  language,
  lampHeight,
  lampLeft,
}: Props) {
  const lampX = useMemo(() => {
    if (lampLeft !== undefined) return lampLeft;
    return language === "ko" ? LAMP_X + 18 : LAMP_X;
  }, [language, lampLeft]);

  const originVec = useMemo(() => vec(lampX, PIVOT_Y), [lampX]);

  const BEAM_START_Y = PIVOT_Y + lampHeight + 35;

  const beamPath = useMemo(() => {
    const topWidth = 6;
    const bottomWidth = 120;

    return Skia.Path.MakeFromSVGString(`
      M ${-topWidth} 0
      L ${topWidth} 0
      L ${bottomWidth} ${BEAM_LENGTH}
      L ${-bottomWidth} ${BEAM_LENGTH}
      Z
    `);
  }, []);

  // 5. 회전 애니메이션 값
  const skiaRotation = useDerivedValue(() => {
    return [{ rotate: (rotation.value * Math.PI) / 180 }];
  });

  if (!(isDark && beamPath)) return null;

  return (
    <View collapsable={false} pointerEvents="none" style={styles.fullScreen}>
      <Canvas style={styles.canvas}>
        <Group origin={originVec} transform={skiaRotation}>
          <Group transform={[{ translate: [lampX, BEAM_START_Y] }]}>
            <Path path={beamPath}>
              <LinearGradient
                colors={[
                  "rgba(255,255,255, 0.15)", // 시작점(전구) 근처는 약간 더 밝게
                  "rgba(255,255,255, 0.03)", // 중간은 은은하게
                  "transparent", // 끝은 투명하게
                ]}
                end={vec(0, BEAM_LENGTH * 0.9)}
                positions={[0, 0.5, 1]}
                start={vec(0, 0)}
              />
              <BlurMask blur={4} style="normal" />
            </Path>
          </Group>
        </Group>
      </Canvas>
    </View>
  );
});

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    zIndex: 2500, // 램프보다 위에 혹은 아래에 배치 (필요에 따라 조절)
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
});
