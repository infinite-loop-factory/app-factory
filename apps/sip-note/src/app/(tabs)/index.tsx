import type { TastingCategory } from "@/db/schema";
import type { TastingNoteFilter } from "@/features/tasting/repo/types";

import { useRouter } from "expo-router";
import { useDeferredValue, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, DayDivider, EmptyState, Fab } from "@/components/ui-domain";
import { FilterBar } from "@/features/tasting/components/filter-bar";
import { useTastingFeed } from "@/features/tasting/hooks/use-tasting-feed";
import i18n from "@/i18n";

type FeedRow =
  | { kind: "divider"; key: string; label: string }
  | {
      kind: "card";
      key: string;
      note: import("@/features/tasting/repo/types").TastingNote;
    };

export default function HomeScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TastingCategory | undefined>(
    undefined,
  );
  const deferredQuery = useDeferredValue(query);

  const filter = useMemo<TastingNoteFilter>(
    () => ({
      query: deferredQuery.trim() || undefined,
      category,
    }),
    [deferredQuery, category],
  );

  const { buckets, isLoading } = useTastingFeed(filter);
  const isFiltered = Boolean(filter.query) || filter.category !== undefined;

  const rows = useMemo<FeedRow[]>(() => {
    const out: FeedRow[] = [];
    for (const bucket of buckets) {
      out.push({
        kind: "divider",
        key: `d-${bucket.key}`,
        label: bucket.label,
      });
      for (const note of bucket.notes) {
        out.push({ kind: "card", key: note.id, note });
      }
    }
    return out;
  }, [buckets]);

  const monthLabel = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const isEmpty = !isLoading && rows.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="flex-row items-end justify-between px-6 pt-3">
        <View>
          <Text className="font-semibold font-text text-overline text-text-subtle tracking-wider">
            {i18n.t("tasting.feed.greeting")}
          </Text>
          <Text className="mt-1 font-display font-semibold text-display text-text">
            {i18n.t("tasting.feed.title")}
          </Text>
        </View>
        <Text className="font-display font-semibold text-brand text-h3 tracking-wide">
          {monthLabel}
        </Text>
      </View>

      {/* TODO Phase 4: home-stats (이번 주 / 평균 / 누적) 연결. */}
      <View className="mx-6 mt-4 flex-row rounded-lg border border-border-subtle bg-surface px-1 py-3">
        {[
          { num: "—", lbl: i18n.t("tasting.feed.stats.thisWeek") },
          { num: "—", lbl: i18n.t("tasting.feed.stats.avgScore") },
          { num: "—", lbl: i18n.t("tasting.feed.stats.yearTotal") },
        ].map((s, idx) => (
          <View
            className={`flex-1 items-center px-2 ${idx > 0 ? "border-border-subtle border-l" : ""}`}
            key={s.lbl}
          >
            <Text className="font-display font-semibold text-h2 text-text">
              {s.num}
            </Text>
            <Text className="mt-0.5 font-text text-overline text-text-subtle tracking-wide">
              {s.lbl}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-4">
        <FilterBar
          category={category}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
          query={query}
        />
      </View>

      <View className="relative flex-1">
        {isEmpty ? (
          <EmptyState
            caption={
              isFiltered
                ? i18n.t("tasting.feed.noResultsBody")
                : i18n.t("empty.feed.body")
            }
            cta={
              isFiltered
                ? undefined
                : {
                    label: i18n.t("tasting.feed.fab"),
                    onPress: () => router.push("/note/compose" as never),
                  }
            }
            title={
              isFiltered
                ? i18n.t("tasting.feed.noResultsTitle")
                : i18n.t("empty.feed.title")
            }
          />
        ) : (
          <FlatList
            contentContainerClassName="pb-32 pt-4"
            data={rows}
            keyExtractor={(row) => row.key}
            renderItem={({ item }) => {
              if (item.kind === "divider") {
                return (
                  <View className="px-6">
                    <DayDivider label={item.label} />
                  </View>
                );
              }
              return (
                <View className="px-6 pt-3">
                  <Card
                    category={item.note.category}
                    name={item.note.name}
                    onPress={() =>
                      router.push(`/note/${item.note.id}` as never)
                    }
                    photoUri={item.note.photos[0] ?? null}
                    placeName={null}
                    score={item.note.score}
                    tags={item.note.tags}
                  />
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Fab
          accessibilityLabel={i18n.t("tasting.feed.fab")}
          onPress={() => router.push("/note/compose" as never)}
        />
      </View>
    </SafeAreaView>
  );
}
