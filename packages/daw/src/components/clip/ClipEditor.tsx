import { useCallback, type CSSProperties, type MouseEvent } from "react";
import { noteToMidiNote, type MidiNote } from "audio-engine";
import * as Sync from "../../engine/sync";
import type { ClipData, SoundData } from "../../stores/types";
import { TimeRulerSpacer } from "../TimeRulerSpacer";
import { TimeRuler } from "../Timeline";
import { Keyboard } from "../piano/Keyboard";
import { KEY_HEIGHT, NOTES_TOP_DOWN } from "../piano/constants";
import { Grid } from "../grid/Grid";
import { Button } from "@/ui";
import { scrollTopForNote } from "../piano/util/key-layout";
import { GridRow } from "../grid/GridRow";
import { Sound } from "../sound/Sound";
import { useProjectStore } from "../../stores/useProjectStore";
import { useUIStore } from "../../stores/useUIStore";
import { Playhead } from "../Playhead";

interface Props {
  clip: ClipData;
  onCloseClick: () => void;
  style?: CSSProperties;
}
export function ClipEditor({ clip, onCloseClick, style }: Props) {
  const { bpm } = useProjectStore();
  const { pixelsPerSecond } = useUIStore();
  const bps = (bpm / 60) * 1;
  const pixelsPerBeat = Math.round(pixelsPerSecond / bps);
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

  const onGridClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const midiNote = parseInt(
      (e.target as HTMLDivElement).dataset.gridRowId || "0",
      10
    ) as MidiNote;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelsPerBeat) * pixelsPerBeat;
    const startTime = clip.startTime + x / pixelsPerSecond;
    Sync.addSoundAt(clip, midiNote, startTime);
  };

  const onSoundClick = (e: MouseEvent<HTMLDivElement>, sound: SoundData) => {
    e.stopPropagation();
    Sync.removeSound(clip, sound.id);
  };

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
          <Grid rowHeight={KEY_HEIGHT} pixelsPerGridLine={pixelsPerBeat} onClick={onGridClick}>
            {NOTES_TOP_DOWN.map((midiNote) => (
              <GridRow key={midiNote} id={String(midiNote)}>
                {clip.sounds.map((sound) => {
                  if (sound.midiNote === midiNote) {
                    return (
                      <Sound
                        key={sound.id}
                        sound={sound}
                        pos={{
                          x: (sound.startTime - clip.startTime) * pixelsPerSecond,
                          y: 0,
                        }}
                        size={{
                          width: pixelsPerBeat,
                        }}
                        onClick={onSoundClick}
                      />
                    );
                  }
                })}
              </GridRow>
            ))}
            <Playhead offset={clip.startTime} />
          </Grid>
        </div>
      </div>
    </div>
  );
}
