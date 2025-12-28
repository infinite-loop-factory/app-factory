import { Image } from "expo-image";
import {
  LogOut,
  Mail,
  MapPin,
  User,
} from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { LanguageAndThemeToggle } from "@/components/language-and-theme-toggle";

export default function ProfileScreen() {
  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="px-4 pt-4">
        <View className="mb-6 items-center">
          <View className="mb-4 overflow-hidden rounded-full border-4 border-white dark:border-gray-800">
            <Image
              className="h-24 w-24"
              contentFit="cover"
              source="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            />
          </View>
          <Text className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">
            김카페
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            cafe@example.com
          </Text>
        </View>

        <View className="mb-6">
          <View className="overflow-hidden rounded-xl bg-white dark:bg-gray-800">
            <Text className="px-4 pt-3 pb-2 font-semibold text-base text-gray-900 dark:text-white">
              계정 정보
            </Text>
            <View className="border-t border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center border-b border-gray-100 px-4 py-4 dark:border-gray-700">
                <User
                  className="mr-3 text-gray-400 dark:text-gray-500"
                  size={20}
                />

                <Text className="flex-1 text-gray-900 dark:text-white">이름</Text>
                <Text className="text-gray-600 dark:text-gray-400">김카페</Text>
              </View>
              <View className="flex-row items-center border-b border-gray-100 px-4 py-4 dark:border-gray-700">
                <Mail
                  className="mr-3 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <Text className="flex-1 text-gray-900 dark:text-white">
                  이메일
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  cafe@example.com
                </Text>
              </View>
              <View className="flex-row items-center px-4 py-4">
                <MapPin
                  className="mr-3 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <Text className="flex-1 text-gray-900 dark:text-white">지역</Text>
                <Text className="text-gray-600 dark:text-gray-400">서울시</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <LanguageAndThemeToggle />
        </View>

        <View>
          <View className="overflow-hidden rounded-xl bg-white dark:bg-gray-800">
            <Text className="px-4 pt-3 pb-2 font-semibold text-base text-gray-900 dark:text-white">
              사장님 모드
            </Text>
            <View className="border-t border-gray-100 dark:border-gray-700 p-4">
              <Text className="text-gray-600 dark:text-gray-400">
                사장님이시면 카페를 등록하고 관리할 수 있습니다
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
