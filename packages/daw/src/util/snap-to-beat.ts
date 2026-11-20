interface SnapToBeatOptions {
  clientX: number;
  /** Left edge of the element the click is measured against (`rect.left`). */
  rectLeft: number;
  pixelsPerBeat: number;
  pixelsPerSecond: number;
}

/**
 * Seconds from the element's left edge to the start of the beat under `clientX`.
 * The result is negative when `clientX` is left of the element.
 */
export function snapToBeat({
  clientX,
  rectLeft,
  pixelsPerBeat,
  pixelsPerSecond,
}: SnapToBeatOptions): number {
  const x = Math.floor((clientX - rectLeft) / pixelsPerBeat) * pixelsPerBeat;
  return x / pixelsPerSecond;
}
