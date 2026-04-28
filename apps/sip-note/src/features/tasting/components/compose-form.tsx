import type { PriceUnit, TastingCategory } from "@/db/schema";
import type {
  TastingNote,
  TastingNoteInput,
} from "@/features/tasting/repo/types";

import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import i18n from "@/i18n";
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
    placeId: null,
    tags: state.tags,
    photos: state.photos,
  };
}

export function ComposeForm({ initial, onChange }: ComposeFormProps) {
  const [state, setState] = useState<ComposeFormState>(() =>
    initial ? fromNote(initial) : blankState(),
  );

  const update = <K extends keyof ComposeFormState>(
    key: K,
    val: ComposeFormState[K],
  ) => {
    const next = { ...state, [key]: val };
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
        hint="선택 · 최대 5장"
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
          placeholderTextColor="rgb(var(--color-text-faint))"
          value={state.name}
        />
      </View>

      <FieldLabel
        hint="0.5 단위 · 위스키 잔"
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
        placeholderTextColor="rgb(var(--color-text-faint))"
        textAlignVertical="top"
        value={state.memo}
      />

      {/* TODO Phase 2: 자동 위치 태깅 + 변경 UI. */}

      <FieldLabel hint="선택" label={i18n.t("tasting.field.price")} />
      <PriceRow
        amount={state.price}
        onAmountChange={(v) => update("price", v)}
        onUnitChange={(u) => update("priceUnit", u)}
        unit={state.priceUnit}
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
