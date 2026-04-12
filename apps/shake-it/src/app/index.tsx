import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Accelerometer } from "expo-sensors";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Linking, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RestaurantResultModal } from "@/components/restaurant-result-modal";
import { SearchRadiusModal } from "@/components/search-radius-modal";
import { ShakeHomeFooter } from "@/components/shake-home-footer";
import { ShakeHomeHeader } from "@/components/shake-home-header";
import { ShakeHomeHero } from "@/components/shake-home-hero";
import { APP_CONFIG } from "@/constants/config";
import { useLocation } from "@/hooks/use-location";
import { useRestaurantRecommendation } from "@/hooks/use-restaurant-recommendation";
import { useSearchRadius } from "@/hooks/use-search-radius";
import { formatSearchRadius } from "@/utils/search-radius";

const C = {
  primary: "#3d6bf5",
  primaryDark: "#254db5",
  surface: "#F2F4F6",
  textMain: "#191F28",
  textSub: "#8B95A1",
};

function useShakeAnimation() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 2,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -2,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(750),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [rotation]);

  return {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [-2, 0, 2],
          outputRange: ["-2deg", "0deg", "2deg"],
        }),
      },
    ],
  };
}

function useBounceAnimation() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.bounce),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [translateY]);

  return { transform: [{ translateY }] };
}

function usePulseAnimation() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [opacity]);

  return { opacity };
}

function useRippleAnimation() {
  const scale = useRef(new Animated.Value(1.1)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.4,
            duration: 3000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 3000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [scale, opacity]);

  return { transform: [{ scale }], opacity };
}

/** Motion lines decorating the phone illustration */
const MotionLines = memo(function MotionLines({
  side,
}: {
  side: "left" | "right";
}) {
  const isLeft = side === "left";
  const position = isLeft ? { top: 40, left: -24 } : { bottom: 40, right: -24 };

  return (
    <View
      className="absolute gap-2"
      style={{
        ...position,
        alignItems: isLeft ? "flex-start" : "flex-end",
        transform: [{ rotate: "-12deg" }],
      }}
    >
      <View
        className="h-1 w-4 rounded-full"
        style={{ backgroundColor: `${C.primary}66` }}
      />
      <View
        className="h-1 w-6 rounded-full"
        style={{ backgroundColor: `${C.primary}99` }}
      />
      <View
        className="h-1 w-3 rounded-full"
        style={{ backgroundColor: `${C.primary}4D` }}
      />
    </View>
  );
});

/** The phone illustration at the center of the screen */
const PhoneIllustration = memo(function PhoneIllustration() {
  const shakeStyle = useShakeAnimation();
  const bounceStyle = useBounceAnimation();

  return (
    <Animated.View style={shakeStyle}>
      <LinearGradient
        colors={[C.primary, C.primaryDark]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          width: 96,
          height: 192,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          borderWidth: 4,
          borderColor: "white",
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* Glare overlay */}
        <View
          className="absolute top-0 right-0 h-full w-full"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        />

        {/* Notch */}
        <View
          className="mt-1 h-4 w-12 rounded-full"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        />

        {/* Screen content */}
        <View className="w-full flex-1 items-center justify-center gap-2">
          <Animated.View style={bounceStyle}>
            <MaterialIcons color="white" name="lunch-dining" size={36} />
          </Animated.View>
          <View
            className="h-1.5 w-12 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
          />
          <View
            className="h-1.5 w-8 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          />
        </View>

        {/* Home indicator */}
        <View
          className="mb-1 h-1 w-10 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
        />
      </LinearGradient>

      <MotionLines side="left" />
      <MotionLines side="right" />
    </Animated.View>
  );
});

