import { useShallow } from "zustand/react/shallow";
import { removeClip } from "../engine/sync";
import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";
import type { TrackData } from "../stores/types";

export const TIMELINE_WIDTH_SECONDS = 60;

export function TrackLane({ track }: { track: TrackData }) {
  const { pixelsPerSecond, selectTrack, selectedTrackId } = useUIStore();
  const clips = useProjectStore(useShallow((s) => s.clips.filter((c) => c.trackId === track.id)));

  function handleLaneClick() {
    if (selectedTrackId === track.id) {
      selectTrack(null);
    } else {
      selectTrack(track.id);
    }
    // const rect = event.currentTarget.getBoundingClientRect();
    // const x = event.clientX - rect.left;
    // addClipAt(track.id, x / pixelsPerSecond);
  }

  return (
    <div
      className="relative h-16 shrink-0 border-b border-neutral-800"
      style={{ width: TIMELINE_WIDTH_SECONDS * pixelsPerSecond }}
      onClick={handleLaneClick}
    >
      {clips.map((clip) => (
        <div
          key={clip.id}
          title="Click to remove"
          onClick={(event) => {
            event.stopPropagation();
            removeClip(clip.id);
          }}
          className="absolute top-2 h-12 cursor-pointer rounded bg-emerald-600/80 hover:bg-emerald-500"
          style={{
            left: clip.startTime * pixelsPerSecond,
            width: Math.max(4, clip.duration * pixelsPerSecond),
          }}
        />
      ))}
    </div>
  );
}
