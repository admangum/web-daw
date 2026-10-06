import type { CSSProperties } from "react";
import type { ClipData } from "../../stores/types";
import { TransportBar } from "../transport/TransportBar";

interface Props {
  clip: ClipData;
  onCloseClick: () => void;
  style?: CSSProperties;
}
export function ClipEditor({ clip, onCloseClick, style }: Props) {
  return (
    <div
      style={style}
      className="flex size-full bg-slate-900/85 border-slate-700 transition duration-300 ease starting:scale-0 scale-100 starting:opacity-0 opacity-100"
      onClick={onCloseClick}
    >
      <div className="w-36 h-full border-r border-inherit"></div>
    </div>
  );
}
