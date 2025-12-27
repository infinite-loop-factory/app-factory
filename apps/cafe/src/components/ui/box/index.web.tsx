import type { VariantProps } from "@gluestack-ui/nativewind-utils";

import React from "react";
import { boxStyle } from "./styles";

type IBoxProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof boxStyle> & { className?: string };

const Box = React.forwardRef<HTMLDivElement, IBoxProps>(function Box(
  { className, ...props },
  ref,
) {
  return (
    <div className={boxStyle({ class: className })} ref={ref} {...props} />
  );
});

Box.displayName = "Box";
export { Box };
