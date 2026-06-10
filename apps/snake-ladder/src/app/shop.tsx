import { MaterialIcons } from "@expo/vector-icons";
import {
  type Purchase,
  useIAP,
  verifyPurchase as verifyPurchaseSdk,
} from "expo-iap";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useMonetization } from "@/hooks/use-monetization";
import i18n from "@/i18n";
import {
  CONSUMABLE_PRODUCT_IDS,
  GOLD_DICE_BY_PRODUCT,
  IAP_PRODUCT_IDS,
} from "@/lib/monetization/constants";
import { isNativeStorePlatform } from "@/lib/monetization/platform";
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
  const nativeStore = isNativeStorePlatform();

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
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: palette.background }}
    >
      <ScrollView contentContainerStyle={{ gap: 20, padding: 24 }}>
        <View className="flex-row items-center justify-between">
          <Link asChild href="/">
            <Pressable
              accessibilityLabel={i18n.t("game.back")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.card }}
            >
              <MaterialIcons color={palette.text} name="arrow-back" size={22} />
            </Pressable>
          </Link>
          <Text
            className="font-extrabold text-xl"
            style={{ color: palette.text }}
          >
            {i18n.t("shop.title")}
          </Text>
          <View className="h-10 w-10" />
        </View>

        {!nativeStore ? (
          <View
            className="rounded-2xl border p-4"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
            }}
          >
            <Text style={{ color: palette.textMuted, lineHeight: 22 }}>
              {i18n.t("shop.webUnavailable")}
            </Text>
          </View>
        ) : (
          <>
            <View
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: palette.card,
                borderColor: palette.border,
              }}
            >
              <Text
                className="font-bold text-base"
                style={{ color: palette.text }}
              >
                {i18n.t("shop.goldBalance", {
                  count: monetization.goldDiceCount,
                })}
              </Text>
              <Text
                style={{
                  color: palette.textMuted,
                  marginTop: 6,
                  lineHeight: 20,
                }}
              >
                {i18n.t("shop.goldDescription")}
              </Text>
            </View>

            {!connected ? (
              <View className="items-center py-4">
                <ActivityIndicator color={palette.ladder} />
                <Text style={{ color: palette.textMuted, marginTop: 8 }}>
                  {i18n.t("shop.connectingStore")}
                </Text>
              </View>
            ) : null}

            {CONSUMABLE_PRODUCT_IDS.map((sku) => (
              <Pressable
                accessibilityRole="button"
                className="flex-row items-center justify-between rounded-2xl border p-4"
                disabled={!connected}
                key={sku}
                onPress={() => void buy(sku)}
                style={{
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                }}
              >
                <View>
                  <Text className="font-bold" style={{ color: palette.text }}>
                    {i18n.t("shop.goldPack", {
                      count: GOLD_DICE_BY_PRODUCT[sku] ?? 0,
                    })}
                  </Text>
                  <Text style={{ color: palette.textMuted, fontSize: 12 }}>
                    {i18n.t("shop.goldPackHint")}
                  </Text>
                </View>
                <Text
                  className="font-extrabold"
                  style={{ color: palette.orbGlow }}
                >
                  {priceFor(sku)}
                </Text>
              </Pressable>
            ))}

            <Pressable
              accessibilityRole="button"
              className="flex-row items-center justify-between rounded-2xl border p-4"
              disabled={monetization.adRemovalPurchased || !connected}
              onPress={() => void buy(IAP_PRODUCT_IDS.adRemoval)}
              style={{
                backgroundColor: palette.card,
                borderColor: palette.border,
                opacity: monetization.adRemovalPurchased ? 0.6 : 1,
              }}
            >
              <View className="flex-1 pr-3">
                <Text className="font-bold" style={{ color: palette.text }}>
                  {i18n.t("shop.adRemoval")}
                </Text>
                <Text style={{ color: palette.textMuted, fontSize: 12 }}>
                  {monetization.adRemovalPurchased
                    ? i18n.t("shop.adRemovalOwned")
                    : i18n.t("shop.adRemovalHint")}
                </Text>
              </View>
              <Text
                className="font-extrabold"
                style={{ color: palette.ladder }}
              >
                {monetization.adRemovalPurchased
                  ? i18n.t("shop.owned")
                  : priceFor(IAP_PRODUCT_IDS.adRemoval)}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              className="items-center rounded-2xl border px-4 py-3"
              disabled={restoring || !connected}
              onPress={() => void restore()}
              style={{ borderColor: palette.border }}
            >
              <Text style={{ color: palette.text, fontWeight: "700" }}>
                {restoring ? i18n.t("shop.restoring") : i18n.t("shop.restore")}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
