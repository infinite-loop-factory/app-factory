import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import i18n from "@/i18n";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-bg p-5">
        <Text className="font-display font-semibold text-h2 text-text">
          {i18n.t("notFound.title")}
        </Text>
        <Link className="mt-4 py-4" href="/">
          <Text className="font-semibold font-text text-bodySm text-brand">
            {i18n.t("notFound.cta")}
          </Text>
        </Link>
      </View>
    </>
  );
}
