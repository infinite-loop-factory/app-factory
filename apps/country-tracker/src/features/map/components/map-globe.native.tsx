import * as Location from "expo-location";
import { useEffect, useState } from "react";
import MapView from "react-native-maps";

export default function MapGlobe() {
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 75,
    longitudeDelta: 75,
  });

  useEffect(() => {
    (async () => {
      // 위치 권한 및 현재 위치 로직 (실제 기기/에뮬레이터에서만 동작)
      const location = await Location.getCurrentPositionAsync();
      if (location) {
        setRegion((prev) => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      }
    })();
  }, []);

  // 네이티브 환경에서 MapView 사용
  return (
    <MapView
      style={{ flex: 1 }}
      showsCompass={false}
      mapType="satelliteFlyover"
      region={region}
    />
  );
}
