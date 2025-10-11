import type { Feature, FeatureCollection, Polygon, Position } from "geojson";
import type { PointerEvent } from "react";
import type {
  AnimationState,
  CountryProperties,
  MapGlobeRef,
} from "@/features/map/types/map-globe";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";
import worldTopo from "@/assets/geodata/world/countries-110m.json";
import { ThemedView } from "@/components/themed-view";
import { Text } from "@/components/ui/text";
import { env } from "@/constants/env";
import {
  VISITED_FILL_OPACITY,
  VISITED_STROKE_WIDTH_WEB,
} from "@/features/map/constants/style";
import { useVisitedCountrySummariesQuery } from "@/features/map/hooks/use-visited-country-summaries";
import {
  getCountryPolygon,
  normalizeCountryCode,
} from "@/features/map/utils/country-polygons";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

type MapGlobeProps = {
  year: number;
};

const MapGlobeComponent = forwardRef<MapGlobeRef, MapGlobeProps>(
  ({ year }, ref) => {
    const { user } = useAuthUser();
    const [primary, outline] = useThemeColor(["primary-500", "outline-400"]);
    const [rotate, setRotate] = useState<[number, number, number]>([0, 0, 0]);
    const rotateRef = useRef<[number, number, number]>(rotate);
    useEffect(() => {
      rotateRef.current = rotate;
    }, [rotate]);

    const dragRef = useRef<{
      x: number;
      y: number;
      rot: [number, number, number];
    } | null>(null);
    const [dragging, setDragging] = useState(false);
    const sphereId = useId();

    const animationFrameRef = useRef<number | null>(null);
    const animationStateRef = useRef<AnimationState | null>(null);

    const stopAnimation = useCallback(() => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      animationStateRef.current = null;
    }, []);

    useEffect(() => () => stopAnimation(), [stopAnimation]);

    const emptyFeatureCollection: FeatureCollection<
      Polygon,
      { country_code: string }
    > = { type: "FeatureCollection", features: [] };

    const { data: visitedFeatureCollection = emptyFeatureCollection } =
      useVisitedCountrySummariesQuery<
        FeatureCollection<Polygon, { country_code: string }>
      >({
        userId: user?.id ?? null,
        year,
        select: (summaries) => {
          const features: Feature<Polygon, { country_code: string }>[] = [];
          const uniqueCodes = Array.from(
            new Set(
              summaries.map((summary) => summary.countryCode).filter(Boolean),
            ),
          ) as string[];

          for (const raw of uniqueCodes) {
            const normalized = normalizeCountryCode(raw);
            if (!normalized) continue;
            const poly = getCountryPolygon(normalized);
            if (!poly) continue;
            for (const ring of poly.coordinates) {
              const ringCoords = ring as unknown as Position[];
              features.push({
                type: "Feature",
                properties: { country_code: normalized },
                geometry: { type: "Polygon", coordinates: [ringCoords] },
              });
            }
          }

          return { type: "FeatureCollection", features };
        },
      });

    const clamp = useCallback(
      (v: number, min: number, max: number) => Math.max(min, Math.min(max, v)),
      [],
    );

    const wrapLon = useCallback((lon: number) => {
      let l = ((((lon + 180) % 360) + 360) % 360) - 180;
      if (l === -180) l = 180;
      return l;
    }, []);

    const openStore = () => {
      const url =
        env.EXPO_PUBLIC_APP_STORE_URL ||
        env.EXPO_PUBLIC_PLAY_STORE_URL ||
        "https://github.com/infinite-loop-factory/app-factory";
      if (typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    };

    const startRotationAnimation = useCallback(
      (targetLatitude: number, targetLongitude: number, duration = 1500) => {
        const sanitizedDuration = Math.max(duration, 300);
        const start = rotateRef.current;
        const targetLon = wrapLon(-targetLongitude);
        const targetLat = clamp(-targetLatitude, -89, 89);
        const lonDiff = wrapLon(targetLon - start[0]);
        const latDiff = targetLat - start[1];

        const step = (timestamp: number) => {
          const state = animationStateRef.current;
          if (!state) return;
          if (state.startTime === 0) {
            state.startTime = timestamp;
          }
          const elapsed = timestamp - state.startTime;
          const progress = Math.min(elapsed / state.duration, 1);
          const eased = easeInOut(progress);
          const nextLon = wrapLon(state.start[0] + state.lonDiff * eased);
          const nextLat = clamp(
            state.start[1] + state.latDiff * eased,
            -89,
            89,
          );
          setRotate([nextLon, nextLat, 0]);
          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(step);
          } else {
            animationFrameRef.current = null;
            animationStateRef.current = null;
          }
        };

        stopAnimation();
        animationStateRef.current = {
          start: [...start] as [number, number, number],
          lonDiff,
          latDiff,
          startTime: 0,
          duration: sanitizedDuration,
        };
        animationFrameRef.current = requestAnimationFrame(step);
      },
      [clamp, stopAnimation, wrapLon],
    );

    useImperativeHandle(
      ref,
      () => ({
        globeRotationAnimation: (
          targetLatitude: number,
          targetLongitude: number,
          duration?: number,
        ) => {
          startRotationAnimation(targetLatitude, targetLongitude, duration);
        },
      }),
      [startRotationAnimation],
    );

    const onPointerDown = useCallback(
      (e: PointerEvent<SVGSVGElement>) => {
        stopAnimation();
        try {
          (e.target as Element)?.setPointerCapture?.(e.pointerId);
        } catch {
          // ignore setPointerCapture errors on unsupported targets
        }
        dragRef.current = {
          x: e.clientX,
          y: e.clientY,
          rot: rotateRef.current,
        };
        setDragging(true);
      },
      [stopAnimation],
    );

    const onPointerMove = useCallback(
      (e: PointerEvent<SVGSVGElement>) => {
        const start = dragRef.current;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        const sensitivity = 0.3;
        const lon = wrapLon(start.rot[0] + dx * sensitivity);
        const lat = clamp(start.rot[1] - dy * sensitivity, -89, 89);
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
              id={sphereId}
              stroke={outline ?? "#3b3f4a"}
              strokeWidth={0.5}
            />
            <Graticule
              stroke={outline ?? "#3b3f4a"}
              strokeOpacity={0.35}
              strokeWidth={0.4}
            />
            <Geographies geography={worldTopo}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const props = geo.properties as CountryProperties | undefined;
                  const candidate =
                    props?.iso_a2 || (geo.id as unknown as string);
                  const code = normalizeCountryCode(candidate) ?? "";
                  return (
                    <Geography
                      fill="#2b2f3a"
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
                      <title>{props?.name ?? code}</title>
                    </Geography>
                  );
                })
              }
            </Geographies>

            <Geographies geography={visitedFeatureCollection}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    fill={primary}
                    geography={geo}
                    key={geo.rsmKey}
                    stroke={primary}
                    strokeWidth={VISITED_STROKE_WIDTH_WEB}
                    style={{
                      default: {
                        outline: "none",
                        pointerEvents: "none",
                        fillOpacity: VISITED_FILL_OPACITY,
                      },
                      pressed: {
                        outline: "none",
                        pointerEvents: "none",
                        fillOpacity: VISITED_FILL_OPACITY,
                      },
                      hover: {
                        outline: "none",
                        pointerEvents: "none",
                        filter: "brightness(1.05)",
                        fillOpacity: VISITED_FILL_OPACITY,
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="gap-2 p-4">
          <Text className="font-medium text-base">
            {i18n.t("map.countries")}
          </Text>
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
            className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-white"
            onClick={openStore}
            type="button"
          >
            {i18n.t("map.download-app", { defaultValue: "Download the app" })}
          </button>
        </div>
      </ThemedView>
    );
  },
);

MapGlobeComponent.displayName = "MapGlobeWeb";

const MapGlobe = memo(MapGlobeComponent);

export default MapGlobe;
