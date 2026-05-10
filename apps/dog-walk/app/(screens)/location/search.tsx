import { useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useFetchSearchLocations } from "@/api/reactQuery/tmap/useFetchSearchLocations";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import LocationResultCard from "@/components/card/LocationResultCard";
import HeaderBar from "@/components/HeaderBar";
import { CloseIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function LocationSearchScreen() {
  const { type = "START" } = useLocalSearchParams();

  const [searchQuery, setSearchQeury] = useState("");

  const { data: searchResult, isFetching } =
    useFetchSearchLocations(searchQuery);

  const handleSearch = (text: string) => {
    setSearchQeury(text);
  };

  const handleReset = () => {
    setSearchQeury("");
  };

  return (
    <CustomSafeAreaView>
      <HeaderBar
        isShowBackButton={true}
        title={type === "START" ? "시작 위치 선택" : "종료 위치 선택"}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack className="flex-1 gap-2 px-6 pt-6">
            <Input className="px-3">
              <InputSlot>
                <InputIcon as={Search} />
              </InputSlot>
              <InputField
                autoFocus
                onChangeText={handleSearch}
                placeholder={"장소명, 주소 검색"}
                value={searchQuery}
              />
              {searchQuery.trim().length > 0 && (
                <InputSlot onPress={handleReset}>
                  <InputIcon as={CloseIcon} />
                </InputSlot>
              )}
            </Input>

            <FlatList
              data={searchResult}
              ItemSeparatorComponent={() => (
                <View className="h-[1px] bg-slate-200" />
              )}
              keyExtractor={(item, index) => item.id + index}
              ListEmptyComponent={
                isFetching ? (
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    검색 중...
                  </Text>
                ) : (
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    검색 결과가 없습니다.
                  </Text>
                )
              }
              ListFooterComponent={() => <View className="h-6" />}
              renderItem={({ item }) => (
                <LocationResultCard
                  item={item}
                  type={type as "START" | "END"}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </CustomSafeAreaView>
  );
}
