import { usePixels } from "../hooks";
import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";
import { Grid } from "./grid/Grid";
import { GridRow } from "./grid/GridRow";
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
  const { pixelsPerBeat } = usePixels();
  return (
    <div {...props}>
      <TimeRuler />
      <Grid spacing={pixelsPerBeat}>
        {tracks.map((track) => (
          <GridRow key={track.id} id={track.id}>
            <TrackLane track={track} />
          </GridRow>
        ))}
        <Playhead />
      </Grid>
    </div>
  );
}
