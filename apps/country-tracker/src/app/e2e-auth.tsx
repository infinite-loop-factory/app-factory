import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { isE2EEnabled } from "@/features/e2e/utils/is-e2e-enabled";
import supabase from "@/lib/supabase";

type Phase = "verifying" | "applying" | "done" | "failed";

/**
 * E2E auth bypass route.
 *
 * Accepts `access_token` and `refresh_token` query parameters, calls
 * `supabase.auth.setSession()`, and redirects to home on success.
 *
 * Gated by `isE2EEnabled()` (double check: __DEV__ + env flag). Returns
 * <Redirect href="/login" /> in any other environment — production builds
 * see this as a no-op route.
 *
 * Triggered by:
 *   `country-tracker://e2e-auth?access_token=...&refresh_token=...`
 */
export default function E2EAuthRoute() {
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
  }>();
  const [phase, setPhase] = useState<Phase>("verifying");

  useEffect(() => {
    if (!isE2EEnabled()) {
      setPhase("failed");
      return;
    }
    if (!(access_token && refresh_token)) {
      setPhase("failed");
      return;
    }
    setPhase("applying");
    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        setPhase(error ? "failed" : "done");
      })
      .catch(() => setPhase("failed"));
  }, [access_token, refresh_token]);

  if (!isE2EEnabled() || phase === "failed") {
    return <Redirect href="/login" />;
  }

  if (phase === "done") {
    return <Redirect href="/" />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Spinner size="large" />
      <Text>E2E session…</Text>
    </View>
  );
}
