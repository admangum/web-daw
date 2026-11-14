import React from "react";
import { cx } from "@/util";
import { ButtonPlay } from "./ButtonPlay";
import { ButtonRecord } from "./ButtonRecord";
import { ButtonStop } from "./ButtonStop";

interface Props {
  className?: string;
  isPlaying?: boolean;
  onPlayClick?: () => void;
  onStopClick?: () => void;
}
export function ButtonComboPlayRecord({ isPlaying, onPlayClick, onStopClick, className }: Props) {
  return (
    <div
      className={cx(
        "flex justify-center gap-2 rounded-full bg-slate-800/80 fill-slate-200 px-2 py-2",
        className
      )}
    >
      {isPlaying ? (
        <ButtonStop className="w-full" onClick={onStopClick} />
      ) : (
        <React.Fragment>
          <ButtonPlay className="size-9 bg-slate-700" onClick={onPlayClick} />
          <ButtonRecord className="size-9 bg-slate-700" />
        </React.Fragment>
      )}
    </div>
  );
}
