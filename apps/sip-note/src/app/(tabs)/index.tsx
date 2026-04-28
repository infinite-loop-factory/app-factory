import type { TastingNoteFilter } from "@/features/tasting/repo/types";

import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, DayDivider, EmptyState, Fab } from "@/components/ui-domain";
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

  // Filter state lives here; wire-up of search/category UI lands in the next commit.
  const [filter] = useState<TastingNoteFilter>({});
  const { buckets, isLoading } = useTastingFeed(filter);

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
            Welcome back
          </Text>
          <Text className="mt-1 font-display font-semibold text-display text-text">
            {i18n.t("tasting.feed.title")}
          </Text>
        </View>
        <Text className="font-display font-semibold text-brand text-h3 tracking-wide">
          {monthLabel}
        </Text>
      </View>

      {/*
        TODO Commit 3: 검색바 + 카테고리 칩 wire-up.
        TODO Phase 4: home-stats (이번 주 / 평균 / 누적) 연결.
      */}
      <View className="mx-6 mt-4 flex-row rounded-lg border border-border-subtle bg-surface px-1 py-3">
        {[
          { num: "—", lbl: "이번 주" },
          { num: "—", lbl: "평균 점수" },
          { num: "—", lbl: "올해 누적" },
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

      <View className="relative flex-1">
        {isEmpty ? (
          <EmptyState
            caption={i18n.t("empty.feed.body")}
            cta={{
              label: i18n.t("tasting.feed.fab"),
              onPress: () => router.push("/note/compose" as never),
            }}
            title={i18n.t("empty.feed.title")}
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
