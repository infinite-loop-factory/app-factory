import type { ActivityType } from "@/hooks/location/use-location.ts";

import { Platform } from "react-native";
import Animated, {
  SensorType,
  type SharedValue,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import {
  LocationMarkerIcon,
  type LocationMarkerIconProps,
} from "@/components/features/map/markers/current-maker/maker/location-maker.tsx";

export type LocationMakerProps = LocationMarkerIconProps & {
  bearingSv: SharedValue<number>;
  mapBearing: SharedValue<number>;
  activity: ActivityType;
  courseBearing?: SharedValue<number>;
};

export function LocationMarker({
  size = 120,
  trackingMode,
  isLoading,
  bearingSv,
  mapBearing,
  activity,
  courseBearing,
}: LocationMakerProps) {
  const sensor = useAnimatedSensor(SensorType.ROTATION, { interval: 16 });
  const sensorRotation = useDerivedValue(() => {
    const { qw, qx, qy, qz } = sensor.sensor.value;
    const siny_cosp = 2 * (qw * qz + qx * qy);
    const cosy_cosp = 1 - 2 * (qy * qy + qz * qz);
    let deg = (Math.atan2(siny_cosp, cosy_cosp) * 180) / Math.PI;
    if (Platform.OS === "android") deg = -deg;
    if (deg < 0) deg += 360;
    return deg;
  });

  const bearingRotation = useDerivedValue(() => {
    const isMovingFast =
      activity === "Cycling" ||
      activity === "Automotive" ||
      activity === "Flying";

    if (isMovingFast && courseBearing) {
      bearingSv.value = courseBearing.value;
      return courseBearing.value;
    }

    bearingSv.value = sensorRotation.value;
    return sensorRotation.value;
  });

  const animatedRotationStyle = useAnimatedStyle(() => {
    if (trackingMode === "Face") {
      return { transform: [{ rotate: "0deg" }] };
    }
    const currentDeg = bearingRotation.value;
    const mapDeg = mapBearing?.value ?? 0;
    return {
      transform: [{ rotate: `${currentDeg - mapDeg}deg` }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        animatedRotationStyle,
      ]}
    >
      <LocationMarkerIcon
        isLoading={isLoading}
        size={size}
        trackingMode={trackingMode}
      />
    </Animated.View>
  );
}
