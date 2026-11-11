/** Whole-pair opacity, symmetric in scroll direction and based on rendered geometry. */
export function pairOpacity(top: number, bottom: number, readingTop: number, readingBottom: number, fadeInFraction: number, fadeOutFraction: number, minimumOpacity: number) {
  const viewportHeight = Math.max(1, readingBottom - readingTop);
  const pairHeight = Math.max(1, bottom - top);
  // Short pairs retain a fully opaque reading interval; tall pairs stay visible
  // until their trailing edge approaches the top of the reading area.
  const enterDistance = Math.max(1, Math.min(viewportHeight * fadeInFraction, pairHeight * 0.45));
  const exitDistance = Math.max(1, Math.min(viewportHeight * fadeOutFraction, pairHeight * 0.45));
  const progress = Math.max(0, Math.min(1, (readingBottom - top) / enterDistance, (bottom - readingTop) / exitDistance));
  return minimumOpacity + (1 - minimumOpacity) * progress;
}
