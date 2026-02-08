import type { Provider } from "@supabase/supabase-js";

// import * as Sentry from "@sentry/react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Chrome, Github } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { flushLocationQueueIfAny } from "@/features/location/location-task";
import { useAuthUser } from "@/hooks/use-auth-user";
import i18n from "@/lib/i18n";
import supabase from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();
const redirectTo = makeRedirectUri();

const OAUTH_PROVIDERS: {
  key: Provider;
  labelKey: string;
  icon: typeof Chrome | typeof Github;
  variant: "google" | "github";
}[] = [
  {
    key: "google",
    labelKey: "login.google",
    icon: Chrome,
    variant: "google",
  },
  {
    key: "github",
    labelKey: "login.github",
    icon: Github,
    variant: "github",
  },
];

type OAuthProviderConfig = (typeof OAUTH_PROVIDERS)[number];

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

function OAuthProviderButton({
  provider,
  disabled,
  isPending,
  onPress,
}: {
  provider: OAuthProviderConfig;
  disabled: boolean;
  isPending: boolean;
  onPress: (provider: Provider) => void;
}) {
  const isGithub = provider.variant === "github";
  const buttonClassName = isGithub
    ? "h-12 w-full rounded-xl border border-typography-900 bg-typography-900 px-4"
    : "h-12 w-full rounded-xl border border-outline-200 bg-background-0 px-4";
  const iconClassName = isGithub ? "text-typography-0" : "text-typography-700";
  const textClassName = isGithub
    ? "ml-3 font-bold text-lg text-typography-0"
    : "ml-3 font-bold text-lg text-typography-900";

  return (
    <Button
      action="default"
      className={buttonClassName}
      disabled={disabled}
      onPress={() => onPress(provider.key)}
      variant={isGithub ? "solid" : "outline"}
    >
      <Box className="w-full flex-row items-center justify-center">
        {isPending ? (
          <ButtonSpinner className={iconClassName} />
        ) : (
          <ButtonIcon as={provider.icon} className={iconClassName} size="md" />
        )}
        <ButtonText className={textClassName}>
          {i18n.t(provider.labelKey)}
        </ButtonText>
      </Box>
    </Button>
  );
}

// * https://supabase.com/docs/guides/auth/native-mobile-deep-linking
export default function LoginPage() {
  const url = Linking.useURL();
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const toast = useToast();
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);

  useEffect(() => {
    if (!url) return;

    createSessionFromUrl(url).catch((_error) => {
      // session parsing can fail on non-auth deep links
    });
  }, [url]);

  useEffect(() => {
    if (user) {
      // best-effort: flush any queued background locations after auth
      flushLocationQueueIfAny().catch((_e) => {
        /* ignore error */
      });
      router.replace("/");
    }
  }, [user, router]);

  const handleLogin = async (provider: Provider) => {
    setPendingProvider(provider);

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
            className="border-outline-300"
            variant="outline"
          >
            <ToastTitle>{i18n.t("settings.toast.language.title")}</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        ),
      });
    } finally {
      setPendingProvider(null);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Box className="flex-1 items-center justify-center bg-background-light px-4 py-8 dark:bg-background-dark">
        <Box className="absolute -top-16 -left-20 h-56 w-56 rounded-full bg-primary-100 opacity-40" />
        <Box className="absolute -right-20 -bottom-16 h-56 w-56 rounded-full bg-primary-200 opacity-30" />

        <Box className="w-full max-w-sm overflow-hidden rounded-3xl border border-outline-100 bg-background-0 shadow-soft-2">
          <Box className="h-1.5 w-full bg-primary-300" />

          <VStack className="items-center px-6 py-8" space="xl">
            <Badge
              action="warning"
              className="rounded-full px-3 py-1"
              size="sm"
            >
              <BadgeText className="font-semibold text-warning-700 text-xs">
                {i18n.t("login.badge")}
              </BadgeText>
            </Badge>

            <Box className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
              <Image
                alt="country tracker logo"
                className="h-8 w-8"
                resizeMode="contain"
                source={require("@/assets/images/icon.png")}
              />
            </Box>

            <VStack className="w-full items-center" space="sm">
              <Heading className="text-center font-bold text-4xl text-typography-950 dark:text-typography-0">
                {i18n.t("login.hero-title")}
              </Heading>
              <Text className="text-center text-typography-600 text-xl dark:text-typography-300">
                {i18n.t("login.hero-subtitle")}
              </Text>
            </VStack>

            <VStack className="w-full" space="sm">
              {loading ? (
                <>
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </>
              ) : (
                OAUTH_PROVIDERS.map((provider) => (
                  <OAuthProviderButton
                    disabled={pendingProvider !== null}
                    isPending={pendingProvider === provider.key}
                    key={provider.key}
                    onPress={(currentProvider) =>
                      void handleLogin(currentProvider)
                    }
                    provider={provider}
                  />
                ))
              )}
            </VStack>

            <Divider className="bg-outline-100" />

            <Box className="flex-row items-center justify-center gap-5">
              <Button action="default" className="px-0" variant="link">
                <Text className="text-sm text-typography-500">
                  {i18n.t("login.terms")}
                </Text>
              </Button>
              <Button action="default" className="px-0" variant="link">
                <Text className="text-sm text-typography-500">
                  {i18n.t("login.privacy")}
                </Text>
              </Button>
            </Box>

            <Box className="mt-1 flex-row items-center gap-2">
              <Text className="text-center text-typography-500 text-xs">
                {i18n.t("login.security-note")}
              </Text>
            </Box>
          </VStack>
        </Box>
      </Box>
    </>
  );
}
