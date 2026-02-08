import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import { router, useLocalSearchParams } from "expo-router";
import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { Image, View } from "react-native";
import Images from "@/assets/images";
import { endPointAtom, startPointAtom } from "@/atoms/pointAtom";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import HeaderBar from "@/components/HeaderBar";
import { Button, ButtonText } from "@/components/ui/button";

export default function LocationConfirmScreen() {
  const { type = "START", name, frontLat, frontLon } = useLocalSearchParams();

  const mapRef = useRef(null);

  const [camera, _setCamera] = useState<{
    latitude: number;
    longitude: number;
    zoom: number;
  }>({
    latitude: Number(frontLat ?? 37.5665),
    longitude: Number(frontLon ?? 126.978),
    zoom: 16,
  });

  const setStartPoint = useSetAtom(startPointAtom);
  const setEndPoint = useSetAtom(endPointAtom);

  const handleConfirm = () => {
    const locationData = {
      latitude: Number(frontLat),
      longitude: Number(frontLon),
      name: String(name),
    };

    if (type === "START") {
      setStartPoint(locationData);
    } else {
      setEndPoint(locationData);
    }

    router.back();

    setTimeout(() => {
      router.back();
    }, 100);
  };

  return (
    <CustomSafeAreaView>
      <HeaderBar
        isShowBackButton={true}
        title={type === "START" ? "시작 위치 확인" : "종료 위치 확인"}
      />
      <NaverMapView camera={camera} ref={mapRef} style={{ flex: 1 }}>
        <NaverMapMarkerOverlay
          anchor={{ x: 0.5, y: 0.5 }}
          height={40}
          latitude={camera.latitude}
          longitude={camera.longitude}
          width={40}
        >
          <Image className="h-full w-full" source={Images.mapPinIcon} />
        </NaverMapMarkerOverlay>
      </NaverMapView>
      <View className="p-6">
        <Button onPress={handleConfirm}>
          <ButtonText>확인</ButtonText>
        </Button>
      </View>
    </CustomSafeAreaView>
  );
}
