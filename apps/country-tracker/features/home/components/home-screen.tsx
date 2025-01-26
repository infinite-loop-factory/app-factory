import type { CountryItem } from "@/features/home/types/country";
import type { ListRenderItem } from "react-native";

import { Search } from "lucide-react-native";
import { DateTime } from "luxon";
import { useState } from "react";
import { FlatList } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { COUNTRIES } from "@/features/home/constants/dummy";

export default function HomeScreen() {
  const [data, setData] = useState<CountryItem[]>(COUNTRIES);
  const [searchText, setSearchText] = useState("");

  const formatDate = (isoDate: string) => {
    return DateTime.fromISO(isoDate).toFormat("yyyy-MM-dd");
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setData(COUNTRIES);
    } else {
      const filteredData = COUNTRIES.filter((item) =>
        item.country.toLowerCase().includes(text.toLowerCase()),
      );
      setData(filteredData);
    }
  };

  const renderItem: ListRenderItem<CountryItem> = ({ item }) => (
    <VStack>
      <Box className="mt-4 flex flex-row justify-between p-2">
        <Box className="flex flex-1 flex-row gap-2">
          <Text className="text-lg">{item.flag}</Text>
          <Text className="text-lg">{item.country}</Text>
        </Box>
        <Text className="text-gray-500" style={{ fontFamily: "SpaceMono" }}>
          {formatDate(item.lastVisitDate)}
        </Text>
      </Box>
      <Divider className="my-0.5" />
    </VStack>
  );

  return (
    <ParallaxScrollView scrollEnabled={false}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <VStack space="md" className="p-2 shadow-sm">
            <Heading className="text-2xl text-typography-900">
              Visited Countries
            </Heading>
            <Input className="p-2">
              <InputField
                placeholder="Search..."
                value={searchText}
                onChangeText={handleSearch}
                onSubmitEditing={() => handleSearch(searchText)}
              />
              <InputSlot onPress={() => handleSearch(searchText)}>
                <InputIcon as={Search} />
              </InputSlot>
            </Input>
          </VStack>
        }
        ListHeaderComponentStyle={{
          backgroundColor: "#fff", // TODO: 테마 적용
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      />
    </ParallaxScrollView>
  );
}
