import { type MouseEvent, type PropsWithChildren } from "react";
import { cssVars } from "@/util";

interface Props extends PropsWithChildren {
  rowHeight: number;
  pixelsPerGridLine: number;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
}

export function Grid({ rowHeight, pixelsPerGridLine, onClick, children }: Props) {
  return (
    <div
      id="clip-editor-grid"
      className="relative"
      onClick={onClick}
      style={cssVars({
        "--pixels-per-grid-line": `${pixelsPerGridLine}px`,
        "--grid-row-height": `${rowHeight}px`,
      })}
    >
      {children}
    </div>
  );
}
