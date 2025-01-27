import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import type { ComponentProps, ElementRef } from "react";

import { forwardRef } from "react";
import { textStyle } from "./styles";

type ITextProps = ComponentProps<"span"> & VariantProps<typeof textStyle>;

const Text = forwardRef<ElementRef<"span">, ITextProps>(
  (
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
    }: { className?: string } & ITextProps,
    ref,
  ) => {
    return (
      <span
        className={textStyle({
          isTruncated,
          bold,
          underline,
          strikeThrough,
          size,
          sub,
          italic,
          highlight,
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
