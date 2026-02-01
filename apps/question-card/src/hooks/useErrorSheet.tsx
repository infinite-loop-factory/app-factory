/**
 * 에러 BottomSheet 관리 Hook
 * 에러 상태 감지 및 BottomSheet 표시를 관리하는 재사용 가능한 훅
 */

import type GorhomBottomSheet from "@gorhom/bottom-sheet";

import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useErrorSheet() {
  const sheetRef = useRef<GorhomBottomSheet>(null);
  const snapPoints = useMemo(() => ["35%"], []);
  const [hasError, setHasError] = useState(false);

  // 에러시 자동으로 시트 열기
  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        sheetRef.current?.snapToIndex(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  const show = useCallback(() => {
    setHasError(true);
  }, []);

  const hide = useCallback(() => {
    sheetRef.current?.close();
    setHasError(false);
  }, []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="none"
      />
    ),
    [],
  );

  return {
    sheetRef,
    snapPoints,
    hasError,
    setHasError,
    show,
    hide,
    renderBackdrop,
  };
}
