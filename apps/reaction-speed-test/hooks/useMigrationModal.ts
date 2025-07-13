import type { User } from "@supabase/supabase-js";

import { useEffect, useState } from "react";
import { getLocalRecordsCount } from "@/services/localRecords";

export const useMigrationModal = (
  isAuthenticated: boolean,
  user: User | null,
) => {
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [hasCheckedMigration, setHasCheckedMigration] = useState(false);

  useEffect(() => {
    const checkForMigration = async () => {
      // 로그인했고, 아직 마이그레이션 체크를 안했고, 이미 모달이 표시되지 않은 경우
      if (
        isAuthenticated &&
        user &&
        !hasCheckedMigration &&
        !showMigrationModal
      ) {
        try {
          const localCount = await getLocalRecordsCount();
          if (localCount > 0) {
            setShowMigrationModal(true);
          }
          setHasCheckedMigration(true);
        } catch (error) {
          console.error("Failed to check for local records:", error);
          setHasCheckedMigration(true);
        }
      }
    };

    checkForMigration();
  }, [isAuthenticated, user, hasCheckedMigration, showMigrationModal]);

  const closeMigrationModal = () => {
    setShowMigrationModal(false);
  };

  const resetMigrationCheck = () => {
    setHasCheckedMigration(false);
    setShowMigrationModal(false);
  };

  return {
    showMigrationModal,
    closeMigrationModal,
    resetMigrationCheck,
  };
};
