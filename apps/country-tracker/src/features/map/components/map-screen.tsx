import type { MapGlobeRef } from "@/features/map/types/map-globe";
import type { CountryYearSummary } from "@/features/map/types/map-summary";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { CountrySummaryItem } from "@/features/map/components/country-summary-item";
import { MapDateRangePickerSheet } from "@/features/map/components/map-date-range-picker-sheet";
import MapGlobe from "@/features/map/components/map-globe";
import { MapHeader } from "@/features/map/components/map-header";
import { MapOverlay } from "@/features/map/components/map-overlay";
import { MapStats } from "@/features/map/components/map-stats";
import { YearPickerSheet } from "@/features/map/components/year-picker-sheet";
import { useVisitedCountrySummariesQuery } from "@/features/map/hooks/use-visited-country-summaries";
import {
  findCountryLocation,
  findCountryLocationByCode,
} from "@/features/map/utils/country-locations";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";
import { countryCodeToFlagEmoji } from "@/utils/country-code-to-flag-emoji";

const GLOBE_ANIMATION_DURATION = 3500;
const GLOBE_ANIMATION_ZOOM = 15;

export default function MapScreen() {
  const { user } = useAuthUser();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapGlobeRef = useRef<MapGlobeRef>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState(DateTime.local().year);
  const [filterMode, setFilterMode] = useState<"year" | "all" | "range">(
    "year",
  );
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);

  // Date Range State
  const [startDate, setStartDate] = useState<DateTime | null>(null);
  const [endDate, setEndDate] = useState<DateTime | null>(null);

  const [selectedSummaryKey, setSelectedSummaryKey] = useState<string | null>(
    null,
  );
  const [topInset, setTopInset] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(250);
  const snapPoints = useMemo(
    () => [headerHeight, "50%", "99%"],
    [headerHeight],
  );

  const [backgroundColor, , , textColor, , accentColor] = useThemeColor([
    "background",
    "background-50",
    "outline-200",
    "typography",
    "typography-500",
    "primary-500",
  ]);

  const {
    data: summaryRows = [],
    isLoading: isYearSummaryLoading,
    isError: isYearSummaryError,
  } = useVisitedCountrySummariesQuery({
    userId: user?.id ?? null,
    year: filterMode === "year" ? selectedYear : null,
    // Pass date strings if filterMode is range
    startDate:
      filterMode === "range" && startDate
        ? startDate.toFormat("yyyy-MM-dd")
        : undefined,
    endDate:
      filterMode === "range" && endDate
        ? endDate.toFormat("yyyy-MM-dd")
        : undefined,
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

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim() === "") return;

    const countryLocation =
      findCountryLocation(searchText) ?? findCountryLocationByCode(searchText);
    if (countryLocation) {
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
      Alert.alert(
        i18n.t("map.alert.country-not-found.title"),
        i18n.t("map.alert.country-not-found.message"),
      );
    }
  };

  const currentYearVisitCount = useMemo(() => {
    return countrySummaries.length;
  }, [countrySummaries]);

  const handleSummaryPress = useCallback((summary: CountryYearSummary) => {
    const location =
      findCountryLocation(summary.country) ??
      findCountryLocationByCode(summary.countryCode);
    if (!location) return;

    const summaryKey = summary.countryCode || summary.country;
    setSelectedSummaryKey(summaryKey);
    setSearchText(summary.country);
    mapGlobeRef.current?.globeRotationAnimation(
      location.latitude,
      location.longitude,
      GLOBE_ANIMATION_DURATION,
      GLOBE_ANIMATION_ZOOM,
    );
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const renderEmptyState = () => {
    if (isYearSummaryLoading) {
      return null;
    }

    if (isYearSummaryError) {
      return (
        <Box className="py-6">
          <Text className="text-center text-sm text-typography-500">
            {i18n.t("map.summary.error")}
          </Text>
        </Box>
      );
    }

    let emptyMessage = "";
    if (searchText.trim()) {
      emptyMessage = i18n.t("map.summary.no-results-search", {
        search: searchText.trim(),
      });
    } else if (filterMode === "year") {
      emptyMessage = i18n.t("map.summary.no-results-year", {
        year: selectedYear,
      });
    } else {
      emptyMessage = i18n.t("map.summary.no-results-all");
    }

    return (
      <Box className="py-6">
        <Text className="text-center text-sm text-typography-500">
          {emptyMessage}
        </Text>
      </Box>
    );
  };

  const renderListHeader = () => (
    <Box className="pb-4">
      <Box
        className="pt-4"
        onLayout={(e) => {
          const height = e.nativeEvent.layout.height;
          if (Math.abs(headerHeight - height) > 2) {
            setHeaderHeight(height);
          }
        }}
      >
        <Box className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-outline-300 dark:bg-outline-600" />

        {/* Profile Stats (Summary) */}
        <Box className="mt-4 mb-5">
          <MapStats
            countryCount={currentYearVisitCount}
            totalDays={totalDaysThisYear}
          />
        </Box>
      </Box>

      {/* Selected Country Detail Card Header */}
      <Box className="mb-2 flex-row items-center justify-between">
        <Text className="pl-1 font-bold text-typography-500 text-xs uppercase tracking-wider dark:text-typography-400">
          {i18n.t("map.filters.recently-visited")}
        </Text>
        <Button
          onPress={() => bottomSheetRef.current?.expand()}
          size="xs"
          variant="link"
        >
          <ButtonText className="font-bold text-primary-500 text-xs hover:underline">
            {i18n.t("map.filters.view-all")}
          </ButtonText>
        </Button>
      </Box>

      {isYearSummaryLoading && (
        <Box className="mt-3 flex-row items-center">
          <ActivityIndicator color={accentColor} size="small" />
          <Text className="ml-2 text-sm text-typography-500">
            {i18n.t("map.summary.loading")}
          </Text>
        </Box>
      )}
    </Box>
  );

  return (
    <ThemedView className="flex-1">
      <MapHeader
        endDate={endDate ? endDate.toFormat("yyyy-MM-dd") : null}
        filterMode={filterMode}
        onLayout={(e) => setTopInset(e.nativeEvent.layout.height)}
        onOpenDateRangePicker={() => setIsDateRangePickerOpen(true)}
        onOpenYearPicker={() => setIsYearPickerOpen(true)}
        selectedYear={selectedYear}
        setFilterMode={setFilterMode}
        startDate={startDate ? startDate.toFormat("yyyy-MM-dd") : null}
      />

      {/* Main Content */}
      <Box className="relative w-full flex-1 overflow-hidden">
        {/* Map */}
        <Box className="absolute inset-0 h-full w-full">
          <MapGlobe ref={mapGlobeRef} year={selectedYear} />
        </Box>

        {/* Map Overlay Controls */}
        <MapOverlay
          bottomInset={headerHeight}
          onLocateMe={() => {
            mapGlobeRef.current?.animateToUserLocation?.();
          }}
          onSearchChange={handleSearch}
          onSearchSubmit={handleSearchSubmit}
          onZoomIn={() => mapGlobeRef.current?.zoomIn?.()}
          onZoomOut={() => mapGlobeRef.current?.zoomOut?.()}
          searchText={searchText}
        />
      </Box>

      <BottomSheet
        backgroundStyle={{ backgroundColor }}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: textColor }}
        handleStyle={{ display: "none" }}
        index={0}
        onChange={handleSheetChanges}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        topInset={topInset}
      >
        <BottomSheetFlatList<CountryYearSummary>
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          data={filteredSummaries}
          keyExtractor={(item: CountryYearSummary) =>
            `${selectedYear}-${item.countryCode || item.country}`
          }
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={renderListHeader}
          renderItem={({ item }: { item: CountryYearSummary }) => (
            <CountrySummaryItem item={item} onPress={handleSummaryPress} />
          )}
        />
      </BottomSheet>

      <YearPickerSheet
        isOpen={isYearPickerOpen}
        onClose={() => setIsYearPickerOpen(false)}
        onSelectYear={setSelectedYear}
        selectedYear={selectedYear}
      />

      <MapDateRangePickerSheet
        initialEndDate={endDate}
        initialStartDate={startDate}
        isOpen={isDateRangePickerOpen}
        onApply={(start, end) => {
          setStartDate(start);
          setEndDate(end);
          setFilterMode("range");
        }}
        onClose={() => setIsDateRangePickerOpen(false)}
      />
    </ThemedView>
  );
}
