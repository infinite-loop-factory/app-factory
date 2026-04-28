import type { PriceUnit } from "@/db/schema";

import { Pressable, Text, TextInput, View } from "react-native";
import i18n from "@/i18n";

export type PriceRowProps = {
  amount: string;
  unit: PriceUnit;
  onAmountChange: (next: string) => void;
  onUnitChange: (next: PriceUnit) => void;
};

export function PriceRow({
  amount,
  unit,
  onAmountChange,
  onUnitChange,
}: PriceRowProps) {
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-12 flex-1 flex-row items-center rounded-md border border-border-subtle bg-surface-sunken px-3">
        <Text className="font-text text-body text-text-muted">₩</Text>
        <TextInput
          className="ml-1 flex-1 font-text text-body text-text"
          inputMode="numeric"
          keyboardType="number-pad"
          onChangeText={(v) => onAmountChange(v.replace(/[^0-9]/g, ""))}
          placeholder="0"
          placeholderTextColor="rgb(var(--color-text-faint))"
          value={amount}
        />
      </View>
      <View className="h-12 flex-row rounded-md border border-border-subtle bg-surface-sunken p-1">
        <Segment
          active={unit === "glass"}
          label={i18n.t("tasting.field.priceUnitGlass")}
          onPress={() => onUnitChange("glass")}
        />
        <Segment
          active={unit === "bottle"}
          label={i18n.t("tasting.field.priceUnitBottle")}
          onPress={() => onUnitChange("bottle")}
        />
      </View>
    </View>
  );
}

type SegmentProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Segment({ label, active, onPress }: SegmentProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={
        active
          ? "h-full items-center justify-center rounded-sm bg-surface-raised px-4 shadow-card-1"
          : "h-full items-center justify-center px-4"
      }
      onPress={onPress}
    >
      <Text
        className={
          active
            ? "font-medium font-text text-bodySm text-text"
            : "font-medium font-text text-bodySm text-text-muted"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
