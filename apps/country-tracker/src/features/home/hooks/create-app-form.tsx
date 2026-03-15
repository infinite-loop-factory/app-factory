import { createFormHook } from "@tanstack/react-form";
import { SubscribeButton } from "@/components/subscribe-button";
import { fieldContext, formContext } from "@/features/home/hooks/form-context";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {
    SubscribeButton,
  },
});
