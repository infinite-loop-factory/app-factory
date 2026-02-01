import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import i18n from "@/lib/i18n";

export default function AddVisitStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: i18n.t("home.add-visit.title"),
          headerTitleStyle: { fontSize: 24 },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 16, padding: 8 }}
            >
              <ChevronLeft size={24} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
