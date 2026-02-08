import {
  openLanguageSetting,
  openStorePage,
} from "@infinite-loop-factory/common";
import Constants from "expo-constants";
import { getLocales } from "expo-localization";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  CircleHelp,
  ExternalLink,
  Flag,
  Globe2,
  PlaneTakeoff,
  Wallet,
} from "lucide-react-native";
import { useMemo } from "react";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { stopLocationTask } from "@/features/location/location-permission";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";
import supabase from "@/lib/supabase";

export default function SettingsScreen() {
  const toast = useToast();
  const router = useRouter();
  const { user } = useAuthUser();

  const [iconColor, chevronColor] = useThemeColor([
    "typography-0",
    "typography-300",
  ]);

  const isKorean = i18n.locale === "ko";
  const deviceLocale = getLocales()[0];
  const regionCode = deviceLocale?.regionCode?.toUpperCase() ?? null;
  const currencyCode = deviceLocale?.currencyCode?.toUpperCase() ?? null;
  const userName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    i18n.t("settings.profile.default-name");
  const userEmail = user?.email ?? "-";
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const appBuild = String(
    Constants.expoConfig?.ios?.buildNumber ??
      Constants.expoConfig?.android?.versionCode ??
      "1",
  );
  const homeCountryValue = useMemo(() => {
    if (!regionCode) {
      return i18n.t("settings.preferences.home-country-value");
    }

    try {
      if (typeof Intl.DisplayNames === "function") {
        const displayNames = new Intl.DisplayNames([i18n.locale], {
          type: "region",
        });
        return displayNames.of(regionCode) ?? regionCode;
      }
    } catch {
      // ignore and fallback to code
    }

    return regionCode;
  }, [regionCode]);

  const currencyValue = useMemo(() => {
    if (!currencyCode) {
      return i18n.t("settings.preferences.currency-value");
    }

    try {
      const symbol = new Intl.NumberFormat(i18n.locale, {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value;

      if (!symbol || symbol === currencyCode) {
        return currencyCode;
      }
      return `${currencyCode} (${symbol})`;
    } catch {
      return currencyCode;
    }
  }, [currencyCode]);

  const handleLanguageSetting = async () => {
    const openLanguageSettingResult = await openLanguageSetting();
    if (!openLanguageSettingResult) {
      toast.show({
        duration: 3000,
        render: () => {
          return (
            <Toast action="error" variant="outline">
              <ToastTitle>{i18n.t("settings.toast.language.title")}</ToastTitle>
              <ToastDescription>
                {i18n.t("settings.toast.language.description")}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  const handleLogout = async () => {
    await stopLocationTask();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <ParallaxScrollView>
      <Box className="-mx-4 mb-5 border-outline-100 border-b px-5 pt-2 pb-3">
        <Heading className="font-bold text-3xl text-typography-950">
          {i18n.t("settings.title")}
        </Heading>
      </Box>

      <Box className="mx-1 rounded-2xl border border-outline-100 bg-background-0 shadow-xs">
        <Box className="flex-row items-center justify-between px-4 py-4">
          <Box className="flex-row items-center gap-4">
            <Box className="h-16 w-16 overflow-hidden rounded-full border border-outline-100">
              <Image
                alt="avatar"
                className="h-full w-full"
                source={
                  user?.user_metadata?.avatar_url
                    ? { uri: user.user_metadata.avatar_url }
                    : require("@/assets/images/icon.png")
                }
              />
            </Box>
            <Box className="flex-1">
              <Text
                className="font-bold text-typography-950 text-xl"
                numberOfLines={1}
              >
                {userName}
              </Text>
              <Text className="text-base text-secondary-600" numberOfLines={1}>
                {userEmail}
              </Text>
            </Box>
          </Box>
          <ChevronRight color={chevronColor} size={22} />
        </Box>
      </Box>

      <Box className="mx-1 mt-3 flex-row items-center justify-between px-4">
        <Text className="font-semibold text-secondary-700 text-sm uppercase tracking-wide">
          {i18n.t("settings.profile.plan")}
        </Text>
        <Badge className="rounded-lg bg-primary-100 px-3 py-1" size="sm">
          <BadgeText className="font-bold text-primary-500 text-sm">
            {i18n.t("settings.profile.pro-member")}
          </BadgeText>
        </Badge>
      </Box>

      <Text className="mx-5 mt-8 mb-3 font-bold text-secondary-700 text-sm uppercase tracking-wide">
        {i18n.t("settings.preferences.title")}
      </Text>
      <Box className="mx-1 overflow-hidden rounded-2xl border border-outline-100 bg-background-0 shadow-xs">
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => void handleLanguageSetting()}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-secondary-500">
              <Globe2 color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.preferences.language")}
            </Text>
          </Box>
          <Box className="flex-row items-center gap-2">
            <Text className="font-normal text-base text-secondary-600">
              {isKorean
                ? i18n.t("settings.preferences.language-value-ko")
                : i18n.t("settings.preferences.language-value-en")}
            </Text>
            <ChevronRight color={chevronColor} size={18} />
          </Box>
        </Button>
        <Divider className="bg-outline-100" />
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => router.push("/settings/denylist")}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-warning-500">
              <Flag color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.preferences.home-country")}
            </Text>
          </Box>
          <Box className="flex-row items-center gap-2">
            <Text className="font-normal text-base text-secondary-600">
              {homeCountryValue}
            </Text>
            <ChevronRight color={chevronColor} size={18} />
          </Box>
        </Button>
        <Divider className="bg-outline-100" />
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => router.push("/settings/license")}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-success-500">
              <Wallet color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.preferences.currency")}
            </Text>
          </Box>
          <Box className="flex-row items-center gap-2">
            <Text className="font-normal text-base text-secondary-600">
              {currencyValue}
            </Text>
            <ChevronRight color={chevronColor} size={18} />
          </Box>
        </Button>
      </Box>

      <Text className="mx-5 mt-8 mb-3 font-bold text-secondary-700 text-sm uppercase tracking-wide">
        {i18n.t("settings.support.title")}
      </Text>
      <Box className="mx-1 overflow-hidden rounded-2xl border border-outline-100 bg-background-0 shadow-xs">
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => void openStorePage({})}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-info-500">
              <CircleHelp color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.support.help-center")}
            </Text>
          </Box>
          <ExternalLink color={chevronColor} size={18} />
        </Button>
      </Box>

      <Box className="mx-1 mt-10 overflow-hidden rounded-2xl border border-outline-100 bg-background-0 shadow-xs">
        <Button
          action="default"
          className="h-14 w-full items-center justify-center rounded-none bg-transparent px-4"
          onPress={() => void handleLogout()}
        >
          <Text className="font-medium text-error-600 text-lg">
            {i18n.t("settings.logout")}
          </Text>
        </Button>
      </Box>

      <Box className="mt-12 mb-10 items-center justify-center gap-3">
        <Box className="flex-row items-center gap-2">
          <Box className="h-6 w-6 items-center justify-center rounded-md bg-primary-400">
            <PlaneTakeoff color={iconColor} size={14} />
          </Box>
          <Text className="font-bold text-typography-900 text-xl">
            {i18n.t("settings.footer.app-name")}
          </Text>
        </Box>
        <Text className="text-sm text-typography-400">
          {i18n.t("settings.footer.version-build", {
            build: appBuild,
            version: appVersion,
          })}
        </Text>
      </Box>
    </ParallaxScrollView>
  );
}
