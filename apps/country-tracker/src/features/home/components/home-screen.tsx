import type { CountryItem } from "@/features/home/types/country";
import type { ListRenderItem } from "react-native";

import { useAtomValue } from "jotai";
import { Search } from "lucide-react-native";
import { DateTime } from "luxon";
import { useState } from "react";
import { FlatList } from "react-native";

import { themeAtom } from "@/atoms/theme.atom";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { COUNTRIES } from "@/features/home/constants/dummy";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";

export default function HomeScreen() {
  const [data, setData] = useState<CountryItem[]>(COUNTRIES);
  const [searchText, setSearchText] = useState("");
  const theme = useAtomValue(themeAtom);

  const [background, borderColor, headingColor, inputBg, textColor] =
    useThemeColor([
      "background",
      "outline-200",
      "typography-900",
      "background-50",
      "typography",
    ]);

  const formatDate = (isoDate: string) =>
    DateTime.fromISO(isoDate).toFormat("yyyy-MM-dd");

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
    <Box
      className="flex flex-row justify-between p-4 transition-colors duration-200 hover:bg-gray-50"
      style={{ backgroundColor: background }}
    >
      <Box className="flex flex-row items-center gap-4">
        <Text className="text-xl" style={{ color: textColor }}>
          {item.flag}
        </Text>
        <Text className="font-semibold text-xl" style={{ color: textColor }}>
          {item.country}
        </Text>
      </Box>
      <Text className="font-mono" style={{ color: textColor }}>
        {formatDate(item.lastVisitDate)}
      </Text>
    </Box>
  );

  return (
    <ParallaxScrollView scrollEnabled={false}>
      <VStack space="md" className="mb-4 shrink-0 px-1 pt-2">
        <Heading className="font-bold text-3xl" style={{ color: headingColor }}>
          {i18n.t("home.title")}
        </Heading>
        <Input
          className="rounded-full border px-4 py-3 shadow-xs"
          size="lg"
          style={{ backgroundColor: inputBg, borderColor }}
        >
          <InputField
            placeholder={i18n.t("home.search")}
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={() => handleSearch(searchText)}
            className="placeholder-gray-500"
            style={{ color: textColor }}
          />
          <InputSlot onPress={() => handleSearch(searchText)}>
            <InputIcon as={() => <Search color={textColor} />} />
          </InputSlot>
        </Input>
      </VStack>
      {/* FlatList의 renderItem 들을 단일 Surface(카드)로 감쌉니다. */}
      <Box
        className="mx-1 mb-2 overflow-hidden rounded-lg border bg-background-50 shadow-xs"
        style={{ backgroundColor: background, borderColor }}
      >
        <FlatList
          data={data}
          keyExtractor={(item) => `${theme}-${item.id}`}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <Divider style={{ backgroundColor: borderColor }} />
          )}
          contentContainerStyle={{
            paddingTop: 0,
            paddingBottom: 4,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Box className="flex-1 items-center justify-center p-6">
              <Text className="text-lg" style={{ color: textColor }}>
                No visited countries.
              </Text>
            </Box>
          }
        />
      </Box>
    </ParallaxScrollView>
  );
}
