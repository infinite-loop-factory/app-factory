import {
  type Coord,
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
  type NaverMapViewRef,
  type Region,
} from "@mj-studio/react-native-naver-map";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Image } from "react-native";
import Images from "@/assets/images";

interface IDetailMapProps {
  path: { lat: number; lon: number }[];
  start: { latitude: number; longitude: number };
  end: { latitude: number; longitude: number };
}

export default function DetailMap({ path, start, end }: IDetailMapProps) {
  const screenWidth = Dimensions.get("window").width;

  const mapRef = useRef<NaverMapViewRef | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const coords: Coord[] = useMemo(() => {
    const converted = path.map((p) => ({
      latitude: p.lat,
      longitude: p.lon,
    }));

    return converted;
  }, [path]);

  useEffect(() => {
    if (!(mapReady && mapRef.current) || coords.length < 2) return;

    if (!(start && end)) return;

    mapRef.current.animateCameraWithTwoCoords({
      coord1: start,
      coord2: end,
      duration: 500,
      easing: "EaseOut",
    });
  }, [coords, mapReady, start, end]);

  const initialRegion: Region | undefined = useMemo(() => {
    if (!coords || coords.length === 0) return undefined;
    return {
      latitude: coords[0]?.latitude ?? 36,
      longitude: coords[0]?.longitude ?? 127,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [coords]);

  return (
    <NaverMapView
      initialRegion={initialRegion}
      isShowScaleBar={false}
      isShowZoomControls={false}
      mapPadding={{ right: 18, left: 18 }}
      onInitialized={() => setMapReady(true)}
      ref={mapRef}
      style={{
        flex: 1,
        width: "100%",
        height: screenWidth,
        marginVertical: 24,
      }}
    >
      {coords.length >= 2 && <NaverMapPathOverlay coords={coords} width={6} />}

      {start && (
        <NaverMapMarkerOverlay
          height={40}
          latitude={start.latitude}
          longitude={start.longitude}
          width={50}
        >
          <Image className="h-full w-full" source={Images.startPinIcon} />
        </NaverMapMarkerOverlay>
      )}

      {end && (
        <NaverMapMarkerOverlay
          height={40}
          latitude={end.latitude}
          longitude={end.longitude}
          width={50}
        >
          <Image className="h-full w-full" source={Images.endPinIcon} />
        </NaverMapMarkerOverlay>
      )}
    </NaverMapView>
  );
}
