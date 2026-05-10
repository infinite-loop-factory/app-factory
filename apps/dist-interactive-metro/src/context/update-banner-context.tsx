import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type BannerType = "success" | "info" | "warning" | "error";

interface BannerState {
  visible: boolean;
  message: string;
  type: BannerType;
}

interface UpdateBannerContextValue extends BannerState {
  showBanner: (message: string, type?: BannerType) => void;
  hideBanner: () => void;
}

const UpdateBannerContext = createContext<UpdateBannerContextValue | null>(
  null,
);

export function UpdateBannerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BannerState>({
    visible: false,
    message: "",
    type: "success",
  });

  const showBanner = useCallback(
    (message: string, type: BannerType = "success") => {
      setState({ visible: true, message, type });
    },
    [],
  );

  const hideBanner = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const value = useMemo<UpdateBannerContextValue>(
    () => ({ ...state, showBanner, hideBanner }),
    [state, showBanner, hideBanner],
  );

  return (
    <UpdateBannerContext.Provider value={value}>
      {children}
    </UpdateBannerContext.Provider>
  );
}

export function useUpdateBanner() {
  const ctx = useContext(UpdateBannerContext);
  if (!ctx) {
    throw new Error("useUpdateBanner must be used within UpdateBannerProvider");
  }
  return ctx;
}
