import type { TastingNote } from "@/features/tasting/repo/types";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import { CategoryGlyph, ScoreStars, TagChip } from "@/components/ui-domain";
import * as repo from "@/features/tasting/repo/tastingNoteRepo";
import {
  formatDateLong,
  formatDateShort,
} from "@/features/tasting/utils/format-date";
import { useThemeColors, withAlpha } from "@/hooks/use-theme-colors";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";

export default function NoteDetailScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<TastingNote | null | undefined>(undefined);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (!id) return;
    let active = true;
    repo.get(id).then((n) => {
      if (active) setNote(n);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (note === undefined) return null;

  if (note === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg">
        <Text className="font-text text-bodySm text-text-subtle">
          {i18n.t("tasting.detail.notFound")}
        </Text>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    router.push(`/note/compose?noteId=${note.id}` as never);
  };

  const handleDelete = () => {
    Alert.alert(i18n.t("tasting.delete.confirm"), undefined, [
      { text: i18n.t("common.cancel"), style: "cancel" },
      {
        text: i18n.t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await repo.remove(note.id);
          haptic.warning();
          router.back();
        },
      },
    ]);
  };

  const heroPhoto = note.photos[activePhoto];

  return (
    <View className="flex-1 bg-bg">
      <ScrollView
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="aspect-[4/3] bg-surface-sunken">
          {heroPhoto ? (
            <Image className="h-full w-full" source={{ uri: heroPhoto }} />
          ) : (
            <View className="flex-1 items-center justify-center">
              <CategoryGlyph category={note.category} size={80} />
            </View>
          )}
          <SafeAreaView
            className="absolute top-0 right-0 left-0 flex-row justify-between p-4"
            edges={["top"]}
          >
            <IconButton onPress={() => router.back()}>
              <Path
                d="M15 18l-6-6 6-6"
                stroke={colors.text}
                strokeLinecap="round"
                strokeWidth={2}
              />
            </IconButton>
          </SafeAreaView>
          {note.photos.length > 1 && (
            <View className="absolute right-0 bottom-3 left-0 flex-row justify-center gap-1">
              {note.photos.map((uri, idx) => (
                <Pressable
                  accessibilityLabel={i18n.t("tasting.a11y.photoIndex", {
                    index: idx + 1,
                  })}
                  accessibilityRole="button"
                  className={
                    idx === activePhoto
                      ? "h-1.5 w-4 rounded-pill bg-brand"
                      : "h-1.5 w-1.5 rounded-pill bg-text-faint"
                  }
                  key={uri}
                  onPress={() => setActivePhoto(idx)}
                />
              ))}
            </View>
          )}
        </View>

        <View className="px-6 pt-5">
          <View
            className="h-6 flex-row items-center gap-1.5 self-start rounded-pill px-2"
            style={{
              backgroundColor: withAlpha(colors.drink[note.category], 0.18),
            }}
          >
            <View
              className="h-1.5 w-1.5 rounded-pill"
              style={{ backgroundColor: colors.drink[note.category] }}
            />
            <Text
              className="font-semibold font-text text-overline tracking-wider"
              style={{ color: colors.drink[note.category] }}
            >
              {i18n.t(`category.${note.category}` as const).toUpperCase()}
            </Text>
          </View>

          <Text className="mt-2 font-display font-semibold text-h1 text-text">
            {note.name}
          </Text>
          <Text className="mt-1 font-text text-bodySm text-text-subtle">
            {formatDateLong(note.date)}
          </Text>

          {note.score != null && (
            <View className="mt-4 flex-row items-center gap-3 rounded-md border border-border-subtle bg-surface p-4">
              <Text className="font-display font-semibold text-brand text-display">
                {note.score.toFixed(1)}
              </Text>
              <View className="flex-1 gap-1">
                <Text className="font-medium font-text text-overline text-text-subtle tracking-wider">
                  {i18n.t("tasting.field.score").toUpperCase()}
                </Text>
                <ScoreStars score={note.score} size={18} />
              </View>
            </View>
          )}

          {note.tags.length > 0 && (
            <View className="mt-4 flex-row flex-wrap gap-1.5">
              {note.tags.map((t) => (
                <TagChip key={t} label={`#${t}`} variant="outline" />
              ))}
            </View>
          )}

          {note.memo && (
            <>
              <SectionTitle label={i18n.t("tasting.field.memo")} />
              <View className="rounded-md border border-border-subtle bg-surface p-4">
                <Text className="mb-1 font-display font-semibold text-brand text-h2">
                  &ldquo;
                </Text>
                <Text className="font-text text-body text-text leading-relaxed">
                  {note.memo}
                </Text>
              </View>
            </>
          )}

          <SectionTitle label={i18n.t("tasting.detail.sectionInfo")} />
          <View className="flex-row flex-wrap gap-2">
            <MetaTile label={i18n.t("tasting.field.date")}>
              {formatDateShort(note.date)}
            </MetaTile>
            {note.price != null && (
              <MetaTile label={i18n.t("tasting.field.price")}>
                ₩{note.price.toLocaleString()}
                {note.priceUnit
                  ? ` / ${i18n.t(
                      note.priceUnit === "glass"
                        ? "tasting.field.priceUnitGlass"
                        : "tasting.field.priceUnitBottle",
                    )}`
                  : ""}
              </MetaTile>
            )}
            <MetaTile label={i18n.t("tasting.field.photos")}>
              {note.photos.length > 0
                ? i18n.t("tasting.detail.photosCount", {
                    count: note.photos.length,
                  })
                : i18n.t("tasting.detail.noPhotos")}
            </MetaTile>
          </View>

          <View className="mt-6 flex-row gap-2">
            <ActionButton onPress={handleEdit}>
              {i18n.t("common.edit")}
            </ActionButton>
            <ActionButton danger onPress={handleDelete}>
              {i18n.t("common.delete")}
            </ActionButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function IconButton({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="h-9 w-9 items-center justify-center rounded-pill border border-border-subtle"
      onPress={onPress}
      style={{ backgroundColor: "rgba(20,16,12,0.55)" }}
    >
      <Svg fill="none" height={16} viewBox="0 0 24 24" width={16}>
        {children}
      </Svg>
    </Pressable>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <Text className="mt-6 mb-3 font-semibold font-text text-overline text-text-subtle tracking-wider">
      {label.toUpperCase()}
    </Text>
  );
}

function MetaTile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="min-w-[48%] flex-1 rounded-md border border-border-subtle bg-surface px-3 py-2">
      <Text className="font-semibold font-text text-overline text-text-subtle tracking-wider">
        {label.toUpperCase()}
      </Text>
      <Text className="mt-1 font-semibold font-text text-bodySm text-text">
        {children}
      </Text>
    </View>
  );
}

function ActionButton({
  children,
  onPress,
  danger = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className={
        danger
          ? "h-12 flex-1 items-center justify-center rounded-md border border-danger-soft bg-danger-soft"
          : "h-12 flex-1 items-center justify-center rounded-md border border-border bg-surface"
      }
      onPress={onPress}
    >
      <Text
        className={
          danger
            ? "font-semibold font-text text-bodySm text-danger"
            : "font-semibold font-text text-bodySm text-text"
        }
      >
        {children}
      </Text>
    </Pressable>
  );
}
