import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Linking, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useFindNearbyCourses } from "@/api/reactQuery/course/useFindNearbyCourses";
import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import CourseDetailCard from "@/components/card/CourseDetailCard";
import NaverMap from "@/components/NaverMap";
import LocationLoading from "@/components/organisms/LocationLoading";

export default function SearchScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const snapPoints = useMemo(() => [`${50}%`, `${100}%`], []);

  const { data: courseList = [] } = useFindNearbyCourses(location);

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
      <GestureHandlerRootView className="h-full flex-1">
        <View className="h-1/2 w-full">
          {location.latitude !== 0 && location.longitude !== 0 && (
            <NaverMap
              data={courseList}
              latitude={location.latitude}
              longitude={location.longitude}
            />
          )}
          {(location.latitude === 0 || location.longitude === 0) && (
            <LocationLoading />
          )}
        </View>
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetView className="flex-1 items-center p-4">
            <FlatList
              className="w-full"
              data={courseList}
              keyExtractor={(item) => `search_${item.id}`}
              renderItem={CourseDetailCard}
            />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </CustomSafeAreaView>
  );
}
