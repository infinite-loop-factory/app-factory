/**
 * 경고 Toast 표시 Hook
 * 검증 실패시 경고 메시지를 표시하는 재사용 가능한 훅
 */

import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";

export function useWarningToast() {
  const toast = useToast();

  const showWarning = (title: string, description: string) => {
    toast.show({
      placement: "top",
      duration: 3000,
      render: ({ id }) => (
        <Toast
          action="warning"
          className="border border-orange-600 bg-orange-500 shadow-lg"
          nativeID={id}
          variant="solid"
        >
          <ToastTitle className="font-semibold text-white">{title}</ToastTitle>
          <ToastDescription className="text-orange-50">
            {description}
          </ToastDescription>
        </Toast>
      ),
    });
  };

  return { showWarning };
}
