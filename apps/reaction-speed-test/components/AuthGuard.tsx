import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSegments } from "expo-router";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";

export default function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(pages)";
    const currentPath = segments.join("/");

    if (isAuthenticated) {
      if (
        currentPath === "" ||
        currentPath === "(pages)/login" ||
        currentPath === "(pages)/signup" ||
        currentPath === "(pages)"
      ) {
        router.replace("/menu");
      }
    } else if (
      !isAuthenticated &&
      inAuthGroup &&
      !currentPath.includes("login") &&
      !currentPath.includes("signup")
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, segments, router]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
