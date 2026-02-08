"use client";

import { cn } from "@infinite-loop-factory/common";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from "react-native";
import { StationBlock } from "@/components/home/station-block";
import { RouteSceneLayout } from "@/components/home/route-scene-layout";
import { StationListItem } from "@/components/home/station-list-item";
import { StationSelectPanel } from "@/components/home/station-select-panel";
import { useRouteSearch } from "@/context/route-search-context";
import i18n from "@/i18n";

type SelectingMode = null | "departure" | "arrival" | "via";

const SAMPLE_STATIONS = [
  { id: "station-101", name: "서울역", lines: "1호선, 4호선" },
  { id: "station-202", name: "강남역", lines: "2호선, 신분당선" },
] as const;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental != null
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function useLayoutTransition() {
  return () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
}

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
  const scheduleLayoutTransition = useLayoutTransition();

  const showViaField = !!departure || !!arrival;

  const handleDeparturePress = () => {
    scheduleLayoutTransition();
    setSelectingMode("departure");
  };
  const handleArrivalPress = () => {
    scheduleLayoutTransition();
    setSelectingMode("arrival");
  };
  const handleViaPress = () => {
    scheduleLayoutTransition();
    setSelectingMode("via");
  };

  const handleSelectDeparture = (id: string, name: string) => {
    setDeparture({ id, name });
    scheduleLayoutTransition();
    setSelectingMode(null);
  };

  const handleSelectArrival = (id: string, name: string) => {
    if (departure?.id === id) return;
    setArrival({ id, name });
    scheduleLayoutTransition();
    setSelectingMode(null);
  };

  const handleAddVia = (id: string, name: string) => {
    addViaStation({ id, name });
    scheduleLayoutTransition();
    setSelectingMode(null);
  };

  const handleBackFromSelect = () => {
    scheduleLayoutTransition();
    setSelectingMode(null);
  };

  const handleSearchPress = () => {
    if (!canSearch) return;
    router.push("/route-result");
  };

  const stationBlock = (
    <StationBlock
      departure={departure}
      arrival={arrival}
      viaStations={viaStations}
      showViaField={showViaField}
      canAddVia={canAddVia}
      maxViaStations={maxViaStations}
      onDeparturePress={handleDeparturePress}
      onArrivalPress={handleArrivalPress}
      onViaPress={handleViaPress}
      onClearDeparture={() => setDeparture(null)}
      onClearArrival={() => setArrival(null)}
      onClearVia={() => setViaStations([])}
      selectingMode={selectingMode}
      hideLabels
    />
  );

  const renderContent = () => {
    if (selectingMode === "departure") {
      return (
        <StationSelectPanel variant="departure" onBack={handleBackFromSelect}>
          {SAMPLE_STATIONS.map((s) => (
            <StationListItem
              key={s.id}
              name={s.name}
              lines={s.lines}
              onPress={() => handleSelectDeparture(s.id, s.name)}
              accentBorder="border-secondary-200"
            />
          ))}
        </StationSelectPanel>
      );
    }

    if (selectingMode === "arrival") {
      return (
        <StationSelectPanel variant="arrival" onBack={handleBackFromSelect}>
          {SAMPLE_STATIONS.map((s) => {
            const disabled = departure?.id === s.id;
            return (
              <StationListItem
                key={s.id}
                name={s.name}
                lines={s.lines}
                onPress={() => !disabled && handleSelectArrival(s.id, s.name)}
                disabled={disabled}
                accentBorder="border-primary-200"
              />
            );
          })}
        </StationSelectPanel>
      );
    }

    if (selectingMode === "via") {
      return (
        <StationSelectPanel
          variant="via"
          onBack={handleBackFromSelect}
          description="경유역 추가 (검색·순서 조정은 Phase 2에서 구현)"
        >
          {SAMPLE_STATIONS.map((s) => (
            <StationListItem
              key={s.id}
              name={s.name}
              lines={s.lines}
              onPress={() => handleAddVia(s.id, s.name)}
            />
          ))}
        </StationSelectPanel>
      );
    }

    return (
      <ScrollView
        className="min-h-0 flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="mb-3 text-sm font-medium text-outline-600"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {i18n.t("homeScreen.searchAndExtras")}
        </Text>
        <SearchButton
          disabled={!canSearch}
          onPress={handleSearchPress}
        />
      </ScrollView>
    );
  };

  return (
    <RouteSceneLayout
      title={i18n.t("homeScreen.title")}
      subtitle={i18n.t("homeScreen.subtitle")}
      stationBlock={stationBlock}
    >
      {renderContent()}
    </RouteSceneLayout>
  );
}

function SearchButton({
  disabled,
  onPress,
}: { disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "items-center justify-center rounded-xl py-4",
        disabled ? "bg-outline-100" : "bg-primary-500",
      )}
      accessibilityLabel={i18n.t("homeScreen.search")}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text
        className={cn(
          "text-base font-semibold",
          disabled ? "text-outline-400" : "text-white",
        )}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {i18n.t("homeScreen.search")}
      </Text>
    </Pressable>
  );
}
