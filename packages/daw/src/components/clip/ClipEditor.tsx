import { useCallback, type CSSProperties } from "react";
import { noteToMidiNote, type MidiNote } from "audio-engine";
import * as Sync from "../../engine/sync";
import type { ClipData } from "../../stores/types";
import { TimeRulerSpacer } from "../TimeRulerSpacer";
import { TimeRuler } from "../Timeline";
import { Keyboard } from "../piano/Keyboard";
import { Grid } from "../piano/Grid";
import { Button } from "@/ui";
import { scrollTopForNote } from "../piano/util/key-layout";

interface Props {
  clip: ClipData;
  onCloseClick: () => void;
  style?: CSSProperties;
}
export function ClipEditor({ clip, onCloseClick, style }: Props) {
  /**
   * On initial mount, center the lowest active midi note in the viewport
   */
  const gridRef = useCallback(function centerActiveNote(node: HTMLDivElement) {
    if (!node) return;
    const [lowestActiveMidiNote] = clip.sounds.map((s) => s.midiNote).sort((a, b) => a - b);
    const viewportHeight = node.clientHeight;
    const scrollTo = scrollTopForNote(lowestActiveMidiNote || noteToMidiNote("C3"), viewportHeight);
    node.scrollTo(0, scrollTo);
    // oxlint-disable-next-line react-hooks/exhaustive-deps - A onetime effect on initial mount
  }, []);

  const onPianoKeyPress = useCallback(
    (midiNote: MidiNote) => {
      Sync.playTrackInstrument(clip.trackId, midiNote);
    },
    [clip]
  );

  return (
    <div
      style={style}
      className="ease size-full scale-100 border-slate-700 bg-slate-900/85 opacity-100 transition duration-300 starting:scale-0 starting:opacity-0"
    >
      <div
        ref={gridRef}
        className="grid h-full w-full scrollbar-none grid-cols-[--spacing(36)_1fr] grid-rows-[--h-6_1fr] overflow-auto"
      >
        <Button.Close className="absolute top-8 right-2 z-40" onClick={onCloseClick} />
        {/* <!-- Top Left (0,0): Completely frozen --> */}
        <div className="sticky top-0 left-0 z-30 bg-slate-900">
          <TimeRulerSpacer />
        </div>

        {/* <!-- Top Right (0,1): Sticks vertically, scrolls horizontally --> */}
        <div className="sticky top-0 z-20 bg-slate-900">
          <TimeRuler />
        </div>

        {/* <!-- Bottom Left (1,0): Sticks horizontally, scrolls vertically --> */}
        <div className="sticky left-0 z-20">
          <Keyboard onKeyPress={onPianoKeyPress} />
        </div>

        {/* <!-- Bottom Right (1,1): Massive contents, free scrolling on both axes --> */}
        <div className="z-10">
          <Grid clip={clip} />
        </div>
      </div>
    </div>
  );
}
