import { cn } from "@infinite-loop-factory/common";
import { useRouter } from "expo-router";
import { memo, useCallback, useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { RouteSceneLayout } from "@/components/home/route-scene-layout";
import { StationBlock } from "@/components/home/station-block";
import { StationListItem } from "@/components/home/station-list-item";
import { StationSelectPanel } from "@/components/home/station-select-panel";
import { useRouteSearch } from "@/context/route-search-context";
import i18n from "@/i18n";

type SelectingMode = null | "departure" | "arrival" | "via";

// TODO: Replace with real data source
const SAMPLE_STATIONS = [
  { id: "station-101", name: "서울역", lines: "1호선, 4호선" },
  { id: "station-202", name: "강남역", lines: "2호선, 신분당선" },
] as const;

const defaultContentContainerStyle = {
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 32,
} as const;

export default function RouteGuideTab() {
  const router = useRouter();
  const {
    departure,
    arrival,
    viaStations,
    setDeparture,
    setArrival,
    addViaStation,
    setViaStations,
    canSearch,
    canAddVia,
    maxViaStations,
  } = useRouteSearch();

  const [selectingMode, setSelectingMode] = useState<SelectingMode>(null);

  const showViaField = !!departure || !!arrival;

  const handleDeparturePress = useCallback(() => {
    setSelectingMode("departure");
  }, []);

  const handleArrivalPress = useCallback(() => {
    setSelectingMode("arrival");
  }, []);

  const handleViaPress = useCallback(() => {
    setSelectingMode("via");
  }, []);

  const handleSelectDeparture = useCallback(
    (id: string, name: string) => {
      setDeparture({ id, name });
      setSelectingMode(null);
    },
    [setDeparture],
  );

  const handleSelectArrival = useCallback(
    (id: string, name: string) => {
      if (departure?.id === id) return;
      setArrival({ id, name });
      setSelectingMode(null);
    },
    [departure?.id, setArrival],
  );

  const handleAddVia = useCallback(
    (id: string, name: string) => {
      addViaStation({ id, name });
      setSelectingMode(null);
    },
    [addViaStation],
  );

  const handleBackFromSelect = useCallback(() => {
    setSelectingMode(null);
  }, []);

  const handleSearchPress = useCallback(() => {
    if (!canSearch) return;
    router.push("/route-result");
  }, [canSearch, router]);

  const handleClearDeparture = useCallback(
    () => setDeparture(null),
    [setDeparture],
  );
  const handleClearArrival = useCallback(() => setArrival(null), [setArrival]);
  const handleClearVia = useCallback(
    () => setViaStations([]),
    [setViaStations],
  );

  const stationBlock = (
    <StationBlock
      arrival={arrival}
      canAddVia={canAddVia}
      departure={departure}
      hideLabels
      maxViaStations={maxViaStations}
      onArrivalPress={handleArrivalPress}
      onClearArrival={handleClearArrival}
      onClearDeparture={handleClearDeparture}
      onClearVia={handleClearVia}
      onDeparturePress={handleDeparturePress}
      onViaPress={handleViaPress}
      selectingMode={selectingMode}
      showViaField={showViaField}
      viaStations={viaStations}
    />
  );

  const renderContent = () => {
    if (selectingMode === "departure") {
      return (
        <StationSelectPanel onBack={handleBackFromSelect} variant="departure">
          {SAMPLE_STATIONS.map((s) => (
            <StationListItem
              accentBorder="border-secondary-200"
              key={s.id}
              lines={s.lines}
              name={s.name}
              onPress={() => handleSelectDeparture(s.id, s.name)}
            />
          ))}
        </StationSelectPanel>
      );
    }

    if (selectingMode === "arrival") {
      return (
        <StationSelectPanel onBack={handleBackFromSelect} variant="arrival">
          {SAMPLE_STATIONS.map((s) => {
            const disabled = departure?.id === s.id;
            return (
              <StationListItem
                accentBorder="border-primary-200"
                disabled={disabled}
                key={s.id}
                lines={s.lines}
                name={s.name}
                onPress={() => !disabled && handleSelectArrival(s.id, s.name)}
              />
            );
          })}
        </StationSelectPanel>
      );
    }

    if (selectingMode === "via") {
      return (
        <StationSelectPanel
          description={i18n.t("via.description")}
          onBack={handleBackFromSelect}
          variant="via"
        >
          {SAMPLE_STATIONS.map((s) => (
            <StationListItem
              key={s.id}
              lines={s.lines}
              name={s.name}
              onPress={() => handleAddVia(s.id, s.name)}
            />
          ))}
        </StationSelectPanel>
      );
    }

    return (
      <ScrollView
        className="min-h-0 flex-1"
        contentContainerStyle={defaultContentContainerStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="mb-3 font-medium text-outline-600 text-sm"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {i18n.t("homeScreen.searchAndExtras")}
        </Text>
        <SearchButton disabled={!canSearch} onPress={handleSearchPress} />
      </ScrollView>
    );
  };

  return (
    <RouteSceneLayout
      stationBlock={stationBlock}
      subtitle={i18n.t("homeScreen.subtitle")}
      title={i18n.t("homeScreen.title")}
    >
      {renderContent()}
    </RouteSceneLayout>
  );
}

const SearchButton = memo(function SearchButton({
  disabled,
  onPress,
}: {
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={i18n.t("homeScreen.search")}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={cn(
        "items-center justify-center rounded-xl py-4",
        disabled ? "bg-outline-100" : "bg-primary-500",
      )}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        className={cn(
          "font-semibold text-base",
          disabled ? "text-outline-400" : "text-white",
        )}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {i18n.t("homeScreen.search")}
      </Text>
    </Pressable>
  );
});
