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
    <div className={cx("flex justify-between w-37 h-12 fill-slate-300", className)}>
      {isPlaying ? (
        <ButtonStop onClick={onStopClick} />
      ) : (
        <React.Fragment>
          <ButtonPlay className="" onClick={onPlayClick} />
          <ButtonRecord className="" />
        </React.Fragment>
      )}
    </div>
  );
}
