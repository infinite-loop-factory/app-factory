import type { TastingNote } from "@/features/tasting/repo/types";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import {
  ComposeForm,
  type ComposeFormState,
  toInput,
} from "@/features/tasting/components/compose-form";
import * as repo from "@/features/tasting/repo/tastingNoteRepo";
import { useThemeColors } from "@/hooks/use-theme-colors";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";
import * as photoService from "@/services/photo";

async function persistPhotos(
  uris: string[],
  noteId: string,
  alreadyPersisted: Set<string> = new Set(),
): Promise<string[]> {
  const out: string[] = [];
  let i = 0;
  for (const uri of uris) {
    if (alreadyPersisted.has(uri)) {
      out.push(uri);
    } else {
      const saved = await photoService.savePhotoToNote(uri, noteId, i);
      out.push(saved);
    }
    i += 1;
  }
  return out;
}

export default function ComposeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();
  const isEdit = Boolean(noteId);

  const [initial, setInitial] = useState<TastingNote | undefined>(undefined);
  const [loaded, setLoaded] = useState(!isEdit);
  const [draft, setDraft] = useState<ComposeFormState | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!noteId) return;
    let active = true;
    repo
      .get(noteId)
      .then((n) => {
        if (!active) return;
        if (n) setInitial(n);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [noteId]);

  const handleSave = async () => {
    if (!(draft && isValid) || submitting) return;
    setSubmitting(true);
    try {
      const input = toInput(draft);
      if (isEdit && noteId) {
        const photos = await persistPhotos(
          input.photos ?? [],
          noteId,
          new Set(initial?.photos ?? []),
        );
        await repo.update(noteId, { ...input, photos });
      } else {
        const created = await repo.create({ ...input, photos: [] });
        const photos = await persistPhotos(input.photos ?? [], created.id);
        if (photos.length > 0) {
          await repo.update(created.id, { ...input, photos });
        }
      }
      haptic.success();
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) return null;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <Pressable
          accessibilityLabel={i18n.t("common.close")}
          accessibilityRole="button"
          className="h-9 w-9 items-center justify-center rounded-pill border border-border-subtle bg-surface"
          onPress={() => router.back()}
        >
          <Svg fill="none" height={14} viewBox="0 0 24 24" width={14}>
            <Path
              d="M6 6l12 12M18 6L6 18"
              stroke={colors.textMuted}
              strokeLinecap="round"
              strokeWidth={2.2}
            />
          </Svg>
        </Pressable>

        <Text className="font-display font-semibold text-h3 text-text">
          {i18n.t(isEdit ? "tasting.write.editTitle" : "tasting.write.title")}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid || submitting }}
          className={
            isValid && !submitting
              ? "h-9 items-center justify-center rounded-pill bg-brand px-4"
              : "h-9 items-center justify-center rounded-pill bg-brand px-4 opacity-40"
          }
          disabled={!isValid || submitting}
          onPress={handleSave}
        >
          <Text className="font-semibold font-text text-bodySm text-text-onBrand">
            {i18n.t("common.save")}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-5">
        <ComposeForm
          initial={initial}
          onChange={(s, v) => {
            setDraft(s);
            setIsValid(v);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
