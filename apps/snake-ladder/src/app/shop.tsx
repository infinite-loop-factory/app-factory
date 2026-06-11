import { MaterialIcons } from "@expo/vector-icons";
import {
  type Purchase,
  useIAP,
  verifyPurchase as verifyPurchaseSdk,
} from "expo-iap";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { ScreenShell } from "@/components/ui/screen-shell";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT } from "@/game/constants/theme";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useMonetization } from "@/hooks/use-monetization";
import i18n from "@/i18n";
import { lightenColor } from "@/lib/color";
import {
  CONSUMABLE_PRODUCT_IDS,
  GOLD_DICE_BY_PRODUCT,
  GOLD_PER_REWARDED_AD,
  IAP_PRODUCT_IDS,
} from "@/lib/monetization/constants";
import { isNativeStorePlatform } from "@/lib/monetization/platform";
import { showRewardedAd } from "@/lib/monetization/rewarded-ads";
import { verifyStorePurchase } from "@/lib/monetization/verify-purchase";

const ALL_SKUS = [
  IAP_PRODUCT_IDS.goldDice10,
  IAP_PRODUCT_IDS.goldDice30,
  IAP_PRODUCT_IDS.goldDice100,
  IAP_PRODUCT_IDS.adRemoval,
];

export default function ShopScreen() {
  const { palette } = useAppSettings();
  const { monetization, addGoldDice, setAdRemovalPurchased } =
    useMonetization();
  const [restoring, setRestoring] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);
  const nativeStore = isNativeStorePlatform();

  const watchRewardedAd = async () => {
    setWatchingAd(true);
    try {
      const earned = await showRewardedAd();
      if (earned) {
        addGoldDice(GOLD_PER_REWARDED_AD);
        Alert.alert(
          i18n.t("shop.purchaseSuccess"),
          i18n.t("shop.goldAdded", { count: GOLD_PER_REWARDED_AD }),
        );
      } else {
        Alert.alert(i18n.t("shop.rewardedUnavailable"));
      }
    } finally {
      setWatchingAd(false);
    }
  };

  const grantPurchase = useCallback(
    (purchase: Purchase) => {
      const productId = purchase.productId ?? "";
      const gold = GOLD_DICE_BY_PRODUCT[productId];
      if (gold) {
        addGoldDice(gold);
        Alert.alert(
          i18n.t("shop.purchaseSuccess"),
          i18n.t("shop.goldAdded", { count: gold }),
        );
        return;
      }
      if (productId === IAP_PRODUCT_IDS.adRemoval) {
        setAdRemovalPurchased(true);
        Alert.alert(
          i18n.t("shop.purchaseSuccess"),
          i18n.t("shop.adRemovalActive"),
        );
      }
    },
    [addGoldDice, setAdRemovalPurchased],
  );

  const {
    connected,
    products,
    availablePurchases,
    fetchProducts,
    requestPurchase,
    restorePurchases,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      const verified = await verifyStorePurchase(purchase, verifyPurchaseSdk);
      if (!verified) {
        Alert.alert(
          i18n.t("shop.purchaseFailed"),
          i18n.t("shop.verificationFailed"),
        );
        return;
      }
      grantPurchase(purchase);
      const isConsumable = Boolean(
        GOLD_DICE_BY_PRODUCT[purchase.productId ?? ""],
      );
      await finishTransaction({ purchase, isConsumable });
    },
    onPurchaseError: (error) => {
      if (error.code === "user-cancelled") return;
      Alert.alert(i18n.t("shop.purchaseFailed"), error.message);
    },
  });

  useEffect(() => {
    if (!(connected && nativeStore)) return;
    void fetchProducts({ skus: ALL_SKUS, type: "in-app" });
  }, [connected, fetchProducts, nativeStore]);

  useEffect(() => {
    const ownsAdRemoval = availablePurchases.some(
      (purchase) => purchase.productId === IAP_PRODUCT_IDS.adRemoval,
    );
    if (ownsAdRemoval) {
      setAdRemovalPurchased(true);
    }
  }, [availablePurchases, setAdRemovalPurchased]);

  const priceFor = (sku: string) =>
    products.find((p) => p.id === sku)?.displayPrice ??
    i18n.t("shop.priceUnavailable");

  const buy = async (sku: string) => {
    if (!connected) {
      Alert.alert(i18n.t("shop.storeUnavailable"));
      return;
    }
    await requestPurchase({
      type: "in-app",
      request: Platform.select({
        ios: { apple: { sku } },
        android: { google: { skus: [sku] } },
        default: { apple: { sku } },
      }),
    });
  };

  const restore = async () => {
    setRestoring(true);
    try {
      await restorePurchases();
      Alert.alert(i18n.t("shop.restoreDone"));
    } catch {
      Alert.alert(i18n.t("shop.restoreFailed"));
    } finally {
      setRestoring(false);
    }
  };

  return (
    <ScreenShell title={i18n.t("shop.title")}>
      {!nativeStore ? (
        <WoodPanel contentStyle={{ padding: 16 }} palette={palette}>
          <Text style={{ color: palette.creamMuted, lineHeight: 22 }}>
            {i18n.t("shop.webUnavailable")}
          </Text>
        </WoodPanel>
      ) : (
        <>
          <WoodPanel
            contentStyle={{
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
            palette={palette}
          >
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.25)",
                borderWidth: 1,
                borderColor: `${palette.orbGlow}66`,
              }}
            >
              <MaterialIcons color={palette.orbGlow} name="casino" size={26} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: palette.cream,
                  fontFamily: GAME_FONT,
                  fontSize: 16,
                }}
              >
                {i18n.t("shop.goldBalance", {
                  count: monetization.goldDiceCount,
                })}
              </Text>
              <Text
                style={{
                  color: palette.creamMuted,
                  marginTop: 4,
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {i18n.t("shop.goldDescription")}
              </Text>
            </View>
          </WoodPanel>

          {!connected ? (
            <View className="items-center py-4">
              <ActivityIndicator color={palette.cream} />
              <Text style={{ color: palette.creamMuted, marginTop: 8 }}>
                {i18n.t("shop.connectingStore")}
              </Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={watchingAd}
            onPress={() => void watchRewardedAd()}
            style={{ opacity: watchingAd ? 0.6 : 1 }}
            testID="shop-rewarded-button"
          >
            <WoodPanel
              contentStyle={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
              palette={palette}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                }}
              >
                <MaterialIcons
                  color={palette.ladder}
                  name="play-circle-outline"
                  size={20}
                />
                <View style={{ flexShrink: 1 }}>
                  <Text
                    style={{
                      color: palette.cream,
                      fontFamily: GAME_FONT,
                      fontSize: 15,
                    }}
                  >
                    {i18n.t("shop.rewarded", { count: GOLD_PER_REWARDED_AD })}
                  </Text>
                  <Text style={{ color: palette.creamMuted, fontSize: 12 }}>
                    {i18n.t("shop.rewardedHint")}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: palette.ladder,
                  fontFamily: GAME_FONT,
                  fontSize: 17,
                }}
              >
                FREE
              </Text>
            </WoodPanel>
          </Pressable>

          {CONSUMABLE_PRODUCT_IDS.map((sku) => (
            <Pressable
              accessibilityRole="button"
              disabled={!connected}
              key={sku}
              onPress={() => void buy(sku)}
            >
              <WoodPanel
                contentStyle={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
                palette={palette}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  <MaterialIcons
                    color={palette.orbGlow}
                    name="casino"
                    size={20}
                  />
                  <View style={{ flexShrink: 1 }}>
                    <Text
                      style={{
                        color: palette.cream,
                        fontFamily: GAME_FONT,
                        fontSize: 15,
                      }}
                    >
                      {i18n.t("shop.goldPack", {
                        count: GOLD_DICE_BY_PRODUCT[sku] ?? 0,
                      })}
                    </Text>
                    <Text style={{ color: palette.creamMuted, fontSize: 12 }}>
                      {i18n.t("shop.goldPackHint")}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: palette.orbGlow,
                    fontFamily: GAME_FONT,
                    fontSize: 17,
                  }}
                >
                  {priceFor(sku)}
                </Text>
              </WoodPanel>
            </Pressable>
          ))}

          <Pressable
            accessibilityRole="button"
            disabled={monetization.adRemovalPurchased || !connected}
            onPress={() => void buy(IAP_PRODUCT_IDS.adRemoval)}
            style={{ opacity: monetization.adRemovalPurchased ? 0.65 : 1 }}
          >
            <WoodPanel
              contentStyle={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
              palette={palette}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                }}
              >
                <MaterialIcons
                  color={lightenColor(palette.ladder, 0.35)}
                  name="block"
                  size={20}
                />
                <View style={{ flexShrink: 1 }}>
                  <Text
                    style={{
                      color: palette.cream,
                      fontFamily: GAME_FONT,
                      fontSize: 15,
                    }}
                  >
                    {i18n.t("shop.adRemoval")}
                  </Text>
                  <Text style={{ color: palette.creamMuted, fontSize: 12 }}>
                    {monetization.adRemovalPurchased
                      ? i18n.t("shop.adRemovalOwned")
                      : i18n.t("shop.adRemovalHint")}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: lightenColor(palette.ladder, 0.35),
                  fontFamily: GAME_FONT,
                  fontSize: 17,
                }}
              >
                {monetization.adRemovalPurchased
                  ? i18n.t("shop.owned")
                  : priceFor(IAP_PRODUCT_IDS.adRemoval)}
              </Text>
            </WoodPanel>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={restoring || !connected}
            onPress={() => void restore()}
            style={{
              alignItems: "center",
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: "rgba(255,255,255,0.25)",
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <Text
              style={{
                color: palette.cream,
                fontFamily: GAME_FONT,
                fontSize: 14,
              }}
            >
              {restoring ? i18n.t("shop.restoring") : i18n.t("shop.restore")}
            </Text>
          </Pressable>
        </>
      )}
    </ScreenShell>
  );
}
