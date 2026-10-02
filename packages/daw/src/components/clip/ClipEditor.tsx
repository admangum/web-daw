import type { CSSProperties } from "react";
import type { ClipData } from "../../stores/types";

interface Props {
  clip: ClipData;
  onCloseClick: () => void;
  style?: CSSProperties;
}
export function ClipEditor({ clip, onCloseClick, style }: Props) {
  return (
    <div
      style={style}
      className="size-full bg-pink-200/80 transition duration-300 ease starting:scale-0 scale-100"
      onClick={onCloseClick}
    >
      Edit clip {clip.id}
    </div>
  );
}
