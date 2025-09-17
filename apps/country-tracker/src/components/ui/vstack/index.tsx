import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import React from "react";
import { View } from "react-native";
import { createVariantResolver } from "@/utils/variant-resolver";
import { vstackStyle } from "./styles";

type IVStackProps = React.ComponentProps<typeof View> &
  VariantProps<typeof vstackStyle>;

const resolveStackSpace = createVariantResolver([
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
] as const);

const VStack = React.forwardRef<React.ComponentRef<typeof View>, IVStackProps>(
  function VStack({ className, space, reversed, ...props }, ref) {
    const variantSpace = resolveStackSpace(space);
    return (
      <View
        className={vstackStyle({
          space: variantSpace,
          reversed: reversed ? true : undefined,
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  },
);

VStack.displayName = "VStack";

export { VStack };
