"use client";

import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

import { PrimitiveIcon, UIIcon } from "@gluestack-ui/core/icon/creator";
import { createSelect } from "@gluestack-ui/core/select/creator";
import {
  tva,
  useStyleContext,
  withStyleContext,
} from "@gluestack-ui/utils/nativewind-utils";
import { cssInterop } from "nativewind";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { createVariantResolver } from "@/utils/variant-resolver";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetScrollView,
  ActionsheetSectionHeaderText,
  ActionsheetSectionList,
  ActionsheetVirtualizedList,
} from "./select-actionsheet";

const SelectTriggerWrapper = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentProps<typeof Pressable>
>(function SelectTriggerWrapper({ ...props }, ref) {
  return <Pressable {...props} ref={ref} />;
});

const selectIconStyle = tva({
  base: "text-background-500 fill-none",
  parentVariants: {
    size: {
      "2xs": "h-3 w-3",
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    },
  },
});

const resolveSelectIconSize = createVariantResolver([
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
] as const);

const selectStyle = tva({
  base: "",
});

const selectTriggerStyle = tva({
  base: "border border-background-300 rounded flex-row items-center overflow-hidden data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:data-[hover=true]:border-background-300",
  variants: {
    size: {
      xl: "h-12",
      lg: "h-11",
      md: "h-10",
      sm: "h-9",
    },
    variant: {
      underlined:
        "border-0 border-b rounded-none data-[hover=true]:border-primary-700 data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_-1px_0_0] data-[focus=true]:web:shadow-primary-700 data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700",
      outline:
        "data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_0_0_1px] data-[focus=true]:data-[hover=true]:web:shadow-primary-600 data-[invalid=true]:web:shadow-[inset_0_0_0_1px] data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700 data-[invalid=true]:data-[hover=true]:border-error-700",
      rounded:
        "rounded-full data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_0_0_1px] data-[focus=true]:web:shadow-primary-700 data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700",
    },
  },
});

const resolveSelectTriggerSize = createVariantResolver([
  "xl",
  "lg",
  "md",
  "sm",
] as const);

const resolveSelectTriggerVariant = createVariantResolver([
  "underlined",
  "outline",
  "rounded",
] as const);

const selectInputStyle = tva({
  base: "px-3 placeholder:text-typography-500 web:w-full h-full text-typography-900 pointer-events-none web:outline-none ios:leading-[0px] py-0",
  parentVariants: {
    size: {
      xl: "text-xl",
      lg: "text-lg",
      md: "text-base",
      sm: "text-sm",
    },
    variant: {
      underlined: "px-0",
      outline: "",
      rounded: "px-4",
    },
  },
});

const resolveSelectInputSize = createVariantResolver([
  "xl",
  "lg",
  "md",
  "sm",
] as const);

const resolveSelectInputVariant = createVariantResolver([
  "underlined",
  "outline",
  "rounded",
] as const);

const UISelect = createSelect(
  {
    Root: View,
    Trigger: withStyleContext(SelectTriggerWrapper),
    Input: TextInput,
    Icon: UIIcon,
  },
  {
    Portal: Actionsheet,
    Backdrop: ActionsheetBackdrop,
    Content: ActionsheetContent,
    DragIndicator: ActionsheetDragIndicator,
    DragIndicatorWrapper: ActionsheetDragIndicatorWrapper,
    Item: ActionsheetItem,
    ItemText: ActionsheetItemText,
    ScrollView: ActionsheetScrollView,
    VirtualizedList: ActionsheetVirtualizedList,
    FlatList: ActionsheetFlatList,
    SectionList: ActionsheetSectionList,
    SectionHeaderText: ActionsheetSectionHeaderText,
  },
);

cssInterop(UISelect, { className: "style" });
cssInterop(UISelect.Input, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
});
cssInterop(SelectTriggerWrapper, { className: "style" });

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

type ISelectProps = VariantProps<typeof selectStyle> &
  React.ComponentProps<typeof UISelect> & { className?: string };

