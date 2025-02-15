"use client";

import { darkSchema, lightSchema } from "@/components/ui/design-token/_index";
import { vars } from "nativewind";

export const config = {
  light: vars(rgbCovertNumber(lightSchema.token)),
  dark: vars(rgbCovertNumber(darkSchema.token)),
};

/**
 * @param colorSchema
 * @description for IDE Color hint
 */
function rgbCovertNumber(colorSchema: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(colorSchema).map(([k, v]) => [
      k,
      v.match(/\d+\s\d+\s\d+/)?.[0],
    ]),
  );
}
