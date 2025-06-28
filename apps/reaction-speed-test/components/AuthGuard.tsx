import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSegments } from "expo-router";
import type { PropsWithChildren } from "react";
import { useCallback, useEffect } from "react";

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const shouldRedirectToMenu = useCallback((currentPath: string): boolean => {
    const loginRelatedPaths = [
      "",
      "(pages)/login",
      "(pages)/signup",
      "(pages)",
    ];
    return loginRelatedPaths.includes(currentPath);
  }, []);

  const shouldRedirectToHome = useCallback(
    (currentPath: string): boolean => {
      const inAuthGroup = segments[0] === "(pages)";
      const allowedGuestPages = ["measurement"];
      const isGuestAllowedPage = allowedGuestPages.some((page) =>
        currentPath.includes(page),
      );

      return (
        inAuthGroup &&
        !currentPath.includes("login") &&
        !currentPath.includes("signup") &&
        !isGuestAllowedPage
      );
    },
    [segments],
  );

  useEffect(() => {
    if (loading) return;

    const currentPath = segments.join("/");

    if (isAuthenticated && shouldRedirectToMenu(currentPath)) {
      router.replace("/menu");
      return;
    }

    if (!isAuthenticated && shouldRedirectToHome(currentPath)) {
      router.replace("/");
      return;
    }
  }, [
    isAuthenticated,
    loading,
    segments,
    router,
    shouldRedirectToMenu,
    shouldRedirectToHome,
  ]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
