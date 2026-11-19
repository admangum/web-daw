import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";

export function usePixels() {
  const bpm = useProjectStore((s) => s.bpm);
  const pixelsPerSecond = useUIStore((s) => s.pixelsPerSecond);
  const pixelsPerBeat = Math.round(pixelsPerSecond / (bpm / 60));
  return { pixelsPerBeat, pixelsPerSecond };
}
