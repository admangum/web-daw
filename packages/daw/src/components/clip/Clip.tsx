import { Dialog, DialogContent, DialogTrigger } from "@/ui";
import type { ClipData } from "../../stores/types";
import React from "react";
import { useClickHandlers, usePressAndHold } from "../../hooks";
import { ClipEditor } from "./ClipEditor";
import { useUIStore } from "../../stores/useUIStore";

interface Pos {
  x: number;
  y: number;
}

interface Size {
  width: number;
}

interface Props {
  clip: ClipData;
  onClick: (clip: ClipData) => void;
  pos: Pos;
  size: Size;
}
export function Clip({ clip, onClick, pos, size, ...props }: Props) {
  const { selectedTrackId, selectTrack } = useUIStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [clickPos, setClickPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [onMouseDown, onMouseUp] = usePressAndHold(
    (event) => {
      setClickPos({ x: event.pageX, y: event.pageY });
      setIsEditing(true);
      if (selectedTrackId !== clip.trackId) {
        selectTrack(clip.trackId);
      }
    },
    { threshold: 300 }
  );

  const onClipClick = React.useCallback(() => {
    if (!isEditing) {
      onClick(clip);
    }
  }, [isEditing]);

  return (
    <Dialog {...props} open={isEditing}>
      <DialogTrigger asChild>
        <div
          title="Click to remove"
          onClick={onClipClick}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          className="absolute h-18 cursor-pointer bg-slate-700/80 overflow-hidden transition-colors delay-100 duration-300 active:bg-slate-400/80 hover:bg-slate-500/80"
          style={{
            translate: `${pos.x}px var(--tw-translate-y)`,
            width: size.width,
          }}
        ></div>
      </DialogTrigger>
      <DialogContent
        className="size-full bg-transparent"
        portalContainer={document.getElementById("main")}
      >
        <ClipEditor
          onCloseClick={() => setIsEditing(false)}
          clip={clip}
          style={{ transformOrigin: `${clickPos.x}px ${clickPos.y}px` }}
        />
      </DialogContent>
    </Dialog>
  );
}
