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
      className="size-full p-4 bg-slate-900/85 transition duration-300 ease starting:scale-0 scale-100 starting:opacity-0 opacity-100"
      onClick={onCloseClick}
    >
      <TransportBar />
    </div>
  );
}
