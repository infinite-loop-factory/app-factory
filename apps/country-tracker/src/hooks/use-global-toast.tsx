import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useThemeColor } from "@/hooks/use-theme-color";

type ToastType = "success" | "error" | "info";

export function useGlobalToast() {
  const toast = useToast();
  const [background, borderColor, headingColor, textColor] = useThemeColor([
    "background",
    "outline-200",
    "typography-900",
    "typography",
  ]);

  const showToast = (type: ToastType, title: string, description: string) => {
    toast.show({
      duration: 4000,
      render: () => (
        <Toast
          action={type}
          className="border"
          style={{
            backgroundColor: background ?? "",
            borderColor: borderColor ?? "",
          }}
          variant="outline"
        >
          <ToastTitle style={{ color: headingColor ?? "" }}>{title}</ToastTitle>
          <ToastDescription style={{ color: textColor ?? "" }}>
            {description}
          </ToastDescription>
        </Toast>
      ),
    });
  };

  const hideToast = (id?: string) => {
    // some toast implementations return a hide/dismiss method which may accept
    // an id. Use optional chaining to avoid runtime errors if not present.
    const t = toast as unknown as { hide?: (id?: string) => void };
    t.hide?.(id);
  };

  return { showToast, hideToast } as const;
}
