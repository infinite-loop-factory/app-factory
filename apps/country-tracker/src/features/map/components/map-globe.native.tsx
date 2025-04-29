import type { Region } from "react-native-maps";

import * as Location from "expo-location";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import MapView from "react-native-maps";

export interface MapGlobeRef {
  moveToLocation: (latitude: number, longitude: number) => void;
}

const MapGlobe = forwardRef<MapGlobeRef>((_, ref) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 75,
    longitudeDelta: 75,
  });

  useImperativeHandle(ref, () => ({
    moveToLocation: (latitude: number, longitude: number) => {
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 25,
        longitudeDelta: 25,
      };

      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1500);
    },
  }));

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
      ref={mapRef}
      style={{ flex: 1 }}
      showsCompass={false}
      mapType="satelliteFlyover"
      region={region}
    />
  );
});

export default MapGlobe;
