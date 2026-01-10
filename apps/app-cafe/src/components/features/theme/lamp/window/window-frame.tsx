import { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Cloud } from "./cloud";
import { CrescentMoon } from "./crescent-moon";
import { Moon } from "./moon";
import { ShootingStar } from "./shooting-star";
import { Sun } from "./sun";
import { TwinklingStar } from "./twinkling-star";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

const generateStars = (): Star[] => {
  const stars: Star[] = [];
  const usedPositions = new Set<string>();

  for (let i = 0; i < 15; i++) {
    let top: number;
    let left: number;
    let positionKey: string;
    let attempts = 0;

    do {
      top = Math.random() * 32 + 2;
      left = Math.random() * 32 + 2;
      positionKey = `${Math.floor(top)}-${Math.floor(left)}`;
      attempts++;
    } while (usedPositions.has(positionKey) && attempts < 50);

    if (attempts < 50) {
      usedPositions.add(positionKey);
      stars.push({
        id: i,
        top,
        left,
        size: Math.random() * 0.8 + 0.6,
        delay: Math.random() * 3000,
        duration: Math.random() * 800 + 800,
      });
    }
  }

  return stars;
};

export const WindowFrame = memo(({ isDark }: { isDark: boolean }) => {
  const prevIsDark = useRef(isDark);

  const [isCrescentMoon, setIsCrescentMoon] = useState(Math.random() < 0.5);
  const [showMoon, setShowMoon] = useState(false);
  const [stars] = useState<Star[]>(generateStars());

  const rotation = useSharedValue(isDark ? 225 : 30);

  useEffect(() => {
    if (prevIsDark.current !== isDark) {
      rotation.value = withTiming(rotation.value + 180, {
        duration: 800,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
      prevIsDark.current = isDark;

      if (isDark) {
        setIsCrescentMoon(Math.random() < 0.5);
        setShowMoon(false);
        setTimeout(() => setShowMoon(true), 100);
      }
    }
  }, [isDark, rotation]);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const dayOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(isDark ? 0 : 1, { duration: 1000 }),
  }));

  const moonCounterRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: 50 }, { rotate: `${-rotation.value}deg` }],
    };
  });

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View
        collapsable={false}
        style={[styles.windowFrame, isDark ? styles.windowFrameDark : null]}
      >
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isDark ? "#080f1a" : "#1a2b47",
            }}
          />
          {isDark && (
            <>
              {stars.map((star) => (
                <TwinklingStar
                  delay={star.delay}
                  duration={star.duration}
                  key={star.id}
                  left={star.left}
                  size={star.size}
                  top={star.top}
                />
              ))}
              <ShootingStar isCrescentMoon={isCrescentMoon} isDark={isDark} />
            </>
          )}
          <Animated.View style={[StyleSheet.absoluteFill, dayOpacity]}>
            <View style={{ flex: 1, backgroundColor: "#4FC3F7" }} />
          </Animated.View>
        </View>
        <Animated.View style={[styles.orbitGroup, orbitStyle]}>
          <View style={[styles.celestialBody, styles.sunWrapper]}>
            <Sun size={8} />
          </View>

          <Animated.View
            style={[
              styles.celestialBody,
              styles.moonWrapperBase,
              moonCounterRotateStyle,
            ]}
          >
            {showMoon &&
              (isCrescentMoon ? <CrescentMoon size={8} /> : <Moon size={8} />)}
          </Animated.View>
        </Animated.View>
        {!isDark && (
          <>
            <Cloud isMorning={!isDark} type="A" x={10} y={15} />
            <Cloud isMorning={!isDark} type="B" x={-10} y={-15} />
            <Cloud isMorning={!isDark} type="C" x={24} y={18} />
          </>
        )}
        <View style={styles.sashHorizontal} />
        <View style={styles.sashVertical} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  windowFrame: {
    position: "absolute",
    top: 60,
    right: 50,
    width: 36,
    height: 36,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: "#8d6d62",
    backgroundColor: "#81D4FA",
    overflow: "hidden",
    zIndex: 5,
  },
  windowFrameDark: {
    borderColor: "#3E2723",
    backgroundColor: "#0D1B2A",
  },
  sashHorizontal: {
    position: "absolute",
    top: "50%",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(62, 39, 35, 0.5)",
  },
  sashVertical: {
    position: "absolute",
    left: "50%",
    height: "100%",
    width: 1,
    backgroundColor: "rgba(62, 39, 35, 0.5)",
  },
  orbitGroup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 0,
    height: 0,
    marginTop: 30,
    marginLeft: -30,
  },
  celestialBody: { position: "absolute", top: 0, left: 0 },
  sunWrapper: {
    marginTop: -5,
    marginLeft: 12,
    transform: [{ translateY: -50 }],
  },
  moonWrapperBase: {
    marginTop: -4,
    marginLeft: -18,
  },
  sunlightContainer: {
    position: "absolute",
    top: 86,
    right: 50,
    width: 200,
    height: 300,
    zIndex: 4,
  },
  sunlightCanvas: {
    flex: 1,
  },
});
