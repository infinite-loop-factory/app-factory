import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import { H1, H2, H3, H4, H5, H6 } from "@expo/html-elements";
import { cssInterop } from "nativewind";
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
  React.ComponentPropsWithoutRef<typeof H1> & {
    as?: React.ElementType;
  };

cssInterop(H1, { className: "style" });
cssInterop(H2, { className: "style" });
cssInterop(H3, { className: "style" });
cssInterop(H4, { className: "style" });
cssInterop(H5, { className: "style" });
cssInterop(H6, { className: "style" });

const MappedHeading = memo(
  forwardRef<React.ComponentRef<typeof H1>, IHeadingProps>(
    function MappedHeading(
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
          return (
            <H1
              className={computedClass}
              {...props}
              // @ts-expect-error : type issue
              ref={ref}
            />
          );
        case "2xl":
          return (
            <H2
              className={computedClass}
              {...props}
              // @ts-expect-error : type issue
              ref={ref}
            />
          );
        case "xl":
          return (
            <H3
              className={computedClass}
              {...props}
              // @ts-expect-error : type issue
              ref={ref}
            />
          );
        case "lg":
          return (
            <H4
              className={computedClass}
              {...props}
              // @ts-expect-error : type issue
              ref={ref}
            />
          );
        case "md":
          return (
            <H5
              className={computedClass}
              {...props}
              // @ts-expect-error : type issue
              ref={ref}
            />
          );
        case "sm":
        case "xs":
          return (
            <H6
              className={computedClass}
              {...props}
              // @ts-expect-error : type issue
              ref={ref}
            />
          );
        default:
          return (
            <H4
              className={computedClass}
              {...props}
              // @ts-expect-error : type issue
              ref={ref}
            />
          );
      }
    },
  ),
);

const Heading = memo(
  forwardRef<React.ComponentRef<typeof H1>, IHeadingProps>(function Heading(
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
