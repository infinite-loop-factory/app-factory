"use client";

import { X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { AddViaField } from "@/components/home/add-via-field";
import { StationField } from "@/components/home/station-field";
import type { Station } from "@/types/station";

interface RouteFormBlockProps {
  departure: Station | null
  arrival: Station | null
  viaStations: Station[]
  showViaSection: boolean
  canAddVia: boolean
  maxViaStations: number
  onDeparturePress: () => void
  onArrivalPress: () => void
  onViaPress: () => void
  onRemoveVia?: (stationId: string) => void
  departureLabel: string
  departurePlaceholder: string
  arrivalLabel: string
  arrivalPlaceholder: string
  addViaLabel: string
}

export function RouteFormBlock({
  departure,
  arrival,
  viaStations,
  showViaSection,
  canAddVia,
  maxViaStations,
  onDeparturePress,
  onArrivalPress,
  onViaPress,
  onRemoveVia,
  departureLabel,
  departurePlaceholder,
  arrivalLabel,
  arrivalPlaceholder,
  addViaLabel,
}: RouteFormBlockProps) {
  return (
    <View className="gap-3">
      <StationField
        label={departureLabel}
        placeholder={departurePlaceholder}
        value={departure}
        onPress={onDeparturePress}
      />
      <StationField
        label={arrivalLabel}
        placeholder={arrivalPlaceholder}
        value={arrival}
        onPress={onArrivalPress}
      />
      {showViaSection && (
        <>
          {viaStations.map((station) => (
            <ViaChip
              key={station.id}
              name={station.name}
              onRemove={onRemoveVia ? () => onRemoveVia(station.id) : undefined}
            />
          ))}
          <AddViaField
            label={addViaLabel}
            viaCount={viaStations.length}
            onPress={onViaPress}
            disabled={!canAddVia}
            maxReached={viaStations.length >= maxViaStations}
          />
        </>
      )}
    </View>
  );
}

function ViaChip({
  name,
  onRemove,
}: { name: string; onRemove?: () => void }) {
  return (
    <View className="flex-row items-center justify-between rounded-xl border border-outline-200 bg-background-50 px-4 py-3">
      <Text className="font-medium text-sm text-typography-800">{name}</Text>
      {onRemove && (
        <Pressable
          onPress={onRemove}
          className="p-1 active:opacity-70"
          accessibilityLabel="경유역 제거"
          accessibilityRole="button"
        >
          <X size={18} className="text-outline-500" />
        </Pressable>
      )}
    </View>
  );
}
