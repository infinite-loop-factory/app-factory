import type { PriceUnit, TastingCategory } from "@/db/schema";
import type { Place, PlaceCategory } from "@/features/place/repo/types";
import type {
  TastingNote,
  TastingNoteInput,
} from "@/features/tasting/repo/types";

import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { PlacePicker } from "@/components/place-picker";
import * as placeRepo from "@/features/place/repo/place-repo";
import { useThemeColors } from "@/hooks/use-theme-colors";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";
import { CategoryGrid } from "./category-grid";
import { PhotoStrip } from "./photo-strip";
import { PriceRow } from "./price-row";
import { ScoreSlider } from "./score-slider";
import { TagInput } from "./tag-input";

export type ComposeFormState = {
  photos: string[];
  category: TastingCategory | null;
  name: string;
  score: number;
  tags: string[];
  memo: string;
  price: string;
  priceUnit: PriceUnit;
  date: number;
  placeId: string | null;
  placeName: string | null;
  placeCategory: PlaceCategory | null;
};

export type ComposeFormProps = {
  initial?: TastingNote;
  onChange: (state: ComposeFormState, isValid: boolean) => void;
};

const blankState = (): ComposeFormState => ({
  photos: [],
  category: null,
  name: "",
  score: 0,
  tags: [],
  memo: "",
  price: "",
  priceUnit: "glass",
  date: Date.now(),
  placeId: null,
  placeName: null,
  placeCategory: null,
});

const fromNote = (n: TastingNote): ComposeFormState => ({
  photos: n.photos,
  category: n.category,
  name: n.name,
  score: n.score ?? 0,
  tags: n.tags,
  memo: n.memo ?? "",
  price: n.price != null ? String(n.price) : "",
  priceUnit: n.priceUnit ?? "glass",
  date: n.date,
  placeId: n.placeId,
  placeName: null,
  placeCategory: null,
});

export function toInput(state: ComposeFormState): TastingNoteInput {
  if (!state.category) throw new Error("category required");
  return {
    category: state.category,
    name: state.name.trim(),
    score: state.score > 0 ? state.score : null,
    memo: state.memo.trim() || null,
    price: state.price ? Number(state.price) : null,
    priceUnit: state.price ? state.priceUnit : null,
    date: state.date,
    placeId: state.placeId,
    tags: state.tags,
    photos: state.photos,
  };
}

