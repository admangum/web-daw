import { useShallow } from "zustand/react/shallow";
import { addClipAt, removeClip } from "../engine/sync";
import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";
import type { ClipData, TrackData } from "../stores/types";
import React from "react";
import { Clip } from "./clip/Clip";

export const TIMELINE_WIDTH_SECONDS = 60;

interface Props {
  track: TrackData;
}

export function TrackLane({ track, ...props }: Props) {
  const { pixelsPerSecond, selectTrack, selectedTrackId } = useUIStore();
  const clips = useProjectStore(useShallow((s) => s.clips.filter((c) => c.trackId === track.id)));
  const laneDiv = React.useRef<HTMLDivElement>(null);
  const onClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.target !== laneDiv.current) {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      addClipAt(track.id, x / pixelsPerSecond);
    },
    [track]
  );

  const onDoubleClick = React.useCallback(() => {}, []);

  const onClipClick = React.useCallback((clip: ClipData) => {
    removeClip(clip.id);
  }, []);

  return (
    <div
      {...props}
      className="relative h-18 shrink-0 border-b border-neutral-700"
      style={{ width: TIMELINE_WIDTH_SECONDS * pixelsPerSecond }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      ref={laneDiv}
    >
      {clips.map((clip) => (
        <Clip
          key={clip.id}
          clip={clip}
          onClick={onClipClick}
          pos={{ x: clip.startTime * pixelsPerSecond, y: 0 }}
          size={{ width: Math.max(4, clip.duration * pixelsPerSecond) }}
        />
      ))}
    </div>
  );
}
