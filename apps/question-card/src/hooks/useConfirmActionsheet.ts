/**
 * 확인 Actionsheet 관리 Hook
 * 확인/취소 다이얼로그 상태를 관리하는 재사용 가능한 훅
 */

import { useCallback, useState } from "react";

export function useConfirmActionsheet() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    open,
    close,
  };
}
