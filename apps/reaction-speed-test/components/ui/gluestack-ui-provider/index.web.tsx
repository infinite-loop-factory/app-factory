"use client";
import type { ReactNode } from "react";

import { setFlushStyles } from "@gluestack-ui/nativewind-utils/flush";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { config } from "./config";
import { script } from "./script";

const variableStyleTagId = "nativewind-style";
const createStyle = (styleTagId: string) => {
  const style = document.createElement("style");
  style.id = styleTagId;
  style.appendChild(document.createTextNode(""));
  return style;
};

export const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function GluestackUIProvider({
  mode = "light",
  ...props
}: {
  mode?: "light" | "dark" | "system";
  children?: ReactNode;
}) {
  let cssVariablesWithMode = "";
  for (const configKey of Object.keys(config)) {
    cssVariablesWithMode +=
      configKey === "dark" ? "\n .dark {\n " : "\n:root {\n";
    const cssVariables = Object.keys(
      config[configKey as keyof typeof config],
    ).reduce((acc: string, curr: string) => {
      return `${acc}${curr}:${config[configKey as keyof typeof config][curr]}; `;
    }, "");
    cssVariablesWithMode += `${cssVariables}\n}`;
  }

  setFlushStyles(cssVariablesWithMode);

  const handleMediaQuery = useCallback((e: MediaQueryListEvent) => {
    script(e.matches ? "dark" : "light");
  }, []);

  useSafeLayoutEffect(() => {
    if (mode !== "system") {
      const documentElement = document.documentElement;
      if (documentElement) {
        documentElement.classList.add(mode);
        documentElement.classList.remove(mode === "light" ? "dark" : "light");
        documentElement.style.colorScheme = mode;
      }
    }
  }, [mode]);

  useSafeLayoutEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    media.addEventListener("change", handleMediaQuery);

    return () => media.removeEventListener("change", handleMediaQuery);
  }, [handleMediaQuery]);

  useSafeLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const documentElement = document.documentElement;
      if (documentElement) {
        const head = documentElement.querySelector("head");
        let style = head?.querySelector(`[id='${variableStyleTagId}']`);
        if (!style) {
          style = createStyle(variableStyleTagId);
          style.innerHTML = cssVariablesWithMode;
          if (head) head.appendChild(style);
        }
      }
    }
  }, []);

  return (
    <>
      <script
        suppressHydrationWarning
        // biome-ignore lint/security/noDangerouslySetInnerHtml: gluestack-ui
        dangerouslySetInnerHTML={{
          __html: `(${script.toString()})('${mode}')`,
        }}
      />
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </>
  );
}
