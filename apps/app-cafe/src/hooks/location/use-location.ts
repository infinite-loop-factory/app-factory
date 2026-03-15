import type {
  Camera,
  LocationTrackingMode,
  NaverMapViewProps,
  NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";

import { clamp } from "es-toolkit";
import * as Location from "expo-location";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export type ActivityType =
  | "Stationary"
  | "Walking"
  | "Running"
  | "Cycling"
  | "Automotive"
  | "Flying";

export type TrackingModeType = LocationTrackingMode;

export const FOLLOW_TRACKING_STATUS: LocationTrackingMode[] = [
  "Follow",
  "Face",
];

export type LatLng = { latitude: number; longitude: number };

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

const normalize360 = (deg: number) => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};

const forceNumber = <T>(value: T, fallback = 0): number => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const bearingBetween = (a: LatLng, b: LatLng) => {
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return normalize360(toDeg(Math.atan2(y, x)));
};

const distanceMeters = (a: LatLng, b: LatLng) => {
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const mixAngleDeg = (aDeg: number, bDeg: number, w: number) => {
  const a = toRad(normalize360(aDeg));
  const b = toRad(normalize360(bDeg));
  const sin = (1 - w) * Math.sin(a) + w * Math.sin(b);
  const cos = (1 - w) * Math.cos(a) + w * Math.cos(b);
  return normalize360(toDeg(Math.atan2(sin, cos)));
};

const determineActivity = (mps: number): ActivityType => {
  if (mps < 1.0) return "Stationary";
  if (mps < 2.5) return "Walking";
  if (mps < 6.0) return "Running";
  if (mps < 15.0) return "Cycling";
  if (mps < 80.0) return "Automotive";
  return "Flying";
};

const CONFIG = {
  // --- 제스처 억제(드래그 후 자동복귀 방지 핵심) ---
  SUPPRESS_GESTURE_MS: 1000,

  // 기본 설정
  ALPHA_STATIC: 0.1,
  TURN_THRESHOLD: 30, // 이 각도 이상 확 돌면 '부스트 모드' 발동

  BOOST_DURATION_MS: 1500,
  BOOST_DEADZONE: 0.1,
  BOOST_ANIMATION: 150,

  // 정지 시 (둔감하게 유지)
  DEADZONE_STATIC: 10,
  DURATION_STATIC: 100,
  ALPHA_ACTIVE_STATIC: 0.35,

  // 걷는 중 (흔들림 방지 위해 둔감하게)
  DEADZONE_WALKING: 20,
  DURATION_WALKING: 250,
  ALPHA_ACTIVE_WALKING: 0.15,

  // 기타 값 유지
  SPEED_EMA_ALPHA: 0.2,
  COURSE_MIN_DIST_M: 5,
  COURSE_MAX_AGE_MS: 2500,
  ACCURACY_MAX_M: 35,
  SPEED_COURSE_START: 1.2,
  SPEED_COURSE_FULL: 2.5,
  JUMP_ACCURACY_BAD_M: 45,
  JUMP_REJECT_DIST_M: 25,
  JUMP_REJECT_DT_MS: 1200,
  MAX_REASONABLE_SPEED_MPS: 15,
  ACC_EMA_ALPHA: 0.18,
  WEIGHT_EMA_ALPHA: 0.25,
  MOVING_ON_MPS: 0.5,
  MOVING_OFF_MPS: 0.3,
  MOVING_HOLD_MS: 1200,
  COURSE_WEIGHT_MAX: 0.85,
} as const;

function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

const initLocation = {
  latitude: 37.5665,
  longitude: 126.978,
};

export const useCafeMap = (mapRef: RefObject<NaverMapViewRef | null>) => {
  const [trackingMode, setTrackingMode] = useState<TrackingModeType>("Follow");
  const [activity, setActivity] = useState<ActivityType>("Walking");

  const isTrackingActive = useSharedValue(1);

  const isInteracting = useSharedValue(false);

  const [isLoading, setIsLoading] = useState(true);
  const markerRotation = useSharedValue(0);

  const [camera, setCamera] = useState<Camera>({
    ...initLocation,
    zoom: 18,
    bearing: 0,
  });

  const trackingRef = useLatestRef(trackingMode);
  const lastAutoCameraRef = useRef<{
    ts: number;
    pos: LatLng;
    bearing: number;
  } | null>(null);
  const mapCameraRef = useRef<Camera | null>(null);
  const mapBearing = useSharedValue(0);

  const sinSumRef = useRef<number>(0);
  const cosSumRef = useRef<number>(1);
  const isInitializedHeading = useRef(false);

  const locSubRef = useRef<Location.LocationSubscription | null>(null);

  const lastRotationRef = useRef(0);
  const lastFixRef = useRef<{ pos: LatLng; ts: number } | null>(null);

  const locationSv = useSharedValue<LatLng>(initLocation);
  const locationRef = useRef<LatLng>(initLocation);
  const bearingSv = useSharedValue<number>(0);
  const courseBearingSv = useSharedValue<number>(0);

  const suppressUntilRef = useRef(0);

  const [locationState, setLocationState] = useState<LatLng | null>(null);

  const courseRef = useRef<{
    deg: number;
    ts: number;
    valid: boolean;
    sin: number;
    cos: number;
  }>({ deg: 0, ts: 0, valid: false, sin: 0, cos: 1 });

  const speedRef = useRef<number>(0);
  const speedEmaRef = useRef<number>(0);
  const accEmaRef = useRef<number>(999);
  const accuracyRef = useRef<number>(999);
  const weightRef = useRef<number>(0);

  const movingStateRef = useRef<{ moving: boolean; until: number }>({
    moving: false,
    until: 0,
  });

  const lastMovedAtRef = useRef<number>(0);

  const gestureBurstRef = useRef<{ ts: number; count: number }>({
    ts: 0,
    count: 0,
  });

  // -----------------------------
  // Fix Reject
  // -----------------------------
  const shouldRejectFix = useCallback(
    (next: LatLng, now: number, accRaw: number, spRaw: number) => {
      const last = lastFixRef.current;
      if (!last) return false;

      const dt = Math.max(1, now - last.ts); // ms
      const dist = distanceMeters(last.pos, next); // meters
      const impliedSpeed = dist / (dt / 1000); // m/s

      if (dt < 250 && dist < 3) return true;

      if (accRaw <= 12) {
        return impliedSpeed > 80;
      }

      if (accRaw <= 30) {
        if (impliedSpeed > 35) return true;
        return dt < 1200 && dist > 80;
      }

      if (dt < 1500 && dist > 25) return true;

      if (impliedSpeed > 45) return true; // 45m/s ≈ 162km/h

      return spRaw <= 0.6 && accRaw > 40 && dt < 1200 && dist > 20;
    },
    [],
  );
  // -----------------------------
  // Course from location delta
  // -----------------------------
  const updateCourseFromFix = useCallback(
    (next: LatLng, now: number) => {
      const last = lastFixRef.current;
      lastFixRef.current = { pos: next, ts: now };
      if (!last) return;

      const dist = distanceMeters(last.pos, next);
      const dt = Math.max(1, now - last.ts);

      if (dist >= 1.2) lastMovedAtRef.current = now;
      if (dist < CONFIG.COURSE_MIN_DIST_M) return;

      if (speedRef.current <= 0.2) speedRef.current = dist / (dt / 1000);

      const rawCourse = bearingBetween(last.pos, next);
      const rawRad = toRad(rawCourse);
      const sp = speedEmaRef.current;

      const alpha = clamp(0.12 + (sp / 6) * 0.18, 0.12, 0.3);
      const c = courseRef.current;

      if (!c.valid) {
        c.sin = Math.sin(rawRad);
        c.cos = Math.cos(rawRad);
        c.deg = rawCourse;
        c.valid = true;
        c.ts = now;
        courseBearingSv.value = rawCourse;
        return;
      }

      c.sin = c.sin * (1 - alpha) + Math.sin(rawRad) * alpha;
      c.cos = c.cos * (1 - alpha) + Math.cos(rawRad) * alpha;
      c.deg = normalize360(toDeg(Math.atan2(c.sin, c.cos)));
      c.ts = now;
      c.valid = true;
      courseBearingSv.value = c.deg;
    },
    [courseBearingSv],
  );

  // -----------------------------
  // ✅ SAFE toLocation
  // - 0 값(bearing=0 / latitude=0)도 정상 반영되도록 수정
  // - current.lat/lon falsy 체크 제거
  // -----------------------------
  const toLocation = useCallback(
    (locationParams?: Partial<{ locParam: LatLng; bearing: number }>) => {
      const current = locationParams?.locParam ?? locationSv.value;

      if (current.latitude == null || current.longitude == null) return;

      const bearing = locationParams?.bearing;

      setCamera((c) => ({
        ...c,
        ...mapCameraRef.current,
        ...current,
        bearing,
      }));
    },
    [locationSv],
  );

  const shouldPushAutoCamera = useCallback(
    (
      nextPos: LatLng,
      nextBearing: number,
      now: number,
      mode: TrackingModeType,
    ) => {
      const prev = lastAutoCameraRef.current;

      if (prev && now - prev.ts < 100) return false;

      if (!prev) return true;

      const dist = distanceMeters(prev.pos, nextPos);

      const delta = Math.abs(normalize360(nextBearing - prev.bearing));
      const bearingDelta = delta > 180 ? 360 - delta : delta;

      if (mode === "Follow") {
        return dist >= 0.8;
      }

      if (mode === "Face") {
        return !(dist < 0.6 && bearingDelta < 2.0);
      }

      return true;
    },
    [],
  );

  // -----------------------------
  // ✅ Auto camera tick loop
  // - 드래그(gesture) 직후 suppress 동안 자동 업데이트 차단
  // - Follow/Face 모드에서만 자동 이동
  // -----------------------------
  useEffect(
    () => {
      let timer: ReturnType<typeof setTimeout> | null = null;
      let alive = true;

      const tick = () => {
        if (!alive) return;

        const now = Date.now();

        // ✅ 1) 제스처 억제 윈도우면 자동 이동 금지
        if (now < suppressUntilRef.current) {
          timer = setTimeout(tick, 50);
          return;
        }

        // ✅ 2) 추적이 꺼져있으면 "가끔만" 체크
        if (!isTrackingActive.value) {
          timer = setTimeout(tick, 200);
          return;
        }

        // ✅ 3) Follow/Face에서만 자동 이동
        const mode = trackingRef.current;
        if (!FOLLOW_TRACKING_STATUS.includes(mode)) {
          timer = setTimeout(tick, 100);
          return;
        }

        const nextPos = locationRef.current;
        const nextBearing = bearingSv.value;

        if (!shouldPushAutoCamera(nextPos, nextBearing, now, mode)) {
          timer = setTimeout(tick, 100);
          return;
        }

        if (mode === "Face") {
          toLocation({ bearing: bearingSv.value });
        } else {
          mapRef.current?.animateCameraTo({
            ...locationRef.current,
            ...{ duration: 800, easing: "Linear" },
          });
        }

        lastAutoCameraRef.current = {
          ts: now,
          pos: nextPos,
          bearing: nextBearing,
        };

        timer = setTimeout(tick, 100);
      };

      tick();

      return () => {
        alive = false;
        if (timer) clearTimeout(timer);
      };
    },
    [
      // toLocation,
      // bearingSv,
      // isTrackingActive,
      // trackingRef,
      // mapRef,
      // shouldPushAutoCamera,
    ],
  );

  // -----------------------------
  // Heading smoothing (유지)
  // -----------------------------
  const computeSmoothedDeviceHeading = useCallback(
    (rawDegree: number, dynamicAlpha: number) => {
      const rawRad = toRad(rawDegree);

      if (!isInitializedHeading.current) {
        sinSumRef.current = Math.sin(rawRad);
        cosSumRef.current = Math.cos(rawRad);
        isInitializedHeading.current = true;

        lastRotationRef.current = rawDegree;
        markerRotation.value = rawDegree;
        return rawDegree;
      }

      const newSin =
        sinSumRef.current * (1 - dynamicAlpha) +
        Math.sin(rawRad) * dynamicAlpha;
      const newCos =
        cosSumRef.current * (1 - dynamicAlpha) +
        Math.cos(rawRad) * dynamicAlpha;

      sinSumRef.current = newSin;
      cosSumRef.current = newCos;

      return normalize360(toDeg(Math.atan2(newSin, newCos)));
    },
    [markerRotation],
  );

  const computeFinalBearing = useCallback(
    (deviceHeadingDeg: number, now: number, isStationary: boolean) => {
      if (isStationary) {
        weightRef.current *= 1 - CONFIG.WEIGHT_EMA_ALPHA;
        return deviceHeadingDeg;
      }

      const c = courseRef.current;
      const courseFresh = c.valid && now - c.ts <= CONFIG.COURSE_MAX_AGE_MS;

      const sp = speedEmaRef.current;
      const acc = accEmaRef.current;
      const ms = movingStateRef.current;

      if (ms.moving) {
        if (sp < CONFIG.MOVING_OFF_MPS && now > ms.until) ms.moving = false;
      } else {
        if (sp > CONFIG.MOVING_ON_MPS) {
          ms.moving = true;
          ms.until = now + CONFIG.MOVING_HOLD_MS;
        }
      }

      if (!(ms.moving && courseFresh)) {
        weightRef.current *= 1 - CONFIG.WEIGHT_EMA_ALPHA;
        return deviceHeadingDeg;
      }

      const wSpeed = clamp(
        (sp - CONFIG.SPEED_COURSE_START) /
          (CONFIG.SPEED_COURSE_FULL - CONFIG.SPEED_COURSE_START),
        0,
        1,
      );

      const wAcc = clamp(1 - (acc - 10) / (CONFIG.ACCURACY_MAX_M - 10), 0, 1);

      const wRaw = clamp(wSpeed * wAcc, 0, CONFIG.COURSE_WEIGHT_MAX);

      weightRef.current =
        weightRef.current * (1 - CONFIG.WEIGHT_EMA_ALPHA) +
        wRaw * CONFIG.WEIGHT_EMA_ALPHA;

      return mixAngleDeg(deviceHeadingDeg, c.deg, weightRef.current);
    },
    [],
  );

  // -----------------------------
  // Set location shared value
  // -----------------------------
  const setLocation = useCallback(
    (latLan: LatLng) => {
      setLocationState(latLan);
      locationSv.value = {
        latitude: latLan.latitude,
        longitude: latLan.longitude,
      };
      locationRef.current = latLan;
    },
    [locationSv],
  );

  // -----------------------------
  // Start subscriptions
  // -----------------------------

  const activeDebounce = useRef<NodeJS.Timeout | null>(null);
  const startSubs = useCallback(async () => {
    setIsLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setIsLoading(false);
      return false;
    }

    const first =
      (await Location.getLastKnownPositionAsync()) ??
      (await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).catch(() => null));

    if (first) {
      const next = {
        latitude: forceNumber(first.coords.latitude),
        longitude: forceNumber(first.coords.longitude),
      };

      toLocation({ locParam: next });
      mapRef.current?.animateCameraTo({
        ...next,
        duration: 0,
      });
      isInteracting.value = true;

      setLocation(next);
      lastFixRef.current = { pos: next, ts: Date.now() };
    }

    locSubRef.current = await Location.watchPositionAsync(
      {
        accuracy: FOLLOW_TRACKING_STATUS.includes(trackingMode)
          ? Location.Accuracy.High
          : Location.Accuracy.Balanced,
        timeInterval: 800,
        distanceInterval: 1.5,
      },
      (location) => {
        if (activeDebounce.current) {
          clearTimeout(activeDebounce.current);
        }

        activeDebounce.current = setTimeout(() => {
          setActivity("Stationary");
        }, 5_000);

        if (isLoading) setIsLoading(false);

        const next = {
          latitude: forceNumber(location.coords.latitude),
          longitude: forceNumber(location.coords.longitude),
        };

        const now = Date.now();
        let spRaw = forceNumber(location.coords.speed, 0);
        const accRaw = forceNumber(location.coords.accuracy, 999);

        // speed EMA
        if (spRaw < 0.25) {
          spRaw = 0;
          speedEmaRef.current = 0;
        } else {
          const prev = speedEmaRef.current || spRaw;
          speedEmaRef.current =
            prev * (1 - CONFIG.SPEED_EMA_ALPHA) +
            spRaw * CONFIG.SPEED_EMA_ALPHA;
        }
        speedRef.current = speedEmaRef.current;

        // accuracy EMA
        const prevAcc = accEmaRef.current || accRaw;
        accEmaRef.current =
          prevAcc * (1 - CONFIG.ACC_EMA_ALPHA) + accRaw * CONFIG.ACC_EMA_ALPHA;
        accuracyRef.current = accEmaRef.current;

        // activity
        const newActivity = determineActivity(speedEmaRef.current);
        setActivity((prev) => (prev !== newActivity ? newActivity : prev));

        const rejected = shouldRejectFix(next, now, accRaw, spRaw);

        if (rejected) {
          if (lastFixRef.current) lastFixRef.current.ts = now;
          return;
        }
        setLocation(next);

        updateCourseFromFix(next, now);
      },
    );

    return true;
  }, [
    updateCourseFromFix,
    shouldRejectFix,
    setLocation,
    toLocation,
    trackingMode,
    isLoading,
  ]);

  // -----------------------------
  // Stop all
  // -----------------------------
  const stopAll = useCallback(() => {
    isTrackingActive.value = 0;

    if (locSubRef.current) {
      locSubRef.current.remove();
      locSubRef.current = null;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    isInitializedHeading.current = false;
    lastFixRef.current = null;
    courseRef.current.valid = false;
    speedEmaRef.current = 0;
    movingStateRef.current = { moving: false, until: 0 };
  }, [isTrackingActive]);

  const checkGesture = useCallback(() => {
    const now = Date.now();
    const g = gestureBurstRef.current;

    if (now - g.ts > 500) {
      g.ts = now;
      g.count = 1;
      return false;
    }

    g.count += 1;

    if (g.count >= 3) {
      g.ts = 0;
      g.count = 0;
      return true;
    }

    return false;
  }, []);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const handleCameraChange = useCallback(
    ({
      reason,
      ...cam
    }: Parameters<NonNullable<NaverMapViewProps["onCameraChanged"]>>[0]) => {
      if (reason === "Gesture") {
        suppressUntilRef.current = Date.now() + CONFIG.SUPPRESS_GESTURE_MS;
        isInteracting.value = true;
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        isInteracting.value = false;
      }, 100);

      mapCameraRef.current = { ...mapCameraRef.current, ...cam };

      if (cam.bearing !== undefined) mapBearing.value = cam.bearing;

      if (!checkGesture()) return;
      // isInteracting.value = true;

      if (
        !FOLLOW_TRACKING_STATUS.includes(trackingRef.current) ||
        reason !== "Gesture"
      )
        return;
      setTrackingMode("None");
    },
    [mapBearing, checkGesture, isInteracting, trackingRef],
  );

  // -----------------------------
  // Current location button
  // -----------------------------
  const handleCurrentLocationPress = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return Alert.alert("권한 필요");

    isTrackingActive.value = 1;

    const nextTracking = [
      ["Follow", "Face"],
      ["Face", "Follow"],
      ["None", "Follow"],
    ] as const satisfies Array<[TrackingModeType, TrackingModeType]>;

    for (const [mode, tracking] of nextTracking) {
      if (mode === trackingRef.current) {
        if (mode === "None") {
          isInteracting.value = true;
        }

        suppressUntilRef.current = 0;

        mapRef.current?.animateCameraTo({
          ...locationSv.value,
          duration: 800,
          easing: "EaseIn",
        });
        return setTrackingMode(tracking);
      }
    }
  }, [
    trackingRef,
    isTrackingActive,
    toLocation,
    locationSv,
    mapRef,
    isInteracting,
  ]);

  // -----------------------------
  // Mount
  // -----------------------------
  // biome-ignore lint/correctness/useExhaustiveDependencies: only first
  useEffect(() => {
    void startSubs();
    return () => stopAll();
  }, []);

  // useEffect(() => {
  //   // 1초마다 실행
  //   const timer = setInterval(() => {
  //     // 현재 위치(Ref)를 가져와서 다음 스텝 계산
  //     const nextPos = simulateHumanStep(locationRef.current);
  //
  //     // 1. UI(지도) 업데이트 (기존 로직 활용)
  //     setLocation(nextPos);
  //     setActivity("Walking");
  //
  //     // 2. 내부 로직(속도/코스 계산)도 속이기 위해 업데이트 호출
  //     // (속도는 1.4m/s, 정확도는 5m로 고정 주입)
  //     updateCourseFromFix(nextPos, Date.now());
  //
  //     // 3. (선택) Face 모드면 카메라도 돌려주기
  //     if (trackingRef.current === "Face") {
  //       bearingSv.value = simHeading;
  //     }
  //   }, 800);a
  //
  //   return () => clearInterval(timer);
  // }, [bearingSv, setLocation, trackingRef, updateCourseFromFix]);

  return {
    trackingMode,
    isLoading,
    markerRotation,
    activity,

    handleCurrentLocationPress,
    handleCameraChange,

    camera,
    setCamera,

    mapCameraRef,
    mapBearing,

    locationSv,
    isTrackingActive,
    bearingSv,
    courseBearing: courseBearingSv,
    isInteracting,

    computeSmoothedDeviceHeading,
    computeFinalBearing,
    locationState,
    onTabMap: () => {},
  };
};

