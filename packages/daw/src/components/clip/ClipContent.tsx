import React from "react";
import type { ClipData } from "../../stores/types";
import { useUIStore } from "../../stores/useUIStore";
import { SOUND_RECT_HEIGHT, layoutSounds } from "./util/preview-layout";

// Matches the `h-18` class applied to the clip in Clip.tsx.
const CLIP_HEIGHT = 72;

interface Props extends React.ComponentProps<"div"> {
  clip: ClipData;
}
export function ClipContent({ clip, ...props }: Props) {
  const pixelsPerSecond = useUIStore((s) => s.pixelsPerSecond);
  const rects = React.useMemo(
    () => layoutSounds(clip, pixelsPerSecond, CLIP_HEIGHT),
    [clip, pixelsPerSecond]
  );

  return (
    <div {...props}>
      {rects.map((r) => (
        <div
          key={r.id}
          className="pointer-events-none absolute rounded-[1px] bg-slate-200/80"
          style={{ width: r.width, height: SOUND_RECT_HEIGHT, translate: `${r.x}px ${r.y}px` }}
        />
      ))}
    </div>
  );
}
