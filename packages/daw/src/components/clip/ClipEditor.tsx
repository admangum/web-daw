import type { CSSProperties } from "react";
import type { ClipData } from "../../stores/types";
// import { PianoRoll } from "../piano/PianoRoll";
import { TimeRulerSpacer } from "../TimeRulerSpacer";
import { TimeRuler } from "../Timeline";
import { Keyboard } from "../piano/Keyboard";
import { Grid } from "../piano/Grid";

interface Props {
  clip: ClipData;
  onCloseClick: () => void;
  style?: CSSProperties;
}
export function ClipEditor({ onCloseClick, style }: Props) {
  return (
    <div
      style={style}
      className="size-full bg-slate-900/85 border-slate-700 transition duration-300 ease starting:scale-0 scale-100 starting:opacity-0 opacity-100"
      onClick={onCloseClick}
    >
      <div className="grid grid-cols-[--spacing(36)_1fr] grid-rows-[--h-6_1fr] w-full h-full overflow-auto scrollbar-none">
        {/* <!-- Top Left (0,0): Completely frozen --> */}
        <div className="sticky top-0 left-0 z-30  bg-slate-900">
          <TimeRulerSpacer />
        </div>

        {/* <!-- Top Right (0,1): Sticks vertically, scrolls horizontally --> */}
        <div className="sticky top-0 z-20 bg-slate-900">
          <TimeRuler />
        </div>

        {/* <!-- Bottom Left (1,0): Sticks horizontally, scrolls vertically --> */}
        <div className="sticky left-0 z-20">
          <Keyboard />
        </div>

        {/* <!-- Bottom Right (1,1): Massive contents, free scrolling on both axes --> */}
        <div className="z-10">
          <Grid />
        </div>
      </div>
    </div>
  );
}
