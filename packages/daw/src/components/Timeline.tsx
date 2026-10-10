import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";
import { Playhead } from "./Playhead";
import { TIMELINE_WIDTH_SECONDS, TrackLane } from "./TrackLane";

export function TimeRuler() {
  const pixelsPerSecond = useUIStore((s) => s.pixelsPerSecond);
  const marks = Array.from({ length: TIMELINE_WIDTH_SECONDS + 1 }, (_, i) => i);

  return (
    <div
      className="relative h-6 shrink-0 border-b border-slate-700"
      style={{ width: TIMELINE_WIDTH_SECONDS * pixelsPerSecond }}
    >
      {marks.map((second) => (
        <div
          key={second}
          className="absolute top-0 h-full border-l border-slate-800 text-[10px] text-slate-500"
          style={{ left: second * pixelsPerSecond }}
        >
          <span className="ml-1">{second}s</span>
        </div>
      ))}
    </div>
  );
}

interface Props {
  className?: string;
}

export function Timeline({ ...props }: Props) {
  const tracks = useProjectStore((s) => s.tracks);

  return (
    <div {...props}>
      <TimeRuler />
      <div className="relative">
        {tracks.map((track) => (
          <TrackLane key={track.id} track={track} />
        ))}
        <Playhead />
      </div>
    </div>
  );
}
