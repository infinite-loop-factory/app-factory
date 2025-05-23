import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import KakaoMap from "@/components/KakaoMap";
import CourseDetailCard from "@/components/card/CourseDetailCard";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Linking } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

export default function SearchScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const snapPoints = useMemo(() => [`${50}%`, `${100}%`], []);

  const courseList = useMemo(() => {
    return [
      {
        id: "1",
        title: "서초구 산책 코스",
        image: "http://via.placeholder.com/280",
        distance: 2.1,
        totalTime: 21,
        address: "몽마르뜨 공원 (서초구)",
        rate: 4.8,
        latitude: 37.49646,
        longitude: 127.0041,
      },
      {
        id: "2",
        title: "마포구 산책 코스",
        image: "http://via.placeholder.com/280",
        distance: 2.1,
        totalTime: 21,
        address: "하늘공원 메타세콰이어길 (마포구)",
        rate: 4.6,
        latitude: 37.56527,
        longitude: 126.8834,
      },
      {
        id: "3",
        title: "노원구 산책 코스",
        image: "http://via.placeholder.com/280",
        distance: 2.1,
        totalTime: 21,
        address: "경춘선 숲길 (노원구)",
        rate: 4.4,
        latitude: 37.61977,
        longitude: 127.0815,
      },
      {
        id: "4",
        title: "강남구 산책 코스",
        image: "http://via.placeholder.com/280",
        distance: 2.1,
        totalTime: 21,
        address: "삼성 해맞이 공원",
        rate: 4.2,
        latitude: 37.51976,
        longitude: 127.062,
      },
    ];
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function getCurrentLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "위치 권한 설정",
            "위치 기반으로 추천 산책 코스를 확인하려면 위치 권한이 필요합니다.",
            [
              { text: "취소" },
              { text: "설정", onPress: () => Linking.openSettings() },
            ],
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        const { coords } = location;
        setLocation(() => ({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
      }

      getCurrentLocation();
    }, []),
  );

  return (
    <CustomSafeAreaView>
      <GestureHandlerRootView className="flex-1">
        <KakaoMap
          data={courseList}
          latitude={location.latitude}
          longitude={location.longitude}
        />
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetView className="flex-1 items-center p-4">
            <FlatList
              className="w-full"
              data={courseList}
              renderItem={CourseDetailCard}
              keyExtractor={(item) => `search_${item.id}`}
            />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </CustomSafeAreaView>
  );
}
