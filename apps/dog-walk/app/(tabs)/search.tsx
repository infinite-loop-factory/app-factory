import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import CourseDetailCard from "@/components/card/CourseDetailCard";
import { Text } from "@/components/ui/text";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Linking, StyleSheet } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function SearchScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const snapPoints = useMemo(() => [`${50}%`, `${100}%`], []);

  const courseList = useMemo(() => {
    return [
      {
        id: "1",
        title: "추천 산책 코스 1",
        image: "http://via.placeholder.com/280",
        distance: 2.1,
        totalTime: 21,
        address: "몽마르뜨 공원 (서초구)",
        rate: 4.8,
      },
      {
        id: "2",
        title: "추천 산책 코스 2",
        image: "http://via.placeholder.com/280",
        distance: 2.1,
        totalTime: 21,
        address: "하늘공원 메타세콰이어길 (마포구)",
        rate: 4.6,
      },
      {
        id: "3",
        title: "도시 공원 코스 3",
        image: "http://via.placeholder.com/280",
        distance: 2.1,
        totalTime: 21,
        address: "경춘선 숲길 (노원구)",
        rate: 4.4,
      },
      {
        id: "4",
        title: "도시 공원 코스 4",
        image: "http://via.placeholder.com/280",
        distance: 2.1,
        totalTime: 21,
        address: "강남구 삼성동",
        rate: 4.2,
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
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.5665,
            longitude: 126.978,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* {location && <Marker coordinate={location} title="현재 위치" />} */}
        </MapView>
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetView className="flex-1 items-center p-4">
            <Text>
              {location.latitude} {location.longitude}
            </Text>
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

const styles = StyleSheet.create({
  map: {
    width: "100%",
    flex: 1,
  },
});
