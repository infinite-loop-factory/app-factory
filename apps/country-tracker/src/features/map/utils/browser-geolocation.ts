export interface BrowserCoordinates {
  latitude: number;
  longitude: number;
}

export interface BrowserGeolocation {
  getCurrentPosition: (
    onSuccess: (position: { coords: BrowserCoordinates }) => void,
    onError?: (error: unknown) => void,
    options?: {
      enableHighAccuracy?: boolean;
      timeout?: number;
      maximumAge?: number;
    },
  ) => void;
}

interface AnimateToBrowserLocationArgs {
  geolocation: BrowserGeolocation | null | undefined;
  onSuccess: (coordinates: BrowserCoordinates) => void;
  onError?: (error: unknown) => void;
}

export function animateToBrowserLocation({
  geolocation,
  onSuccess,
  onError,
}: AnimateToBrowserLocationArgs): boolean {
  if (!geolocation) {
    return false;
  }

  geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      onError?.(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 60_000,
    },
  );

  return true;
}
