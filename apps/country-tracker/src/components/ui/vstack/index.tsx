import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import React from "react";
import { View } from "react-native";
import { createVariantResolver } from "@/utils/variant-resolver";
import { vstackStyle } from "./styles";

const resolveVstackSpace = createVariantResolver([
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
] as const);

type IVStackProps = React.ComponentProps<typeof View> &
  VariantProps<typeof vstackStyle>;

const VStack = React.forwardRef<React.ComponentRef<typeof View>, IVStackProps>(
  function VStack({ className, space, reversed, ...props }, ref) {
    return (
      <View
        className={vstackStyle({
          space: resolveVstackSpace(space),
          reversed: reversed as boolean,
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
