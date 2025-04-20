import { ThemedView } from "@/components/ThemedView";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import MapGlobe from "@/features/map/components/map-globe";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Search, Share } from "lucide-react-native";
import { useRef, useState } from "react";
import { View } from "react-native";

export default function MapScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
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

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <ThemedView className="flex-1">
      <MapGlobe />

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
            />
            <InputSlot>
              <InputIcon as={Search} />
            </InputSlot>
          </Input>
        </BottomSheetView>
      </BottomSheet>
    </ThemedView>
  );
}
