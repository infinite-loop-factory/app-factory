import type { User } from "@supabase/supabase-js";
import type { CountryItem } from "@/types/country-item";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useSetAtom } from "jotai";
import {
  CalendarDays,
  Globe2,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { themeAtom } from "@/atoms/theme.atom";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { locationQueryKeys } from "@/features/location/apis/query-keys";
import { fetchVisitedCountries } from "@/features/map/apis/fetch-visited-countries";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";
import supabase from "@/lib/supabase";
import { getFlagUri, getStayDays, resolveRegion } from "@/utils/country-region";
import { formatIsoDate } from "@/utils/format-date";

type FilterOption =
  | "recent"
  | "mostDays"
  | "europe"
  | "asia"
  | "americas"
  | "africa"
  | "oceania";

export default function HomeScreen() {
  const setTheme = useSetAtom(themeAtom);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("recent");
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("recent");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const sheetSnapPoints = useMemo(() => ["48%"], []);

  const [
    screenBg,
    cardBg,
    borderColor,
    textMuted,
    textStrong,
    primaryColor,
    warningSurface,
    warningText,
    secondarySurface,
  ] = useThemeColor([
    "background-50",
    "background",
    "outline-100",
    "typography-400",
    "typography-900",
    "primary-300",
    "warning-0",
    "warning-600",
    "secondary-0",
  ]);

  useEffect(() => {
    setSelectedFilter(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    setTheme("light");
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user ?? null);
      setUserLoaded(true);
    });
  }, [setTheme]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      ...locationQueryKeys.visitedCountries(searchText),
      currentUser?.id ?? "guest",
    ],
    enabled: Boolean(currentUser?.id),
    queryFn: async () => {
      if (!currentUser?.id) return [] as CountryItem[];
      return await fetchVisitedCountries(currentUser.id);
    },
    select: (allCountries) =>
      searchText.trim()
        ? allCountries.filter((item) =>
            item.country.toLowerCase().includes(searchText.toLowerCase()),
          )
        : allCountries,
  });

  const greetingName =
    currentUser?.user_metadata?.full_name ?? i18n.t("home.default-name");

  const safeCountries = data ?? [];

  const trackedDays = useMemo(
    () => safeCountries.reduce((sum, item) => sum + getStayDays(item), 0),
    [safeCountries],
  );

  const sortedCountries = useMemo(() => {
    const regionFilters: FilterOption[] = [
      "europe",
      "asia",
      "americas",
      "africa",
      "oceania",
    ];

    const regionFiltered = safeCountries.filter((item) => {
      if (regionFilters.includes(activeFilter)) {
        return resolveRegion(item.country_code) === activeFilter;
      }
      return true;
    });

    const comparator =
      activeFilter === "mostDays"
        ? (a: CountryItem, b: CountryItem) => getStayDays(b) - getStayDays(a)
        : (a: CountryItem, b: CountryItem) =>
            Date.parse(b.endDate ?? "") - Date.parse(a.endDate ?? "");

    return [...regionFiltered].sort(comparator);
  }, [activeFilter, safeCountries]);

  const isEmpty =
    userLoaded && !isLoading && !isError && sortedCountries.length === 0;

  const filterLabels: Record<FilterOption, string> = {
    recent: i18n.t("home.filters.recent"),
    mostDays: i18n.t("home.filters.most-days"),
    europe: i18n.t("home.filters.europe"),
    asia: i18n.t("home.filters.asia"),
    americas: i18n.t("home.filters.americas"),
    africa: i18n.t("home.filters.africa"),
    oceania: i18n.t("home.filters.oceania"),
  } as const;

  const openFilterSheet = useCallback(() => {
    setSelectedFilter(activeFilter);
    bottomSheetRef.current?.present();
  }, [activeFilter]);

  const closeFilterSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const applyFilter = useCallback(() => {
    setActiveFilter(selectedFilter);
    closeFilterSheet();
  }, [closeFilterSheet, selectedFilter]);

  const renderFilterChip = useCallback(
    (option: FilterOption, isActive: boolean, onPress: () => void) => (
      <Pressable className="mr-3 mb-2" key={option} onPress={onPress}>
        <Box
          className="rounded-full border px-4 py-2"
          style={{
            backgroundColor: isActive ? textStrong : cardBg,
            borderColor,
          }}
        >
          <Text
            className="font-semibold text-sm"
            style={{ color: isActive ? screenBg : textMuted }}
          >
            {filterLabels[option]}
          </Text>
        </Box>
      </Pressable>
    ),
    [borderColor, cardBg, filterLabels, screenBg, textMuted, textStrong],
  );

  const renderCountryCard = (item: CountryItem) => {
    const flagUri = getFlagUri(item.country_code);
    const stayDays = getStayDays(item);
    const lastVisited = formatIsoDate(item.endDate, {
      format: "LLL yyyy",
      fallback: "--",
    });

    return (
      <Box
        className="mb-3 flex-row items-center justify-between rounded-2xl border px-3 py-3"
        key={item.id}
        style={{ backgroundColor: cardBg, borderColor }}
      >
        <Box className="flex-row items-center gap-3">
          <Box
            className="h-14 w-14 items-center justify-center overflow-hidden rounded-xl border"
            style={{ backgroundColor: secondarySurface, borderColor }}
          >
            {flagUri ? (
              <Image
                alt={`${item.country} flag`}
                className="h-full w-full"
                source={{ uri: flagUri }}
              />
            ) : (
              <Text className="text-2xl" style={{ color: textStrong }}>
                {item.flag}
              </Text>
            )}
          </Box>
          <Box>
            <Text
              className="font-semibold text-lg"
              style={{ color: textStrong }}
            >
              {item.country}
            </Text>
            <Box className="mt-1 flex-row items-center gap-1">
              <Text className="text-xs" style={{ color: textMuted }}>
                {i18n.t("home.list.last-visit", { date: lastVisited })}
              </Text>
            </Box>
          </Box>
        </Box>
        <Badge
          className="rounded-full"
          size="sm"
          style={{ backgroundColor: warningSurface }}
        >
          <BadgeText style={{ color: warningText }}>
            {i18n.t("home.list.stay-days", { count: stayDays })}
          </BadgeText>
        </Badge>
      </Box>
    );
  };

  return (
    <ParallaxScrollView>
      <Box
        className="-mx-4 flex-1 px-4 pb-10"
        style={{ backgroundColor: screenBg }}
      >
        <VStack className="pt-2" space="lg">
          <Box
            className="flex-row items-center justify-between rounded-3xl border px-4 py-4"
            style={{ backgroundColor: cardBg, borderColor }}
          >
            <Box className="flex-row items-center gap-3">
              <Box
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: borderColor }}
              >
                <Text
                  className="font-bold text-lg"
                  style={{ color: primaryColor }}
                >
                  {greetingName.charAt(0).toUpperCase()}
                </Text>
              </Box>
              <Box>
                <Heading
                  className="font-bold text-2xl"
                  style={{ color: textStrong }}
                >
                  {i18n.t("home.title")}
                </Heading>
                <Text className="mt-1 text-sm" style={{ color: textMuted }}>
                  {i18n.t("home.subtitle", { name: greetingName })}
                </Text>
              </Box>
            </Box>
            <Link asChild href="/add-visit">
              <Button
                action="primary"
                className="h-12 w-12 items-center justify-center rounded-full p-0 shadow-sm"
                size="md"
                style={{ backgroundColor: primaryColor }}
                variant="solid"
              >
                <ButtonIcon as={Plus} color={screenBg} />
              </Button>
            </Link>
          </Box>

          <Box className="flex-row gap-3">
            <Box
              className="flex-1 rounded-2xl border px-4 py-4"
              style={{ backgroundColor: cardBg, borderColor }}
            >
              <Box className="mb-2 flex-row items-center gap-2">
                <Globe2 color={primaryColor} size={18} />
                <Text
                  className="font-semibold text-xs"
                  style={{ color: textStrong }}
                >
                  {i18n.t("home.stats.countries").toUpperCase()}
                </Text>
              </Box>
              <Text
                className="font-extrabold text-3xl"
                style={{ color: textStrong }}
              >
                {safeCountries.length}
              </Text>
            </Box>
            <Box
              className="flex-1 rounded-2xl border px-4 py-4"
              style={{ backgroundColor: cardBg, borderColor }}
            >
              <Box className="mb-2 flex-row items-center gap-2">
                <CalendarDays color={primaryColor} size={18} />
                <Text
                  className="font-semibold text-xs"
                  style={{ color: textStrong }}
                >
                  {i18n.t("home.stats.days-tracked").toUpperCase()}
                </Text>
              </Box>
              <Text
                className="font-extrabold text-3xl"
                style={{ color: textStrong }}
              >
                {trackedDays}
              </Text>
            </Box>
          </Box>

          <Box>
            <Input
              className="rounded-2xl border px-4 shadow-sm"
              size="xl"
              style={{ backgroundColor: cardBg, borderColor }}
            >
              <InputSlot className="pl-2">
                <InputIcon as={() => <Search color={textMuted} />} />
              </InputSlot>
              <InputField
                accessibilityLabel={i18n.t("home.search-a11y")}
                className="text-base"
                onChangeText={(value) => setSearchText(value)}
                onSubmitEditing={() => setSearchText(searchText.trim())}
                placeholder={i18n.t("home.search")}
                placeholderTextColor={textMuted}
                style={{ color: textStrong }}
                value={searchText}
              />
              <InputSlot
                accessibilityLabel={i18n.t("home.filter-button-a11y")}
                className="pr-2"
              >
                <TouchableOpacity
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={openFilterSheet}
                >
                  <SlidersHorizontal color={textMuted} />
                </TouchableOpacity>
              </InputSlot>
            </Input>
            <ScrollView
              className="mt-3"
              contentContainerStyle={{ paddingRight: 8 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {(
                [
                  "recent",
                  "mostDays",
                  "europe",
                  "asia",
                  "americas",
                  "africa",
                  "oceania",
                ] as FilterOption[]
              ).map((option) =>
                renderFilterChip(option, activeFilter === option, () =>
                  setActiveFilter(option),
                ),
              )}
            </ScrollView>
          </Box>

          <Box className="flex-row items-center justify-between px-1">
            <Heading
              className="font-bold text-xl"
              style={{ color: textStrong }}
            >
              {i18n.t("home.stats.countries")}
            </Heading>
            <Link asChild href="/map">
              <Pressable className="flex-row items-center gap-1">
                <Text
                  className="font-semibold text-sm"
                  style={{ color: primaryColor }}
                >
                  {i18n.t("home.actions.view-map")}
                </Text>
              </Pressable>
            </Link>
          </Box>

          <Box className="px-1 py-2">
            {isError ? (
              <Box className="items-center justify-center p-6">
                <Text className="text-lg" style={{ color: textStrong }}>
                  {i18n.t("home.error-loading")}
                </Text>
              </Box>
            ) : (
              <Skeleton className="w-full" isLoaded={userLoaded && !isLoading}>
                {isEmpty ? (
                  <View className="items-center justify-center px-6 py-10">
                    <Text
                      className="text-center font-semibold text-base"
                      style={{ color: textStrong }}
                    >
                      {i18n.t("home.no-visited-countries")}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    contentContainerStyle={{ paddingVertical: 4 }}
                    data={sortedCountries}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderCountryCard(item)}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </Skeleton>
            )}
          </Box>
          <BottomSheetModal
            backdropComponent={(backdropProps) => (
              <BottomSheetBackdrop
                {...backdropProps}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.4}
              />
            )}
            backgroundStyle={{ backgroundColor: cardBg }}
            handleIndicatorStyle={{ backgroundColor: borderColor }}
            ref={bottomSheetRef}
            snapPoints={sheetSnapPoints}
          >
            <BottomSheetView
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                gap: 16,
              }}
            >
              <Box className="gap-1">
                <Text
                  className="font-semibold text-base"
                  style={{ color: textStrong }}
                >
                  {i18n.t("home.filter-sheet.title")}
                </Text>
                <Text className="text-sm" style={{ color: textMuted }}>
                  {i18n.t("home.filter-sheet.subtitle")}
                </Text>
              </Box>

              <Box style={{ gap: 8 }}>
                <Text
                  className="font-semibold text-sm"
                  style={{ color: textStrong }}
                >
                  {i18n.t("home.filter-sheet.sort")}
                </Text>
                <Box className="flex-row flex-wrap">
                  {(["recent", "mostDays"] as FilterOption[]).map((option) =>
                    renderFilterChip(option, selectedFilter === option, () =>
                      setSelectedFilter(option),
                    ),
                  )}
                </Box>
              </Box>

              <Box style={{ gap: 8 }}>
                <Text
                  className="font-semibold text-sm"
                  style={{ color: textStrong }}
                >
                  {i18n.t("home.filter-sheet.region")}
                </Text>
                <Box className="flex-row flex-wrap">
                  {(
                    [
                      "europe",
                      "asia",
                      "americas",
                      "africa",
                      "oceania",
                    ] as FilterOption[]
                  ).map((option) =>
                    renderFilterChip(option, selectedFilter === option, () =>
                      setSelectedFilter(option),
                    ),
                  )}
                </Box>
              </Box>

              <Box className="flex-row gap-3">
                <Button
                  action="secondary"
                  className="flex-1"
                  onPress={closeFilterSheet}
                  style={{ borderColor, backgroundColor: cardBg }}
                  variant="outline"
                >
                  <ButtonText style={{ color: textStrong }}>
                    {i18n.t("home.filter-sheet.cancel")}
                  </ButtonText>
                </Button>
                <Button className="flex-1" onPress={applyFilter}>
                  <ButtonText>{i18n.t("home.filter-sheet.apply")}</ButtonText>
                </Button>
              </Box>
            </BottomSheetView>
          </BottomSheetModal>
        </VStack>
      </Box>
    </ParallaxScrollView>
  );
}
