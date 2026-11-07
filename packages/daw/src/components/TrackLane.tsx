import { useShallow } from "zustand/react/shallow";
import * as Sync from "../engine/sync";
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
  const { pixelsPerSecond, selectedTrackId } = useUIStore();
  const clips = useProjectStore(useShallow((s) => s.clips.filter((c) => c.trackId === track.id)));

  const laneDiv = React.useRef<HTMLDivElement>(null);
  const onClick = (event: React.MouseEvent) => {
    if (event.target !== laneDiv.current) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    Sync.addClipAt(track.id, x / pixelsPerSecond);
  };

  const onDoubleClick = React.useCallback(() => {}, []);

  const onClipClick = React.useCallback((clip: ClipData, isEditing: boolean) => {
    if (!isEditing) {
      Sync.removeClip(clip.id);
    }
  }, []);

  const bg =
    selectedTrackId === track.id
      ? "bg-[repeating-linear-gradient(135deg,--alpha(var(--color-slate-200)/12%)_0,--alpha(var(--color-slate-200)/12%)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-top-left"
      : "bg-transparent";

  return (
    <div
      {...props}
      className={`relative h-18 shrink-0 border-b border-slate-700 ${bg}`}
      style={{
        width: TIMELINE_WIDTH_SECONDS * pixelsPerSecond,
        // backgroundImage: `background: repeating-linear-gradient(135deg, black, black 10px, #ffffff11 11px, #ffffff11 12px)`,
      }}
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
