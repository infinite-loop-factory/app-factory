import { Stack, useLocalSearchParams } from "expo-router";
import { AddVisitScreen } from "@/features/home/components/add-visit-screen";

export default function AddVisitPage() {
  const params = useLocalSearchParams<{
    mode?: string;
    countryCode?: string;
    country?: string;
    startDate?: string;
    endDate?: string;
    dateSet?: string;
  }>();

  const editData =
    params.mode === "edit"
      ? {
          countryCode: params.countryCode ?? "",
          country: params.country ?? "",
          startDate: params.startDate ?? "",
          endDate: params.endDate ?? "",
          dateSet: params.dateSet
            ? (JSON.parse(params.dateSet) as string[])
            : [],
        }
      : undefined;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddVisitScreen editData={editData} />
    </>
  );
}
