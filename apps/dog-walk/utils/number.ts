/**
 * 미터 단위 거리를 km로 변환 (소수점 첫째자리까지 표시)
 * @param distance 미터 단위 거리
 * @returns 변환된 km (string)
 */
export function formatDistanceKm(distance: number): string {
  if (Number.isNaN(distance)) return "0.0";

  const km = distance / 1000;

  const rounded = Math.round(km * 10) / 10;

  return rounded.toFixed(1);
}

/**
 * 초 단위 시간을 분 단위로 변환
 * @param time 초 단위 시간
 * @returns 변환된 분 단위 시간 (number)
 */
export function convertSecondsToMinutes(time: number): number {
  return Math.round(time / 60);
}
