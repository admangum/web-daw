import { Dialog } from "@/ui";
import type { ClipData } from "../../stores/types";
import { useState } from "react";
import { usePressAndHold } from "../../hooks";
import { ClipEditor } from "./ClipEditor";
import { useUIStore } from "../../stores/useUIStore";
import { ClipContent } from "./ClipContent";
import { useClipEditor } from "./use-clip-editor";

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
  const { isEditing, open, close } = useClipEditor(clip);

  const [clickPos, setClickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const pressAndHoldProps = usePressAndHold(
    (event) => {
      setClickPos({ x: event.pageX, y: event.pageY });
      open();
    },
    { threshold: 300 }
  );

  return (
    <Dialog.Root {...props} open={isEditing} modal={false}>
      <Dialog.Trigger asChild>
        <ClipContent
          title="Click to remove"
          onClick={() => onClick(clip, useUIStore.getState().editingClipId !== null)}
          {...pressAndHoldProps}
          className="absolute h-18 cursor-pointer overflow-hidden bg-slate-700/80 transition-colors delay-100 duration-300 hover:bg-slate-500/80 active:bg-slate-400/80"
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
          onCloseClick={close}
          clip={clip}
          style={{ transformOrigin: `${clickPos.x}px ${clickPos.y}px` }}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
