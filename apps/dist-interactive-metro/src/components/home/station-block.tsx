"use client";

import { View } from "react-native";
import { AddViaField } from "@/components/home/add-via-field";
import { StationField } from "@/components/home/station-field";
import type { Station } from "@/types/station";
import i18n from "@/i18n";

export type StationSelectingMode = null | "departure" | "arrival" | "via";

export interface StationBlockProps {
  departure: Station | null
  arrival: Station | null
  viaStations: Station[]
  showViaField: boolean
  canAddVia: boolean
  maxViaStations: number
  onDeparturePress: () => void
  onArrivalPress: () => void
  onViaPress: () => void
  onClearDeparture?: () => void
  onClearArrival?: () => void
  onClearVia?: () => void
  /** Optional: compact display-only for departure */
  departureOnly?: boolean
  /** Optional: compact display-only for arrival */
  arrivalOnly?: boolean
  /** Which field is currently being selected (highlights that cell) */
  selectingMode?: StationSelectingMode
  /** Hide departure/arrival labels; position (left→right) implies meaning */
  hideLabels?: boolean
}

/**
 * Single-row block: 출발 | (경유) | 도착.
 * Used on home and on selection screens; position (top/bottom/split) is controlled by parent layout.
 */
export function StationBlock({
  departure,
  arrival,
  viaStations,
  showViaField,
  canAddVia,
  maxViaStations,
  onDeparturePress,
  onArrivalPress,
  onViaPress,
  onClearDeparture,
  onClearArrival,
  onClearVia,
  departureOnly = false,
  arrivalOnly = false,
  selectingMode = null,
  hideLabels = false,
}: StationBlockProps) {
  const rowClass = "min-w-0 flex-row items-stretch gap-4 px-2";
  if (departureOnly) {
    return (
      <View className={rowClass}>
        <View className="min-w-0 flex-1">
          <StationField
            label={i18n.t("homeScreen.departure")}
            placeholder={i18n.t("homeScreen.departurePlaceholder")}
            value={departure}
            onPress={onDeparturePress}
            onClear={onClearDeparture}
          />
        </View>
      </View>
    );
  }

  if (arrivalOnly) {
    return (
      <View className={rowClass}>
        <View className="min-w-0 flex-1">
          <StationField
            label={i18n.t("homeScreen.arrival")}
            placeholder={i18n.t("homeScreen.arrivalPlaceholder")}
            value={arrival}
            onPress={onArrivalPress}
            onClear={onClearArrival}
          />
        </View>
      </View>
    );
  }

  return (
    <View className={rowClass}>
      <View className="min-w-0 flex-1">
        <StationField
          label={i18n.t("homeScreen.departure")}
          placeholder={i18n.t("homeScreen.departurePlaceholder")}
          value={departure}
          onPress={onDeparturePress}
          onClear={onClearDeparture}
          hideLabel={hideLabels}
          active={selectingMode === "departure"}
          activeVariant="departure"
        />
      </View>
      {showViaField && (
        <View className="min-w-0 flex-1">
          <AddViaField
            label={i18n.t("homeScreen.addVia")}
            viaCount={viaStations.length}
            onPress={onViaPress}
            onClearVia={onClearVia}
            disabled={!canAddVia}
            maxReached={viaStations.length >= maxViaStations}
          />
        </View>
      )}
      <View className="min-w-0 flex-1">
        <StationField
          label={i18n.t("homeScreen.arrival")}
          placeholder={i18n.t("homeScreen.arrivalPlaceholder")}
          value={arrival}
          onPress={onArrivalPress}
          onClear={onClearArrival}
          hideLabel={hideLabels}
          active={selectingMode === "arrival"}
          activeVariant="arrival"
        />
      </View>
    </View>
  );
}
