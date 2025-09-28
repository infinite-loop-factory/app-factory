import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { DENYLIST_STORAGE_KEY } from "@/constants/storage-keys";
import { locationQueryKeys } from "@/features/location/apis/query-keys";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import supabase from "@/libs/supabase";

type AllCountry = {
  country: string;
  country_code: string;
};

// moved to shared constants

// Fetches all unique countries from the user's location history
const fetchAllUniqueCountries = async (
  userId: string,
): Promise<AllCountry[]> => {
  const { data, error } = await supabase
    .from("locations")
    .select("country, country_code")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  const uniqueCountries = Array.from(
    new Map(
      data
        .filter((d) => d.country && d.country_code)
        .map((item) => [item.country_code, item]),
    ).values(),
  );

  return uniqueCountries.sort((a, b) => a.country.localeCompare(b.country));
};

// Fetches the user's denylist from AsyncStorage
const fetchDenylist = async (): Promise<string[]> => {
  const jsonValue = await AsyncStorage.getItem(DENYLIST_STORAGE_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

// Saves the user's denylist to AsyncStorage
const saveDenylist = async (denylist: string[]) => {
  const jsonValue = JSON.stringify(denylist);
  await AsyncStorage.setItem(DENYLIST_STORAGE_KEY, jsonValue);
};

export default function DenylistScreen() {
  const { user } = useAuthUser();
  const queryClient = useQueryClient();

  const [background, borderColor, textColor, highlightColor, switchBgColor] =
    useThemeColor([
      "background",
      "outline-200",
      "typography",
      "primary-400",
      "background-100",
    ]);

  const { data: allCountries, isLoading: isLoadingCountries } = useQuery({
    queryKey: locationQueryKeys.allUniqueCountries(user?.id ?? null),
    queryFn: async () => {
      if (!user) return [] as AllCountry[];
      return await fetchAllUniqueCountries(user.id);
    },
    enabled: !!user,
  });

  const [denylist, setDenylist] = useState<string[]>([]);
  const [isLoadingDenylist, setIsLoadingDenylist] = useState(true);

  useEffect(() => {
    fetchDenylist().then((storedDenylist) => {
      setDenylist(storedDenylist);
      setIsLoadingDenylist(false);
    });
  }, []);

  const denylistSet = useMemo(() => new Set(denylist), [denylist]);

  const handleToggle = async (countryCode: string, isDenylisted: boolean) => {
    const newDenylist = isDenylisted
      ? denylist.filter((code) => code !== countryCode)
      : [...denylist, countryCode];

    setDenylist(newDenylist);
    await saveDenylist(newDenylist);

    // Invalidate queries to refetch
    await queryClient.invalidateQueries({
      queryKey: ["location", "visited-countries"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["map", "visited-countries"],
    });
  };

  const isLoading = isLoadingCountries || isLoadingDenylist;

  return (
    <ParallaxScrollView>
      <Box className="mb-4 px-1 pt-2">
        <Text className="mt-2 text-base" style={{ color: textColor }}>
          {i18n.t("settings.denylist.description")}
        </Text>
      </Box>

      <Box
        className="mx-1 mb-4 rounded-lg border shadow-xs"
        style={{ backgroundColor: background, borderColor }}
      >
        {isLoading ? (
          <ActivityIndicator className="p-8" size="large" />
        ) : (
          allCountries?.map((country, index) => {
            const isDenylisted = denylistSet.has(country.country_code);
            return (
              <React.Fragment key={country.country_code}>
                <View className="flex-row items-center justify-between p-4">
                  <Text
                    className="font-bold text-base"
                    style={{ color: textColor }}
                  >
                    {country.country}
                  </Text>
                  <Switch
                    accessibilityLabel={i18n.t("settings.denylist.switch-a11y")}
                    ios_backgroundColor={switchBgColor}
                    onValueChange={() =>
                      handleToggle(country.country_code, isDenylisted)
                    }
                    thumbColor={highlightColor}
                    trackColor={{ false: switchBgColor, true: switchBgColor }}
                    value={isDenylisted}
                  />
                </View>
                {index < allCountries.length - 1 && (
                  <Divider style={{ backgroundColor: borderColor }} />
                )}
              </React.Fragment>
            );
          })
        )}
      </Box>
    </ParallaxScrollView>
  );
}
