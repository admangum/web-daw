import { useRef, type MouseEvent } from "react";
import type { ClipData, SoundData } from "../../stores/types";
import { useProjectStore } from "../../stores/useProjectStore";
import { useUIStore } from "../../stores/useUIStore";
import * as Sync from "../../engine/sync";
import { Sound } from "../sound/Sound";
import { KEY_HEIGHT, NOTES_TOP_DOWN } from "./constants";
import { Playhead } from "../Playhead";
import type { MidiNote } from "audio-engine";
import { GridRow } from "../grid/GridRow";

interface Props {
  clip: ClipData;
}

export function Grid({ clip }: Props) {
  const { bpm } = useProjectStore();
  const { pixelsPerSecond } = useUIStore();
  const bps = (bpm / 60) * 1;
  const pixelsPerBeat = Math.round(pixelsPerSecond / bps);
  const gridElRef = useRef<HTMLDivElement | null>(null);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget !== gridElRef.current) {
      return;
    }
    e.stopPropagation();

    const midiNote = parseInt((e.target as HTMLDivElement).dataset.midiNote || "0", 10) as MidiNote;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelsPerBeat) * pixelsPerBeat;
    const startTime = clip.startTime + x / pixelsPerSecond;
    Sync.addSoundAt(clip, midiNote, startTime);
  };

  const onSoundClick = (e: MouseEvent, sound: SoundData) => {
    e.stopPropagation();
    Sync.removeSound(clip, sound.id);
  };

  return (
    <div id="clip-editor-grid" className="relative" ref={gridElRef} onClick={onClick}>
      <>
        {NOTES_TOP_DOWN.map((midiNote) => (
          <GridRow
            key={String(midiNote)}
            id={String(midiNote)}
            height={KEY_HEIGHT}
            pixelsPerColumn={pixelsPerBeat}
          >
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
      </>
      <Playhead offset={clip.startTime} />
    </div>
  );
}
