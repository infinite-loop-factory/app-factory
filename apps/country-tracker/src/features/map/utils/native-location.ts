export interface CurrentCoordinates {
  latitude: number;
  longitude: number;
}

interface PermissionResponse {
  status: string;
}

interface PositionResponse {
  coords: CurrentCoordinates;
}

export interface ForegroundLocationApi {
  getForegroundPermissionsAsync: () => Promise<PermissionResponse>;
  requestForegroundPermissionsAsync: () => Promise<PermissionResponse>;
  getCurrentPositionAsync: () => Promise<PositionResponse>;
}

export async function getCurrentCoordinates(
  locationApi: ForegroundLocationApi,
): Promise<CurrentCoordinates | null> {
  try {
    const existingPermission =
      await locationApi.getForegroundPermissionsAsync();

    let status = existingPermission.status;
    if (status !== "granted") {
      const requestedPermission =
        await locationApi.requestForegroundPermissionsAsync();
      status = requestedPermission.status;
    }

    if (status !== "granted") {
      return null;
    }

    const location = await locationApi.getCurrentPositionAsync();
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch {
    return null;
  }
}
