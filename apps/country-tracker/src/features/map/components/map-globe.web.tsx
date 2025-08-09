import type { PointerEvent } from "react";

import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";
import { ThemedView } from "@/components/themed-view";
import { Text } from "@/components/ui/text";
import { env } from "@/constants/env";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import { fetchVisitedCountries } from "@/utils/visited-countries";

// World topojson URL (lazy-fetched by react-simple-maps internally)
const WORLD_GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type CountryProperties = {
  iso_a2?: string;
  name?: string;
};

const MapGlobe = memo(function MapGlobe() {
  const { user } = useAuthUser();
  const [primary, outline] = useThemeColor(["primary-500", "outline-400"]);
  // rotation [lon, lat, roll]
  const [rotate, setRotate] = useState<[number, number, number]>([0, 0, 0]);
  const dragRef = useRef<{
    x: number;
    y: number;
    rot: [number, number, number];
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const { data: visitedCodes = [] } = useQuery({
    queryKey: QUERY_KEYS.countryPolygons(user?.id ?? null),
    queryFn: async () => {
      if (!user) return [] as string[];
      const items = await fetchVisitedCountries(user.id);
      return Array.from(new Set(items.map((i) => i.country_code))).filter(
        Boolean,
      );
    },
    enabled: !!user,
  });

  // For quick membership checks
  const visitedSet = useMemo(() => new Set(visitedCodes), [visitedCodes]);

  const openStore = () => {
    const url =
      env.EXPO_PUBLIC_APP_STORE_URL ||
      env.EXPO_PUBLIC_PLAY_STORE_URL ||
      "https://github.com/infinite-loop-factory/app-factory";
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Helpers
  const clamp = useCallback(
    (v: number, min: number, max: number) => Math.max(min, Math.min(max, v)),
    [],
  );
  const wrapLon = useCallback((lon: number) => {
    let l = ((((lon + 180) % 360) + 360) % 360) - 180; // wrap to [-180, 180)
    if (l === -180) l = 180;
    return l;
  }, []);

  // Pointer handlers on the SVG to rotate the globe
  const onPointerDown = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      try {
        (e.target as Element)?.setPointerCapture?.(e.pointerId);
      } catch {
        // ignore setPointerCapture errors on unsupported targets
      }
      dragRef.current = { x: e.clientX, y: e.clientY, rot: rotate };
      setDragging(true);
    },
    [rotate],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<SVGSVGElement>) => {
      const start = dragRef.current;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const K = 0.3; // deg per pixel sensitivity
      const lon = wrapLon(start.rot[0] + dx * K);
      const lat = clamp(start.rot[1] - dy * K, -89, 89);
      setRotate([lon, lat, 0]);
    },
    [clamp, wrapLon],
  );

  const endDrag = useCallback((e?: PointerEvent<SVGSVGElement>) => {
    try {
      if (e) {
        const pointerId: number = e.pointerId as number;
        (e.target as Element)?.releasePointerCapture?.(pointerId);
      }
    } catch {
      // ignore releasePointerCapture errors on unsupported targets
    }
    dragRef.current = null;
    setDragging(false);
  }, []);

  return (
    <ThemedView className="flex-1">
      <div className="h-full w-full flex-1">
        <ComposableMap
          onPointerDown={onPointerDown}
          onPointerLeave={endDrag}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          projection="geoOrthographic"
          projectionConfig={{ scale: 220, rotate }}
          style={{
            width: "100%",
            height: "100%",
            cursor: dragging ? "grabbing" : "grab",
          }}
        >
          <Sphere
            fill="var(--color-bg-subtle, #0b1020)"
            id="sphere"
            stroke={outline ?? "#3b3f4a"}
            strokeWidth={0.5}
          />
          <Graticule
            stroke={outline ?? "#3b3f4a"}
            strokeOpacity={0.35}
            // Slightly lighter grid lines
            strokeWidth={0.4}
          />
          <Geographies geography={WORLD_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const props = geo.properties as CountryProperties | undefined;
                const code = props?.iso_a2 ?? "";
                const isVisited = visitedSet.has(code);
                return (
                  <Geography
                    fill={isVisited ? `${primary}B3` : "#2b2f3a"}
                    geography={geo}
                    key={geo.rsmKey}
                    stroke={outline ?? "#3b3f4a"}
                    strokeWidth={0.25}
                    style={{
                      default: { outline: "none" },
                      pressed: { outline: "none" },
                      hover: { outline: "none", filter: "brightness(1.1)" },
                    }}
                  >
                    {/* Tooltip via SVG <title> */}
                    <title>{props?.name ?? code}</title>
                  </Geography>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div className="gap-2 p-4">
        <Text className="font-medium text-base">{i18n.t("map.countries")}</Text>
        {!user && (
          <Text className="text-sm opacity-80">
            {i18n.t("login.description")}
          </Text>
        )}
        <Text className="text-xs opacity-70">
          {i18n.t("map.web-disclaimer", {
            defaultValue:
              "3D globe is available on iOS. This is a 2D web view.",
          })}
        </Text>
        <button
          className={[
            "inline-flex",
            "items-center",
            "justify-center",
            "mt-2",
            "px-3",
            "py-2",
            "rounded-md",
            "bg-blue-600",
            "text-white",
          ].join(" ")}
          onClick={openStore}
          type="button"
        >
          {i18n.t("map.download-app", { defaultValue: "Download the app" })}
        </button>
      </div>
    </ThemedView>
  );
});

export default MapGlobe;