let simHeading = 0;

export const simulateHumanStep = (current: LatLng): LatLng => {
  // const WALKING_SPEED = 1.4; // 약 5km/h (사람 걷는 속도)
  const WALKING_SPEED = 1; // 약 5km/h (사람 걷는 속도)
  const EARTH_RADIUS = 6371000; // 미터

  // 1. 방향을 랜덤하게 살짝 틉니다 (-20도 ~ +20도)
  // 그래야 술 취한 사람처럼 안 보이고 자연스럽게 걷는 것처럼 보입니다.
  const randomTurn = (Math.random() - 0.5) * 40;
  simHeading = (simHeading + randomTurn) % 360;

  // 2. 이동할 거리 (m) -> 위경도 델타 변환
  const dist = WALKING_SPEED;
  const radHeading = (simHeading * Math.PI) / 180;
  const radLat = (current.latitude * Math.PI) / 180;

  // 단순화된 삼각함수 이동 계산
  const deltaLat = (dist * Math.cos(radHeading)) / EARTH_RADIUS;
  const deltaLon =
    (dist * Math.sin(radHeading)) / (EARTH_RADIUS * Math.cos(radLat));

  // 3. 라디안 -> 도로 (Degree) 변환 후 더하기
  return {
    latitude: current.latitude + (deltaLat * 180) / Math.PI,
    longitude: current.longitude + (deltaLon * 180) / Math.PI,
  };
};
