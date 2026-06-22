import * as Location from "expo-location";
import {
  getLocationPermissionStatus,
  requestLocationPermission,
} from "./permissions";

export type LocationCoords = {
  latitude: number;
  longitude: number;
};

export async function getCurrentPosition(): Promise<LocationCoords | null> {
  const granted = await requestLocationPermission();
  if (!granted) return null;
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export async function getLastKnownPosition(): Promise<LocationCoords | null> {
  const granted = await getLocationPermissionStatus();
  if (!granted) return null;
  const position = await Location.getLastKnownPositionAsync();
  if (!position) return null;
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export {
  getBackgroundLocationPermissionStatus,
  getLocationPermissionStatus,
  requestBackgroundLocationPermission,
  requestLocationPermission,
} from "./permissions";
