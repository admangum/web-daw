import { type MouseEvent } from "react";
import type { SoundData } from "../../stores/types";

interface Pos {
  x: number;
  y: number;
}

interface Size {
  width: number;
}

interface Props {
  sound: SoundData;
  onClick: (e: MouseEvent<HTMLDivElement>, sound: SoundData) => void;
  pos: Pos;
  size: Size;
}
export function Sound({ sound, onClick, pos, size, ...props }: Props) {
  return (
    <div
      {...props}
      onClick={(e) => onClick(e, sound)}
      className="absolute h-full cursor-pointer overflow-hidden bg-slate-700/80 transition-colors delay-100 duration-300 hover:bg-slate-500/80 active:bg-slate-400/80"
      style={{
        translate: `${pos.x}px var(--tw-translate-y)`,
        width: size.width,
      }}
    ></div>
  );
}
