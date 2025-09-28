import type { CountryLocation } from "@/features/map/types/country-location";
import type { MapGlobeRef } from "@/features/map/types/map-globe";
import type { CountryYearSummary } from "@/features/map/types/map-summary";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
  Share,
  XCircle,
} from "lucide-react-native";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import MapGlobe from "@/features/map/components/map-globe";
import { useVisitedCountrySummariesQuery } from "@/features/map/hooks/use-visited-country-summaries";
import {
  findCountryLocation,
  findCountryLocationByCode,
} from "@/features/map/utils/country-locations";
import { addAlphaToColor } from "@/features/map/utils/globe-helpers";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import { countryCodeToFlagEmoji } from "@/utils/country-code-to-flag-emoji";
import { formatIsoDate } from "@/utils/format-date";

const GLOBE_ANIMATION_DURATION = 3500;
const GLOBE_ANIMATION_ZOOM = 15;

export default function MapScreen() {
  const { user } = useAuthUser();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapGlobeRef = useRef<MapGlobeRef>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryLocation | null>(null);
  const [selectedYear, setSelectedYear] = useState(DateTime.local().year);
  const [selectedSummaryKey, setSelectedSummaryKey] = useState<string | null>(
    null,
  );

  const [
    backgroundColor,
    inputBackgroundColor,
    borderColor,
    textColor,
    mutedTextColor,
    accentColor,
  ] = useThemeColor([
    "background",
    "background-50",
    "outline-200",
    "typography",
    "typography-500",
    "primary-500",
  ]);

  const currentYear = DateTime.local().year;

  const overlayBackgroundColor = addAlphaToColor(backgroundColor, 0.9);

  const resetSearchState = () => {
    setSearchText("");
    setSelectedCountry(null);
    setSelectedSummaryKey(null);
  };

  const {
    data: summaryRows = [],
    isLoading: isYearSummaryLoading,
    isError: isYearSummaryError,
  } = useVisitedCountrySummariesQuery({
    userId: user?.id ?? null,
    year: selectedYear,
  });

  const countrySummaries = useMemo<CountryYearSummary[]>(() => {
    return summaryRows.map((summary) => ({
      ...summary,
      flag: summary.countryCode
        ? countryCodeToFlagEmoji(summary.countryCode)
        : "",
    }));
  }, [summaryRows]);

  useEffect(() => {
    if (!selectedSummaryKey) return;
    const exists = countrySummaries.some((summary) => {
      const key = summary.countryCode || summary.country;
      return key === selectedSummaryKey;
    });
    if (!exists) {
      setSelectedSummaryKey(null);
    }
  }, [countrySummaries, selectedSummaryKey]);

  const selectedSummary = useMemo(() => {
    if (!selectedSummaryKey) return null;
    return (
      countrySummaries.find((summary) => {
        const key = summary.countryCode || summary.country;
        return key === selectedSummaryKey;
      }) ?? null
    );
  }, [countrySummaries, selectedSummaryKey]);

  const filteredSummaries = useMemo(() => {
    if (!searchText.trim()) return countrySummaries;
    const normalized = searchText.trim().toLowerCase();
    return countrySummaries.filter((summary) =>
      summary.country.toLowerCase().includes(normalized),
    );
  }, [countrySummaries, searchText]);

  const totalDaysThisYear = useMemo(
    () =>
      countrySummaries.reduce((total, summary) => total + summary.totalDays, 0),
    [countrySummaries],
  );

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

  const handleResetSearch = () => {
    resetSearchState();
  };

  const handleSearchSubmit = () => {
    if (searchText.trim() === "") return;

    const countryLocation =
      findCountryLocation(searchText) ?? findCountryLocationByCode(searchText);
    if (countryLocation) {
      setSelectedCountry(countryLocation);
      const summaryMatch = countrySummaries.find((summary) => {
        if (summary.countryCode) {
          return (
            summary.countryCode === countryLocation.country_code.toUpperCase()
          );
        }
        return (
          summary.country.toLowerCase() ===
          countryLocation.country.toLowerCase()
        );
      });
      setSelectedSummaryKey(
        summaryMatch ? summaryMatch.countryCode || summaryMatch.country : null,
      );
      mapGlobeRef.current?.globeRotationAnimation(
        countryLocation.latitude,
        countryLocation.longitude,
        GLOBE_ANIMATION_DURATION,
        GLOBE_ANIMATION_ZOOM,
      );

      bottomSheetRef.current?.snapToIndex(1);
    } else {
      resetSearchState();
      Alert.alert(
        i18n.t("map.alert.country-not-found.title"),
        i18n.t("map.alert.country-not-found.message"),
      );
    }
  };

  const isNextYearDisabled = selectedYear >= currentYear;

  const handleYearDecrease = () => {
    resetSearchState();
    setSelectedYear((prev) => prev - 1);
  };

  const handleYearIncrease = () => {
    if (isNextYearDisabled) return;
    resetSearchState();
    setSelectedYear((prev) => prev + 1);
  };

  const handleSummaryPress = useCallback((summary: CountryYearSummary) => {
    const location =
      findCountryLocation(summary.country) ??
      findCountryLocationByCode(summary.countryCode);
    if (!location) return;

    const summaryKey = summary.countryCode || summary.country;
    setSelectedSummaryKey(summaryKey);
    setSelectedCountry(location);
    setSearchText(summary.country);
    mapGlobeRef.current?.globeRotationAnimation(
      location.latitude,
      location.longitude,
      GLOBE_ANIMATION_DURATION,
      GLOBE_ANIMATION_ZOOM,
    );
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const renderSummaryItem = ({ item }: { item: CountryYearSummary }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      className="mb-3 rounded-2xl border px-4 py-3"
      onPress={() => handleSummaryPress(item)}
      style={{ borderColor, backgroundColor: inputBackgroundColor }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Text className="text-3xl">{item.flag}</Text>
          <View>
            <Text
              className="font-semibold text-lg"
              style={{ color: textColor }}
            >
              {item.country}
            </Text>
            <Text className="text-xs" style={{ color: mutedTextColor }}>
              {item.latestVisit
                ? i18n.t("map.summary.latest-visit", {
                    date: formatIsoDate(item.latestVisit),
                  })
                : i18n.t("map.summary.no-visit")}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="font-bold text-lg" style={{ color: textColor }}>
            {i18n.t("map.summary.days", { count: item.totalDays })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (isYearSummaryLoading) {
      return null;
    }

    if (isYearSummaryError) {
      return (
        <View className="py-6">
          <Text
            className="text-center text-sm"
            style={{ color: mutedTextColor }}
          >
            {i18n.t("map.summary.error")}
          </Text>
        </View>
      );
    }

    const emptyMessage = searchText.trim()
      ? i18n.t("map.summary.no-results-search", { search: searchText.trim() })
      : i18n.t("map.summary.no-results-year", { year: selectedYear });

    return (
      <View className="py-6">
        <Text className="text-center text-sm" style={{ color: mutedTextColor }}>
          {emptyMessage}
        </Text>
      </View>
    );
  };

  const renderListHeader = () => (
    <View className="pt-4 pb-4">
      <View className="mb-2 flex flex-row items-center justify-between">
        <Heading className="font-bold text-2xl" style={{ color: textColor }}>
          {i18n.t("map.countries")}
        </Heading>
        <View className="flex flex-row">
          <Button className="mr-1" onPress={handleShare} variant="link">
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
          onChangeText={handleSearch}
          onSubmitEditing={handleSearchSubmit}
          placeholder={i18n.t("map.search-placeholder")}
          value={searchText}
        />
        {searchText.length > 0 && (
          <InputSlot className="mr-1" onPress={handleResetSearch}>
            <InputIcon as={XCircle} />
          </InputSlot>
        )}
        <InputSlot onPress={handleSearchSubmit}>
          <InputIcon as={Search} />
        </InputSlot>
      </Input>

      {selectedCountry && (
        <View className="px-2">
          <Button
            action="secondary"
            className="mt-3 border border-outline-200 bg-transparent data-[active=true]:border-outline-400 data-[hover=true]:border-outline-300 data-[hover=true]:bg-transparent"
            variant="outline"
          >
            <ButtonIcon
              as={() => <Info color={textColor} />}
              className="mr-2"
            />
            <ButtonText style={{ color: textColor }}>
              {i18n.t("map.summary.view-details")}
            </ButtonText>
          </Button>
        </View>
      )}

      {selectedSummary ? (
        <Text
          className="mt-4 font-semibold text-sm"
          style={{ color: textColor }}
        >
          {i18n.t("map.summary.total-days-selected", {
            count: selectedSummary.totalDays,
            country: selectedSummary.country,
          })}
        </Text>
      ) : (
        totalDaysThisYear > 0 && (
          <Text
            className="mt-4 font-semibold text-sm"
            style={{ color: textColor }}
          >
            {i18n.t("map.summary.total-days-year", {
              count: totalDaysThisYear,
            })}
          </Text>
        )
      )}

      {isYearSummaryLoading && (
        <View className="mt-3 flex-row items-center">
          <ActivityIndicator color={accentColor} size="small" />
          <Text className="ml-2 text-xs" style={{ color: mutedTextColor }}>
            {i18n.t("map.summary.loading")}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <ThemedView className="flex-1">
      <MapGlobe ref={mapGlobeRef} year={selectedYear} />

      <View
        className="absolute right-0 left-0 z-10"
        style={{ top: 20, paddingHorizontal: 20 }}
      >
        <View
          className="flex-row items-center justify-between rounded-full border px-4 py-2"
          style={{
            backgroundColor: overlayBackgroundColor,
            borderColor,
          }}
        >
          <Button
            action="secondary"
            className="border border-outline-200 bg-transparent"
            onPress={handleYearDecrease}
            size="sm"
            variant="outline"
          >
            <ButtonIcon as={ChevronLeft} />
          </Button>
          <Text
            className="font-semibold text-base"
            style={{ color: textColor }}
          >
            {i18n.t("map.summary.year-label", { year: selectedYear })}
          </Text>
          <Button
            action="secondary"
            className="border border-outline-200 bg-transparent"
            disabled={isNextYearDisabled}
            onPress={handleYearIncrease}
            size="sm"
            variant="outline"
          >
            <ButtonIcon as={ChevronRight} />
          </Button>
        </View>
      </View>

      <BottomSheet
        backgroundStyle={{ backgroundColor }}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: textColor }}
        index={0}
        onChange={handleSheetChanges}
        ref={bottomSheetRef}
        snapPoints={["25%", "45%", "90%"]}
      >
        <BottomSheetFlatList
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          data={filteredSummaries}
          keyExtractor={(item) =>
            `${selectedYear}-${item.countryCode || item.country}`
          }
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={renderListHeader}
          renderItem={renderSummaryItem}
        />
      </BottomSheet>
    </ThemedView>
  );
}
