import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useThrottleFn } from "@reactuses/core";
import type { ComponentProps } from "react";

type globalToastProps = { duration?: number };
type RenderFn = (params: {
  title: string;
  description?: string;
  action?: ComponentProps<typeof Toast>["action"];
}) => void;

export default function useGlobalToast(
  props?: globalToastProps,
): Record<"showToast", RenderFn> {
  const { show } = useToast();
  const duration = props?.duration ?? 3_000;

  const { run: showToast } = useThrottleFn<RenderFn>(
    ({ title, description, action }) =>
      show({
        duration,
        placement: "top",
        render: ({ id }) => (
          <Toast
            nativeID={`toast-${id}`}
            action={action ?? "success"}
            variant="solid"
            className={"min-w-[100px] items-center"}
          >
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        ),
      }),
    duration + 100,
  );

  return { showToast };
}
