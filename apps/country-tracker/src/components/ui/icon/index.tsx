"use client";

import type { ComponentType, ReactElement } from "react";

import React from "react";

export type IPrimitiveIcon = {
  height?: number | string;
  width?: number | string;
  fill?: string;
  color?: string;
  size?: number | string;
  stroke?: string;
  as?: React.ElementType;
  className?: string;
  classNameColor?: string;
  style?: Record<string, unknown>;
};

export const PrimitiveIcon = React.forwardRef<
  React.ElementRef<"svg">,
  IPrimitiveIcon
>(
  (
    {
      height,
      width,
      fill,
      color,
      classNameColor,
      size,
      stroke = "currentColor",
      as: AsComp,
      ...props
    },
    ref,
  ) => {
    const sizeProps = React.useMemo(() => {
      if (size) return { height: size, width: size };
      if (height && width) return { height, width };
      if (height) return { height };
      if (width) return { width };
      return {};
    }, [size, height, width]);

    const colorProps = (() => {
      if (classNameColor) {
        return {
          color: classNameColor,
        };
      }
      if (fill) {
        return { fill };
      }
      if (stroke === "currentColor" && color) {
        return { color };
      }
      return { stroke };
    })();

    if (AsComp) {
      return <AsComp ref={ref} {...props} {...sizeProps} {...colorProps} />;
    }
    return null;
  },
);

PrimitiveIcon.displayName = "PrimitiveIcon";

export type UIIconProps = {
  as?: React.ElementType;
  className?: string;
  size?: number | string;
  height?: number | string;
  width?: number | string;
  color?: string;
  fill?: string;
  stroke?: string;
};

const UIIconComponent = (
  {
    as: Icon,
    className,
    size,
    height,
    width,
    color,
    fill,
    stroke,
    ...props
  }: UIIconProps,
  ref: React.Ref<unknown>,
): ReactElement | null => {
  if (!Icon) return null;

  const sizeValue = size || height || width || 24;

  return (
    <Icon
      className={className}
      color={color}
      fill={fill || "none"}
      height={sizeValue}
      ref={ref}
      stroke={stroke || "currentColor"}
      width={sizeValue}
      {...props}
    />
  );
};

export const UIIcon = React.forwardRef<unknown, UIIconProps>(UIIconComponent);

(UIIcon as { displayName?: string }).displayName = "UIIcon";
