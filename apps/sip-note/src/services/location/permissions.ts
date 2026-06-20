import * as Location from "expo-location";

export async function requestLocationPermission(): Promise<boolean> {
  const result = await Location.requestForegroundPermissionsAsync();
  return result.granted;
}

export async function getLocationPermissionStatus(): Promise<boolean> {
  const result = await Location.getForegroundPermissionsAsync();
  return result.granted;
}

/**
 * 백그라운드 위치 권한(iOS "항상 허용")을 요청한다.
 * 지오펜싱은 포그라운드 권한이 선행되어야 하므로 호출 측에서 foreground → background 순서로 요청한다.
 * 거부 시 false 반환(지오펜싱 graceful no-op).
 */
export async function requestBackgroundLocationPermission(): Promise<boolean> {
  const result = await Location.requestBackgroundPermissionsAsync();
  return result.granted;
}

export async function getBackgroundLocationPermissionStatus(): Promise<boolean> {
  const result = await Location.getBackgroundPermissionsAsync();
  return result.granted;
}
