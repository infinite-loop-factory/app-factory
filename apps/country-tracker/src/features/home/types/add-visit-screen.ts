export type PickerField = "start" | "end";

export interface ErrorBannerProps {
  message?: string;
}

export interface FooterActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
}
