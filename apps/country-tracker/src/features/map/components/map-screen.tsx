import { ThemedView } from "@/components/ThemedView";
import { useAsyncEffect, usePlatform } from "@reactuses/core";
import { noop } from "es-toolkit";
import * as Location from "expo-location";
import { useState } from "react";
import MapView from "react-native-maps";

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { platform } = usePlatform();

  useAsyncEffect(
    async () => {
      const location = await Location.getCurrentPositionAsync();
      if (location) {
        setRegion((prev) => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      }
    },
    noop,
    [],
  );

  return (
    <ThemedView className="flex-1">
      <MapView
        style={{ flex: 1 }}
        showsCompass={false}
        // 플랫폼별 mapType 설정
        // iOS: hybridFlyover, 안드로이드: satellite
        mapType={platform === "android" ? "satellite" : "hybridFlyover"}
        region={region}
      />
    </ThemedView>
  );
}