export default function HomeScreen() {
  const pulseStyle = usePulseAnimation();
  const rippleStyle = useRippleAnimation();
  const { address, location, refreshLocation } = useLocation();
  const {
    radius,
    isLoading: isSearchRadiusLoading,
    setRadius,
  } = useSearchRadius();
  const {
    isRecommending,
    isSelectingRestaurant,
    rouletteCategories,
    rouletteIndex,
    showRecommendLoadingText,
    recommendationError,
    recommendedRestaurant,
    recommendRestaurant,
    clearRecommendation,
  } = useRestaurantRecommendation();
  const [isRadiusModalVisible, setIsRadiusModalVisible] = useState(false);

  useEffect(() => {
    void refreshLocation();
  }, [refreshLocation]);

  const handleRecommendRestaurant = useCallback(async () => {
    await recommendRestaurant(
      location,
      refreshLocation,
      isSearchRadiusLoading ? APP_CONFIG.DEFAULT_SEARCH_RADIUS : radius,
    );
  }, [
    isSearchRadiusLoading,
    location,
    radius,
    recommendRestaurant,
    refreshLocation,
  ]);

  // Shake gesture detection
  useEffect(() => {
    if (process.env.EXPO_OS === "web") {
      return;
    }

    const SHAKE_THRESHOLD = APP_CONFIG.DEFAULT_SHAKE_THRESHOLD;
    let lastShakeTime = 0;
    const SHAKE_COOLDOWN = APP_CONFIG.SHAKE_COOLDOWN;

    Accelerometer.setUpdateInterval(APP_CONFIG.SHAKE_DETECTION_INTERVAL);

    const subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      const now = Date.now();
      if (
        acceleration > SHAKE_THRESHOLD &&
        now - lastShakeTime > SHAKE_COOLDOWN
      ) {
        lastShakeTime = now;
        handleRecommendRestaurant();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [handleRecommendRestaurant]);

  const handleCloseRecommendation = useCallback(() => {
    clearRecommendation();
  }, [clearRecommendation]);

  const handleOpenRadiusModal = useCallback(() => {
    setIsRadiusModalVisible(true);
  }, []);

  const handleCloseRadiusModal = useCallback(() => {
    setIsRadiusModalVisible(false);
  }, []);

  const handleSelectRadius = useCallback(
    async (nextRadius: number) => {
      await setRadius(nextRadius);
      setIsRadiusModalVisible(false);
    },
    [setRadius],
  );

  const handleOpenMap = useCallback(async () => {
    if (!recommendedRestaurant?.placeUrl) {
      return;
    }

    const supported = await Linking.canOpenURL(recommendedRestaurant.placeUrl);
    if (!supported) {
      return;
    }

    await Linking.openURL(recommendedRestaurant.placeUrl);
  }, [recommendedRestaurant]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ShakeHomeHeader
        address={address}
        onPressRadius={handleOpenRadiusModal}
        radiusLabel={formatSearchRadius(radius)}
      />
      <ShakeHomeHero
        phoneIllustration={<PhoneIllustration />}
        pulseStyle={pulseStyle}
        rippleStyle={rippleStyle}
      />
      <ShakeHomeFooter
        isBusy={isRecommending || isSelectingRestaurant}
        onPressRecommend={handleRecommendRestaurant}
        recommendationError={recommendationError}
        showRecommendLoadingText={showRecommendLoadingText}
      />

      <RestaurantResultModal
        isRecommending={isRecommending || isSelectingRestaurant}
        isSelecting={isSelectingRestaurant}
        onClose={handleCloseRecommendation}
        onOpenMap={handleOpenMap}
        onRefresh={handleRecommendRestaurant}
        restaurant={recommendedRestaurant}
        rouletteCategories={rouletteCategories}
        rouletteIndex={rouletteIndex}
        visible={Boolean(recommendedRestaurant)}
      />
      <SearchRadiusModal
        onClose={handleCloseRadiusModal}
        onSelect={handleSelectRadius}
        options={APP_CONFIG.SEARCH_RADIUS_OPTIONS}
        selectedRadius={radius}
        visible={isRadiusModalVisible}
      />
    </SafeAreaView>
  );
}
