import * as Location from "expo-location";

export async function requestLocationPermission(): Promise<boolean> {
  const result = await Location.requestForegroundPermissionsAsync();
  return result.granted;
}

export async function getLocationPermissionStatus(): Promise<boolean> {
  const result = await Location.getForegroundPermissionsAsync();
  return result.granted;
}
