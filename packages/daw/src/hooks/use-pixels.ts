import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";

export function usePixels() {
  const { bpm } = useProjectStore();
  const { pixelsPerSecond } = useUIStore();
  const bps = (bpm / 60) * 1;
  const pixelsPerBeat = Math.round(pixelsPerSecond / bps);
  return { pixelsPerBeat, pixelsPerSecond };
}
