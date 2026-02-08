"use client";

import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { cn } from "@infinite-loop-factory/common";
import { CircleDot, MapPin } from "lucide-react-native";
import i18n from "@/i18n";

export type StationSelectPanelVariant = "departure" | "arrival" | "via";

const VARIANT_STYLES: Record<
  StationSelectPanelVariant,
  { container: string; pill: string; pillIcon: string; pillText: string }
> = {
  departure: {
    container: "border-l-4 border-secondary-400 bg-secondary-0",
    pill: "bg-secondary-100",
    pillIcon: "text-secondary-600",
    pillText: "text-secondary-700",
  },
  arrival: {
    container: "border-r-4 border-primary-400 bg-primary-0",
    pill: "bg-primary-100",
    pillIcon: "text-primary-600",
    pillText: "text-primary-700",
  },
  via: {
    container: "bg-background-50",
    pill: "bg-outline-100",
    pillIcon: "text-outline-600",
    pillText: "text-outline-700",
  },
};

const VARIANT_LABELS: Record<StationSelectPanelVariant, string> = {
  departure: i18n.t("stationSelect.departureShort"),
  arrival: i18n.t("stationSelect.arrivalShort"),
  via: i18n.t("stationSelect.viaShort"),
};

export interface StationSelectPanelProps {
  variant: StationSelectPanelVariant;
  onBack: () => void;
  /** Optional short description below the pill (e.g. for via) */
  description?: string;
  children: ReactNode;
}

/**
 * Reusable selection panel: back button + mode pill + scrollable content.
 * Departure/arrival/via share the same structure; only accent (color/border) and label differ.
 */
export function StationSelectPanel({
  variant,
  onBack,
  description,
  children,
}: StationSelectPanelProps) {
  const styles = VARIANT_STYLES[variant];
  const label = VARIANT_LABELS[variant];
  const Icon =
    variant === "departure" ? CircleDot : variant === "arrival" ? MapPin : null;

  return (
    <View className={cn("min-h-0 flex-1", styles.container)}>
      <ScrollView
        className="min-h-0 flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-3 flex-row flex-wrap items-center gap-2">
          <Pressable
            onPress={onBack}
            className="rounded-lg px-2 py-1.5"
            accessibilityLabel={i18n.t("stationSelect.back")}
            accessibilityRole="button"
          >
            <Text
              className="text-sm text-outline-600"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {i18n.t("stationSelect.back")}
            </Text>
          </Pressable>
          <View
            className={cn(
              "flex-row items-center gap-1.5 rounded-full px-3 py-1.5",
              styles.pill,
            )}
          >
            {Icon != null && (
              <Icon size={16} className={cn("shrink-0", styles.pillIcon)} />
            )}
            <Text
              className={cn("text-xs font-medium", styles.pillText)}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {label}
            </Text>
          </View>
        </View>
        {description != null && description !== "" && (
          <Text
            className="mb-2 text-sm text-outline-500"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        )}
        {children}
      </ScrollView>
    </View>
  );
}
