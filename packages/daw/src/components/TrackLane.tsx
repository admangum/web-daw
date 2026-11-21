import { useShallow } from "zustand/react/shallow";
import * as Sync from "../engine/sync";
import { useProjectStore } from "../stores/useProjectStore";
import { useUIStore } from "../stores/useUIStore";
import type { ClipData, TrackData } from "../stores/types";
import React from "react";
import { Clip } from "./clip/Clip";
import { usePixels } from "../hooks";
import { snapToBeat } from "@/util";

export const TIMELINE_WIDTH_SECONDS = 60;

interface Props {
  track: TrackData;
}

export function TrackLane({ track, ...props }: Props) {
  const isSelected = useUIStore((s) => s.selectedTrackId === track.id);
  const { pixelsPerBeat, pixelsPerSecond } = usePixels();
  const clips = useProjectStore(useShallow((s) => s.clips.filter((c) => c.trackId === track.id)));

  const onClick = (e: React.MouseEvent) => {
    // Only proceed if the lane itself was clicked. Clicking anything
    // already in the lane (like a clip) should not be handled here.
    if (e.target !== e.currentTarget) {
      return;
    }
    const startTime = snapToBeat({
      clientX: e.clientX,
      rectLeft: e.currentTarget.getBoundingClientRect().left,
      pixelsPerBeat,
      pixelsPerSecond,
    });
    Sync.addClipAt(track.id, startTime);
  };

  const onClipClick = (clip: ClipData, isEditing: boolean) => {
    if (!isEditing) {
      Sync.removeClip(clip.id);
    }
  };

  const bg = isSelected
    ? "bg-[repeating-linear-gradient(135deg,--alpha(var(--color-slate-200)/12%)_0,--alpha(var(--color-slate-200)/12%)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-top-left"
    : "bg-transparent";

  return (
    <div
      {...props}
      className={`relative h-18 shrink-0 border-b border-slate-700 ${bg}`}
      style={{
        width: TIMELINE_WIDTH_SECONDS * pixelsPerSecond,
      }}
      onClick={onClick}
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
