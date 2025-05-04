import type React from "react";
import { useState } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "./ui/hstack";
import { HelpCircleIcon, Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { Toast, useToast } from "./ui/toast";

let globalHandleToast: ((message: string) => void) | null = null;

export const CustomToast: React.FC = () => {
  const toast = useToast();
  const [toastId, setToastId] = useState<string | null>(null);

  const handleToast = (message: string) => {
    if (toastId === null || !toast.isActive(String(toastId))) {
      showNewToast(message);
    }
  };

  const ToastContent = ({ id, message }: { id: string; message: string }) => (
    <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
      <HStack space="md" className="items-center">
        <Icon as={HelpCircleIcon} className="h-4 w-4 text-background-0" />
        <Text className="text-typography-0">{message}</Text>
      </HStack>
    </Toast>
  );

  const showNewToast = (message: string) => {
    const newId = Math.random().toString();
    setToastId(newId);

    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const content = <ToastContent id={id} message={message} />;
        return Platform.OS === "android" ? (
          <SafeAreaView>{content}</SafeAreaView>
        ) : (
          content
        );
      },
    });
  };

  globalHandleToast = handleToast;

  return null;
};

export const getGlobalHandleToast = (message: string) => {
  if (!globalHandleToast) {
    throw new Error("ToastManager is not initialized");
  }
  return globalHandleToast(message);
};
