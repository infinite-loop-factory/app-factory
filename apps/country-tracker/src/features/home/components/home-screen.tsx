import type { ListRenderItem } from "react-native";
import type { CountryItem } from "@/features/home/types/country";

import { Motion } from "@legendapp/motion";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Map as MapIcon, Search } from "lucide-react-native";
import { DateTime } from "luxon";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { themeAtom } from "@/atoms/theme.atom";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import supabase from "@/libs/supabase";
import { fetchVisitedCountries } from "@/utils/visited-countries";

export default function HomeScreen() {
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["visited-countries", searchText],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return [];
      return await fetchVisitedCountries(user.id);
    },
    select: (allCountries) =>
      searchText.trim()
        ? allCountries.filter((item) =>
            item.country.toLowerCase().includes(searchText.toLowerCase()),
          )
        : allCountries,
  });

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const renderItem: ListRenderItem<CountryItem> = ({ item, index }) => (
    <Motion.View
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ type: "timing", duration: 300, delay: index * 50 }}
    >
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
        <Box className="flex flex-row items-center gap-2">
          <Text className="font-mono" style={{ color: textColor }}>
            {formatDate(item.endDate)}
          </Text>
          {item.stayDays > 0 && (
            <Badge size="sm">
              <BadgeText>+{item.stayDays}</BadgeText>
            </Badge>
          )}
        </Box>
      </Box>
    </Motion.View>
  );

  return (
    <ParallaxScrollView scrollEnabled={false}>
      <VStack className="mb-4 shrink-0 px-1 pt-2" space="md">
        <Heading className="font-bold text-3xl" style={{ color: headingColor }}>
          {i18n.t("home.title")}
        </Heading>
        <Input
          className="rounded-full border px-4 py-3 shadow-xs"
          size="lg"
          style={{ backgroundColor: inputBg, borderColor }}
        >
          <InputField
            className="placeholder-gray-500"
            onChangeText={handleSearch}
            onSubmitEditing={() => handleSearch(searchText)}
            placeholder={i18n.t("home.search")}
            style={{ color: textColor }}
            value={searchText}
          />
          <InputSlot onPress={() => handleSearch(searchText)}>
            <InputIcon as={() => <Search color={textColor} />} />
          </InputSlot>
        </Input>
      </VStack>
      <Box
        className="mx-1 mb-2 overflow-hidden rounded-lg border bg-background-50 shadow-xs"
        style={{ backgroundColor: background, borderColor }}
      >
        {isError ? (
          <Box className="flex-1 items-center justify-center p-6">
            <Text className="text-lg" style={{ color: textColor }}>
              Error loading countries.
            </Text>
          </Box>
        ) : (
          <Skeleton className="h-[300px] w-full" isLoaded={!isLoading}>
            {!data || data?.length === 0 ? (
              <View className="flex-1 items-center justify-center p-10">
                <MapIcon color={textColor} size={48} />
                <Text
                  className="mt-4 text-center text-lg"
                  style={{ color: textColor }}
                >
                  {i18n.t("home.no-visited-countries")}
                </Text>
                <Text
                  className="mt-2 text-center text-sm"
                  style={{ color: textColor }}
                >
                  {i18n.t("home.no-visited-countries-description")}
                </Text>
              </View>
            ) : (
              <FlatList
                contentContainerStyle={{
                  paddingTop: 0,
                  paddingBottom: 4,
                }}
                data={data}
                ItemSeparatorComponent={() => (
                  <Divider style={{ backgroundColor: borderColor }} />
                )}
                keyExtractor={(item) => `${theme}-${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </Skeleton>
        )}
      </Box>
    </ParallaxScrollView>
  );
}
