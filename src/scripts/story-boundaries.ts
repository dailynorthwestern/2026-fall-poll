// Switch at the last two lines, using measured text geometry rather than scroll percentages.
export const END_LINES = 2;
export const HYSTERESIS_PX = 8;
export function activeSection(bottoms: number[], lineHeights: number[], readingTop: number, current: number) {
  let next = Math.max(0, Math.min(current, bottoms.length - 1));
  while (next < bottoms.length - 1 && bottoms[next] <= readingTop + END_LINES * lineHeights[next] - HYSTERESIS_PX) next++;
  while (next > 0 && bottoms[next - 1] > readingTop + END_LINES * lineHeights[next - 1] + HYSTERESIS_PX) next--;
  return next;
}