const Select = React.forwardRef<
  React.ComponentRef<typeof UISelect>,
  ISelectProps
>(function Select({ className, ...props }, ref) {
  return (
    <UISelect
      className={selectStyle({
        class: className,
      })}
      ref={ref}
      {...props}
    />
  );
});

type ISelectTriggerProps = VariantProps<typeof selectTriggerStyle> &
  React.ComponentProps<typeof UISelect.Trigger> & { className?: string };

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof UISelect.Trigger>,
  ISelectTriggerProps
>(function SelectTrigger(
  { className, size = "md", variant = "outline", ...props },
  ref,
) {
  const variantSize = resolveSelectTriggerSize(size);
  const variantStyle = resolveSelectTriggerVariant(variant);
  return (
    <UISelect.Trigger
      className={selectTriggerStyle({
        class: className,
        size: variantSize,
        variant: variantStyle,
      })}
      context={{
        size: variantSize ?? size,
        variant: variantStyle ?? variant,
      }}
      ref={ref}
      {...props}
    />
  );
});

type ISelectInputProps = VariantProps<typeof selectInputStyle> &
  React.ComponentProps<typeof UISelect.Input> & { className?: string };

const SelectInput = React.forwardRef<
  React.ComponentRef<typeof UISelect.Input>,
  ISelectInputProps
>(function SelectInput({ className, ...props }, ref) {
  const { size: parentSize, variant: parentVariant } = useStyleContext();
  const resolvedParentSize = resolveSelectInputSize(parentSize);
  const resolvedParentVariant = resolveSelectInputVariant(parentVariant);
  return (
    <UISelect.Input
      className={selectInputStyle({
        class: className,
        parentVariants: {
          size: resolvedParentSize,
          variant: resolvedParentVariant,
        },
      })}
      ref={ref}
      {...props}
    />
  );
});

type ISelectIcon = VariantProps<typeof selectIconStyle> &
  React.ComponentProps<typeof UISelect.Icon> & {
    className?: string;
    height?: number;
    width?: number;
  };

const SelectIcon = React.forwardRef<
  React.ComponentRef<typeof UISelect.Icon>,
  ISelectIcon
>(function SelectIcon({ className, size, height, width, ...props }, ref) {
  const { size: parentSize } = useStyleContext();
  if (typeof size === "number") {
    return (
      <UISelect.Icon
        ref={ref}
        {...props}
        className={selectIconStyle({ class: className })}
        height={height}
        size={size}
        width={width}
      />
    );
  } else if (
    (height !== undefined || width !== undefined) &&
    size === undefined
  ) {
    return (
      <UISelect.Icon
        ref={ref}
        {...props}
        className={selectIconStyle({ class: className })}
        height={height}
        width={width}
      />
    );
  }
  const variantSize = resolveSelectIconSize(size);
  const parentVariantSize = resolveSelectIconSize(parentSize);
  return (
    <UISelect.Icon
      className={selectIconStyle({
        class: className,
        size: variantSize,
        parentVariants: {
          size: parentVariantSize,
        },
      })}
      height={height}
      ref={ref}
      size={size}
      width={width}
      {...props}
    />
  );
});

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectInput.displayName = "SelectInput";
SelectIcon.displayName = "SelectIcon";

// Actionsheet Components
const SelectPortal = UISelect.Portal;
const SelectBackdrop = UISelect.Backdrop;
const SelectContent = UISelect.Content;
const SelectDragIndicator = UISelect.DragIndicator;
const SelectDragIndicatorWrapper = UISelect.DragIndicatorWrapper;
const SelectItem = UISelect.Item;
const SelectScrollView = UISelect.ScrollView;
const SelectVirtualizedList = UISelect.VirtualizedList;
const SelectFlatList = UISelect.FlatList;
const SelectSectionList = UISelect.SectionList;
const SelectSectionHeaderText = UISelect.SectionHeaderText;

export {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
  SelectVirtualizedList,
  SelectFlatList,
  SelectSectionList,
  SelectSectionHeaderText,
};
