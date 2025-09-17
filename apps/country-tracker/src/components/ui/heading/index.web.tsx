import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import React, { forwardRef, memo } from "react";
import { createVariantResolver } from "@/utils/variant-resolver";
import { headingStyle } from "./styles";

const resolveHeadingSize = createVariantResolver([
  "5xl",
  "4xl",
  "3xl",
  "2xl",
  "xl",
  "lg",
  "md",
  "sm",
  "xs",
] as const);

type IHeadingProps = VariantProps<typeof headingStyle> &
  React.ComponentPropsWithoutRef<"h1"> & {
    as?: React.ElementType;
  };

const MappedHeading = memo(
  forwardRef<HTMLHeadingElement, IHeadingProps>(function MappedHeading(
    {
      size,
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      sub,
      italic,
      highlight,
      ...props
    },
    ref,
  ) {
    const variantSize = resolveHeadingSize(size);
    const effectiveSize = variantSize ?? "lg";
    const computedClass = headingStyle({
      size: variantSize,
      isTruncated: Boolean(isTruncated),
      bold: Boolean(bold),
      underline: Boolean(underline),
      strikeThrough: Boolean(strikeThrough),
      sub: Boolean(sub),
      italic: Boolean(italic),
      highlight: Boolean(highlight),
      class: className,
    });

    switch (effectiveSize) {
      case "5xl":
      case "4xl":
      case "3xl":
        return <h1 className={computedClass} {...props} ref={ref} />;
      case "2xl":
        return <h2 className={computedClass} {...props} ref={ref} />;
      case "xl":
        return <h3 className={computedClass} {...props} ref={ref} />;
      case "lg":
        return <h4 className={computedClass} {...props} ref={ref} />;
      case "md":
        return <h5 className={computedClass} {...props} ref={ref} />;
      case "sm":
      case "xs":
        return <h6 className={computedClass} {...props} ref={ref} />;
      default:
        return <h4 className={computedClass} {...props} ref={ref} />;
    }
  }),
);

const Heading = memo(
  forwardRef<HTMLHeadingElement, IHeadingProps>(function Heading(
    { className, size = "lg", as: AsComp, ...props },
    ref,
  ) {
    const variantSize = resolveHeadingSize(size) ?? "lg";
    const {
      isTruncated,
      bold,
      underline,
      strikeThrough,
      sub,
      italic,
      highlight,
    } = props;

    if (AsComp) {
      return (
        <AsComp
          className={headingStyle({
            size: variantSize,
            isTruncated: Boolean(isTruncated),
            bold: Boolean(bold),
            underline: Boolean(underline),
            strikeThrough: Boolean(strikeThrough),
            sub: Boolean(sub),
            italic: Boolean(italic),
            highlight: Boolean(highlight),
            class: className,
          })}
          {...props}
          ref={ref}
        />
      );
    }

    return (
      <MappedHeading
        className={className}
        ref={ref}
        size={variantSize}
        {...props}
      />
    );
  }),
);

Heading.displayName = "Heading";

export { Heading };
