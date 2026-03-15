import type { NaverMapViewRef } from "@mj-studio/react-native-naver-map";
import type { RefObject } from "react";
import type {
  ActivityType,
  LatLng,
  TrackingModeType,
} from "@/hooks/location/use-location.ts";

import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { LocationMarker } from "@/components/features/map/markers/current-maker/maker/location-maker-bearing.tsx";
import { useGhostMarkerStore } from "@/hooks/location/use-ghost-marker-store.ts";

const TELEPORT_THRESHOLD = 100;

interface CurrentGhostLocationMarkerProps {
  size?: number;
  trackingMode: TrackingModeType;
  isLoading: boolean;
  bearingSv: SharedValue<number>;
  mapBearing: SharedValue<number>;
  locationState: LatLng;
  mapRef: RefObject<NaverMapViewRef | null>;
  isInteracting: SharedValue<boolean>;
  activity: ActivityType;
}

export function CurrentGhostLocationMarker({
  size = 120,
  trackingMode,
  isLoading,
  bearingSv,
  mapBearing,
  locationState,
  mapRef,
  isInteracting,
  activity,
}: CurrentGhostLocationMarkerProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isVisible = useSharedValue(0);
  const ghostMarkerScreenPos = useGhostMarkerStore(
    (state) => state.ghostMarkerScreenPos,
  );

  const isReady = useSharedValue(false);
  const isFirst = useSharedValue(true);
  const moveGhostMarker = async ({ latitude, longitude }: LatLng) => {
    if (!mapRef.current) return;

    if (isInteracting.value) isReady.value = false;
    const screenPos = await mapRef.current.coordinateToScreen({
      latitude,
      longitude,
    });

    if (screenPos) {
      const targetX = screenPos.screenX - size / 2;
      const targetY = screenPos.screenY - size / 2;

      ghostMarkerScreenPos.value = {
        x: screenPos.screenX,
        y: screenPos.screenY,
      };

      const dx = targetX - translateX.value;
      const dy = targetY - translateY.value;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const shouldTeleport =
        isVisible.value === 0 || distance > TELEPORT_THRESHOLD;

      if (shouldTeleport) {
        cancelAnimation(translateX);
        cancelAnimation(translateY);
        translateX.value = targetX;
        translateY.value = targetY;
      } else {
        translateX.value = withTiming(targetX, {
          duration: isInteracting.value ? 0 : 800,
          easing: Easing.linear,
        });
        translateY.value = withTiming(targetY, {
          duration: isInteracting.value ? 0 : 800,
          easing: Easing.linear,
        });
      }

      setTimeout(() => {
        isReady.value = true;
      }, 10);
    }
  };

  useAnimatedReaction(
    () => locationState,
    (currLoc, prevLoc) => {
      if (
        prevLoc?.latitude !== currLoc.latitude ||
        prevLoc?.longitude !== currLoc.longitude
      ) {
        scheduleOnRN(moveGhostMarker, currLoc);
      }
    },
    [locationState],
  );

  useAnimatedReaction(
    () => isInteracting.value,
    (now, prev) => {
      if (now) {
        isVisible.value = 0;
      } else if (isFirst.value || (!now && prev)) {
        if (isFirst.value) {
          isFirst.value = false;
        }
        scheduleOnRN(moveGhostMarker, locationState);

        isVisible.value = withDelay(105, withTiming(1, { duration: 0 }));
      }
    },
    [locationState],
  );

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity:
        activity === "Stationary"
          ? 0
          : isVisible.value * (isReady.value ? 1 : 0),
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
      <Animated.View
        style={[
          styles.markerContainer,
          { width: size, height: size },
          containerStyle,
        ]}
      >
        <LocationMarker
          bearingSv={bearingSv}
          isLoading={isLoading}
          mapBearing={mapBearing}
          size={size}
          trackingMode={trackingMode}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
});
