import React from "react";
import type { LayoutChangeEvent } from "react-native";
import { boxStyle } from "./styles";

import type { VariantProps } from "@gluestack-ui/nativewind-utils";

type IBoxProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof boxStyle> & {
    className?: string;
    onLayout?: (event: LayoutChangeEvent) => void;
  };

const Box = React.forwardRef<HTMLDivElement, IBoxProps>(function Box(
  { className, style, onLayout, ...props },
  ref,
) {
  // style이 배열이면 객체로 병합
  const mergedStyle = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;
  // onLayout은 웹에서 무시
  return (
    <div
      ref={ref}
      className={boxStyle({ class: className })}
      style={mergedStyle}
      {...props}
    />
  );
});

Box.displayName = "Box";
export { Box };
