import { useEffect, useRef, useState } from "react";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
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

  if (!user) {
    return null;
  }

  return (
    <Modal isOpen={visible} onClose={() => setVisible(false)}>
      <ModalBackdrop />
      <ModalContent className="max-w-md rounded-2xl">
        <ModalHeader>
          <Box className="gap-1.5">
            <Text className="font-bold text-primary-600 text-xs uppercase tracking-[1.5px]">
              {i18n.t("location.disclosure.badge")}
            </Text>
            <Heading className="font-bold text-2xl text-typography-950">
              {i18n.t("location.disclosure.title")}
            </Heading>
          </Box>
        </ModalHeader>
        <ModalBody>
          <Text className="text-base text-typography-700 leading-7">
            {i18n.t("location.disclosure.message")}
          </Text>
        </ModalBody>
        <ModalFooter className="flex-col gap-2">
          <Button
            action="primary"
            className="h-12 w-full rounded-2xl"
            isDisabled={isRequesting}
            onPress={() => void handleRequestPermission()}
          >
            <ButtonText>
              {isRequesting
                ? i18n.t("location.disclosure.requesting")
                : i18n.t("location.disclosure.primary")}
            </ButtonText>
          </Button>
          <Button
            action="secondary"
            className="h-12 w-full rounded-2xl border border-outline-200 bg-background-0 data-[active=true]:bg-background-100 data-[hover=true]:bg-background-50"
            isDisabled={isRequesting}
            onPress={() => setVisible(false)}
            variant="outline"
          >
            <ButtonText className="font-semibold text-typography-900">
              {i18n.t("location.disclosure.secondary")}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
