import { type Href, useRouter } from "expo-router";
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export const useAuthAwareNavigation = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const navigateToMenu = useCallback(() => {
    if (isAuthenticated) {
      router.push("/menu");
    } else {
      router.push("/guest-menu");
    }
  }, [isAuthenticated, router]);

  const navigateToResults = useCallback(() => {
    if (isAuthenticated) {
      router.push("/results");
    } else {
      router.push("/guest-results");
    }
  }, [isAuthenticated, router]);

  const navigateToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const smartBack = useCallback(
    (fallbackRoute?: string) => {
      // 히스토리가 있으면 뒤로가기, 없으면 메뉴나 홈으로
      if (router.canGoBack()) {
        router.back();
      } else if (fallbackRoute) {
        router.push(fallbackRoute as Href);
      } else if (isAuthenticated) {
        router.push("/menu");
      } else {
        router.push("/");
      }
    },
    [router, isAuthenticated],
  );

  return {
    navigateToMenu,
    navigateToResults,
    navigateToHome,
    smartBack,
    isAuthenticated,
  };
};
