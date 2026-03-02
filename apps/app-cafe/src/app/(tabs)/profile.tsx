import { Image } from "expo-image";
import {
  Globe,
  Mail,
  MapPin,
  Palette,
  Smartphone,
  User,
  Wand2,
} from "lucide-react-native";
import { View } from "react-native";
import { LanguageToggle } from "@/components/features/setting/toggle/language-toggle";
import { TabBarStyleToggle } from "@/components/features/setting/toggle/tab-bar-style-toggle";
import { ThemeStyleToggle } from "@/components/features/setting/toggle/theme-style-toggle";
import { ThemeSwitch } from "@/components/features/theme/controls/theme-switch";
import { BaseLayout } from "@/components/ui/layout/base-layout";
import { ThemedText } from "@/components/ui/themed-text";
import { useTranslation } from "@/hooks/use-translation.ts";

export default function ProfileScreen() {
  const { t } = useTranslation();

  return (
    <BaseLayout
      contentContainerStyle={{ paddingBottom: 20 }}
      scrollable
      title={t("profile")}
    >
      <View className="px-4 pt-6">
        <View className="mb-6 items-center">
          <View className="mb-4 overflow-hidden rounded-full">
            <View className="h-24 w-24">
              <Image
                contentFit="cover"
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                }}
                style={{ height: "100%", width: "100%" }}
              />
            </View>
          </View>
          <View className="mb-1">
            <ThemedText className="font-black text-2xl text-typography-0">
              김카페
            </ThemedText>
          </View>
          <ThemedText className="text-typography-300">
            cafe@example.com
          </ThemedText>
        </View>

        <View className="mb-4">
          <ThemedText
            className="mb-2 ml-1 font-semibold text-typography-300"
            translationKey="profile.accountInfo"
          />
          <View className="overflow-hidden rounded-xl bg-background-0">
            <View className="border-primary-200">
              <View className="h-[52px] flex-row items-center gap-3 border-primary-200 border-b px-4">
                <User
                  className="mr-3"
                  color="rgba(148, 163, 184, 1)"
                  size={20}
                />
                <ThemedText
                  className="flex-1 text-typography-100"
                  translationKey={"profile.name"}
                />
                <ThemedText className="text-typography-300">김카페</ThemedText>
              </View>
              <View className="h-[52px] flex-row items-center gap-3 border-primary-200 border-b px-4">
                <Mail
                  className="mr-3"
                  color="rgba(148, 163, 184, 1)"
                  size={20}
                />
                <ThemedText
                  className="flex-1 text-typography-100"
                  translationKey={"profile.email"}
                />
                <ThemedText className="text-typography-300">
                  cafe@example.com
                </ThemedText>
              </View>
              <View className="h-[52px] flex-row items-center gap-3 px-4">
                <MapPin
                  className="mr-3"
                  color="rgba(148, 163, 184, 1)"
                  size={20}
                />
                <ThemedText
                  className="flex-1 text-typography-100"
                  translationKey="profile.location"
                />
                <ThemedText className="text-typography-300">서울시</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-4">
          <ThemedText
            className="mb-2 ml-1 font-semibold text-typography-300"
            translationKey="settings.language"
          />
          <View className="overflow-hidden rounded-xl bg-background-0">
            <View className="border-primary-200">
              <View className="h-[52px] flex-row items-center justify-between px-4">
                <View className="flex-row items-center gap-3">
                  <Globe color="rgba(148, 163, 184, 1)" size={20} />
                  <ThemedText
                    className="text-typography-100"
                    translationKey="settings.language"
                  />
                </View>
                <View className="flex-1" />
                <LanguageToggle />
              </View>

              <View className="h-[52px] flex-row items-center justify-between border-primary-200 border-t px-4">
                <View className="flex-row items-center gap-3">
                  <Palette color="rgba(148, 163, 184, 1)" size={20} />
                  <ThemedText
                    className="text-typography-100"
                    translationKey="settings.themeColor"
                  />
                </View>
                <View className="flex-1" />
                <ThemeSwitch />
              </View>

              <View className="h-[52px] flex-row items-center justify-between border-primary-200 border-t px-4">
                <View className="flex-row items-center gap-3">
                  <Wand2 color="rgba(148, 163, 184, 1)" size={20} />
                  <ThemedText
                    className="text-typography-100"
                    translationKey="settings.themeStyle"
                  />
                </View>
                <View className="flex-1" />
                <ThemeStyleToggle />
              </View>

              <View className="h-[52px] flex-row items-center justify-between border-primary-200 border-t px-4">
                <View className="flex-row items-center gap-3">
                  <Smartphone color="rgba(148, 163, 184, 1)" size={20} />
                  <ThemedText
                    className="text-typography-100"
                    translationKey="settings.tabBarStyle"
                  />
                </View>
                <View className="flex-1" />
                <TabBarStyleToggle />
              </View>
            </View>
          </View>
        </View>

        <View>
          <ThemedText
            className="mb-2 ml-1 font-semibold text-typography-300"
            translationKey="profile.ownerMode"
          />
          <View className="overflow-hidden rounded-xl bg-background-0">
            <View className="h-[100px] items-center justify-center border-primary-200 px-4">
              <ThemedText
                className="text-typography-300"
                translationKey="profile.ownerModeDescription"
              />
            </View>
          </View>
        </View>
      </View>
    </BaseLayout>
  );
}
