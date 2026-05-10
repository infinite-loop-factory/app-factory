import type { Provider } from "@supabase/supabase-js";

// import * as Sentry from "@sentry/react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Github } from "lucide-react-native";
import { useEffect, useState } from "react";
import { AppleIcon } from "@/components/apple-icon";
import { GoogleIcon } from "@/components/google-icon";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
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
  icon?: typeof GoogleIcon | typeof Github | typeof AppleIcon;
  variant: "apple" | "google" | "github";
}[] = [
  {
    key: "apple",
    labelKey: "login.apple",
    icon: AppleIcon,
    variant: "apple",
  },
  {
    key: "google",
    labelKey: "login.google",
    icon: GoogleIcon,
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

const getButtonStyles = (variant: string) => {
  switch (variant) {
    case "apple":
    case "github":
      return {
        button:
          "h-12 w-full rounded-xl border border-typography-900 bg-typography-900 px-4 data-[hover=true]:bg-typography-800 data-[active=true]:bg-typography-700 data-[focus=true]:bg-typography-900",
        buttonStyle: undefined,
        buttonVariant: "solid" as const,
        icon: "text-typography-0",
        text: "ml-3 font-bold text-lg text-typography-0",
      };
    default: // google
      return {
        button:
          "h-12 w-full rounded-xl border border-outline-200 bg-background-0 px-4 data-[hover=true]:bg-background-50 data-[active=true]:bg-background-100",
        buttonStyle: undefined,
        buttonVariant: "outline" as const,
        icon: "text-typography-700",
        text: "ml-3 font-bold text-lg text-typography-900",
      };
  }
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
  const styles = getButtonStyles(provider.variant);

  return (
    <Button
      action="default"
      className={styles.button}
      disabled={disabled}
      onPress={() => onPress(provider.key)}
      style={styles.buttonStyle}
      variant={styles.buttonVariant}
    >
      <Box className="w-full flex-row items-center justify-center">
        {isPending && <ButtonSpinner className={styles.icon} />}
        {!isPending && provider.variant === "google" && (
          <GoogleIcon size={20} />
        )}
        {!isPending && provider.variant === "apple" && (
          <AppleIcon color="#FFFFFF" size={18} />
        )}
        {!isPending && provider.variant === "github" && (
          <ButtonIcon as={Github} className={styles.icon} size="md" />
        )}
        <ButtonText className={styles.text}>
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
      <Box className="flex-1 items-center justify-center bg-background-50 px-4 py-8">
        <Box className="w-full max-w-sm overflow-hidden rounded-2xl border border-outline-100 bg-background-0 shadow-soft-1">
          <Box className="h-1.5 w-full bg-primary-500" />

          <VStack className="items-center px-6 py-8" space="xl">
            <Image
              alt="country tracker logo"
              className="h-16 w-16"
              resizeMode="contain"
              source={require("@/assets/images/icon.png")}
            />

            <VStack className="w-full items-center" space="xs">
              <Heading className="text-center font-bold text-3xl text-typography-900">
                {i18n.t("login.hero-title")}
              </Heading>
              <Text className="text-center text-base text-typography-600">
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

            <Box className="flex-row items-center justify-center gap-6">
              <Button
                action="default"
                className="px-0"
                onPress={() => router.push("/terms" as never)}
                variant="link"
              >
                <Text className="text-sm text-typography-500">
                  {i18n.t("login.terms")}
                </Text>
              </Button>
              <Button
                action="default"
                className="px-0"
                onPress={() => router.push("/privacy" as never)}
                variant="link"
              >
                <Text className="text-sm text-typography-500">
                  {i18n.t("login.privacy")}
                </Text>
              </Button>
            </Box>
          </VStack>
        </Box>
      </Box>
    </>
  );
}
