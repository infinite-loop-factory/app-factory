export function formatSearchRadius(radius: number) {
  if (radius < 1000) {
    return `${radius}m`;
  }

  const kilometer = radius / 1000;
  return Number.isInteger(kilometer) ? `${kilometer}km` : `${kilometer}km`;
}
