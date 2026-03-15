import { useLocalSearchParams } from "expo-router";
import { CountryDetailScreen } from "@/features/home/components/country-detail-screen";

export default function CountryDetailPage() {
  const { code } = useLocalSearchParams<{ code: string }>();
  return <CountryDetailScreen countryCode={code ?? ""} />;
}
