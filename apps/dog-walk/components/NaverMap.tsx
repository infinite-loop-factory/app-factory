import type { CourseRow } from "@/types/course";

import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import { useMemo, useRef } from "react";
import { Image } from "react-native";
import Images from "@/assets/images";

interface INaverMapProps {
  latitude: number;
  longitude: number;
  data: CourseRow[];
}

export default function NaverMap({
  latitude,
  longitude,
  data,
}: INaverMapProps) {
  const mapRef = useRef(null);

  const camera = useMemo(
    () => ({
      latitude: Number(latitude ?? 37.5665),
      longitude: Number(longitude ?? 126.978),
      zoom: 16,
    }),
    [latitude, longitude],
  );

  return (
    <NaverMapView
      camera={camera}
      isShowZoomControls={false}
      ref={mapRef}
      style={{ flex: 1 }}
    >
      {/* NOTE: 현위치 표시 */}
      <NaverMapMarkerOverlay
        anchor={{ x: 0.5, y: 0.5 }}
        height={45}
        latitude={camera.latitude}
        longitude={camera.longitude}
        width={45}
      >
        <Image
          className="h-full w-full"
          source={Images.currentLocationPinIcon}
        />
      </NaverMapMarkerOverlay>
      {/* NOTE: 코스 데이터의 시작위치 표시  */}
      {data.map((item) => (
        <NaverMapMarkerOverlay
          anchor={{ x: 0.5, y: 0.5 }}
          height={40}
          key={`location_data_${item.id}`}
          latitude={item.start_lat}
          longitude={item.start_lng}
          width={40}
        >
          <Image className="h-full w-full" source={Images.mapPinIcon} />
        </NaverMapMarkerOverlay>
      ))}
    </NaverMapView>
  );
}
