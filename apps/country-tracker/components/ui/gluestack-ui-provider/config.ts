"use client";
import { TOKENS } from "@/constants/color-tokens";
import { vars } from "nativewind";

type ColorMap = {
  [key in `--${string}`]: string;
};

const removeRgbWrapper = (colorMap: ColorMap) =>
  Object.fromEntries(
    Object.entries(colorMap).map(([key, value]) => [
      key,
      value.replace(/rgb\((.+)\)/, "$1").trim(),
    ]),
  );

export const config = {
  light: vars(removeRgbWrapper(TOKENS.light)),
  dark: vars(removeRgbWrapper(TOKENS.dark)),
};
