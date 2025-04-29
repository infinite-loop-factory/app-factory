import type { MapGlobeRef } from "@/features/map/components/map-globe";

import { ThemedView } from "@/components/ThemedView";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import MapGlobe from "@/features/map/components/map-globe";
import { findCountryLocation } from "@/features/map/constants/countries";
import { useThemeColor } from "@/hooks/useThemeColor";
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

  // * 검색 버튼 클릭 시 지구본 이동
  const handleSearchSubmit = () => {
    if (searchText.trim() === "") return;

    const countryLocation = findCountryLocation(searchText);
    if (countryLocation) {
      mapGlobeRef.current?.moveToLocation(
        countryLocation.latitude,
        countryLocation.longitude,
      );

      // * 크기 조절
      bottomSheetRef.current?.snapToIndex(2);
    } else {
      Alert.alert(
        "국가를 찾을 수 없습니다",
        "검색한 국가를 찾을 수 없습니다. 다른 국가 이름을 입력해보세요.",
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
              Countries
            </Heading>
            <Button onPress={handleShare} variant="link" className="mr-1">
              <ButtonIcon as={Share} />
            </Button>
          </View>

          <Input
            className="rounded-full border px-4 py-3 shadow-xs"
            size="lg"
            style={{ backgroundColor: inputBackgroundColor, borderColor }}
          >
            <InputField
              placeholder="Search for a country..."
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
