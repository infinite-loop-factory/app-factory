import type { Place } from "@/features/place/repo/types";
import type { TastingNote } from "@/features/tasting/repo/types";

import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import * as placeRepo from "@/features/place/repo/place-repo";
import * as tastingRepo from "@/features/tasting/repo/tasting-note-repo";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";

export type PlaceSummarySheetRef = {
  present: (placeId: string) => void;
};

export type PlaceSummarySheetProps = {
  onViewDetail: (placeId: string) => void;
};

export const PlaceSummarySheet = forwardRef<
  PlaceSummarySheetRef,
  PlaceSummarySheetProps
>(({ onViewDetail }, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [latestNote, setLatestNote] = useState<TastingNote | null>(null);

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  useImperativeHandle(ref, () => ({
    present: async (id: string) => {
      const [p, notes] = await Promise.all([
        placeRepo.get(id),
        tastingRepo.list({ placeId: id }),
      ]);
      setPlace(p);
      setLatestNote(notes[0] ?? null);
      sheetRef.current?.present();
    },
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const handleViewDetail = () => {
    if (!place) return;
    haptic.selection();
    sheetRef.current?.dismiss();
    onViewDetail(place.id);
  };

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      index={0}
      ref={sheetRef}
      snapPoints={snapPoints}
    >
      <BottomSheetView className="px-4 pt-3 pb-8">
        {place ? (
          <View>
            {place.category && (
              <View className="mb-2 flex-row">
                <View className="rounded-pill bg-surface-sunken px-2 py-0.5">
                  <Text className="font-text text-caption text-text-muted">
                    {i18n.t(`placeCategory.${place.category}` as const)}
                  </Text>
                </View>
              </View>
            )}
            <Text className="font-semibold font-text text-h3 text-text">
              {place.name}
            </Text>
            {place.address && (
              <Text className="mt-1 font-text text-caption text-text-muted">
                {place.address}
              </Text>
            )}
            <Text className="mt-2 font-text text-caption text-text-muted">
              {i18n.t("place.detail.visitCount", { count: place.visitCount })}
            </Text>

            {latestNote && (
              <View className="mt-4 rounded-md border border-border-subtle bg-surface-sunken p-3">
                <Text className="font-text text-caption text-text-muted">
                  {i18n.t("place.detail.recentNote")}
                </Text>
                <Text
                  className="mt-1 font-medium font-text text-body text-text"
                  numberOfLines={1}
                >
                  {latestNote.name}
                </Text>
                {latestNote.score != null && (
                  <Text className="mt-0.5 font-text text-caption text-text-muted">
                    ★ {latestNote.score}
                  </Text>
                )}
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              className="mt-4 h-12 items-center justify-center rounded-md bg-brand"
              onPress={handleViewDetail}
            >
              <Text className="font-medium font-text text-body text-text-onBrand">
                {i18n.t("place.summary.viewDetail")}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

PlaceSummarySheet.displayName = "PlaceSummarySheet";
