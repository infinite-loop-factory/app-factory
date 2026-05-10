import { openLanguageSetting } from "@infinite-loop-factory/common";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import {
  Ban,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  FileText,
  Flag,
  Globe2,
  ShieldAlert,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { nationalityAtom } from "@/atoms/nationality.atom";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
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
  const [nationality, setNationality] = useAtom(nationalityAtom);

  const [iconColor, chevronColor] = useThemeColor([
    "primary-600",
    "typography-300",
  ]);
  const reduceMotion = useReducedMotion();

  const isKorean = i18n.locale === "ko";
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

  const [isNationalityModalOpen, setNationalityModalOpen] = useState(false);
  const [nationalityDraft, setNationalityDraft] = useState("");

  const openNationalityModal = () => {
    setNationalityDraft(nationality ?? "");
    setNationalityModalOpen(true);
  };

  const closeNationalityModal = () => setNationalityModalOpen(false);

  const submitNationality = () => {
    const trimmed = nationalityDraft.trim().toUpperCase();
    if (trimmed) void setNationality(trimmed);
    closeNationalityModal();
  };

  const content = (
    <>
      <Box className="-mx-4 mb-5 border-outline-100 border-b px-5 pt-2 pb-3">
        <Heading className="font-bold text-3xl text-typography-950">
          {i18n.t("settings.title")}
        </Heading>
      </Box>

      <Card className="mx-1 rounded-2xl border border-outline-100 bg-background-0 p-0 shadow-xs">
        <Box className="flex-row items-center justify-between px-4 py-4">
          <Box className="flex-row items-center gap-4">
            <Avatar className="border border-outline-100" size="lg">
              <AvatarFallbackText>{userName}</AvatarFallbackText>
              {user?.user_metadata?.avatar_url ? (
                <AvatarImage source={{ uri: user.user_metadata.avatar_url }} />
              ) : null}
            </Avatar>
            <Box className="flex-1 gap-1">
              <Box className="flex-row items-center gap-2">
                <Text
                  className="font-bold text-typography-950 text-xl"
                  numberOfLines={1}
                >
                  {userName}
                </Text>
                <Badge
                  className="rounded-full bg-primary-50 px-2 py-0.5"
                  size="sm"
                >
                  <BadgeText className="font-semibold text-primary-600 text-xs">
                    {i18n.t("settings.profile.pro-member")}
                  </BadgeText>
                </Badge>
              </Box>
              <Text className="text-base text-typography-500" numberOfLines={1}>
                {userEmail}
              </Text>
            </Box>
          </Box>
          <ChevronRight color={chevronColor} size={22} />
        </Box>
      </Card>

      <Text className="mx-5 mt-8 mb-3 font-semibold text-typography-500 text-xs uppercase tracking-wide">
        {i18n.t("settings.preferences.title")}
      </Text>
      <Card className="mx-1 overflow-hidden rounded-2xl border border-outline-100 bg-background-0 p-0 shadow-xs">
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => void handleLanguageSetting()}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-primary-50">
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
          onPress={openNationalityModal}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-primary-50">
              <Flag color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.nationality.label")}
            </Text>
          </Box>
          <Box className="flex-row items-center gap-2">
            <Text className="font-normal text-base text-secondary-600">
              {nationality || i18n.t("settings.nationality.not-set")}
            </Text>
            <ChevronRight color={chevronColor} size={18} />
          </Box>
        </Button>
        <Divider className="bg-outline-100" />
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => router.push("/settings/visa-limits" as never)}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-primary-50">
              <ShieldAlert color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("visa.title")}
            </Text>
          </Box>
          <ChevronRight color={chevronColor} size={18} />
        </Button>
        <Divider className="bg-outline-100" />
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => router.push("/settings/denylist")}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-primary-50">
              <Ban color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.general.denylist")}
            </Text>
          </Box>
          <ChevronRight color={chevronColor} size={18} />
        </Button>
        <Divider className="bg-outline-100" />
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => router.push("/settings/license")}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-primary-50">
              <FileText color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.general.license")}
            </Text>
          </Box>
          <ChevronRight color={chevronColor} size={18} />
        </Button>
      </Card>

      <Text className="mx-5 mt-8 mb-3 font-semibold text-typography-500 text-xs uppercase tracking-wide">
        {i18n.t("settings.support.title")}
      </Text>
      <Card className="mx-1 overflow-hidden rounded-2xl border border-outline-100 bg-background-0 p-0 shadow-xs">
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => router.push("/support" as never)}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-primary-50">
              <CircleHelp color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.support.help-center")}
            </Text>
          </Box>
          <ExternalLink color={chevronColor} size={18} />
        </Button>
        <Divider className="bg-outline-100" />
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => router.push("/privacy" as never)}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-primary-50">
              <ShieldAlert color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.support.privacy-policy")}
            </Text>
          </Box>
          <ExternalLink color={chevronColor} size={18} />
        </Button>
        <Divider className="bg-outline-100" />
        <Button
          action="default"
          className="h-14 w-full justify-between rounded-none bg-transparent px-4"
          onPress={() => router.push("/terms" as never)}
        >
          <Box className="flex-row items-center gap-3.5">
            <Box className="h-8 w-8 items-center justify-center rounded-md bg-primary-50">
              <FileText color={iconColor} size={17} />
            </Box>
            <Text className="font-medium text-base text-typography-900">
              {i18n.t("settings.support.terms")}
            </Text>
          </Box>
          <ExternalLink color={chevronColor} size={18} />
        </Button>
      </Card>

      <Card className="mx-1 mt-10 overflow-hidden rounded-2xl border border-outline-100 bg-background-0 p-0 shadow-xs">
        <Button
          action="default"
          className="h-14 w-full items-center justify-center rounded-none bg-transparent px-4"
          onPress={() => void handleLogout()}
        >
          <Text className="font-medium text-error-600 text-lg">
            {i18n.t("settings.logout")}
          </Text>
        </Button>
      </Card>

      <Box className="mt-12 mb-10 items-center justify-center gap-3">
        <Box className="flex-row items-center gap-2">
          <Image
            alt="country tracker logo"
            className="h-7 w-7"
            resizeMode="contain"
            source={require("@/assets/images/icon.png")}
          />
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
    </>
  );

  return (
    <>
      {reduceMotion ? (
        <ScrollView>{content}</ScrollView>
      ) : (
        <ParallaxScrollView>{content}</ParallaxScrollView>
      )}
      <Modal isOpen={isNationalityModalOpen} onClose={closeNationalityModal}>
        <ModalBackdrop />
        <ModalContent className="max-w-sm rounded-2xl">
          <ModalHeader>
            <Heading className="font-bold text-lg text-typography-900">
              {i18n.t("settings.nationality.title")}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Text className="mb-3 text-sm text-typography-600">
              {i18n.t("settings.nationality.message")}
            </Text>
            <Input className="rounded-xl">
              <InputField
                autoCapitalize="characters"
                autoFocus
                maxLength={3}
                onChangeText={setNationalityDraft}
                onSubmitEditing={submitNationality}
                placeholder="KR"
                returnKeyType="done"
                value={nationalityDraft}
              />
            </Input>
          </ModalBody>
          <ModalFooter className="gap-2">
            <Button
              action="secondary"
              className="flex-1 border border-outline-200"
              onPress={closeNationalityModal}
              variant="outline"
            >
              <ButtonText className="font-semibold text-typography-900">
                {i18n.t("common.cancel")}
              </ButtonText>
            </Button>
            <Button
              action="primary"
              className="flex-1"
              isDisabled={!nationalityDraft.trim()}
              onPress={submitNationality}
            >
              <ButtonText>{i18n.t("common.save")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
