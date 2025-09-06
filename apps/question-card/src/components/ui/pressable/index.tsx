"use client";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import { createPressable } from "@gluestack-ui/core/pressable/creator";
import { tva, withStyleContext } from "@gluestack-ui/utils/nativewind-utils";
import React from "react";
import { Pressable as RNPressable } from "react-native";

const UIPressable = createPressable({
  Root: withStyleContext(RNPressable),
});

const pressableStyle = tva({
  base: "data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-indicator-info data-[focus-visible=true]:ring-2 data-[disabled=true]:opacity-40",
});

type IPressableProps = Omit<
  React.ComponentProps<typeof UIPressable>,
  "context"
> &
  VariantProps<typeof pressableStyle>;
const Pressable = React.forwardRef<
  React.ComponentRef<typeof UIPressable>,
  IPressableProps
>(function Pressable({ className, ...props }, ref) {
  return (
    <UIPressable
      {...props}
      className={pressableStyle({
        class: className,
      })}
      ref={ref}
    />
  );
});

Pressable.displayName = "Pressable";
export { Pressable };
