export interface MapGlobeRef {
  globeRotationAnimation: (
    targetLatitude: number,
    targetLongitude: number,
    duration?: number,
    zoomLevel?: number,
  ) => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
}

export type CountryProperties = {
  iso_a2?: string;
  name?: string;
};

export type AnimationState = {
  start: [number, number, number];
  lonDiff: number;
  latDiff: number;
  startTime: number;
  duration: number;
};
