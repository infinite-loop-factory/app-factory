import type { MapGlobeRef } from "@/features/map/components/map-globe";

import { ThemedView } from "@/components/themed-view";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import MapGlobe from "@/features/map/components/map-globe";
import { findCountryLocation } from "@/features/map/constants/countries";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Search, Share } from "lucide-react-native";
import { useRef, useState } from "react";
import { Alert, View } from "react-native";

export default function MapScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapGlobeRef = useRef<MapGlobeRef>(null);

  const [searchText, setSearchText] = useState("");
  const [backgroundColor, inputBackgroundColor, borderColor, textColor] =
    useThemeColor(["background", "background-50", "outline-200", "typography"]);

  const handleSheetChanges = (index: number) => {
    // biome-ignore lint/suspicious/noConsole: 테스트
    console.log("handleSheetChanges", index);
  };

  const handleShare = () => {
    // biome-ignore lint/suspicious/noConsole: 테스트
    console.log("handleShare");
  };

  // * 국가 검색 및 지구본 이동 처리
  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  // * 검색 버튼 클릭 시 지구본 회전 애니메이션과 함께 이동
  const handleSearchSubmit = () => {
    if (searchText.trim() === "") return;

    const countryLocation = findCountryLocation(searchText);
    if (countryLocation) {
      // 항상 일반 회전 애니메이션 적용
      mapGlobeRef.current?.globeRotationAnimation(
        countryLocation.latitude,
        countryLocation.longitude,
        3500, // 애니메이션 지속 시간(ms)
        15, // 최종 줌 레벨
      );

      // * 크기 조절
      bottomSheetRef.current?.snapToIndex(2);
    } else {
      Alert.alert(
        i18n.t("map.alert.country-not-found.title"),
        i18n.t("map.alert.country-not-found.message"),
      );
    }
  };

  return (
    <ThemedView className="flex-1">
      <MapGlobe ref={mapGlobeRef} />

      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={["40%", "90%", "14%"]}
        enableDynamicSizing={false}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: textColor }}
      >
        <BottomSheetView className="px-4 py-2">
          <View className="mb-2 flex flex-row items-center justify-between">
            <Heading
              className="font-bold text-2xl"
              style={{ color: textColor }}
            >
              {i18n.t("map.countries")}
            </Heading>
            <View className="flex flex-row">
              <Button onPress={handleShare} variant="link" className="mr-1">
                <ButtonIcon as={Share} />
              </Button>
            </View>
          </View>

          <Input
            className="rounded-full border px-4 py-3 shadow-xs"
            size="lg"
            style={{ backgroundColor: inputBackgroundColor, borderColor }}
          >
            <InputField
              placeholder={i18n.t("map.search-placeholder")}
              value={searchText}
              onChangeText={handleSearch}
              onSubmitEditing={handleSearchSubmit}
            />
            <InputSlot onPress={handleSearchSubmit}>
              <InputIcon as={Search} />
            </InputSlot>
          </Input>
        </BottomSheetView>
      </BottomSheet>
    </ThemedView>
  );
}
