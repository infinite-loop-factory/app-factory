import { useRouter } from "expo-router";
import { useAuth } from "./useAuth";

export const useAuthAwareNavigation = () => {
  const router = useRouter();
  const { isAuthenticated, getRedirectPath } = useAuth();

  const navigateBackWithFallback = async (fallbackPath: string) => {
    try {
      const redirectPath = await getRedirectPath();
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push(fallbackPath);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      router.push(fallbackPath);
    }
  };

  const navigateToMenu = () => {
    if (isAuthenticated) {
      router.push("/menu");
    } else {
      router.push("/guest-menu");
    }
  };

  const navigateToResults = () => {
    if (isAuthenticated) {
      router.push("/results");
    } else {
      router.push("/guest-results");
    }
  };

  const navigateToHome = () => {
    router.push("/");
  };

  return {
    navigateBackWithFallback,
    navigateToMenu,
    navigateToResults,
    navigateToHome,
  };
};