export function ComposeForm({ initial, onChange }: ComposeFormProps) {
  const colors = useThemeColors();
  const [state, setState] = useState<ComposeFormState>(() =>
    initial ? fromNote(initial) : blankState(),
  );
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (!initial?.placeId) return;
    let alive = true;
    placeRepo.get(initial.placeId).then((p) => {
      if (!(alive && p)) return;
      setState((prev) => ({
        ...prev,
        placeName: p.name,
        placeCategory: p.category,
      }));
    });
    return () => {
      alive = false;
    };
  }, [initial?.placeId]);

  const update = <K extends keyof ComposeFormState>(
    key: K,
    val: ComposeFormState[K],
  ) => {
    const next = { ...state, [key]: val };
    setState(next);
    onChange(next, Boolean(next.category) && next.name.trim().length > 0);
  };

  const handleSelectPlace = (place: Place) => {
    const next: ComposeFormState = {
      ...state,
      placeId: place.id,
      placeName: place.name,
      placeCategory: place.category,
    };
    setState(next);
    onChange(next, Boolean(next.category) && next.name.trim().length > 0);
  };

  const handleClearPlace = () => {
    haptic.selection();
    const next: ComposeFormState = {
      ...state,
      placeId: null,
      placeName: null,
      placeCategory: null,
    };
    setState(next);
    onChange(next, Boolean(next.category) && next.name.trim().length > 0);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-12"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <FieldLabel
        hint={i18n.t("tasting.field.photosHint")}
        label={i18n.t("tasting.field.photos")}
      />
      <PhotoStrip onChange={(p) => update("photos", p)} photos={state.photos} />

      <FieldLabel label={i18n.t("tasting.field.category")} required />
      <CategoryGrid
        onChange={(c) => update("category", c)}
        value={state.category}
      />

      <FieldLabel label={i18n.t("tasting.field.name")} required />
      <View className="h-12 justify-center rounded-md border border-border-subtle bg-surface-sunken px-3">
        <TextInput
          className="font-text text-body text-text"
          onChangeText={(v) => update("name", v)}
          placeholder={i18n.t("tasting.field.namePlaceholder")}
          placeholderTextColor={colors.textFaint}
          value={state.name}
        />
      </View>

      <FieldLabel
        hint={i18n.t("tasting.field.scoreHint")}
        label={i18n.t("tasting.field.score")}
      />
      <View className="rounded-md border border-border-subtle bg-surface-sunken p-4">
        <ScoreSlider onChange={(s) => update("score", s)} value={state.score} />
      </View>

      <FieldLabel label={i18n.t("tasting.field.tags")} />
      <TagInput onChange={(t) => update("tags", t)} value={state.tags} />

      <FieldLabel label={i18n.t("tasting.field.memo")} />
      <TextInput
        className="min-h-24 rounded-md border border-border-subtle bg-surface-sunken p-3 font-text text-body text-text leading-relaxed"
        multiline
        onChangeText={(v) => update("memo", v)}
        placeholder={i18n.t("tasting.field.memoPlaceholder")}
        placeholderTextColor={colors.textFaint}
        textAlignVertical="top"
        value={state.memo}
      />

      <FieldLabel
        hint={i18n.t("tasting.field.placeHint")}
        label={i18n.t("tasting.field.place")}
      />
      <Pressable
        accessibilityRole="button"
        className="h-12 flex-row items-center justify-between rounded-md border border-border-subtle bg-surface-sunken px-3"
        onPress={() => {
          haptic.selection();
          setPickerVisible(true);
        }}
      >
        {state.placeName ? (
          <View className="flex-1 flex-row items-center gap-2">
            <Text
              className="font-medium font-text text-body text-text"
              numberOfLines={1}
            >
              {state.placeName}
            </Text>
            {state.placeCategory && (
              <Text className="font-text text-caption text-text-muted">
                {i18n.t(`placeCategory.${state.placeCategory}` as const)}
              </Text>
            )}
          </View>
        ) : (
          <Text className="font-text text-body text-text-faint">
            {i18n.t("tasting.field.placePlaceholder")}
          </Text>
        )}
        {state.placeId && (
          <Pressable
            accessibilityLabel={i18n.t("tasting.field.placeRemove")}
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleClearPlace}
          >
            <Text className="font-text text-caption text-text-muted">×</Text>
          </Pressable>
        )}
      </Pressable>

      <FieldLabel
        hint={i18n.t("tasting.field.priceHint")}
        label={i18n.t("tasting.field.price")}
      />
      <PriceRow
        amount={state.price}
        onAmountChange={(v) => update("price", v)}
        onUnitChange={(u) => update("priceUnit", u)}
        unit={state.priceUnit}
      />

      <PlacePicker
        onClose={() => setPickerVisible(false)}
        onSelect={handleSelectPlace}
        visible={pickerVisible}
      />
    </ScrollView>
  );
}

type FieldLabelProps = {
  label: string;
  required?: boolean;
  hint?: string;
};

function FieldLabel({ label, required, hint }: FieldLabelProps) {
  return (
    <View className="mt-5 mb-2 flex-row items-center justify-between">
      <View className="flex-row items-center gap-1">
        <Text className="font-semibold font-text text-overline text-text-subtle tracking-wider">
          {label.toUpperCase()}
        </Text>
        {required && (
          <Text className="font-text text-caption text-danger">*</Text>
        )}
      </View>
      {hint && (
        <Text className="font-text text-overline text-text-faint">{hint}</Text>
      )}
    </View>
  );
}
