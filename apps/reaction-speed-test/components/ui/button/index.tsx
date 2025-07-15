"use client";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import type { PressableProps } from "react-native";

import { createButton } from "@gluestack-ui/button";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { withStates } from "@gluestack-ui/nativewind-utils/withStates";
import {
  useStyleContext,
  withStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { withStyleContextAndStates } from "@gluestack-ui/nativewind-utils/withStyleContextAndStates";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { cssInterop } from "react-native-css-interop";
import Svg from "react-native-svg";

const SCOPE = "BUTTON";
const ButtonWrapper = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  PressableProps
>(({ ...props }, ref) => {
  return <Pressable {...props} ref={ref} />;
});

type IPrimitiveIcon = React.ComponentPropsWithoutRef<typeof Svg> & {
  height?: number | string;
  width?: number | string;
  fill?: string;
  color?: string;
  size?: number | string;
  stroke?: string;
  as?: React.ElementType;
  className?: string;
  classNameColor?: string;
};

const PrimitiveIcon = React.forwardRef<
  React.ElementRef<typeof Svg>,
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
    color = color ?? classNameColor;
    const sizeProps = useMemo(() => {
      if (size) return { size };
      if (height && width) return { height, width };
      if (height) return { height };
      if (width) return { width };
      return {};
    }, [size, height, width]);

    let colorProps = {};
    if (fill) {
      colorProps = { ...colorProps, fill: fill };
    }
    if (stroke !== "currentColor") {
      colorProps = { ...colorProps, stroke: stroke };
    } else if (stroke === "currentColor" && color !== undefined) {
      colorProps = { ...colorProps, stroke: color };
    }

    if (AsComp) {
      return <AsComp ref={ref} {...props} {...sizeProps} {...colorProps} />;
    }
    return (
      <Svg height={height} ref={ref} width={width} {...colorProps} {...props} />
    );
  },
);

const Root =
  Platform.OS === "web"
    ? withStyleContext(ButtonWrapper, SCOPE)
    : withStyleContextAndStates(ButtonWrapper, SCOPE);

const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: withStates(PrimitiveIcon),
});

cssInterop(Root, { className: "style" });
cssInterop(UIButton.Text, { className: "style" });
cssInterop(UIButton.Group, { className: "style" });
cssInterop(UIButton.Spinner, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});
//@ts-ignore
cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      //@ts-ignore
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

const buttonStyle = tva({
  base: "group/button rounded-lg bg-primary-600 flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2",
  variants: {
    action: {
      primary:
        "bg-primary-600 data-[hover=true]:bg-primary-700 data-[active=true]:bg-primary-800 border-primary-500 data-[hover=true]:border-primary-600 data-[active=true]:border-primary-700 data-[focus-visible=true]:web:ring-primary-400",
      secondary:
        "bg-secondary-100 border-secondary-300 data-[hover=true]:bg-secondary-200 data-[hover=true]:border-secondary-400 data-[active=true]:bg-secondary-300 data-[active=true]:border-secondary-500 data-[focus-visible=true]:web:ring-secondary-400",
      positive:
        "bg-accent-start border-green-400 data-[hover=true]:bg-green-600 data-[hover=true]:border-green-500 data-[active=true]:bg-green-700 data-[active=true]:border-green-600 data-[focus-visible=true]:web:ring-green-400",
      negative:
        "bg-accent-stop border-red-400 data-[hover=true]:bg-red-600 data-[hover=true]:border-red-500 data-[active=true]:bg-red-700 data-[active=true]:border-red-600 data-[focus-visible=true]:web:ring-red-400",
      default:
        "bg-transparent data-[hover=true]:bg-background-100 dark:data-[hover=true]:bg-background-800 data-[active=true]:bg-transparent",
    },
    variant: {
      link: "px-0",
      outline:
        "bg-transparent border data-[hover=true]:bg-background-100 dark:data-[hover=true]:bg-background-800 data-[active=true]:bg-transparent",
      solid: "",
    },

    size: {
      xs: "px-3.5 h-8",
      sm: "px-4 h-9",
      md: "px-5 h-10",
      lg: "px-6 h-11",
      xl: "px-7 h-12",
    },
  },
  compoundVariants: [
    {
      action: "primary",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
    },
    {
      action: "secondary",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
    },
    {
      action: "positive",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
    },
    {
      action: "negative",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
    },
    {
      action: "primary",
      variant: "outline",
      class:
        "bg-transparent border-primary-600 data-[hover=true]:bg-background-100 dark:data-[hover=true]:bg-background-800 data-[active=true]:bg-transparent",
    },
    {
      action: "secondary",
      variant: "outline",
      class:
        "bg-transparent border-secondary-300 data-[hover=true]:bg-background-100 dark:data-[hover=true]:bg-background-800 data-[active=true]:bg-transparent",
    },
    {
      action: "positive",
      variant: "outline",
      class:
        "bg-transparent border-green-500 data-[hover=true]:bg-green-50 data-[active=true]:bg-transparent",
    },
    {
      action: "negative",
      variant: "outline",
      class:
        "bg-transparent border-red-500 data-[hover=true]:bg-red-50 data-[active=true]:bg-transparent",
    },
  ],
});

