/**
 * 완료 BottomSheet 관리 Hook
 * 완료 상태 BottomSheet 표시를 관리하는 재사용 가능한 훅
 */

import type GorhomBottomSheet from "@gorhom/bottom-sheet";

import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";

export function useCompletionSheet() {
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const snapPoints = useMemo(() => ["35%"], []);

  const show = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  const hide = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  return {
    sheetRef,
    snapPoints,
    show,
    hide,
    renderBackdrop,
  };
}
