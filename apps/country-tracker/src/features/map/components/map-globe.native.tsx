import type { Region } from "react-native-maps";
import type { CountryPolygon } from "@/features/map/types/country-polygon";
import type { MapGlobeRef } from "@/features/map/types/map-globe";

import * as Location from "expo-location";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, Easing, Platform } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import {
  VISITED_FILL_OPACITY,
  VISITED_STROKE_WIDTH_NATIVE,
} from "@/features/map/constants/style";
import { useVisitedCountrySummariesQuery } from "@/features/map/hooks/use-visited-country-summaries";
import {
  getCountryPolygon,
  normalizeCountryCode,
} from "@/features/map/utils/country-polygons";
import {
  addAlphaToColor,
  calculateLongitudeDifference,
  normalizeLongitude,
} from "@/features/map/utils/globe-helpers";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";

const MAX_ZOOM_LEVEL = 100;

type MapGlobeProps = {
  year: number;
};

const MapGlobe = forwardRef<MapGlobeRef, MapGlobeProps>(({ year }, ref) => {
  const mapRef = useRef<MapView>(null);
  const { user } = useAuthUser();
  const [primaryColor] = useThemeColor(["primary-500"]);
  const polygonFillColor = addAlphaToColor(
    primaryColor,
    VISITED_FILL_OPACITY,
    `rgba(0, 0, 0, ${VISITED_FILL_OPACITY})`,
  );
  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 75,
    longitudeDelta: 75,
  });

  const { data: countryPolygons = [] } = useVisitedCountrySummariesQuery<
    CountryPolygon[]
  >({
    userId: user?.id ?? null,
    year,
    select: (summaries) => {
      const uniqueCodes = Array.from(
        new Set(
          summaries.map((summary) => summary.countryCode).filter(Boolean),
        ),
      ) as string[];

      return uniqueCodes
        .map((raw) => {
          const normalized = normalizeCountryCode(raw);
          if (!normalized) return null;
          const polygon = getCountryPolygon(normalized);
          return polygon ? { ...polygon, country_code: normalized } : null;
        })
        .filter((polygon): polygon is CountryPolygon => polygon !== null);
    },
  });

  // 애니메이션 값 생성
  const animatedValue = useRef(new Animated.Value(0)).current;

  // 애니메이션을 위한 상태 추가
  const animationState = useRef({
    isAnimating: false,
    startLat: 0,
    startLng: 0,
    targetLat: 0,
    targetLng: 0,
    routeWaypoints: [] as { latitude: number; longitude: number }[],
  });

  useImperativeHandle(ref, () => ({
    // 지구본 회전
    globeRotationAnimation: (
      targetLatitude: number,
      targetLongitude: number,
      duration = 3000,
      zoomLevel = 25,
    ) => {
      const startLat = region.latitude;
      const startLng = normalizeLongitude(region.longitude);
      const endLng = normalizeLongitude(targetLongitude);
      const lngDiff = calculateLongitudeDifference(startLng, endLng);

      // 항상 최단 경로로 이동 상태 저장
      animationState.current = {
        isAnimating: true,
        startLat,
        startLng,
        targetLat: targetLatitude,
        targetLng: endLng,
        routeWaypoints: [],
      };

      // 단계 수 및 애니메이션 초기화
      const steps = 60;
      animatedValue.setValue(0);

      const listenerID = animatedValue.addListener(({ value }) => {
        const progress = value / steps;
        // 줌 아웃/인 효과
        let currentZoom = zoomLevel;
        if (progress < 0.25) {
          currentZoom =
            zoomLevel + (MAX_ZOOM_LEVEL - zoomLevel) * (progress / 0.25);
        } else if (progress > 0.75) {
          currentZoom =
            MAX_ZOOM_LEVEL -
            (MAX_ZOOM_LEVEL - zoomLevel) * ((progress - 0.75) / 0.25);
        } else {
          currentZoom = MAX_ZOOM_LEVEL;
        }

        // 최단 경로로 직접 이동
        const currentLat = startLat + (targetLatitude - startLat) * progress;
        const currentLng = normalizeLongitude(startLng + lngDiff * progress);

        const newRegion = {
          latitude: currentLat,
          longitude: currentLng,
          latitudeDelta: currentZoom,
          longitudeDelta: currentZoom,
        };
        // Keep region in sync for both platforms
        mapRef.current?.animateToRegion(newRegion, 0);

        // Android: apply subtle tilt for faux-3D
        if (Platform.OS === "android") {
          mapRef.current?.animateCamera(
            {
              center: { latitude: currentLat, longitude: currentLng },
              pitch: 35,
              heading: 0,
            },
            { duration: 0 },
          );
        }
      });

      Animated.timing(animatedValue, {
        toValue: steps,
        duration,
        useNativeDriver: false,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }).start(() => {
        animatedValue.removeListener(listenerID);
        animationState.current.isAnimating = false;
        const finalRegion = {
          latitude: targetLatitude,
          longitude: normalizeLongitude(targetLongitude),
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        };
        mapRef.current?.animateToRegion(finalRegion, 300);
        if (Platform.OS === "android") {
          mapRef.current?.animateCamera(
            {
              center: {
                latitude: targetLatitude,
                longitude: normalizeLongitude(targetLongitude),
              },
              pitch: 35,
              heading: 0,
            },
            { duration: 300 },
          );
        }
      });
    },
    zoomIn: () => {
      setRegion((prev) => ({
        ...prev,
        latitudeDelta: Math.max(prev.latitudeDelta * 0.5, 0.01),
        longitudeDelta: Math.max(prev.longitudeDelta * 0.5, 0.01),
      }));
    },
    zoomOut: () => {
      setRegion((prev) => ({
        ...prev,
        latitudeDelta: Math.min(prev.latitudeDelta * 1.5, 100),
        longitudeDelta: Math.min(prev.longitudeDelta * 1.5, 100),
      }));
    },
  }));

  useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync();
      if (location) {
        setRegion((prev) => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: normalizeLongitude(location.coords.longitude),
        }));
      }
    })();
  }, []);

  return (
    <MapView
      mapType={Platform.OS === "ios" ? "satelliteFlyover" : "terrain"}
      onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      ref={mapRef}
      region={region}
      showsCompass={false}
      style={{ flex: 1 }}
    >
      {countryPolygons.map((polygonData) =>
        polygonData.coordinates.map((coords: number[][], index: number) => (
          <Polygon
            coordinates={coords
              .filter(
                ([longitude, latitude]: number[]) =>
                  typeof latitude === "number" && typeof longitude === "number",
              )
              .map(([longitude, latitude]: number[]) => ({
                latitude: latitude as number,
                longitude: longitude as number,
              }))}
            fillColor={polygonFillColor}
            key={`${polygonData.country_code}_${index}`}
            strokeColor={primaryColor}
            strokeWidth={VISITED_STROKE_WIDTH_NATIVE}
          />
        )),
      )}
    </MapView>
  );
});

export default MapGlobe;
