import { Dialog } from "@/ui";
import type { ClipData } from "../../stores/types";
import React, { useRef } from "react";
import { usePressAndHold } from "../../hooks";
import { ClipEditor } from "./ClipEditor";
import { useUIStore } from "../../stores/useUIStore";
import { getTransportPosition, seek } from "../../engine/sync";
import { useTransportStore } from "../../stores/useTransportStore";
import { ClipContent } from "./ClipContent";

interface Pos {
  x: number;
  y: number;
}

interface Size {
  width: number;
}

interface Props {
  clip: ClipData;
  onClick: (clip: ClipData, isEditing: boolean) => void;
  pos: Pos;
  size: Size;
}
export function Clip({ clip, onClick, pos, size, ...props }: Props) {
  const { selectedTrackId, selectTrack, editingClipId, setEditingClipId } = useUIStore();
  const { isPlaying } = useTransportStore();

  const [clickPos, setClickPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const transportTimeAtOpen = useRef<number>(0);

  const onOpenClipEditor = () => {
    if (selectedTrackId !== clip.trackId) {
      selectTrack(clip.trackId);
    }
    setEditingClipId(clip.id);
    transportTimeAtOpen.current = getTransportPosition();
    seek(clip.startTime);
  };

  const onCloseClipEditor = () => {
    setEditingClipId(null);
    if (!isPlaying) {
      seek(transportTimeAtOpen.current);
    }
  };

  const [onMouseDown, onMouseUp] = usePressAndHold(
    (event) => {
      setClickPos({ x: event.pageX, y: event.pageY });
      onOpenClipEditor();
    },
    { threshold: 300 }
  );

  return (
    <Dialog.Root {...props} open={!!editingClipId} modal={false}>
      <Dialog.Trigger asChild>
        <ClipContent
          title="Click to remove"
          onClick={() => onClick(clip, !!editingClipId)}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          className="absolute h-18 cursor-pointer bg-slate-700/80 overflow-hidden transition-colors delay-100 duration-300 active:bg-slate-400/80 hover:bg-slate-500/80"
          style={{
            translate: `${pos.x}px var(--tw-translate-y)`,
            width: size.width,
          }}
          clip={clip}
        />
      </Dialog.Trigger>
      <Dialog.Content
        className="size-full bg-transparent"
        portalContainer={document.getElementById("main")}
      >
        <ClipEditor
          onCloseClick={onCloseClipEditor}
          clip={clip}
          style={{ transformOrigin: `${clickPos.x}px ${clickPos.y}px` }}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
