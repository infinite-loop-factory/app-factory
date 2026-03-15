import { forwardRef } from "react";
import { Image, View } from "react-native";
import ViewShot from "react-native-view-shot";
import { Text } from "@/components/ui/text";
import i18n from "@/lib/i18n";
import { getFlagUri } from "@/utils/country-region";

interface ShareableStatsCardProps {
  userName: string;
  countriesCount: number;
  totalDays: number;
  topCountries: Array<{ country: string; countryCode: string; days: number }>;
  year?: string;
}

export const ShareableStatsCard = forwardRef<ViewShot, ShareableStatsCardProps>(
  ({ userName, countriesCount, totalDays, topCountries, year }, ref) => {
    const currentYear = year ?? new Date().getFullYear().toString();

    return (
      <ViewShot
        options={{ format: "png", quality: 1.0 }}
        ref={ref}
        style={{ width: 360, backgroundColor: "white" }}
      >
        <View
          style={{
            padding: 24,
            backgroundColor: "#ffffff",
            borderRadius: 20,
            gap: 20,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "#1a1a2e" }}>
              {userName}'s {currentYear}
            </Text>
            <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
              Travel Summary
            </Text>
          </View>

          {/* Stats Row */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: "#f0f4ff",
                borderRadius: 16,
                paddingVertical: 16,
              }}
            >
              <Text
                style={{ fontSize: 32, fontWeight: "800", color: "#3b5bdb" }}
              >
                {countriesCount}
              </Text>
              <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                {i18n.t("home.stats.countries")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: "#fff4e6",
                borderRadius: 16,
                paddingVertical: 16,
              }}
            >
              <Text
                style={{ fontSize: 32, fontWeight: "800", color: "#e8590c" }}
              >
                {totalDays}
              </Text>
              <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                {i18n.t("home.stats.days-tracked")}
              </Text>
            </View>
          </View>

          {/* Top Countries */}
          {topCountries.length > 0 && (
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#999" }}>
                TOP DESTINATIONS
              </Text>
              {topCountries.slice(0, 5).map((c, idx) => {
                const flagUri = getFlagUri(c.countryCode);
                return (
                  <View
                    key={c.countryCode}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: "#fafafa",
                      borderRadius: 12,
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#aaa",
                        width: 20,
                      }}
                    >
                      {idx + 1}
                    </Text>
                    {flagUri && (
                      <Image
                        source={{ uri: flagUri }}
                        style={{ width: 28, height: 20, borderRadius: 3 }}
                      />
                    )}
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {c.country}
                    </Text>
                    <Text
                      style={{ fontSize: 13, fontWeight: "600", color: "#888" }}
                    >
                      {c.days}d
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Branding */}
          <View style={{ alignItems: "center", paddingTop: 8 }}>
            <Text style={{ fontSize: 11, color: "#bbb", fontWeight: "500" }}>
              Country Tracker
            </Text>
          </View>
        </View>
      </ViewShot>
    );
  },
);
