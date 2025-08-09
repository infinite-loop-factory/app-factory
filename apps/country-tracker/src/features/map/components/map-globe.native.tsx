import type { Region } from "react-native-maps";

import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, Easing } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import { fetchVisitedCountries } from "@/utils/visited-countries";

export interface MapGlobeRef {
  globeRotationAnimation: (
    targetLatitude: number,
    targetLongitude: number,
    duration?: number,
    zoomLevel?: number,
  ) => void;
}

const MAX_ZOOM_LEVEL = 100;

// 경도를 -180 ~ 180 범위로 정규화하는 함수
const normalizeLongitude = (lngParam: number): number => {
  let lng = lngParam % 360;
  if (lng > 180) {
    lng = lng - 360;
  }
  if (lng < -180) {
    lng = lng + 360;
  }
  return lng;
};

// 두 경도 사이의 최단 거리를 계산하는 함수 (항상 -180 ~ 180 범위의 결과 반환)
const calculateLongitudeDifference = (start: number, end: number): number => {
  const directDiff = normalizeLongitude(end - start);

  // 최단 경로 계산 (왼쪽 또는 오른쪽 중 더 가까운 쪽)
  if (Math.abs(directDiff) > 180) {
    // 180도 이상 차이나면 반대 방향으로 이동하는 것이 더 가까움
    return directDiff > 0
      ? directDiff - 360 // 동쪽 방향이면 서쪽으로 이동
      : directDiff + 360; // 서쪽 방향이면 동쪽으로 이동
  }

  return directDiff; // 180도 이하면 직접 이동
};

const MapGlobe = forwardRef<MapGlobeRef>((_, ref) => {
  const mapRef = useRef<MapView>(null);
  const { user } = useAuthUser();
  const [primaryColor] = useThemeColor(["primary-500"]);
  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 75,
    longitudeDelta: 75,
  });

  const { data: countryPolygons } = useQuery({
    queryKey: QUERY_KEYS.countryPolygons(user?.id ?? null),
    queryFn: async () => {
      if (!user) return [];
      const visited = await fetchVisitedCountries(user.id);
      const countryCodes = visited.map((v) => v.country_code);
      const polygons = await Promise.all(
        countryCodes.map(async (code) => {
          try {
            const data = await import(
              `@/assets/geodata/countries/${code}.json`
            );
            return { ...data, country_code: code };
          } catch {
            return null;
          }
        }),
      );
      return polygons.filter(Boolean);
    },
    enabled: !!user,
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
        mapRef.current?.animateToRegion(newRegion, 0);
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
      });
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
      mapType="satelliteFlyover"
      onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      ref={mapRef}
      region={region}
      showsCompass={false}
      style={{ flex: 1 }}
    >
      {countryPolygons?.map((polygonData) =>
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
            fillColor={`${primaryColor}80`}
            key={`${polygonData.country_code}_${index}`}
            strokeColor={primaryColor}
            strokeWidth={1}
          />
        )),
      )}
    </MapView>
  );
});

export default MapGlobe;