const buttonTextStyle = tva({
  base: "text-white font-semibold web:select-none",
  parentVariants: {
    action: {
      primary:
        "text-primary-600 data-[hover=true]:text-primary-700 data-[active=true]:text-primary-800",
      secondary:
        "text-secondary-700 data-[hover=true]:text-secondary-800 data-[active=true]:text-secondary-900",
      positive:
        "text-green-600 data-[hover=true]:text-green-700 data-[active=true]:text-green-800",
      negative:
        "text-red-600 data-[hover=true]:text-red-700 data-[active=true]:text-red-800",
    },
    variant: {
      link: "data-[hover=true]:underline data-[active=true]:underline",
      outline: "",
      solid:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  parentCompoundVariants: [
    {
      variant: "solid",
      action: "primary",
      class:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    {
      variant: "solid",
      action: "secondary",
      class:
        "text-gray-700 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-900",
    },
    {
      variant: "solid",
      action: "positive",
      class:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    {
      variant: "solid",
      action: "negative",
      class:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    {
      variant: "outline",
      action: "primary",
      class:
        "text-primary-600 data-[hover=true]:text-primary-700 data-[active=true]:text-primary-800",
    },
    {
      variant: "outline",
      action: "secondary",
      class:
        "text-secondary-600 data-[hover=true]:text-secondary-700 data-[active=true]:text-secondary-800",
    },
    {
      variant: "outline",
      action: "positive",
      class:
        "text-green-600 data-[hover=true]:text-green-700 data-[active=true]:text-green-800",
    },
    {
      variant: "outline",
      action: "negative",
      class:
        "text-red-600 data-[hover=true]:text-red-700 data-[active=true]:text-red-800",
    },
  ],
});

const buttonIconStyle = tva({
  base: "fill-none",
  parentVariants: {
    variant: {
      link: "data-[hover=true]:underline data-[active=true]:underline",
      outline: "",
      solid:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    size: {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-[18px] w-[18px]",
      xl: "h-5 w-5",
    },
    action: {
      primary:
        "text-primary-600 data-[hover=true]:text-primary-700 data-[active=true]:text-primary-800",
      secondary:
        "text-secondary-700 data-[hover=true]:text-secondary-800 data-[active=true]:text-secondary-900",
      positive:
        "text-green-600 data-[hover=true]:text-green-700 data-[active=true]:text-green-800",
      negative:
        "text-red-600 data-[hover=true]:text-red-700 data-[active=true]:text-red-800",
    },
  },
  parentCompoundVariants: [
    {
      variant: "solid",
      action: "primary",
      class:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    {
      variant: "solid",
      action: "secondary",
      class:
        "text-gray-700 data-[hover=true]:text-gray-800 data-[active=true]:text-gray-900",
    },
    {
      variant: "solid",
      action: "positive",
      class:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
    {
      variant: "solid",
      action: "negative",
      class:
        "text-white data-[hover=true]:text-white data-[active=true]:text-white",
    },
  ],
});

const buttonGroupStyle = tva({
  base: "",
  variants: {
    space: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-5",
      "2xl": "gap-6",
      "3xl": "gap-7",
      "4xl": "gap-8",
    },
    isAttached: {
      true: "gap-0",
    },
  },
});

type IButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIButton>,
  "context"
> &
  VariantProps<typeof buttonStyle> & { className?: string };

const Button = React.forwardRef<
  React.ElementRef<typeof UIButton>,
  IButtonProps
>(
  (
    { className, variant = "solid", size = "md", action = "primary", ...props },
    ref,
  ) => {
    return (
      <UIButton
        ref={ref}
        {...props}
        className={buttonStyle({ variant, size, action, class: className })}
        context={{ variant, size, action }}
      />
    );
  },
);

type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle> & { className?: string };

const ButtonText = React.forwardRef<
  React.ElementRef<typeof UIButton.Text>,
  IButtonTextProps
>(({ className, variant, size, action, ...props }, ref) => {
  const {
    variant: parentVariant,
    size: parentSize,
    action: parentAction,
  } = useStyleContext(SCOPE);

  return (
    <UIButton.Text
      ref={ref}
      {...props}
      className={buttonTextStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
          action: parentAction,
        },
        variant,
        size,
        action,
        class: className,
      })}
    />
  );
});

const ButtonSpinner = UIButton.Spinner;

type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
  };

const ButtonIcon = React.forwardRef<
  React.ElementRef<typeof UIButton.Icon>,
  IButtonIcon
>(({ className, size, ...props }, ref) => {
  const {
    variant: parentVariant,
    size: parentSize,
    action: parentAction,
  } = useStyleContext(SCOPE);

  if (typeof size === "number") {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
        size={size}
      />
    );
  }
  if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIButton.Icon
      {...props}
      className={buttonIconStyle({
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
          action: parentAction,
        },
        size,
        class: className,
      })}
      ref={ref}
    />
  );
});

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof UIButton.Group>,
  IButtonGroupProps
>(({ className, space = "md", isAttached = false, ...props }, ref) => {
  return (
    <UIButton.Group
      className={buttonGroupStyle({ class: className, space, isAttached })}
      {...props}
      ref={ref}
    />
  );
});

Button.displayName = "Button";
ButtonText.displayName = "ButtonText";
ButtonSpinner.displayName = "ButtonSpinner";
ButtonIcon.displayName = "ButtonIcon";
ButtonGroup.displayName = "ButtonGroup";

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
