import type { Provider } from "@supabase/supabase-js";

import * as Sentry from "@sentry/react-native";
import clsx from "clsx";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { flushLocationQueueIfAny } from "@/features/location/location-task";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import supabase from "@/libs/supabase";

WebBrowser.maybeCompleteAuthSession();
const redirectTo = makeRedirectUri();

const OAUTH_PROVIDERS: { key: Provider; labelKey: string }[] = [
  { key: "google", labelKey: "login.google" },
  { key: "github", labelKey: "login.github" },
  // 필요시 추가: { key: "kakao", labelKey: "login.kakao" }
];

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) {
    throw new Error(errorCode);
  }

  const { access_token, refresh_token } = params;
  if (!access_token) {
    return;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: access_token ?? "",
    refresh_token: refresh_token ?? "",
  });

  if (error) {
    throw error;
  }
  return data.session;
};

// * https://supabase.com/docs/guides/auth/native-mobile-deep-linking
export default function LoginPage() {
  const url = Linking.useURL();
  if (url) {
    createSessionFromUrl(url);
  }

  const { user, loading } = useAuthUser();
  const router = useRouter();
  const [background, cardBackground, headingColor, textColor] = useThemeColor([
    "background",
    "background-100",
    "typography-900",
    "typography",
  ]);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      // best-effort: flush any queued background locations after auth
      flushLocationQueueIfAny().catch((e) =>
        Sentry.captureMessage(`queue flush failed: ${String(e)}`),
      );
      router.replace("/");
    }
  }, [user, router]);

  const handleLogin = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;

      const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo,
      );
      if (res.type === "success") {
        await createSessionFromUrl(res.url);
        // after setting session, flush any queued locations
        await flushLocationQueueIfAny();
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : i18n.t("home.error-loading");
      toast.show({
        duration: 3000,
        render: () => (
          <Toast
            action="error"
            className="border-neutral-600"
            variant="outline"
          >
            <ToastTitle>{i18n.t("settings.toast.language.title")}</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        ),
      });
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: background }}
      >
        <View
          className="w-[400px] items-center rounded-3xl p-8 shadow-md"
          style={{ backgroundColor: cardBackground }}
        >
          {/* 앱 로고/아이콘 (예시: 지구본) */}
          <Image
            alt="logo"
            className="mb-4 h-12 w-12 rounded-xl"
            resizeMode="contain"
            source={require("@/assets/images/icon.png")}
          />
          <Text
            className="mb-2 font-bold text-2xl"
            style={{ color: headingColor }}
          >
            {i18n.t("login.title") || "Country Tracker"}
          </Text>
          <Text
            className="mb-7 text-center text-base"
            style={{ color: textColor }}
          >
            {i18n.t("login.description")}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            OAUTH_PROVIDERS.map((provider, idx) => (
              <Button
                className={clsx(
                  "w-full rounded-lg py-2",
                  idx !== OAUTH_PROVIDERS.length - 1 && "mb-4",
                )}
                key={provider.key}
                onPress={() => handleLogin(provider.key)}
                variant="outline"
              >
                <Text>{i18n.t(provider.labelKey)}</Text>
              </Button>
            ))
          )}
        </View>
      </View>
    </>
  );
}
