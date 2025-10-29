import type { ReactNode } from "react";

import { useFormContext } from "@/hooks/form-context";

export type AppSubscribeButtonRenderProps = {
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  handleSubmit: () => void;
};

type SubscribeButtonProps = {
  children: (props: AppSubscribeButtonRenderProps) => ReactNode;
};

export function SubscribeButton({ children }: SubscribeButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        isSubmitting: state.isSubmitting,
        canSubmit: state.canSubmit,
      })}
    >
      {({ isSubmitting, canSubmit }) =>
        children({
          isSubmitting,
          isSubmitDisabled: !canSubmit,
          handleSubmit: () => form.handleSubmit(),
        })
      }
    </form.Subscribe>
  );
}
