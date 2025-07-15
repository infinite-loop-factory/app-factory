import { type Href, useRouter } from "expo-router";
import { useCallback } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export const useAuthAwareNavigation = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const navigateToMenu = useCallback(() => {
    if (isAuthenticated) {
      router.push(ROUTES.MENU);
    } else {
      router.push(ROUTES.GUEST_MENU);
    }
  }, [isAuthenticated, router]);

  const navigateToResults = useCallback(() => {
    if (isAuthenticated) {
      router.push(ROUTES.RESULTS);
    } else {
      router.push(ROUTES.GUEST_RESULTS);
    }
  }, [isAuthenticated, router]);

  const navigateToHome = useCallback(() => {
    router.push(ROUTES.HOME);
  }, [router]);

  const navigateBackWithFallback = useCallback(
    (fallbackRoute?: string) => {
      // 히스토리가 있으면 뒤로가기, 없으면 메뉴나 홈으로
      if (router.canGoBack()) {
        router.back();
      } else if (fallbackRoute) {
        router.push(fallbackRoute as Href);
      } else if (isAuthenticated) {
        router.push(ROUTES.MENU);
      } else {
        router.push(ROUTES.HOME);
      }
    },
    [router, isAuthenticated],
  );

  return {
    navigateToMenu,
    navigateToResults,
    navigateToHome,
    navigateBackWithFallback,
    isAuthenticated,
  };
};
