import { Image } from "expo-image";
import { Mail, MapPin, User } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { LanguageAndThemeToggle } from "@/components/language-and-theme-toggle";
import { useTranslation } from "@/hooks/use-translation";

export default function ProfileScreen() {
  const { t } = useTranslation();
  return (
    <ScrollView
      className="flex-1 bg-background-100"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="px-4 pt-4">
        <View className="mb-6 items-center">
          <View className="mb-4 overflow-hidden rounded-full">
            <Image
              className="h-24 w-24"
              contentFit="cover"
              source="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            />
          </View>
          <Text className="mb-1 font-bold text-2xl text-typography-100">
            김카페
          </Text>
          <Text className="text-typography-300">cafe@example.com</Text>
        </View>

        <View className="mb-6">
          <View className="overflow-hidden rounded-xl bg-background-0">
            <Text className="flex h-[42px] items-center px-4 font-semibold text-base text-typography-100">
              {t("accountInfo")}
            </Text>
            <View className="border-outline-100 border-t">
              <View className="h-[52px] flex-row items-center border-outline-100 border-b px-4">
                <User className="mr-3 text-outline-400" size={20} />
                <Text className="flex-1 text-typography-100">{t("name")}</Text>
                <Text className="text-typography-300">김카페</Text>
              </View>
              <View className="h-[52px] flex-row items-center border-outline-100 border-b px-4">
                <Mail className="mr-3 text-outline-400" size={20} />
                <Text className="flex-1 text-typography-100">{t("email")}</Text>
                <Text className="text-typography-300">cafe@example.com</Text>
              </View>
              <View className="h-[52px] flex-row items-center px-4">
                <MapPin className="mr-3 text-outline-400" size={20} />
                <Text className="flex-1 text-typography-100">
                  {t("location")}
                </Text>
                <Text className="text-typography-300">서울시</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <LanguageAndThemeToggle />
        </View>

        <View>
          <View className="overflow-hidden rounded-xl bg-background-0">
            <Text className="flex h-[42px] items-center px-4 font-semibold text-base text-typography-100">
              {t("ownerMode")}
            </Text>
            <View className="h-[100px] items-center justify-center border-outline-100 border-t px-4">
              <Text className="text-typography-300">
                {t("ownerModeDescription")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
