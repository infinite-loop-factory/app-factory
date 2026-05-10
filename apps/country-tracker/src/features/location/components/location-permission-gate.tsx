import { useEffect, useRef, useState } from "react";
import { Modal } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  hasRequiredLocationPermissions,
  startLocationTask,
} from "@/features/location/location-permission";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useGlobalToast } from "@/hooks/use-global-toast";
import i18n from "@/lib/i18n";

export function LocationPermissionGate() {
  const { user } = useAuthUser();
  const { showToast } = useGlobalToast();
  const initializedUserIdRef = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      initializedUserIdRef.current = null;
      setVisible(false);
      return;
    }

    if (initializedUserIdRef.current === user.id) {
      return;
    }

    initializedUserIdRef.current = user.id;

    const syncLocationTracking = async () => {
      const hasPermissions = await hasRequiredLocationPermissions();
      if (hasPermissions) {
        await startLocationTask({
          onPermissionDenied: () => {
            showToast(
              "error",
              i18n.t("location.permission.denied.title"),
              i18n.t("location.permission.denied.message"),
            );
          },
        });
        return;
      }

      setVisible(true);
    };

    syncLocationTracking().catch(() => {
      setVisible(true);
    });
  }, [showToast, user?.id]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      await startLocationTask({
        onPermissionDenied: () => {
          showToast(
            "error",
            i18n.t("location.permission.denied.title"),
            i18n.t("location.permission.denied.message"),
          );
        },
      });

      const hasPermissions = await hasRequiredLocationPermissions();
      if (hasPermissions) {
        setVisible(false);
      }
    } finally {
      setIsRequesting(false);
    }
  };

  if (!(user && visible)) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Box
        className="flex-1 items-center justify-end bg-background-dark/60 px-4 pb-10"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
      >
        <Box className="w-full max-w-md gap-4 rounded-[28px] border border-outline-100 bg-background-0 p-6 shadow-soft-2">
          <Text className="font-bold text-primary-600 text-xs uppercase tracking-[1.5px]">
            {i18n.t("location.disclosure.badge")}
          </Text>
          <Heading className="font-bold text-2xl text-typography-950">
            {i18n.t("location.disclosure.title")}
          </Heading>
          <Text className="text-base text-typography-700 leading-7">
            {i18n.t("location.disclosure.message")}
          </Text>

          <Box className="gap-3 pt-2">
            <Button
              action="primary"
              className="h-12 rounded-2xl"
              disabled={isRequesting}
              onPress={() => void handleRequestPermission()}
            >
              <ButtonText>
                {isRequesting
                  ? i18n.t("location.disclosure.requesting")
                  : i18n.t("location.disclosure.primary")}
              </ButtonText>
            </Button>
            <Button
              action="default"
              className="h-12 rounded-2xl border border-outline-200 bg-background-0"
              disabled={isRequesting}
              onPress={() => setVisible(false)}
              variant="outline"
            >
              <ButtonText>{i18n.t("location.disclosure.secondary")}</ButtonText>
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
