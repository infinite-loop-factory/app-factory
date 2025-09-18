import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import React from "react";
import { Text as RNText } from "react-native";
import { createVariantResolver } from "@/utils/variant-resolver";
import { textStyle } from "./styles";

type ITextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof textStyle>;

const resolveTextSize = createVariantResolver([
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
] as const);

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  function Text(
    {
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      size = "md",
      sub,
      italic,
      highlight,
      ...props
    },
    ref,
  ) {
    const variantSize = resolveTextSize(size);
    return (
      <RNText
        className={textStyle({
          isTruncated: Boolean(isTruncated),
          bold: Boolean(bold),
          underline: Boolean(underline),
          strikeThrough: Boolean(strikeThrough),
          size: variantSize,
          sub: Boolean(sub),
          italic: Boolean(italic),
          highlight: Boolean(highlight),
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  },
);

Text.displayName = "Text";

export { Text };
