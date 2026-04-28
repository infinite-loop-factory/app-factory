import { useState } from "react";
import { TextInput, View } from "react-native";
import { TagChip } from "@/components/ui-domain";
import i18n from "@/i18n";

export type TagInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

export function TagInput({ value, onChange }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim().replace(/^#/, "");
    if (!t) return;
    if (value.includes(t)) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  };

  const remove = (t: string) => {
    onChange(value.filter((x) => x !== t));
  };

  return (
    <View className="min-h-12 flex-row flex-wrap items-center gap-1.5 rounded-md border border-border-subtle bg-surface-sunken px-3 py-2">
      {value.map((t) => (
        <TagChip
          dismissible
          key={t}
          label={`#${t}`}
          onDismiss={() => remove(t)}
        />
      ))}
      <TextInput
        autoCapitalize="none"
        className="min-w-20 flex-1 font-text text-bodySm text-text"
        onChangeText={setDraft}
        onSubmitEditing={add}
        placeholder={i18n.t("tasting.field.tagsPlaceholder")}
        placeholderTextColor="rgb(var(--color-text-faint))"
        returnKeyType="done"
        value={draft}
      />
    </View>
  );
}
