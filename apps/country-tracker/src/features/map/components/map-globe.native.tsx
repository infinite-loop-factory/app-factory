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

  return (
    <MapView
      style={{ flex: 1 }}
      showsCompass={false}
      mapType="satelliteFlyover"
      region={region}
    />
  );
}
